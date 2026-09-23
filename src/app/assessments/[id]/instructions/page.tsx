import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function startAssessment(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login");
  const assessmentId = String(formData.get("assessmentId"));
  const consentTerms = formData.get("consentTerms") === "on";
  const consentCamera = formData.get("consentCamera") === "on";
  if (!consentTerms) redirect(`/assessments/${assessmentId}/instructions?error=consent`);

  const assessment = await prisma.assessment.findUnique({ where: { id: assessmentId } });
  if (!assessment) redirect("/dashboard");

  await prisma.consentRecord.create({
    data: {
      userId: session.id,
      purpose: "assessment_integrity",
      version: "1.0",
      granted: true,
    },
  });
  if (consentCamera) {
    await prisma.consentRecord.create({
      data: {
        userId: session.id,
        purpose: "camera_optional",
        version: "1.0",
        granted: true,
      },
    });
  }

  const endsAt = new Date(Date.now() + assessment.durationSec * 1000);
  const sess = await prisma.assessmentSession.create({
    data: {
      assessmentId,
      endsAt,
      consentCamera,
      status: "active",
    },
  });

  await prisma.assessment.update({
    where: { id: assessmentId },
    data: { status: "in_progress" },
  });
  await prisma.project.update({
    where: { id: assessment.projectId },
    data: { status: "assessing" },
  });

  redirect(`/assessments/session/${sess.id}`);
}

export default async function AssessmentInstructionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  const { id } = await params;
  const query = await searchParams;

  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: { questions: true, project: true },
  });
  if (!assessment) notFound();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-semibold">Before you start</h1>
        <p className="mt-3 text-ink-muted">
          Quiz about <strong className="text-ink">{assessment.project.title}</strong>
        </p>

        <ul className="panel mt-6 space-y-3 p-5 text-sm text-ink-soft">
          <li>✓ {assessment.questions.length} questions</li>
          <li>✓ About {Math.round(assessment.durationSec / 60)} minutes</li>
          <li>✓ Answers save automatically</li>
          <li>✓ Short answers are fine if they’re correct</li>
          <li>✓ Camera is optional (off by default)</li>
        </ul>

        <form action={startAssessment} className="panel mt-6 space-y-4 p-6">
          <input type="hidden" name="assessmentId" value={assessment.id} />
          {query.error && (
            <p className="rounded-md bg-signal-soft px-3 py-2 text-sm text-signal">
              Please tick the checkbox to continue.
            </p>
          )}
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" name="consentTerms" className="mt-1" required />
            <span>I understand this quiz checks if I know my own project.</span>
          </label>
          <label className="flex items-start gap-3 text-sm text-ink-muted">
            <input type="checkbox" name="consentCamera" className="mt-1" />
            <span>Optional camera consent (not required for demo)</span>
          </label>
          <button className="btn-primary w-full py-3 text-base" type="submit">
            Start quiz →
          </button>
          <Link href={`/projects/${assessment.projectId}`} className="btn-ghost w-full">
            Go back
          </Link>
        </form>
      </main>
    </div>
  );
}
