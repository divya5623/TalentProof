import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { friendlyStatus } from "@/lib/labels";

export default async function StudentHome() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "recruiter") redirect("/recruiter");
  if (session.role === "reviewer") redirect("/reviewer");

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.id },
    include: {
      claimedSkills: true,
      projects: { include: { reports: true, assessments: { take: 1 } } },
      certificates: true,
      badges: { include: { skill: true } },
    },
  });
  if (!student) redirect("/login");

  const verifiedSkills = student.claimedSkills.filter((c) => c.status === "verified");
  const pendingExams = student.claimedSkills.filter((c) => c.status === "pending");
  const verifiedProjects = student.projects.filter((p) => p.status === "completed");
  const readyProjects = student.projects.filter((p) => p.status === "ready");

  const steps = [
    {
      n: 1,
      title: "Skills & resume",
      href: "/journey/skills",
      done: student.journeyStep > 1 || student.claimedSkills.length > 0,
      detail:
        student.claimedSkills.length > 0
          ? `${student.claimedSkills.length} skill(s) claimed`
          : "Upload resume or add skills",
    },
    {
      n: 2,
      title: "Skill exams",
      href: "/journey/exams",
      done: pendingExams.length === 0 && verifiedSkills.length > 0,
      detail:
        verifiedSkills.length > 0
          ? `${verifiedSkills.length} verified · ${pendingExams.length} left`
          : "Take one exam per skill",
    },
    {
      n: 3,
      title: "Projects",
      href: "/journey/projects",
      done: verifiedProjects.length > 0,
      detail:
        verifiedProjects.length > 0
          ? `${verifiedProjects.length} project(s) verified`
          : readyProjects.length > 0
            ? "Project ready — take quiz"
            : "Prove you understand your code",
    },
    {
      n: 4,
      title: "Certificate",
      href: "/journey/certificate",
      done: student.certificates.length > 0 || student.journeyStep >= 4,
      detail:
        student.certificates[0]
          ? `Issued · score ${Math.round(student.overallScore)}`
          : "Issue shareable certificate",
    },
  ];

  let next = steps.find((s) => !s.done) || steps[3];
  if (student.journeyStep === 1) next = steps[0];
  else if (student.journeyStep === 2) next = steps[1];
  else if (student.journeyStep === 3) next = steps[2];
  else if (student.journeyStep >= 4) next = steps[3];

  const requests = await prisma.contactRequest.findMany({
    where: { studentId: session.id, status: "pending" },
    include: { recruiter: { include: { recruiterProfile: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppShell active="/journey">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-seal">Student workspace</p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-ink">
              Hi, {session.name.split(" ")[0]}
            </h1>
            <p className="mt-2 max-w-xl text-ink-muted">
              One path: claim skills → pass exams → verify projects → get a certificate HR can trust.
            </p>
          </div>
          <Link href={next.href} className="btn-primary px-5 py-3 text-base">
            Continue: {next.title} →
          </Link>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          <div className="panel p-4">
            <p className="text-xs text-ink-muted">Verified skills</p>
            <p className="mt-1 font-display text-3xl font-semibold text-seal">{verifiedSkills.length}</p>
          </div>
          <div className="panel p-4">
            <p className="text-xs text-ink-muted">Exams left</p>
            <p className="mt-1 font-display text-3xl font-semibold">{pendingExams.length}</p>
          </div>
          <div className="panel p-4">
            <p className="text-xs text-ink-muted">Projects proven</p>
            <p className="mt-1 font-display text-3xl font-semibold">{verifiedProjects.length}</p>
          </div>
          <div className="panel p-4">
            <p className="text-xs text-ink-muted">Overall score</p>
            <p className="mt-1 font-display text-3xl font-semibold">{Math.round(student.overallScore)}</p>
          </div>
        </div>

        {requests.length > 0 && (
          <div className="mt-6 rounded-xl border border-seal/30 bg-seal-soft/50 p-4 text-sm text-seal-deep">
            <p className="font-medium">{requests.length} recruiter request(s)</p>
            <ul className="mt-2 space-y-1">
              {requests.map((r) => (
                <li key={r.id}>
                  {r.recruiter.name}
                  {r.recruiter.recruiterProfile
                    ? ` · ${r.recruiter.recruiterProfile.company}`
                    : ""}{" "}
                  —{" "}
                  <Link href={`/contact/${r.id}`} className="underline">
                    Respond
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold">Your verification journey</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {steps.map((s) => (
              <Link
                key={s.n}
                href={s.href}
                className={`panel block p-5 transition hover:border-seal/40 ${
                  next.n === s.n ? "border-seal/50 bg-seal-soft/20" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-seal">Step {s.n}</p>
                    <p className="mt-1 font-display text-lg font-semibold">{s.title}</p>
                    <p className="mt-1 text-sm text-ink-muted">{s.detail}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      s.done ? "bg-seal-soft text-seal-deep" : "bg-paper text-ink-muted"
                    }`}
                  >
                    {s.done ? "Done" : "Open"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="panel p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Exam board</h3>
              <Link href="/journey/exams" className="text-sm text-seal underline">
                Open exams
              </Link>
            </div>
            {student.claimedSkills.length === 0 ? (
              <p className="mt-4 text-sm text-ink-muted">No skills yet — start with Skills.</p>
            ) : (
              <ul className="mt-4 divide-y divide-paper-line">
                {student.claimedSkills.map((c) => (
                  <li key={c.id} className="flex justify-between py-3 text-sm">
                    <span>{c.skillName}</span>
                    <span className="font-medium text-ink-muted">
                      {c.status === "verified"
                        ? `Verified ${c.score}`
                        : c.status === "failed"
                          ? `Retry (${c.score})`
                          : "Take exam"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="panel p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Projects</h3>
              <Link href="/journey/projects" className="text-sm text-seal underline">
                Open projects
              </Link>
            </div>
            {student.projects.length === 0 ? (
              <p className="mt-4 text-sm text-ink-muted">No projects yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-paper-line">
                {student.projects.slice(0, 5).map((p) => (
                  <li key={p.id} className="flex justify-between py-3 text-sm">
                    <Link href={`/projects/${p.id}`} className="hover:text-seal">
                      {p.title}
                    </Link>
                    <span className="text-ink-muted">{friendlyStatus(p.status)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {student.certificates[0] && (
          <div className="panel mt-8 flex flex-wrap items-center justify-between gap-3 border-seal/30 p-5">
            <div>
              <p className="font-display text-lg font-semibold">Certificate ready</p>
              <p className="text-sm text-ink-muted">{student.certificates[0].certUid}</p>
            </div>
            <Link
              href={`/certificate/${student.certificates[0].certUid}`}
              className="btn-primary"
            >
              View / share
            </Link>
          </div>
        )}
      </main>
    </AppShell>
  );
}
