import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  FileSearch,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useApp } from '../context/AppContext'

const steps = [
  { icon: FileSearch, title: 'Submit evidence', desc: 'ZIP / GitHub theater / URL with stack, contribution & setup notes.' },
  { icon: Eye, title: 'Observe & interpret', desc: 'Structure, languages, quality signals — split from AI interpretation.' },
  { icon: Lock, title: 'Trusted sample run', desc: 'Controlled fixtures only. Unsupported stacks → Manual review.' },
  { icon: Timer, title: 'Prove you know it', desc: 'Timed questions that reference your actual files & functions.' },
  { icon: BadgeCheck, title: 'Earn verified badges', desc: 'Explicit rules: Observed → Explained → Verified.' },
  { icon: Search, title: 'Get discovered', desc: 'Recruiters find skills with evidence — request contact via inbox.' },
]

export function Landing() {
  const { switchPersona } = useApp()

  return (
    <div className="min-h-svh bg-canvas">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal text-white">
            <ShieldCheck className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-sm font-bold tracking-wide">TALENT PROOF</div>
            <div className="text-[11px] text-ink-faint">Prove Skills. Build Trust. Discover Talent.</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" to="/login">
            Sign in
          </Button>
          <Button size="sm" to="/signup">
            Get started
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
        <div className="animate-slide-up mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal-light px-3 py-1 text-xs font-semibold text-teal">
            <Sparkles className="h-3.5 w-3.5" />
            Hackathon MVP · Frontend theater with honest labels
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl sm:leading-[1.1]">
            Prove what you built.
            <span className="block text-teal">Not just what you listed.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-ink-muted sm:text-lg">
            Talent Proof turns student projects into trusted skill evidence — observed structure, project-specific
            assessment, and recruiter discovery — without faking live sandboxes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => {
                switchPersona('stu-priya')
              }}
              to="/student"
            >
              Enter as Priya (student)
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => switchPersona('rec-jordan')}
              to="/recruiter"
            >
              <Users className="h-4 w-4" />
              Enter as Jordan (recruiter)
            </Button>
          </div>
          <p className="mt-4 text-xs text-ink-faint">
            Or start from <Link className="text-teal underline" to="/signup">signup theater</Link> ·{' '}
            <Link className="text-teal underline" to="/tech-matrix">supported tech matrix</Link>
          </p>
        </div>

        <div className="mt-16 grid gap-3 sm:grid-cols-3">
          {[
            { k: 'Observed', v: 'Evidence first', d: 'Files, langs, quality signals' },
            { k: 'Explained', v: 'Timed proof', d: 'Questions tied to your code' },
            { k: 'Verified', v: 'Badge with rules', d: 'Sample exec + assessment' },
          ].map((m) => (
            <div key={m.k} className="rounded-2xl border border-border bg-surface p-5 text-left">
              <div className="text-xs font-semibold uppercase tracking-wider text-teal">{m.k}</div>
              <div className="mt-1 text-xl font-bold text-ink">{m.v}</div>
              <div className="mt-1 text-sm text-ink-muted">{m.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight">The verification spine</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-ink-muted">
            End-to-end clickable demo — every AI/sandbox step is labeled when simulated.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-xl border border-border bg-canvas p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal text-white">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div className="text-xs font-mono text-ink-faint">0{i + 1}</div>
                </div>
                <h3 className="mt-3 font-semibold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-xs text-ink-faint">
        TALENT PROOF · No real Docker / OAuth / LLM on this MVP host
      </footer>
    </div>
  )
}
