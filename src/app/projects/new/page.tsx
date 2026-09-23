import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { copySampleProjectToStorage, ensureUploadDir, runProjectPipeline } from "@/lib/pipeline";

async function submitDemoProject() {
  "use server";
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login");
  const student = await prisma.studentProfile.findUnique({ where: { userId: session.id } });
  if (!student) redirect("/login");

  const project = await prisma.project.create({
    data: {
      studentId: student.id,
      title: "Python Expense Tracker",
      description: "A simple Python project that tracks expenses and has tests.",
      sourceType: "zip",
      contribution: "sole author",
      teamMembers: "[]",
      technologies: JSON.stringify(["Python", "Testing"]),
      setupNotes: "python -m unittest discover -s tests -v",
      status: "analyzing",
    },
  });

  const storagePath = await copySampleProjectToStorage(project.id);
  await prisma.project.update({ where: { id: project.id }, data: { storagePath } });
  await ensureUploadDir();
  await runProjectPipeline(project.id);

  await prisma.notification.create({
    data: {
      userId: session.id,
      type: "analysis_complete",
      title: "Project checked",
      body: "Your project is ready. Take the quiz next.",
      payload: JSON.stringify({ projectId: project.id }),
    },
  });

  redirect(`/projects/${project.id}`);
}

export default async function NewProjectPage() {
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login");

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-semibold">Submit a project</h1>
        <p className="mt-3 text-ink-muted">
          For the hackathon demo, click the big button. We’ll use a real Python sample with real tests.
        </p>

        <form action={submitDemoProject} className="panel mt-8 p-6 text-center">
          <p className="text-lg font-medium text-ink">Python Expense Tracker</p>
          <p className="mt-2 text-sm text-ink-muted">
            Includes code + unit tests. Safe to run in demo mode.
          </p>
          <button className="btn-primary mt-6 w-full py-3 text-base" type="submit">
            Submit demo project →
          </button>
          <p className="mt-4 text-xs text-ink-muted">Takes a few seconds while we check the code.</p>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          <a href="/dashboard" className="underline">
            Back to home
          </a>
        </p>
      </main>
    </div>
  );
}
