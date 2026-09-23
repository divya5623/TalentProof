import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

const studentSteps = [
  "Create a student profile",
  "Choose a programming language and level",
  "Submit a project and complete the skill assessment",
  "Receive evidence-backed results, badges, and certificates",
];

const recruiterSteps = [
  "Create a recruiter account",
  "Create or review open roles",
  "Discover candidates by verified skills",
  "Review evidence, shortlist, and request contact",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-paper-line bg-white px-3 py-1 text-xs font-medium text-seal-deep">
              <span className="inline-flex h-2 w-2 rounded-full bg-seal" />
              One connected verification network
            </div>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
              Talent <span className="text-seal">Proof</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-soft sm:text-xl">
              Prove skills. Build trust. Discover talent. Students demonstrate what they can do,
              while recruiters discover candidates through evidence instead of claims alone.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="btn-primary px-6 py-3 text-base">
                Create account →
              </Link>
              <Link href="/login" className="btn-secondary px-6 py-3 text-base">
                Log in
              </Link>
            </div>
          </div>

          <div className="panel space-y-5 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-seal text-2xl font-semibold text-white">
                ✓
              </div>
              <div>
                <p className="font-display text-xl font-semibold text-ink">Verified by evidence</p>
                <p className="text-sm text-ink-muted">A shared student-to-recruiter journey</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-ink-soft">
              <div className="rounded-xl bg-seal-soft/60 p-4">
                <p className="font-semibold text-ink">Student proof</p>
                <p className="mt-1">Projects, assessments, reports, badges, and certificates.</p>
              </div>
              <div className="rounded-xl bg-paper-soft p-4">
                <p className="font-semibold text-ink">Recruiter discovery</p>
                <p className="mt-1">Roles, candidate search, evidence review, and shortlists.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="panel p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-seal">For students</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Turn learning into proof</h2>
            <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-6 text-ink-soft">
              {studentSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <Link href="/journey" className="btn-secondary mt-6 inline-flex">
              Explore student journey →
            </Link>
          </div>

          <div className="panel p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-seal">For recruiters</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Find verified talent</h2>
            <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-6 text-ink-soft">
              {recruiterSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <Link href="/recruiter" className="btn-secondary mt-6 inline-flex">
              Open recruiter workspace →
            </Link>
          </div>
        </section>

        <section className="panel mt-6 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl font-semibold text-ink">Integrated platform modules</p>
              <p className="mt-1 text-sm text-ink-muted">The same product connects assessment, evidence, and hiring workflows.</p>
            </div>
            <Link href="/reports" className="btn-primary">
              View reports →
            </Link>
          </div>
          <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Assessment", "/assessments/session"],
              ["Projects", "/projects"],
              ["Certificates", "/certificate"],
              ["Find talent", "/recruiter/candidates"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="rounded-xl border border-paper-line bg-white p-4 font-medium text-ink transition hover:border-seal hover:text-seal">
                {label} ↗
              </Link>
            ))}
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-ink-muted">
          Talent Proof keeps verification and discovery in one connected product.
        </p>
      </main>
    </div>
  );
}
