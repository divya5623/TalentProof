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

  const exam = await prisma.skillExamSession.findUnique({ where: { id } });
  if (!exam) return NextResponse.json({ error: "missing" }, { status: 404 });

  const events = parseJson<{ type: string; severity: string; at: string }[]>(
    exam.integrityJson,
    []
  );
  events.push({
    type: String(body.type || "unknown"),
    severity: String(body.severity || "info"),
    at: new Date().toISOString(),
  });

  await prisma.skillExamSession.update({
    where: { id },
    data: { integrityJson: JSON.stringify(events.slice(-100)) },
  });
  return NextResponse.json({ ok: true });
}
