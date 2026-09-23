import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function PrivacyPage() {
  const session = await getSession();
  const consents = session
    ? await prisma.consentRecord.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <p className="eyebrow">Privacy</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Privacy & consent</h1>
        <div className="panel mt-8 space-y-4 p-6 text-sm text-ink-soft">
          <p>Camera access is never activated without explicit consent.</p>
          <p>This MVP stores integrity event metadata (e.g. tab blur), not raw video.</p>
          <p>Students control profile visibility and must accept recruiter contact requests.</p>
          <p>Project uploads are analyzed in a trusted/limited execution mode with clear labels.</p>
          <p>You may request deletion of assessment artifacts after the hackathon retention window.</p>
        </div>
        {session && (
          <div className="panel mt-6 p-6">
            <h2 className="font-display text-lg font-semibold">Your consent records</h2>
            {consents.length === 0 ? (
              <p className="mt-3 text-sm text-ink-muted">None yet.</p>
            ) : (
              <ul className="mt-3 space-y-2 font-mono text-xs text-ink-muted">
                {consents.map((c) => (
                  <li key={c.id}>
                    {c.purpose} v{c.version} · granted={String(c.granted)} ·{" "}
                    {c.createdAt.toISOString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {!session && (
          <p className="mt-6 text-sm">
            <a href="/login" className="text-seal underline">
              Log in
            </a>{" "}
            to view personal consent records.
          </p>
        )}
      </main>
    </div>
  );
}
