import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

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
  if (!questionId) return NextResponse.json({ error: "missing" }, { status: 400 });

  await prisma.answer.upsert({
    where: { sessionId_questionId: { sessionId: id, questionId } },
    create: { sessionId: id, questionId, content },
    update: { content },
  });
  return NextResponse.json({ ok: true });
}
