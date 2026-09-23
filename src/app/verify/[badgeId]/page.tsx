import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function VerifyBadgePage({
  params,
}: {
  params: Promise<{ badgeId: string }>;
}) {
  const { badgeId } = await params;
  const badge = await prisma.badge.findUnique({
    where: { badgeUid: badgeId },
    include: {
      skill: true,
      student: { include: { user: true } },
    },
  });
  if (!badge) notFound();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="panel relative overflow-hidden p-8 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-seal text-seal">
            <span className="font-display text-xs font-bold tracking-widest">VERIFIED</span>
          </div>
          <p className="eyebrow mt-6">Badge verification</p>
          <h1 className="mt-2 font-display text-2xl font-semibold">{badge.skill.name}</h1>
          <p className="mt-2 font-mono text-sm text-seal">{badge.badgeUid}</p>
          <p className="mt-4 text-sm text-ink-soft">
            Issued to <strong>{badge.student.user.name}</strong>
          </p>
          <p className="mt-1 text-xs text-ink-muted">{formatDate(badge.issuedAt)}</p>
          <p className="mt-6 text-sm text-ink-muted">{badge.evidenceSummary}</p>
          <p className="mt-4 rounded-md bg-seal-soft/50 px-3 py-2 text-xs text-seal-deep">
            {badge.limitations}
          </p>
          <p className="mt-6 text-xs text-ink-muted">Status: {badge.status}</p>
        </div>
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-seal underline">
            Talent Proof home
          </Link>
        </p>
      </main>
    </div>
  );
}
