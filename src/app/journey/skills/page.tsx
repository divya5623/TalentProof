import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { JourneyProgress } from "@/components/JourneyProgress";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SKILL_CATALOG, extractSkillsFromText, getSkillBySlug } from "@/lib/skill-catalog";

async function saveSkillsStep(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login");
  const student = await prisma.studentProfile.findUnique({ where: { userId: session.id } });
  if (!student) redirect("/login");

  const githubUrl = String(formData.get("githubUrl") || "").trim();
  const resumeText = String(formData.get("resumeText") || "").trim();
  const resumeFileName = String(formData.get("resumeFileName") || "").trim();
  const selected = formData.getAll("skills").map(String);

  if (selected.length === 0) redirect("/journey/skills?error=none");

  await prisma.studentProfile.update({
    where: { id: student.id },
    data: {
      githubUrl,
      resumeText: resumeText.slice(0, 50000),
      resumeFileName,
      journeyStep: 2,
      skillsJson: JSON.stringify(selected),
    },
  });

  // Sync claimed skills
  const existing = await prisma.claimedSkill.findMany({ where: { studentId: student.id } });
  const existingSlugs = new Set(existing.map((e) => e.skillSlug));

  for (const slug of selected) {
    const def = getSkillBySlug(slug);
    if (!def) continue;
    const fromResume =
      resumeText && extractSkillsFromText(resumeText).includes(slug) ? "resume" : "manual";
    if (existingSlugs.has(slug)) {
      await prisma.claimedSkill.update({
        where: { studentId_skillSlug: { studentId: student.id, skillSlug: slug } },
        data: { skillName: def.name, source: fromResume },
      });
    } else {
      await prisma.claimedSkill.create({
        data: {
          studentId: student.id,
          skillSlug: slug,
          skillName: def.name,
          source: fromResume,
          status: "pending",
        },
      });
    }
  }

  // Remove unchecked pending skills (keep verified)
  for (const e of existing) {
    if (!selected.includes(e.skillSlug) && e.status === "pending") {
      await prisma.claimedSkill.delete({ where: { id: e.id } });
    }
  }

  redirect("/journey/exams");
}

async function extractAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login");
  const text = String(formData.get("resumeText") || "");
  const githubUrl = String(formData.get("githubUrl") || "");
  const fileName = String(formData.get("resumeFileName") || "resume.txt");
  const student = await prisma.studentProfile.findUnique({ where: { userId: session.id } });
  if (!student) redirect("/login");

  const found = extractSkillsFromText(text);
  await prisma.studentProfile.update({
    where: { id: student.id },
    data: {
      resumeText: text.slice(0, 50000),
      resumeFileName: fileName,
      githubUrl,
      skillsJson: JSON.stringify(found),
    },
  });
  redirect(`/journey/skills?extracted=${found.length}`);
}

export default async function SkillsStepPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; extracted?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login");
  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.id },
    include: { claimedSkills: true },
  });
  if (!student) redirect("/login");
  const params = await searchParams;

  const preselected = new Set(
    student.skillsJson
      ? (JSON.parse(student.skillsJson) as string[])
      : student.claimedSkills.map((c) => c.skillSlug)
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <JourneyProgress step={1} />
        <h1 className="font-display text-3xl font-semibold">What skills do you want to prove?</h1>
        <p className="mt-2 text-ink-muted">
          Upload a resume (optional) to auto-detect skills, or pick them yourself. You can skip the
          resume.
        </p>

        {params.extracted && (
          <p className="mt-4 rounded-lg bg-seal-soft px-3 py-2 text-sm text-seal-deep">
            Found {params.extracted} skill(s) in your resume — review and edit below.
          </p>
        )}
        {params.error && (
          <p className="mt-4 rounded-lg bg-signal-soft px-3 py-2 text-sm text-signal">
            Select at least one skill to continue.
          </p>
        )}

        <form action={extractAction} className="panel mt-6 space-y-4 p-5">
          <h2 className="font-display text-lg font-semibold">1) Resume (optional)</h2>
          <p className="text-sm text-ink-muted">
            Paste resume text (PDF later). We only extract skills — we do not store your email from
            the file for recruiters.
          </p>
          <input type="hidden" name="resumeFileName" value="pasted-resume.txt" />
          <textarea
            className="input min-h-32 text-sm"
            name="resumeText"
            placeholder="Paste resume text here… e.g. Skills: Python, React, SQL, Git"
            defaultValue={student.resumeText || ""}
          />
          <div>
            <label className="label" htmlFor="githubUrl">
              GitHub profile or repo (optional)
            </label>
            <input
              className="input"
              id="githubUrl"
              name="githubUrl"
              placeholder="https://github.com/you"
              defaultValue={student.githubUrl || ""}
            />
          </div>
          <button type="submit" className="btn-secondary">
            Extract skills from resume
          </button>
        </form>

        <form action={saveSkillsStep} className="panel mt-4 space-y-4 p-5">
          <h2 className="font-display text-lg font-semibold">2) Confirm skills to verify</h2>
          <p className="text-sm text-ink-muted">Tick every language/tool you want to take an exam for.</p>
          <input type="hidden" name="resumeText" value={student.resumeText || ""} />
          <input type="hidden" name="resumeFileName" value={student.resumeFileName || ""} />
          <input type="hidden" name="githubUrl" value={student.githubUrl || ""} />

          <div className="grid gap-2 sm:grid-cols-2">
            {SKILL_CATALOG.map((s) => (
              <label
                key={s.slug}
                className="flex items-center gap-3 rounded-lg border border-paper-line px-3 py-3 text-sm hover:border-seal/40"
              >
                <input
                  type="checkbox"
                  name="skills"
                  value={s.slug}
                  defaultChecked={preselected.has(s.slug)}
                />
                <span>
                  <span className="font-medium">{s.name}</span>
                  <span className="block text-xs text-ink-muted">{s.category}</span>
                </span>
              </label>
            ))}
          </div>

          <button type="submit" className="btn-primary w-full py-3 text-base">
            Next: take skill exams →
          </button>
        </form>
      </main>
    </div>
  );
}
