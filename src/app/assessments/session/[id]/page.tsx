import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { LiveAssessment } from "@/components/LiveAssessment";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const sessionUser = await getSession();
  if (!sessionUser) redirect("/login");
  const { id } = await params;

  const session = await prisma.assessmentSession.findUnique({
    where: { id },
    include: {
      answers: true,
      assessment: {
        include: {
          questions: { orderBy: { orderIndex: "asc" } },
          project: true,
        },
      },
    },
  });
  if (!session) notFound();
  if (session.status !== "active") redirect(`/projects/${session.assessment.projectId}`);

  const initialAnswers: Record<string, string> = {};
  for (const a of session.answers) initialAnswers[a.questionId] = a.content;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="eyebrow">Live assessment</p>
        <h1 className="mt-2 font-display text-2xl font-semibold">{session.assessment.project.title}</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Autosave is on. Integrity events are warnings/review cues — not automatic fails.
        </p>
        <div className="mt-8">
          <LiveAssessment
            sessionId={session.id}
            endsAtIso={session.endsAt.toISOString()}
            questions={session.assessment.questions}
            initialAnswers={initialAnswers}
          />
        </div>
      </main>
    </div>
  );
}
