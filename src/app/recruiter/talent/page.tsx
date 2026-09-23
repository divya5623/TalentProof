import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseJson } from "@/lib/utils";

async function sendRequest(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session || session.role !== "recruiter") redirect("/login");
  const studentUserId = String(formData.get("studentUserId"));
  const message = String(formData.get("message") || "").trim();
  const type = String(formData.get("type") || "interview");
  if (!studentUserId || !message) redirect("/recruiter/talent?error=missing");

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

async function addToShortlist(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session || session.role !== "recruiter") redirect("/login");
  const studentUserId = String(formData.get("studentUserId"));
  const profile = await prisma.recruiterProfile.findUnique({ where: { userId: session.id } });
  if (!profile) redirect("/recruiter/talent");

  type SL = { id: string; name: string; studentIds: string[] };
  const lists = parseJson<SL[]>(profile.shortlistsJson || "[]", []);
  let primary = lists.find((l) => l.name === "Default");
  if (!primary) {
    primary = { id: "default", name: "Default", studentIds: [] };
    lists.unshift(primary);
  }
  if (!primary.studentIds.includes(studentUserId)) primary.studentIds.push(studentUserId);

  await prisma.recruiterProfile.update({
    where: { id: profile.id },
    data: { shortlistsJson: JSON.stringify(lists) },
  });
  redirect("/recruiter/shortlists");
}

export default async function TalentSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string; error?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "recruiter") redirect("/journey");
  const params = await searchParams;
  const skill = (params.skill || "").toLowerCase().trim();

  const students = await prisma.studentProfile.findMany({
    where: { visibility: { in: ["public", "limited"] } },
    include: {
      user: true,
      claimedSkills: { where: { status: "verified" } },
      certificates: true,
      projects: {
        where: { status: "completed" },
        include: { reports: { take: 1 } },
        take: 5,
      },
    },
  });

  const filtered = students.filter((s) => {
    if (s.claimedSkills.length === 0 && s.certificates.length === 0 && s.projects.length === 0) {
      return false;
    }
    if (!skill) return true;
    const hay = [
      ...s.claimedSkills.map((c) => c.skillName),
      ...s.projects.map((p) => p.title),
      s.headline,
      s.user.name,
      ...parseJson<string[]>(s.skillsJson, []),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(skill);
  });

  return (
    <AppShell active="/recruiter/talent">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-semibold">Find verified talent</h1>
        <p className="mt-2 text-ink-muted">
          Search only shows students who passed Talent Proof exams (same data as student dashboard).
        </p>

        <form className="mt-6 flex gap-2">
          <input
            className="input"
            name="skill"
            placeholder="e.g. python, react, sql"
            defaultValue={params.skill || "python"}
          />
          <button className="btn-primary shrink-0" type="submit">
            Search
          </button>
        </form>

        {params.error && (
          <p className="mt-4 text-sm text-signal">Please write a message before contacting.</p>
        )}

        <div className="mt-8 space-y-4">
          {filtered.length === 0 ? (
            <div className="panel p-6 text-center text-sm text-ink-muted">
              No matches. Have a student finish exams on this platform first.
            </div>
          ) : (
            filtered.map((s) => (
              <article key={s.id} className="panel p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-semibold">{s.user.name}</h2>
                    <p className="text-sm text-ink-muted">{s.headline || "Verified student"}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {s.claimedSkills.map((c) => (
                        <span
                          key={c.id}
                          className="rounded-full bg-seal-soft px-2.5 py-1 text-xs text-seal-deep"
                        >
                          ✓ {c.skillName} ({c.score})
                        </span>
                      ))}
                    </div>
                    <ul className="mt-3 list-disc pl-5 text-sm text-ink-muted">
                      {s.claimedSkills.length > 0 && <li>Passed skill exams on Talent Proof</li>}
                      {s.projects.length > 0 && <li>{s.projects.length} project(s) verified</li>}
                      {s.certificates[0] && <li>Certificate {s.certificates[0].certUid}</li>}
                      {skill && <li>Matches “{skill}”</li>}
                    </ul>
                  </div>
                  <Link href={`/recruiter/candidates/${s.userId}`} className="btn-secondary">
                    Full profile
                  </Link>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-paper-line pt-4">
                  <form action={addToShortlist}>
                    <input type="hidden" name="studentUserId" value={s.userId} />
                    <button className="btn-secondary" type="submit">
                      Shortlist
                    </button>
                  </form>
                  <form action={sendRequest} className="flex min-w-[240px] flex-1 flex-col gap-2">
                    <input type="hidden" name="studentUserId" value={s.userId} />
                    <input type="hidden" name="type" value="interview" />
                    <input
                      className="input"
                      name="message"
                      required
                      defaultValue="Hi! We liked your verified skills. Open to a short chat?"
                    />
                    <button className="btn-primary" type="submit">
                      Request contact
                    </button>
                  </form>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </AppShell>
  );
}
