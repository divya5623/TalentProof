import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseJson } from "@/lib/utils";

export default async function CandidateProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "recruiter") redirect("/journey");
  const { userId } = await params;

  const student = await prisma.studentProfile.findUnique({
    where: { userId },
    include: {
      user: true,
      claimedSkills: true,
      certificates: true,
      projects: {
        include: { reports: { take: 1 }, testRuns: { take: 1 } },
        orderBy: { updatedAt: "desc" },
      },
      badges: { include: { skill: true } },
    },
  });
  if (!student || student.visibility === "private") notFound();

  return (
    <AppShell active="/recruiter/talent">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link href="/recruiter/talent" className="text-sm text-ink-muted underline">
          ← Back to search
        </Link>
        <h1 className="mt-4 font-display text-3xl font-semibold">{student.user.name}</h1>
        <p className="mt-2 text-ink-muted">{student.headline}</p>
        <p className="mt-1 text-sm text-ink-muted">{student.bio}</p>
        <p className="mt-2 text-sm">
          Score: <strong className="text-seal">{Math.round(student.overallScore)}</strong>
          {student.availability ? ` · ${student.availability}` : ""}
        </p>

        <section className="panel mt-8 p-5">
          <h2 className="font-display text-lg font-semibold">Verified skills (exam evidence)</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {student.claimedSkills.filter((c) => c.status === "verified").length === 0 && (
              <li className="text-ink-muted">None verified yet</li>
            )}
            {student.claimedSkills
              .filter((c) => c.status === "verified")
              .map((c) => (
                <li key={c.id} className="flex justify-between border-b border-paper-line py-2">
                  <span>✓ {c.skillName}</span>
                  <span className="font-mono text-xs">{c.score}</span>
                </li>
              ))}
          </ul>
        </section>

        <section className="panel mt-4 p-5">
          <h2 className="font-display text-lg font-semibold">Projects</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {student.projects.length === 0 && <li className="text-ink-muted">No projects</li>}
            {student.projects.map((p) => {
              const scores = p.reports[0]
                ? parseJson<{ overall: number }>(p.reports[0].scoresJson, { overall: 0 })
                : null;
              return (
                <li key={p.id} className="border-b border-paper-line pb-3">
                  <p className="font-medium">{p.title}</p>
                  <p className="text-ink-muted">{p.status}</p>
                  {scores && <p className="text-xs text-seal">Report score {scores.overall}</p>}
                  {p.reports[0] && (
                    <Link href={`/reports/${p.reports[0].id}`} className="text-seal underline">
                      Open report
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {student.certificates[0] && (
          <section className="panel mt-4 border-seal/30 p-5">
            <h2 className="font-display text-lg font-semibold">Certificate</h2>
            <p className="mt-2 font-mono text-sm text-seal">{student.certificates[0].certUid}</p>
            <Link
              href={`/certificate/${student.certificates[0].certUid}`}
              className="btn-primary mt-4 inline-flex"
            >
              View certificate
            </Link>
          </section>
        )}
      </main>
    </AppShell>
  );
}
