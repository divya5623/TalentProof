import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { friendlyStatus } from "@/lib/labels";
import { formatDate, parseJson } from "@/lib/utils";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { id } = await params;

  const report = await prisma.verificationReport.findUnique({
    where: { id },
    include: {
      project: true,
      student: { include: { user: true, badges: { include: { skill: true } } } },
      session: { include: { answers: { include: { question: true } }, integrityEvents: true } },
    },
  });
  if (!report) notFound();

  const scores = parseJson<{
    overall: number;
    categories: Record<string, number>;
    tests: string;
  }>(report.scoresJson, { overall: 0, categories: {}, tests: "unknown" });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <p className="text-sm text-ink-muted">
          <Link href="/dashboard" className="underline">
            ← Home
          </Link>
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold">Your results</h1>
        <p className="mt-2 text-ink-muted">
          {report.project.title} · {report.student.user.name} · {formatDate(report.createdAt)}
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="panel p-5 text-center">
            <p className="text-sm text-ink-muted">Score</p>
            <p className="mt-1 font-display text-4xl font-semibold text-seal">{scores.overall}</p>
            <p className="text-xs text-ink-muted">out of 100</p>
          </div>
          <div className="panel p-5 text-center">
            <p className="text-sm text-ink-muted">How sure we are</p>
            <p className="mt-1 font-display text-4xl font-semibold">
              {Math.round(report.confidence * 100)}%
            </p>
          </div>
          <div className="panel p-5 text-center">
            <p className="text-sm text-ink-muted">Code tests</p>
            <p className="mt-1 font-display text-xl font-semibold">
              {friendlyStatus(scores.tests)}
            </p>
          </div>
        </div>

        <section className="panel mt-6 p-6">
          <h2 className="font-display text-lg font-semibold">Score by topic</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {Object.entries(scores.categories).map(([k, v]) => (
              <li key={k} className="flex justify-between border-b border-paper-line py-2">
                <span>{k}</span>
                <span className="font-semibold">{v}</span>
              </li>
            ))}
          </ul>
        </section>

        {report.student.badges.length > 0 && (
          <section className="panel mt-4 p-6">
            <h2 className="font-display text-lg font-semibold">Badges earned</h2>
            <ul className="mt-3 space-y-2">
              {report.student.badges.map((b) => (
                <li key={b.id}>
                  <Link href={`/verify/${b.badgeUid}`} className="text-seal underline">
                    {b.skill.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="panel mt-4 p-6">
          <h2 className="font-display text-lg font-semibold">Your answers</h2>
          <ul className="mt-4 space-y-4">
            {(report.session?.answers || []).map((a, i) => (
              <li key={a.id} className="border-t border-paper-line pt-4 text-sm">
                <p className="font-medium text-ink">
                  {i + 1}. {a.question.prompt}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-ink-soft">{a.content || "(empty)"}</p>
                <p className="mt-2 text-xs text-seal">
                  Points: {a.score ?? "—"} — {a.feedback}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-6 rounded-lg bg-paper p-4 text-sm text-ink-muted">{report.limitations}</p>

        {session.role === "student" && (
            <div className="mt-8 rounded-xl border border-seal/30 bg-seal-soft/40 p-5 text-sm text-seal-deep">
              <p className="font-medium">Next</p>
              <p className="mt-1">
                Go back to{" "}
                <a href="/journey/projects" className="underline">
                  Projects step
                </a>{" "}
                to continue your certificate, or log in as recruiter to be discovered.
              </p>
            </div>
          )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/badges" className="btn-primary">
            See badges
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            Home
          </Link>
        </div>
      </main>
    </div>
  );
}
