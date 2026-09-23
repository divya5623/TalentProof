import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseJson } from "@/lib/utils";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const body = await req.json();
  const questionId = String(body.questionId || "");
  const content = String(body.content || "");

  const exam = await prisma.skillExamSession.findUnique({ where: { id } });
  if (!exam || exam.status !== "active") {
    return NextResponse.json({ error: "closed" }, { status: 400 });
  }

  const answers = parseJson<Record<string, string>>(exam.answersJson, {});
  answers[questionId] = content;
  await prisma.skillExamSession.update({
    where: { id },
    data: { answersJson: JSON.stringify(answers) },
  });
  return NextResponse.json({ ok: true });
}
