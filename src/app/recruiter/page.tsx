import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseJson } from "@/lib/utils";

async function sendRequest(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session || session.role !== "recruiter") redirect("/login");
  const studentUserId = String(formData.get("studentUserId"));
  const message = String(formData.get("message") || "").trim();
  const type = String(formData.get("type") || "contact");
  if (!studentUserId || !message) redirect("/recruiter?error=missing");

  const req = await prisma.contactRequest.create({
    data: {
      recruiterId: session.id,
      studentId: studentUserId,
      message,
      type,
      status: "pending",
    },
  });

  await prisma.notification.create({
    data: {
      userId: studentUserId,
      type: "contact_request",
      title: type === "interview" ? "Interview invitation" : "Contact request",
      body: message,
      payload: JSON.stringify({ requestId: req.id }),
    },
  });

  redirect(`/contact/${req.id}`);
}

export default async function RecruiterPage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string; error?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "recruiter") redirect("/dashboard");
  const params = await searchParams;
  const skill = (params.skill || "python").toLowerCase();

  const students = await prisma.studentProfile.findMany({
    where: { visibility: { in: ["public", "limited"] } },
    include: {
      user: true,
      badges: { include: { skill: true } },
      claimedSkills: { where: { status: "verified" } },
      projects: {
        where: { status: "completed" },
        include: { reports: { orderBy: { createdAt: "desc" }, take: 1 } },
        orderBy: { updatedAt: "desc" },
        take: 3,
      },
    },
  });

  const filtered = students.filter((s) => {
    const skills = parseJson<string[]>(s.skillsJson, []);
    const badgeNames = s.badges.map((b) => b.skill.name.toLowerCase());
    const claimed = s.claimedSkills.map((c) => c.skillName.toLowerCase());
    const stack = s.projects.flatMap((p) => parseJson<string[]>(p.detectedStack, []));
    const hay = [...skills, ...badgeNames, ...claimed, ...stack, s.headline, s.user.name]
      .join(" ")
      .toLowerCase();
    if (skill && !hay.includes(skill)) return false;
    return s.claimedSkills.length > 0 || s.badges.length > 0 || s.projects.length > 0;
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-semibold">Find students</h1>
        <p className="mt-2 text-ink-muted">
          Search by skill. You’ll only see students with real project proof.
        </p>

        <form className="mt-6 flex gap-2">
          <input
            className="input"
            name="skill"
            placeholder="Try: python"
            defaultValue={params.skill || "python"}
          />
          <button className="btn-primary shrink-0" type="submit">
            Search
          </button>
        </form>

        {params.error && (
          <p className="mt-4 text-sm text-signal">Please write a short message before sending.</p>
        )}

        <div className="mt-8 space-y-4">
          {filtered.length === 0 ? (
            <div className="panel p-6 text-center">
              <p className="text-ink-soft">No verified students yet.</p>
              <p className="mt-2 text-sm text-ink-muted">
                Log in as the student first, finish the quiz, then come back here.
              </p>
            </div>
          ) : (
            filtered.map((s) => (
              <article key={s.id} className="panel p-5">
                <h2 className="font-display text-xl font-semibold">{s.user.name}</h2>
                <p className="text-sm text-ink-muted">{s.headline || "Student"}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {s.claimedSkills.map((c) => (
                    <span key={c.id} className="rounded-full bg-seal-soft px-2.5 py-1 text-xs text-seal-deep">
                      ✓ {c.skillName}
                    </span>
                  ))}
                  {s.badges.map((b) => (
                    <span key={b.id} className="rounded-full bg-seal-soft px-2.5 py-1 text-xs text-seal-deep">
                      ✓ {b.skill.name}
                    </span>
                  ))}
                </div>

                <p className="mt-4 text-sm font-medium text-ink">Why they match</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-ink-muted">
                  {s.claimedSkills.length > 0 && <li>Passed skill verification exams</li>}
                  {s.badges.length > 0 && <li>Has verified skill badges</li>}
                  {s.projects.length > 0 && <li>Finished a project quiz with a report</li>}
                  {skill && <li>Related to “{skill}”</li>}
                </ul>

                {s.projects[0]?.reports[0] && (
                  <Link
                    href={`/reports/${s.projects[0].reports[0].id}`}
                    className="mt-3 inline-block text-sm text-seal underline"
                  >
                    View proof / report
                  </Link>
                )}

                <form action={sendRequest} className="mt-5 space-y-2 border-t border-paper-line pt-4">
                  <input type="hidden" name="studentUserId" value={s.userId} />
                  <label className="label">Ask to contact them</label>
                  <select className="input" name="type" defaultValue="interview">
                    <option value="contact">Say hello</option>
                    <option value="interview">Invite to interview</option>
                  </select>
                  <textarea
                    className="input min-h-20"
                    name="message"
                    required
                    placeholder="Hi! We liked your Python project…"
                    defaultValue="Hi! We liked your verified Python project. Interested in a short chat?"
                  />
                  <button className="btn-primary w-full py-3" type="submit">
                    Send request (needs student OK)
                  </button>
                </form>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
