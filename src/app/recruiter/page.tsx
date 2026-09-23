import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function HrOverviewPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "recruiter") redirect("/journey");

  const recruiter = await prisma.recruiterProfile.findUnique({ where: { userId: session.id } });

  const students = await prisma.studentProfile.findMany({
    where: { visibility: { in: ["public", "limited"] } },
    include: {
      user: true,
      claimedSkills: { where: { status: "verified" } },
      certificates: true,
      projects: { where: { status: "completed" }, take: 3 },
    },
  });

  const verifiedCandidates = students.filter(
    (s) => s.claimedSkills.length > 0 || s.certificates.length > 0 || s.projects.length > 0
  );
  const totalSkills = verifiedCandidates.reduce((n, s) => n + s.claimedSkills.length, 0);
  const withCert = verifiedCandidates.filter((s) => s.certificates.length > 0).length;
  const pendingRequests = await prisma.contactRequest.count({
    where: { recruiterId: session.id, status: "pending" },
  });

  return (
    <AppShell active="/recruiter">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-sm font-medium text-seal">HR / Recruiter</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">Talent overview</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          Don&apos;t trust the claim. Verify the skill. Candidates here passed real Talent Proof exams.
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          {recruiter?.company || "Your company"} · {session.name}
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          <div className="panel p-4">
            <p className="text-xs text-ink-muted">Verified candidates</p>
            <p className="mt-1 font-display text-3xl font-semibold text-seal">
              {verifiedCandidates.length}
            </p>
          </div>
          <div className="panel p-4">
            <p className="text-xs text-ink-muted">Skills verified</p>
            <p className="mt-1 font-display text-3xl font-semibold">{totalSkills}</p>
          </div>
          <div className="panel p-4">
            <p className="text-xs text-ink-muted">With certificate</p>
            <p className="mt-1 font-display text-3xl font-semibold">{withCert}</p>
          </div>
          <div className="panel p-4">
            <p className="text-xs text-ink-muted">Pending contacts</p>
            <p className="mt-1 font-display text-3xl font-semibold">{pendingRequests}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/recruiter/talent" className="btn-primary px-5 py-3">
            Find verified talent →
          </Link>
          <Link href="/recruiter/shortlists" className="btn-secondary">
            Shortlists
          </Link>
        </div>

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold">Recommended</h2>
          {verifiedCandidates.length === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">
              No verified students yet. Ask a student to complete skills → exams → certificate on the
              same platform.
            </p>
          ) : (
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {verifiedCandidates.slice(0, 6).map((s) => (
                <li key={s.id} className="panel p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{s.user.name}</p>
                      <p className="text-sm text-ink-muted">{s.headline || "Student"}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {s.claimedSkills.slice(0, 4).map((c) => (
                          <span
                            key={c.id}
                            className="rounded-full bg-seal-soft px-2 py-0.5 text-xs text-seal-deep"
                          >
                            ✓ {c.skillName}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link href={`/recruiter/candidates/${s.userId}`} className="btn-secondary shrink-0">
                      Open
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </AppShell>
  );
}
