import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Compass, GraduationCap, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { useApp, useActivePersona, useJourney } from '../context/AppContext'

type Goal = 'pro' | 'explore' | null

const STEPS = ['Welcome', 'Track', 'Goal'] as const

export function Onboarding() {
  const persona = useActivePersona()
  const journey = useJourney()
  const { dispatch, toast } = useApp()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState<Goal>('pro')

  if (journey.onboardingComplete) {
    return (
      <div className="mx-auto max-w-2xl animate-fade-up">
        <div className="rounded-3xl border border-line bg-card p-10 shadow-card md:p-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Check className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink">
            Onboarding complete
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            You&apos;re on the{' '}
            <span className="font-semibold text-ink">{persona.trackTitle}</span> track as{' '}
            <span className="font-semibold text-ink">{persona.name}</span>. Continue to claims
            or jump back to the cockpit.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/claims')}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
            >
              Continue to claims
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3.5 text-sm font-semibold text-ink transition hover:bg-canvas"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  function finish() {
    dispatch({ type: 'COMPLETE_ONBOARDING' })
    toast('Onboarding complete — claim your skills next.', 'success')
    navigate('/claims')
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          Onboarding
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
          Verification Journey
        </h1>
        <div className="mt-6 flex items-center gap-2">
          {STEPS.map((label, i) => {
            const active = i === step
            const done = i < step
            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${
                    active
                      ? 'bg-accent text-white'
                      : done
                        ? 'bg-accent-soft text-accent'
                        : 'bg-canvas text-muted border border-line'
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </div>
                <span
                  className={`hidden text-[12px] font-medium sm:inline ${
                    active ? 'text-ink' : 'text-muted'
                  }`}
                >
                  {label}
                </span>
                {i < STEPS.length - 1 && <span className="mx-1 h-px w-6 bg-line sm:w-10" />}
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-card p-8 shadow-card md:p-10">
        {step === 0 && (
          <div className="space-y-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
                Welcome to VERIFIED Candidate
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                This is a Verification Journey OS — not a resume polish tool. You claim skills,
                attach evidence, reconcile honesty, then prove performance through L1 exams and
                L2 projects.
              </p>
            </div>
            <blockquote className="rounded-2xl border border-line bg-canvas/80 px-5 py-4">
              <p className="text-[15px] font-semibold tracking-tight text-ink">
                Don&apos;t trust the claim. Verify the skill.
              </p>
              <p className="mt-1.5 text-[13px] text-muted">
                Green appears only after independent assessment — never for self-report alone.
              </p>
            </blockquote>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Confirm your track</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Track is set by the active demo persona. Switch personas in the sidebar to
                explore Frontend, Backend, Data/ML, or Mobile with equal depth.
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-line bg-canvas/60 p-5">
              <Avatar
                initials={persona.avatarInitials}
                hue={persona.avatarHue}
                size="lg"
                name={persona.name}
              />
              <div>
                <p className="text-lg font-semibold text-ink">{persona.name}</p>
                <p className="mt-0.5 text-[13px] text-muted">{persona.trackTitle}</p>
                <p className="mt-1 text-[12px] text-muted">
                  {persona.location} · Credential target {persona.credentialId}
                </p>
              </div>
            </div>
            <p className="text-[12px] text-muted">
              Track is read-only here. Use the persona switcher (sidebar footer) to change identity.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Set your goal</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Choose how you want to move through the journey. You can always change pace later.
              </p>
            </div>
            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => setGoal('pro')}
                className={`rounded-2xl border px-5 py-4 text-left transition ${
                  goal === 'pro'
                    ? 'border-accent bg-accent-soft/60 shadow-sm'
                    : 'border-line bg-white hover:border-accent/30'
                }`}
              >
                <p className="text-[14px] font-semibold text-ink">Get Pro Certificate</p>
                <p className="mt-1 text-[13px] text-muted">
                  Full path: claims → evidence → honesty → all core L1 → L2 → Pro credential.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setGoal('explore')}
                className={`rounded-2xl border px-5 py-4 text-left transition ${
                  goal === 'explore'
                    ? 'border-accent bg-accent-soft/60 shadow-sm'
                    : 'border-line bg-white hover:border-accent/30'
                }`}
              >
                <p className="text-[14px] font-semibold text-ink">Explore the journey</p>
                <p className="mt-1 text-[13px] text-muted">
                  Browse steps at your own pace. Gates still apply — no skipping evidence or exams.
                </p>
              </button>
            </div>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!goal}
              onClick={finish}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Finish onboarding
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
