import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { JourneyProgress } from "@/components/JourneyProgress";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSkillBySlug } from "@/lib/skill-catalog";

async function startExam(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login");
  const claimedId = String(formData.get("claimedId"));
  const claimed = await prisma.claimedSkill.findUnique({
    where: { id: claimedId },
    include: { student: true },
  });
  if (!claimed || claimed.student.userId !== session.id) redirect("/journey/exams");

  const skill = getSkillBySlug(claimed.skillSlug);
  if (!skill) redirect("/journey/exams");

  const endsAt = new Date(Date.now() + 15 * 60 * 1000);
  const examSession = await prisma.skillExamSession.create({
    data: {
      claimedSkillId: claimed.id,
      endsAt,
      status: "active",
      answersJson: "{}",
      integrityJson: "[]",
    },
  });

  redirect(`/journey/exams/take/${examSession.id}`);
}

async function goToProjects() {
  "use server";
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login");
  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.id },
    include: { claimedSkills: true },
  });
  if (!student) redirect("/login");

  const pending = student.claimedSkills.filter((c) => c.status === "pending");
  if (pending.length > 0) redirect("/journey/exams?error=pending");

  await prisma.studentProfile.update({
    where: { id: student.id },
    data: { journeyStep: 3 },
  });
  redirect("/journey/projects");
}

export default async function ExamsStepPage({
  searchParams,
}: {
  searchParams: Promise<{ done?: string; error?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login");
  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.id },
    include: { claimedSkills: { orderBy: { skillName: "asc" } } },
  });
  if (!student) redirect("/login");
  if (student.journeyStep < 2) redirect("/journey/skills");

  const params = await searchParams;
  const verified = student.claimedSkills.filter((c) => c.status === "verified").length;
  const failed = student.claimedSkills.filter((c) => c.status === "failed").length;
  const pending = student.claimedSkills.filter((c) => c.status === "pending").length;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <JourneyProgress step={2} />
        <h1 className="font-display text-3xl font-semibold">Skill exams</h1>
        <p className="mt-2 text-ink-muted">
          One exam per skill. Strict mode: no paste, stay on this tab, timer on. Pass to verify.
        </p>

        {params.done && (
          <p className="mt-4 rounded-lg bg-seal-soft px-3 py-2 text-sm text-seal-deep">
            Exam submitted. Check status below.
          </p>
        )}
        {params.error === "pending" && (
          <p className="mt-4 rounded-lg bg-signal-soft px-3 py-2 text-sm text-signal">
            Finish every pending exam (pass or fail) before continuing — or remove skills in step 1.
          </p>
        )}

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="panel p-3">
            <p className="text-2xl font-semibold text-seal">{verified}</p>
            <p className="text-ink-muted">Verified</p>
          </div>
          <div className="panel p-3">
            <p className="text-2xl font-semibold">{pending}</p>
            <p className="text-ink-muted">To do</p>
          </div>
          <div className="panel p-3">
            <p className="text-2xl font-semibold text-signal">{failed}</p>
            <p className="text-ink-muted">Failed</p>
          </div>
        </div>

        <ul className="mt-6 space-y-3">
          {student.claimedSkills.map((c) => (
            <li key={c.id} className="panel flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium">{c.skillName}</p>
                <p className="text-xs text-ink-muted">
                  From {c.source} ·{" "}
                  {c.status === "verified"
                    ? `Verified · score ${c.score}`
                    : c.status === "failed"
                      ? `Not verified · score ${c.score}`
                      : "Not taken yet"}
                </p>
              </div>
              {c.status === "pending" ? (
                <form action={startExam}>
                  <input type="hidden" name="claimedId" value={c.id} />
                  <button className="btn-primary" type="submit">
                    Start exam
                  </button>
                </form>
              ) : c.status === "failed" ? (
                <form action={startExam}>
                  <input type="hidden" name="claimedId" value={c.id} />
                  <button className="btn-secondary" type="submit">
                    Retake
                  </button>
                </form>
              ) : (
                <span className="rounded-full bg-seal-soft px-3 py-1 text-xs font-medium text-seal-deep">
                  ✓ Verified
                </span>
              )}
            </li>
          ))}
        </ul>

        {student.claimedSkills.length === 0 && (
          <p className="mt-6 text-sm text-ink-muted">
            No skills selected.{" "}
            <Link href="/journey/skills" className="text-seal underline">
              Go back
            </Link>
          </p>
        )}

        <form action={goToProjects} className="mt-8">
          {pending > 0 ? (
            <p className="mb-3 text-center text-sm text-signal">
              Complete {pending} remaining exam(s) to unlock the next step.
            </p>
          ) : null}
          <button className="btn-primary w-full py-3 text-base" type="submit">
            {pending > 0 ? "Check exams status" : "Next: verify projects →"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          <Link href="/journey/skills" className="text-ink-muted underline">
            ← Edit skills
          </Link>
        </p>
      </main>
    </div>
  );
}
