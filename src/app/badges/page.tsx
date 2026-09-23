import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function BadgesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.id },
    include: { badges: { include: { skill: true }, orderBy: { issuedAt: "desc" } } },
  });

  if (!student) {
    // recruiters/reviewers can browse skill definitions
    const skills = await prisma.skillDefinition.findMany();
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="font-display text-3xl font-semibold">Skill badge catalog</h1>
          <ul className="mt-6 space-y-4">
            {skills.map((s) => (
              <li key={s.id} className="panel p-4">
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-ink-muted">{s.description}</p>
              </li>
            ))}
          </ul>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="eyebrow">Badges</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Your verified badges</h1>
        {student.badges.length === 0 ? (
          <p className="mt-8 text-ink-muted">No badges yet. Complete a project assessment.</p>
        ) : (
          <ul className="mt-8 space-y-4">
            {student.badges.map((b) => (
              <li key={b.id} className="panel p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-semibold">{b.skill.name}</h2>
                    <p className="mt-1 font-mono text-xs text-seal">{b.badgeUid}</p>
                    <p className="mt-3 text-sm text-ink-soft">{b.evidenceSummary}</p>
                    <p className="mt-2 text-xs text-ink-muted">
                      Issued {formatDate(b.issuedAt)}
                      {b.expiresAt ? ` · expires ${formatDate(b.expiresAt)}` : ""}
                    </p>
                    <p className="mt-2 text-xs text-ink-muted">{b.limitations}</p>
                  </div>
                  <Link href={`/verify/${b.badgeUid}`} className="btn-secondary">
                    Verification page
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
