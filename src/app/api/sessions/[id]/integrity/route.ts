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
  await prisma.integrityEvent.create({
    data: {
      sessionId: id,
      type: String(body.type || "unknown"),
      severity: String(body.severity || "info"),
      metadata: JSON.stringify({ at: new Date().toISOString() }),
    },
  });
  return NextResponse.json({ ok: true });
}
