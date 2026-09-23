import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSkillBySlug } from "@/lib/skill-catalog";
import { estimateAiRisk, scoreSkillAnswers } from "@/lib/skill-exam";
import { parseJson } from "@/lib/utils";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  const exam = await prisma.skillExamSession.findUnique({
    where: { id },
    include: { claimedSkill: true },
  });
  if (!exam) return NextResponse.json({ error: "missing" }, { status: 404 });

  const skill = getSkillBySlug(exam.claimedSkill.skillSlug);
  if (!skill) return NextResponse.json({ error: "skill" }, { status: 400 });

  const answers = parseJson<Record<string, string>>(exam.answersJson, {});
  const integrity = parseJson<{ type: string }[]>(exam.integrityJson, []);
  const { overall, details } = scoreSkillAnswers(skill.questions, answers);
  const aiRisk = estimateAiRisk(answers, integrity);

  let finalScore = overall;
  if (aiRisk >= 0.55) finalScore = Math.max(0, finalScore - 10);

  const passed = finalScore >= skill.passScore && aiRisk < 0.85;

  await prisma.skillExamSession.update({
    where: { id },
    data: {
      status: "submitted",
      submittedAt: new Date(),
      score: finalScore,
      passed,
      aiRiskScore: aiRisk,
    },
  });

  await prisma.claimedSkill.update({
    where: { id: exam.claimedSkillId },
    data: {
      status: passed ? "verified" : "failed",
      score: finalScore,
      examJson: JSON.stringify({
        details,
        aiRisk,
        integrityCount: integrity.length,
        passScore: skill.passScore,
        disclaimer: "AI risk is a soft signal only — not proof of cheating.",
      }),
    },
  });

  return NextResponse.json({ passed, score: finalScore, aiRisk });
}
