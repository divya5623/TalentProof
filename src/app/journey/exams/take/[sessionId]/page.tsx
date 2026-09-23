import { notFound, redirect } from "next/navigation";
import { StrictSkillExam } from "@/components/StrictSkillExam";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSkillBySlug } from "@/lib/skill-catalog";

export default async function TakeSkillExamPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const user = await getSession();
  if (!user || user.role !== "student") redirect("/login");
  const { sessionId } = await params;

  const exam = await prisma.skillExamSession.findUnique({
    where: { id: sessionId },
    include: { claimedSkill: { include: { student: true } } },
  });
  if (!exam) notFound();
  if (exam.claimedSkill.student.userId !== user.id) redirect("/journey/exams");
  if (exam.status !== "active") redirect("/journey/exams");

  const skill = getSkillBySlug(exam.claimedSkill.skillSlug);
  if (!skill) redirect("/journey/exams");

  return (
    <div className="min-h-screen bg-paper">
      <StrictSkillExam
        sessionId={exam.id}
        skillName={skill.name}
        endsAtIso={exam.endsAt.toISOString()}
        questions={skill.questions.map((q) => ({
          id: q.id,
          type: q.type,
          prompt: q.prompt,
          options: q.options,
        }))}
      />
    </div>
  );
}
