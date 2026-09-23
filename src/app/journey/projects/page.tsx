import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { JourneyProgress } from "@/components/JourneyProgress";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { copySampleProjectToStorage, ensureUploadDir, runProjectPipeline } from "@/lib/pipeline";
import { friendlyStatus } from "@/lib/labels";

async function addDemoProject() {
  "use server";
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login");
  const student = await prisma.studentProfile.findUnique({ where: { userId: session.id } });
  if (!student) redirect("/login");

  const project = await prisma.project.create({
    data: {
      studentId: student.id,
      title: "Python Expense Tracker",
      description: "Project I want to prove I understand.",
      sourceType: "zip",
      githubUrl: student.githubUrl || null,
      contribution: "sole author",
      teamMembers: "[]",
      technologies: JSON.stringify(["Python"]),
      setupNotes: "python -m unittest discover -s tests -v",
      status: "analyzing",
    },
  });

  const storagePath = await copySampleProjectToStorage(project.id);
  await prisma.project.update({ where: { id: project.id }, data: { storagePath } });
  await ensureUploadDir();
  await runProjectPipeline(project.id);
  redirect(`/projects/${project.id}`);
}

async function finishProjects() {
  "use server";
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login");
  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.id },
    include: {
      projects: { include: { reports: true } },
      claimedSkills: true,
    },
  });
  if (!student) redirect("/login");

  const verifiedProjects = student.projects.filter((p) => p.status === "completed");
  // Allow continue even with 0 projects but encourage at least one — for hackathon allow skip with warning redirect if none verified and none pending
  const pending = student.projects.filter(
    (p) => p.status === "ready" || p.status === "analyzing" || p.status === "assessing"
  );
  if (pending.length > 0) redirect("/journey/projects?error=pending");

  // Compute overall score
  const skillScores = student.claimedSkills
    .filter((c) => c.status === "verified" && c.score != null)
    .map((c) => c.score as number);
  const projectScores = verifiedProjects.map((p) => {
    const r = p.reports[0];
    if (!r) return 70;
    try {
      return (JSON.parse(r.scoresJson) as { overall: number }).overall || 70;
    } catch {
      return 70;
    }
  });
  const all = [...skillScores, ...projectScores];
  const overall = all.length ? Math.round(all.reduce((a, b) => a + b, 0) / all.length) : 0;

  await prisma.studentProfile.update({
    where: { id: student.id },
    data: { journeyStep: 4, overallScore: overall },
  });
  redirect("/journey/certificate");
}

export default async function ProjectsStepPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login");
  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.id },
    include: {
      projects: {
        orderBy: { createdAt: "desc" },
        include: {
          assessments: { take: 1 },
          reports: { take: 1 },
        },
      },
    },
  });
  if (!student) redirect("/login");
  if (student.journeyStep < 3) redirect("/journey");
  const params = await searchParams;

  return (
    <AppShell active="/journey/projects">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <JourneyProgress step={3} />
        <h1 className="font-display text-3xl font-semibold">Prove your projects</h1>
        <p className="mt-2 text-ink-muted">
          Add a project you built. We’ll ask questions about <strong>your</strong> code. If you don’t
          understand it, it won’t be verified — even if AI wrote it.
        </p>

        {params.error === "pending" && (
          <p className="mt-4 rounded-lg bg-signal-soft px-3 py-2 text-sm text-signal">
            Finish open project quizzes first (or wait for analysis).
          </p>
        )}

        <form action={addDemoProject} className="panel mt-6 p-5 text-center">
          <p className="font-medium">Quick demo project</p>
          <p className="mt-1 text-sm text-ink-muted">Python Expense Tracker (real tests + quiz)</p>
          <button className="btn-primary mt-4" type="submit">
            Add & analyze project
          </button>
        </form>

        <ul className="mt-6 space-y-3">
          {student.projects.map((p) => (
            <li key={p.id} className="panel flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-ink-muted">{friendlyStatus(p.status)}</p>
              </div>
              <div className="flex gap-2">
                {p.status === "ready" && p.assessments[0] && (
                  <Link
                    href={`/assessments/${p.assessments[0].id}/instructions`}
                    className="btn-primary"
                  >
                    Take project quiz
                  </Link>
                )}
                {p.status === "completed" && p.reports[0] && (
                  <Link href={`/reports/${p.reports[0].id}`} className="btn-secondary">
                    View report
                  </Link>
                )}
                <Link href={`/projects/${p.id}`} className="btn-ghost">
                  Open
                </Link>
              </div>
            </li>
          ))}
        </ul>

        {student.projects.length === 0 && (
          <p className="mt-4 text-sm text-ink-muted">No projects yet — add the demo project above.</p>
        )}

        <form action={finishProjects} className="mt-8">
          <button className="btn-primary w-full py-3 text-base" type="submit">
            Next: get certificate →
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-ink-muted">
          Certificate will only list skills & projects you verified.
        </p>
      </main>
    </AppShell>
  );
}
