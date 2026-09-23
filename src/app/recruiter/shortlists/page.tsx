import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseJson } from "@/lib/utils";

type SL = { id: string; name: string; studentIds: string[] };

export default async function ShortlistsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "recruiter") redirect("/journey");

  const profile = await prisma.recruiterProfile.findUnique({ where: { userId: session.id } });
  const lists = parseJson<SL[]>(profile?.shortlistsJson || "[]", []);
  const allIds = [...new Set(lists.flatMap((l) => l.studentIds))];

  const students = allIds.length
    ? await prisma.studentProfile.findMany({
        where: { userId: { in: allIds } },
        include: {
          user: true,
          claimedSkills: { where: { status: "verified" } },
        },
      })
    : [];

  const byUser = Object.fromEntries(students.map((s) => [s.userId, s]));

  return (
    <AppShell active="/recruiter/shortlists">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl font-semibold">Shortlists</h1>
        <p className="mt-2 text-ink-muted">Saved from Find talent — connected to real students.</p>

        {lists.length === 0 ? (
          <div className="panel mt-8 p-6 text-center text-sm text-ink-muted">
            Empty. Search talent and click Shortlist.
            <div className="mt-4">
              <Link href="/recruiter/talent" className="btn-primary">
                Find talent
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {lists.map((list) => (
              <section key={list.id} className="panel p-5">
                <h2 className="font-display text-lg font-semibold">{list.name}</h2>
                <ul className="mt-3 space-y-2">
                  {list.studentIds.length === 0 && (
                    <li className="text-sm text-ink-muted">No people yet</li>
                  )}
                  {list.studentIds.map((id) => {
                    const s = byUser[id];
                    if (!s) {
                      return (
                        <li key={id} className="text-sm text-ink-muted">
                          Unknown student
                        </li>
                      );
                    }
                    return (
                      <li
                        key={id}
                        className="flex items-center justify-between border-b border-paper-line py-2 text-sm"
                      >
                        <div>
                          <p className="font-medium">{s.user.name}</p>
                          <p className="text-xs text-ink-muted">
                            {s.claimedSkills.map((c) => c.skillName).join(", ")}
                          </p>
                        </div>
                        <Link href={`/recruiter/candidates/${s.userId}`} className="text-seal underline">
                          Profile
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}
