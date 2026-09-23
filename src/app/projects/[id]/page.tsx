import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { friendlyStatus } from "@/lib/labels";
import { parseJson } from "@/lib/utils";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      testRuns: { orderBy: { createdAt: "desc" }, take: 1 },
      assessments: { include: { questions: true }, orderBy: { createdAt: "desc" }, take: 1 },
      reports: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!project) notFound();

  const stack = parseJson<string[]>(project.detectedStack, []);
  const analysis = parseJson<{
    evidence?: {
      observations?: string[];
      supportReason?: string;
    };
  }>(project.analysisJson, {});
  const test = project.testRuns[0];
  const assessment = project.assessments[0];
  const report = project.reports[0];

  const canQuiz = assessment && project.status !== "completed";
  const canReport = !!report;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <p className="text-sm text-ink-muted">
          <Link href="/dashboard" className="underline">
            ← Home
          </Link>
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">{project.title}</h1>
        <p className="mt-2 text-ink-muted">{project.description}</p>

        <div className="mt-4 inline-flex rounded-full bg-seal-soft px-3 py-1 text-sm font-medium text-seal-deep">
          {friendlyStatus(project.status)}
        </div>

        {(canQuiz || canReport) && (
          <div className="panel mt-8 border-seal/40 bg-seal-soft/30 p-6">
            <p className="font-medium text-ink">Next step</p>
            {canQuiz && (
              <>
                <p className="mt-2 text-sm text-ink-muted">
                  We checked your project. Now answer a short quiz about your code.
                </p>
                <Link
                  href={`/assessments/${assessment!.id}/instructions`}
                  className="btn-primary mt-4 inline-flex py-3 text-base"
                >
                  Start quiz →
                </Link>
              </>
            )}
            {!canQuiz && canReport && (
              <>
                <p className="mt-2 text-sm text-ink-muted">Your quiz is done. See the results.</p>
                <Link href={`/reports/${report!.id}`} className="btn-primary mt-4 inline-flex py-3 text-base">
                  Open my report →
                </Link>
              </>
            )}
          </div>
        )}

        <section className="panel mt-6 p-6">
          <h2 className="font-display text-lg font-semibold">What we found</h2>
          <p className="mt-3 text-sm text-ink-soft">
            <span className="font-medium">Languages / tools: </span>
            {stack.length ? stack.join(", ") : "Still checking…"}
          </p>
          <p className="mt-2 text-sm text-ink-muted">{analysis.evidence?.supportReason}</p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-ink-soft">
            {(analysis.evidence?.observations || []).slice(0, 5).map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>

        <section className="panel mt-4 p-6">
          <h2 className="font-display text-lg font-semibold">Did the tests run?</h2>
          {test ? (
            <div className="mt-3 text-sm">
              <p className="font-medium text-ink">{friendlyStatus(test.status)}</p>
              <p className="mt-1 text-ink-muted">Took {test.durationMs} ms</p>
              <details className="mt-3">
                <summary className="cursor-pointer text-seal">Show test output</summary>
                <pre className="mt-2 max-h-40 overflow-auto rounded-md bg-ink p-3 font-mono text-[11px] text-seal-soft">
                  {(test.stdout || test.stderr || "No output").slice(0, 2000)}
                </pre>
              </details>
            </div>
          ) : (
            <p className="mt-3 text-sm text-ink-muted">No test run yet.</p>
          )}
        </section>

        {assessment && (
          <section className="panel mt-4 p-6">
            <h2 className="font-display text-lg font-semibold">
              Quiz questions ({assessment.questions.length})
            </h2>
            <p className="mt-1 text-sm text-ink-muted">Each question points to real files in your project.</p>
            <ol className="mt-4 space-y-3 text-sm">
              {assessment.questions
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((q, i) => (
                  <li key={q.id} className="border-t border-paper-line pt-3">
                    <span className="text-seal">{i + 1}. </span>
                    {q.prompt}
                  </li>
                ))}
            </ol>
          </section>
        )}
      </main>
    </div>
  );
}
