import { Info, RotateCcw, Sparkles, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Modal } from '../components/Modal'
import { PersonaSwitcher } from '../components/PersonaSwitcher'
import { useApp, useActivePersona } from '../context/AppContext'

export function Settings() {
  const persona = useActivePersona()
  const { dispatch, toast } = useApp()
  const [motionOn, setMotionOn] = useState(true)
  const [integrityTheaterOn, setIntegrityTheaterOn] = useState(true)
  const [confirm, setConfirm] = useState<'persona' | 'all' | 'complete' | null>(null)

  const runReset = () => {
    if (confirm === 'persona') {
      dispatch({ type: 'RESET_PERSONA' })
      toast(`${persona.name}'s journey restored to seed`, 'success')
    } else if (confirm === 'all') {
      dispatch({ type: 'RESET_ALL' })
      toast('All personas restored to seed journeys', 'success')
    } else if (confirm === 'complete') {
      dispatch({ type: 'APPLY_COMPLETE_JOURNEY' })
      toast(`${persona.name} loaded as Pro-complete`, 'success')
    }
    setConfirm(null)
  }

  return (
    <div className="mx-auto max-w-[720px] space-y-8 animate-fade-up">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Settings
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          Demo controls & preferences
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">
          Resets restore <code className="text-[12px]">seedJourneyByPersona</code>. No
          real accounts or payments in this prototype.
        </p>
      </header>

      <section className="rounded-2xl border border-line bg-card p-6 shadow-card">
        <div className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold text-ink">Active persona</h2>
        </div>
        <p className="mt-1 text-[13px] text-muted">
          Mirror of the sidebar switcher — swaps the full mock world.
        </p>
        <div className="mt-4 rounded-xl border border-line bg-canvas/60 p-4">
          <PersonaSwitcher />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-card p-6 shadow-card">
        <div className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold text-ink">Demo resets</h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setConfirm('persona')}
            className="rounded-xl border border-line bg-white px-4 py-3 text-left transition hover:bg-canvas"
          >
            <p className="text-sm font-semibold text-ink">Reset journey</p>
            <p className="mt-1 text-[12px] text-muted">
              Restore seed for {persona.name} only
            </p>
          </button>
          <button
            type="button"
            onClick={() => setConfirm('all')}
            className="rounded-xl border border-line bg-white px-4 py-3 text-left transition hover:bg-canvas"
          >
            <p className="text-sm font-semibold text-ink">Reset all</p>
            <p className="mt-1 text-[12px] text-muted">
              Restore every persona to seedJourneyByPersona
            </p>
          </button>
          <button
            type="button"
            onClick={() => setConfirm('complete')}
            className="rounded-xl border border-verified/25 bg-verified-soft/40 px-4 py-3 text-left transition hover:bg-verified-soft/70 sm:col-span-2"
          >
            <p className="text-sm font-semibold text-verified">Load Pro-complete</p>
            <p className="mt-1 text-[12px] text-muted">
              Apply completeJourneyTargets for {persona.name} — certificate + Authentic share
            </p>
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-card p-6 shadow-card">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold text-ink">Theater preferences</h2>
        </div>
        <p className="mt-1 text-[13px] text-muted">
          Prototype toggles — pages may still show chrome when off.
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex items-center justify-between gap-4 rounded-xl border border-line bg-canvas/50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink">Motion</p>
              <p className="text-[12px] text-muted">Fade-up / ring draw animations</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={motionOn}
              onClick={() => {
                setMotionOn((v) => !v)
                toast(motionOn ? 'Motion reduced' : 'Motion enabled', 'info')
              }}
              className={`relative h-7 w-12 rounded-full transition ${
                motionOn ? 'bg-accent' : 'bg-line'
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                  motionOn ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </li>
          <li className="flex items-center justify-between gap-4 rounded-xl border border-line bg-canvas/50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink">Integrity theater</p>
              <p className="text-[12px] text-muted">
                Exam webcam lite / focus strip chrome
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={integrityTheaterOn}
              onClick={() => {
                setIntegrityTheaterOn((v) => !v)
                toast(
                  integrityTheaterOn
                    ? 'Integrity theater off'
                    : 'Integrity theater on',
                  'info',
                )
              }}
              className={`relative h-7 w-12 rounded-full transition ${
                integrityTheaterOn ? 'bg-accent' : 'bg-line'
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                  integrityTheaterOn ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border border-line bg-card p-6 shadow-card">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold text-ink">About VERIFIED</h2>
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-muted">
          <span className="font-semibold text-ink">VERIFIED Candidate</span> is a
          Verification Journey OS prototype. Frontend-only — no real OAuth, grading,
          proctoring, PDF signing, or payments. Trust line:{' '}
          <span className="font-medium text-ink">
            Don&apos;t trust the claim. Verify the skill.
          </span>
        </p>
        <p className="mt-3 text-[12px] text-muted">
          Active demo identity: {persona.name} · {persona.credentialId} ·{' '}
          {persona.trackTitle}
        </p>
      </section>

      <Modal
        open={confirm != null}
        onClose={() => setConfirm(null)}
        title={
          confirm === 'all'
            ? 'Reset all personas?'
            : confirm === 'complete'
              ? 'Load Pro-complete?'
              : 'Reset this journey?'
        }
      >
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-muted">
            {confirm === 'all'
              ? 'Every persona returns to seedJourneyByPersona. Unsaved demo progress is discarded.'
              : confirm === 'complete'
                ? `${persona.name} jumps to a finished Pro journey (all core L1 + L2 + issued credential). Useful for certificate / share demos.`
                : `${persona.name} returns to their seed journey. Other personas are unchanged.`}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirm(null)}
              className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={runReset}
              className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5b3ce0]"
            >
              {confirm === 'complete' ? 'Load complete' : 'Reset'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
