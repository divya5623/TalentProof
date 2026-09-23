import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

async function markReviewed(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session || session.role !== "reviewer") redirect("/login");
  const id = String(formData.get("id"));
  await prisma.verificationReport.update({
    where: { id },
    data: { reviewStatus: "reviewed" },
  });
  redirect("/reviewer");
}

export default async function ReviewerPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "reviewer") redirect("/dashboard");

  const reports = await prisma.verificationReport.findMany({
    where: { reviewStatus: "needs_review" },
    include: { project: true, student: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });

  const manualProjects = await prisma.project.findMany({
    where: { status: "manual_review" },
    include: { student: { include: { user: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <p className="eyebrow">Reviewer</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Human review queue</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Low confidence, integrity review signals, or unsupported stacks land here.
        </p>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold">Reports needing review</h2>
          {reports.length === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">Queue empty.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {reports.map((r) => (
                <li key={r.id} className="panel flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-medium">
                      {r.project.title} · {r.student.user.name}
                    </p>
                    <p className="font-mono text-xs text-ink-muted">
                      confidence {r.confidence.toFixed(2)} · {formatDate(r.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/reports/${r.id}`} className="btn-secondary">
                      Open
                    </Link>
                    <form action={markReviewed}>
                      <input type="hidden" name="id" value={r.id} />
                      <button className="btn-primary" type="submit">
                        Mark reviewed
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold">Manual review projects</h2>
          {manualProjects.length === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">None.</p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm">
              {manualProjects.map((p) => (
                <li key={p.id}>
                  <Link href={`/projects/${p.id}`} className="text-seal underline">
                    {p.title}
                  </Link>{" "}
                  · {p.student.user.name}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
