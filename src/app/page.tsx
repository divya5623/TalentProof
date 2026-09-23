import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-14 sm:px-6">
        <p className="font-display text-4xl font-semibold text-ink sm:text-5xl">
          Talent <span className="text-seal">Proof</span>
        </p>
        <h1 className="mt-4 text-xl text-ink-soft sm:text-2xl">
          One connected platform — student exams and HR discovery share the same verified data.
        </h1>
        <p className="mt-4 text-ink-muted">
          Students prove skills. HR sees only what was verified. No separate fake dashboards.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/login" className="btn-primary px-6 py-3 text-base">
            Log in →
          </Link>
          <Link href="/register" className="btn-secondary px-6 py-3 text-base">
            Create account
          </Link>
        </div>

        <div className="panel mt-10 space-y-4 p-6 text-sm text-ink-soft">
          <p className="font-display text-lg font-semibold text-ink">Connected flow</p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong>Student</strong> — Skills → Exam dashboard → Projects → Certificate
            </li>
            <li>
              <strong>HR</strong> — Overview → Find talent → Candidate profile → Shortlist / Contact
            </li>
            <li>Same database. Same verification. Same certificate ID.</li>
          </ol>
        </div>

        <div className="mt-6 rounded-xl bg-seal-soft/60 p-4 text-sm text-seal-deep">
          <p className="font-medium">Demo accounts</p>
          <p className="mt-1">
            Student: <code>student@talentproof.dev</code>
          </p>
          <p>
            Recruiter / HR: <code>recruiter@talentproof.dev</code>
          </p>
          <p>
            Password: <code>password123</code>
          </p>
        </div>
      </main>
    </div>
  );
}
