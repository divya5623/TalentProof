import {
  AlertTriangle,
  ArrowRight,
  Award,
  ClipboardCheck,
  ExternalLink,
  FolderGit2,
  Inbox,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { JourneySpine } from '../components/JourneySpine'
import { MetricCard } from '../components/MetricCard'
import { EmptyState } from '../components/EmptyState'
import { SkillChip } from '../components/SkillChip'
import { useApp, useActivePersona, useJourney, useScore } from '../context/AppContext'
import { getHonestyMap } from '../data/honestyMaps'
import { getSkill } from '../data/skillsCatalog'
import {
  firstIncompleteStep,
  STEP_ORDER,
  STEP_PATHS,
} from '../lib/journey'

const NEXT_COPY: Record<string, { title: string; body: string }> = {
  onboarding: {
    title: 'Start onboarding',
    body: 'Confirm your track and set a verification goal.',
  },
  claims: {
    title: 'Claim your skills',
    body: 'Declare the skills you want independently verified.',
  },
  evidence: {
    title: 'Attach evidence',
    body: 'Upload a resume and connect GitHub so claims can be checked.',
  },
  reconcile: {
    title: 'Review Honesty Map',
    body: 'Reconcile claims against artifacts before L1 exams unlock.',
  },
  exams: {
    title: 'Take L1 exams',
    body: 'Pass core skill exams (70%+) to unlock L2 projects.',
  },
  projects: {
    title: 'Complete an L2 project',
    body: 'Pass an in-track project audit to become Pro-eligible.',
  },
  certificate: {
    title: 'Issue Pro certificate',
    body: 'All gates cleared — mint your credential.',
  },
  share: {
    title: 'Share publicly',
    body: 'Your Pro certificate is live. Share the verify link.',
  },
}

export function Home() {
  const persona = useActivePersona()
  const journey = useJourney()
  const score = useScore()
  const { dispatch } = useApp()

  const nextStep = firstIncompleteStep(journey, persona)
  const nextPath = STEP_PATHS[nextStep]
  const nextMeta = NEXT_COPY[nextStep]
  const spineIndex = STEP_ORDER.indexOf(nextStep)

  const coreCount = persona.coreSkillIds.length
  const passedCore = persona.coreSkillIds.filter(
    (id) => journey.examResults[id]?.status === 'passed',
  ).length

  const l2Passed = Object.values(journey.projectResults).filter(
    (r) => r.status === 'passed',
  ).length
  const l2Attempted = Object.keys(journey.projectResults).length

  const overallLabel =
    score.overall != null
      ? String(Math.round(score.overall))
      : journey.claimedSkillIds.length > 0 ||
          journey.resumeAttached ||
          Object.keys(journey.examResults).length > 0
        ? 'In progress'
        : 'Not scored'

  const overallTone =
    score.overall != null && journey.proIssued
      ? 'verified'
      : score.overall != null
        ? 'accent'
        : 'muted'

  const proValue = journey.proIssued ? 'Issued' : 'Locked'
  const proTone = journey.proIssued ? 'verified' : 'muted'
  const proHint = journey.proIssued
    ? persona.credentialId
    : 'All core L1 + 1 L2 required'

  const claimedPreview = journey.claimedSkillIds
    .slice(0, 8)
    .map((id) => getSkill(id))
    .filter(Boolean)

  const isEmptyCockpit =
    journey.onboardingComplete &&
    journey.claimedSkillIds.length === 0 &&
    !journey.resumeAttached &&
    !journey.githubConnected

  const pendingConflicts = getHonestyMap(persona.id).filter((row) => {
    if (row.state !== 'conflict') return false
    if (!journey.claimedSkillIds.includes(row.skillId)) return false
    return journey.dispositions[row.skillId] == null
  })
  const blockedOnConflict =
    pendingConflicts.length > 0 &&
    (journey.resumeAttached || journey.githubConnected) &&
    !journey.reconcileReviewed

  const partialEvidence =
    (journey.resumeAttached || journey.githubConnected) &&
    !(journey.resumeAttached && journey.githubConnected)

  return (
    <div className="mx-auto max-w-[1100px] space-y-10 animate-fade-up">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-line bg-card shadow-card">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-accent-soft/60 blur-3xl" />
        <div className="relative flex flex-col gap-8 px-8 py-10 md:flex-row md:items-center md:justify-between md:px-10 md:py-12">
          <div className="flex items-start gap-5">
            <Avatar
              initials={persona.avatarInitials}
              hue={persona.avatarHue}
              size="xl"
              name={persona.name}
            />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                Don&apos;t trust the claim. Verify the skill.
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                {persona.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-line bg-canvas px-3 py-1 text-[11px] font-semibold text-ink">
                  {persona.trackTitle}
                </span>
                <span className="text-[12px] text-muted">
                  {persona.location} · {persona.experienceYears} yrs
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to={nextPath}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5b3ce0]"
            >
              Continue journey
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3.5 text-sm font-semibold text-ink transition hover:bg-canvas"
            >
              Recruiter preview
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            {journey.proIssued && (
              <Link
                to="/certificate"
                className="inline-flex items-center gap-2 rounded-xl border border-verified/25 bg-verified-soft/50 px-5 py-3.5 text-sm font-semibold text-verified transition hover:bg-verified-soft"
              >
                <Award className="h-4 w-4" />
                Certificate
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Teaching / mock-state banners */}
      {isEmptyCockpit ? (
        <EmptyState
          icon={Inbox}
          title="Fresh journey"
          body={`${persona.name} has finished onboarding but has not claimed skills yet. Start with Claims to unlock evidence.`}
          ctaLabel="Open Claims"
          ctaTo="/claims"
          tone="accent"
        />
      ) : null}

      {blockedOnConflict ? (
        <EmptyState
          icon={ShieldAlert}
          title="Blocked on conflict"
          body={`${pendingConflicts.length} Honesty Map conflict${pendingConflicts.length === 1 ? '' : 's'} still need disposition before L1 unlocks.`}
          ctaLabel="Review Honesty Map"
          ctaTo="/reconcile"
          tone="warning"
        />
      ) : null}

      {partialEvidence && !blockedOnConflict ? (
        <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-[#FFFBEB] px-5 py-4 text-[13px] text-ink shadow-card">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <div>
            <p className="font-semibold">Partial evidence</p>
            <p className="mt-1 text-muted">
              {!journey.resumeAttached
                ? 'Resume still needed. '
                : 'GitHub still needed. '}
              Honesty Map can open with one artifact, but L1 stays locked until both are attached.
            </p>
          </div>
        </div>
      ) : null}

      {journey.proIssued ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-verified/25 bg-verified-soft/50 px-5 py-4 shadow-card">
          <div>
            <p className="text-sm font-semibold text-verified">Pro complete</p>
            <p className="mt-0.5 text-[13px] text-muted">
              {persona.credentialId} issued · overall{' '}
              {score.overall != null ? Math.round(score.overall) : '—'} · Authentic share ready
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/certificate"
              className="inline-flex items-center rounded-xl bg-verified px-4 py-2 text-sm font-semibold text-white"
            >
              Certificate studio
            </Link>
            <Link
              to={`/certificate/share?id=${persona.credentialId}`}
              className="inline-flex items-center rounded-xl border border-verified/30 bg-white px-4 py-2 text-sm font-semibold text-verified"
            >
              Public share
            </Link>
          </div>
        </div>
      ) : null}

      {/* Metrics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Overall score"
          value={overallLabel}
          hint={
            score.overall != null
              ? 'L1 40% · L2 35% · Align 15% · Integrity 10%'
              : 'Scored after L1 + L2 aggregates'
          }
          tone={overallTone}
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <MetricCard
          label="L1 exams"
          value={`${passedCore}/${coreCount}`}
          hint={
            passedCore === coreCount
              ? 'All core skills passed'
              : 'Pass mark 70% per core skill'
          }
          tone={passedCore === coreCount && coreCount > 0 ? 'verified' : 'default'}
          icon={<ClipboardCheck className="h-4 w-4" />}
        />
        <MetricCard
          label="L2 projects"
          value={l2Attempted === 0 ? '0' : `${l2Passed}/${l2Attempted}`}
          hint={
            l2Passed > 0
              ? 'In-track project passed'
              : 'Authorship ≥40% + composite ≥70'
          }
          tone={l2Passed > 0 ? 'verified' : 'default'}
          icon={<FolderGit2 className="h-4 w-4" />}
        />
        <MetricCard
          label="Pro status"
          value={proValue}
          hint={proHint}
          tone={proTone}
          icon={<Award className="h-4 w-4" />}
        />
      </section>

      {/* Spine + next step */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-line bg-card p-8 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                Journey spine
              </p>
              <h2 className="mt-1 text-lg font-semibold text-ink">Where you are</h2>
            </div>
          </div>
          <div className="mt-6">
            <JourneySpine currentIndex={Math.max(0, spineIndex)} variant="large" />
          </div>
          <p className="mt-6 text-[13px] leading-relaxed text-muted">
            Spine unlocks strictly: Claims → Evidence → Honesty Map → L1 → L2 → Pro → Share.
            Green appears only after verified performance.
          </p>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-line bg-card p-8 shadow-card">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
              Next step
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">
              {nextMeta.title}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">{nextMeta.body}</p>
          </div>
          <Link
            to={nextPath}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
          >
            Go to {nextStep === 'share' ? 'public share' : nextStep}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Claimed skills preview */}
      <section className="rounded-2xl border border-line bg-card p-8 shadow-card">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              Skill claims
            </p>
            <h2 className="mt-1 text-lg font-semibold text-ink">
              {journey.claimedSkillIds.length === 0
                ? 'No skills claimed yet'
                : `${journey.claimedSkillIds.length} claimed`}
            </h2>
          </div>
          <Link
            to="/claims"
            onClick={(e) => {
              if (!journey.onboardingComplete) {
                e.preventDefault()
                dispatch({
                  type: 'TOAST',
                  message: 'Complete onboarding first',
                  toastType: 'info',
                })
              }
            }}
            className="text-[13px] font-semibold text-accent hover:underline"
          >
            Manage claims →
          </Link>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {claimedPreview.length === 0 ? (
            <p className="text-sm text-muted">
              Open Claims to declare core and additional skills for your track.
            </p>
          ) : (
            claimedPreview.map((skill) => {
              if (!skill) return null
              const exam = journey.examResults[skill.id]
              const verified = exam?.status === 'passed'
              return (
                <SkillChip
                  key={skill.id}
                  name={skill.name}
                  core={skill.core}
                  variant={verified ? 'verified' : 'self-reported'}
                />
              )
            })
          )}
          {journey.claimedSkillIds.length > 8 && (
            <span className="inline-flex items-center rounded-lg border border-line bg-canvas px-3 py-1.5 text-[12px] font-medium text-muted">
              +{journey.claimedSkillIds.length - 8} more
            </span>
          )}
        </div>
      </section>
    </div>
  )
}
