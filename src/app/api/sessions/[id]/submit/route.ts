import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { evaluateSession } from "@/lib/pipeline";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  await prisma.assessmentSession.update({
    where: { id },
    data: { status: "submitted", submittedAt: new Date() },
  });

  const report = await evaluateSession(id);
  return NextResponse.json({ reportId: report.id });
}
