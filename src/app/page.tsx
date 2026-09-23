import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-14 sm:px-6">
        <p className="font-display text-4xl font-semibold text-ink sm:text-5xl">
          Talent <span className="text-seal">Proof</span>
        </p>
        <h1 className="mt-4 text-xl text-ink-soft sm:text-2xl">
          Upload resume → prove each skill with a strict exam → verify projects → get a certificate.
        </h1>
        <p className="mt-4 text-ink-muted">
          We extract skills from your resume (or you add them). You only get certified for what you
          pass.
        </p>

        <Link href="/login" className="btn-primary mt-8 inline-flex px-6 py-3 text-base">
          Start → Log in
        </Link>

        <div className="panel mt-10 p-6">
          <h2 className="font-display text-lg font-semibold">4 clear steps</h2>
          <ol className="mt-4 space-y-3 text-sm text-ink-soft">
            <li>
              <strong>1. Skills</strong> — resume extract or add manually
            </li>
            <li>
              <strong>2. Skill exams</strong> — strict test per language (no paste, tab warnings)
            </li>
            <li>
              <strong>3. Projects</strong> — prove you understand your own code
            </li>
            <li>
              <strong>4. Certificate</strong> — download & share only verified items
            </li>
          </ol>
        </div>

        <div className="mt-6 rounded-xl bg-seal-soft/60 p-4 text-sm text-seal-deep">
          Demo: <code>student@talentproof.dev</code> / <code>password123</code>
        </div>
      </main>
    </div>
  );
}
