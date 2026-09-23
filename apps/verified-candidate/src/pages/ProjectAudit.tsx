import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  PartyPopper,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AuthorshipHeatmap } from '../components/AuthorshipHeatmap'
import { LockedGate } from '../components/LockedGate'
import { Modal } from '../components/Modal'
import { UnlockFlash } from '../components/UnlockFlash'
import { ScoreRing } from '../components/ScoreRing'
import { SkillChip } from '../components/SkillChip'
import { useApp, useActivePersona, useJourney } from '../context/AppContext'
import { getRepos } from '../data/evidence'
import {
  demoProjectComposite,
  getProject,
} from '../data/projects'
import { getSkill } from '../data/skillsCatalog'
import { wait } from '../lib/theater'
import type { JourneyProgress, Persona } from '../types'

type Phase = 'ready' | 'answering' | 'grading' | 'result'

function allCoreL1Passed(progress: JourneyProgress, persona: Persona): boolean {
  return persona.coreSkillIds.every(
    (id) => progress.examResults[id]?.status === 'passed',
  )
}

function wouldSatisfyProGate(
  progress: JourneyProgress,
  persona: Persona,
  repoId: string,
  passed: boolean,
): boolean {
  if (!progress.reconcileReviewed) return false
  if (!allCoreL1Passed(progress, persona)) return false
  if (!passed) {
    return Object.entries(progress.projectResults).some(
      ([id, r]) => id !== repoId && r.status === 'passed',
    )
  }
  return true
}

export function ProjectAudit() {
  const { repoId = '' } = useParams<{ repoId: string }>()
  const persona = useActivePersona()
  const journey = useJourney()
  const { dispatch, toast } = useApp()
  const navigate = useNavigate()

  const project = getProject(repoId)
  const repo = getRepos(persona.id).find((r) => r.id === repoId)
  const included = journey.includedRepoIds.includes(repoId)
  const existing = journey.projectResults[repoId]

  const [phase, setPhase] = useState<Phase>(
    existing?.status === 'passed' || existing?.status === 'failed'
      ? 'result'
      : 'ready',
  )
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [usedDemo, setUsedDemo] = useState(false)
  const [composite, setComposite] = useState<number | null>(
    existing?.composite ?? null,
  )
  const [passed, setPassed] = useState(
    existing?.status === 'passed',
  )
  const [celebrateOpen, setCelebrateOpen] = useState(false)
  const [flashUnlock, setFlashUnlock] = useState(false)
  const [resultOpen, setResultOpen] = useState(false)

  const authorship = repo?.authorshipPct ?? 0
  const archQs = project?.architectureQs ?? []
  const archMaxTotal = archQs.reduce((sum, q) => sum + q.rubricMax, 0)

  const stackChips = useMemo(() => {
    if (!project) return []
    const claimed = new Set(journey.claimedSkillIds)
    return project.stackMatchSkillIds.map((id) => ({
      id,
      name: getSkill(id)?.name ?? id,
      matched: claimed.has(id),
    }))
  }, [project, journey.claimedSkillIds])

  useEffect(() => {
    if (!project || !repo) return
    dispatch({ type: 'SET_UI', patch: { projectAuditSession: { repoId } } })
    return () => {
      dispatch({ type: 'SET_UI', patch: { projectAuditSession: null } })
    }
  }, [dispatch, project, repo, repoId])

  const fillDemoAnswers = useCallback(() => {
    if (!project) return
    const next: Record<string, string> = {}
    for (const q of project.architectureQs) {
      next[q.id] =
        `Demo walkthrough: ${q.prompt.slice(0, 72)}… — citing ownership in the heatmap and the primary module boundary.`
    }
    setAnswers(next)
    setUsedDemo(true)
    toast('Demo architecture answers filled', 'info')
  }, [project, toast])

  const answeredCount = archQs.filter(
    (q) => (answers[q.id] ?? '').trim().length > 0,
  ).length

  const submitAudit = useCallback(async () => {
    if (!project || !repo) return
    setPhase('grading')
    await wait(900)

    const archScores = project.architectureQs.map((q) => {
      const text = (answers[q.id] ?? '').trim()
      if (!text) return 0
      if (usedDemo) return q.demoAnswerScore
      // Honest prototype rubric: non-empty answers earn demo-ready scores
      // scaled slightly down from demo path for manual typing.
      return Math.max(0, q.demoAnswerScore - 2)
    })

    const score = demoProjectComposite(
      repo.authorshipPct,
      archScores,
      archMaxTotal,
    )
    const ok = score >= 70 && repo.authorshipPct >= 40

    dispatch({
      type: 'SUBMIT_PROJECT',
      repoId: project.repoId,
      composite: score,
      authorship: repo.authorshipPct,
    })

    setComposite(score)
    setPassed(ok)
    setPhase('result')
    setResultOpen(true)

    if (ok) {
      toast(`L2 passed · ${project.repoId} · ${score}%`, 'success')
      const proReady = wouldSatisfyProGate(journey, persona, project.repoId, true)
      if (proReady && !journey.proIssued) {
        dispatch({ type: 'ISSUE_PRO' })
        setCelebrateOpen(true)
        setFlashUnlock(true)
        toast('Pro certificate unlocked', 'success')
      }
    } else {
      toast(
        score < 70
          ? `L2 below threshold · ${score}% (need ≥70)`
          : 'Authorship below 40% — cannot pass',
        'warning',
      )
    }
  }, [
    project,
    repo,
    answers,
    usedDemo,
    archMaxTotal,
    dispatch,
    toast,
    journey,
    persona,
  ])

  if (!repo || !included) {
    return (
      <LockedGate
        title="Repo not available"
        reason="This repository is not in your included GitHub evidence for the active persona."
        ctaLabel="Back to projects"
        ctaTo="/projects"
        secondaryLabel="GitHub evidence"
        secondaryTo="/evidence/github"
      />
    )
  }

  if (!project || project.personaId !== persona.id) {
    return (
      <LockedGate
        title="No L2 blueprint"
        reason={`${repo.name} is supporting evidence only. Open a primary in-track repo with an architecture audit.`}
        ctaLabel="Back to projects"
        ctaTo="/projects"
      />
    )
  }

  const ringTone =
    authorship >= 70 ? 'verified' : authorship >= 40 ? 'accent' : 'warning'

  return (
    <div className="mx-auto max-w-[960px] space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Projects lobby
        </Link>
        {repo.primaryL2 ? (
          <span className="rounded-md bg-accent-soft px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
            Primary L2
          </span>
        ) : null}
      </div>

      <header className="rounded-2xl border border-line bg-card p-6 shadow-card">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Project audit
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              {repo.name}
            </h1>
            <p className="max-w-xl text-[14px] leading-relaxed text-muted">
              {repo.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {stackChips.map((chip) => (
                <SkillChip
                  key={chip.id}
                  name={chip.name}
                  variant={chip.matched ? 'claimed' : 'self-reported'}
                />
              ))}
            </div>
          </div>
          <ScoreRing
            value={authorship}
            label="Authorship"
            tone={ringTone}
            sublabel="Pass needs ≥40%"
          />
        </div>
      </header>

      <section className="rounded-2xl border border-line bg-card p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-ink">Authorship heatmap</h2>
            <p className="mt-0.5 text-[13px] text-muted">
              File-level ownership from the mock GitHub graph.
            </p>
          </div>
        </div>
        <AuthorshipHeatmap cells={project.heatmap} />
      </section>

      {phase === 'ready' ? (
        <section className="rounded-2xl border border-line bg-card p-6 shadow-card">
          <h2 className="text-base font-semibold text-ink">Ready to audit</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            Answer {archQs.length} architecture questions about this repo. Composite
            blends authorship (45%) with the architecture rubric (55%). Demo path
            scores are pass-ready.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPhase('answering')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
            >
              Start architecture Qs
            </button>
            {existing ? (
              <button
                type="button"
                onClick={() => {
                  setPhase('result')
                  setResultOpen(true)
                }}
                className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas"
              >
                View last result
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      {phase === 'answering' ? (
        <section className="space-y-4 rounded-2xl border border-line bg-card p-6 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-ink">
                Architecture questions
              </h2>
              <p className="mt-0.5 text-[13px] text-muted">
                {answeredCount}/{archQs.length} answered · rubric max {archMaxTotal}{' '}
                pts
              </p>
            </div>
            <button
              type="button"
              onClick={fillDemoAnswers}
              className="inline-flex items-center gap-1.5 rounded-xl border border-accent/20 bg-accent-soft px-3 py-2 text-[13px] font-semibold text-accent transition hover:bg-accent-soft/80"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Use demo answers
            </button>
          </div>

          <ol className="space-y-4">
            {archQs.map((q, i) => (
              <li key={q.id} className="rounded-xl border border-line bg-canvas/60 p-4">
                <p className="text-[13px] font-semibold text-ink">
                  <span className="mr-2 text-muted">{i + 1}.</span>
                  {q.prompt}
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  Rubric max {q.rubricMax} pts
                </p>
                <textarea
                  value={answers[q.id] ?? ''}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                  rows={3}
                  placeholder="Describe the boundary, trade-offs, and where ownership shows up…"
                  className="mt-3 w-full resize-y rounded-xl border border-line bg-white px-3 py-2.5 text-[13px] text-ink outline-none transition placeholder:text-muted/70 focus:border-accent/40 focus:ring-2 focus:ring-accent/15"
                />
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap gap-2 border-t border-line pt-4">
            <button
              type="button"
              disabled={answeredCount === 0}
              onClick={() => void submitAudit()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit audit
            </button>
            <button
              type="button"
              onClick={() => setPhase('ready')}
              className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-muted transition hover:bg-canvas hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </section>
      ) : null}

      {phase === 'grading' ? (
        <section className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-card px-6 py-16 shadow-card">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm font-semibold text-ink">Scoring architecture rubric…</p>
          <p className="text-[13px] text-muted">
            Blending authorship with walkthrough quality (mock theater).
          </p>
        </section>
      ) : null}

      {phase === 'result' && composite !== null ? (
        <section className="rounded-2xl border border-line bg-card p-6 shadow-card">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2">
                {passed ? (
                  <CheckCircle2 className="h-5 w-5 text-verified" />
                ) : (
                  <XCircle className="h-5 w-5 text-danger" />
                )}
                <h2 className="text-lg font-semibold text-ink">
                  {passed ? 'L2 project passed' : 'L2 project failed'}
                </h2>
              </div>
              <p className="mt-2 max-w-md text-[14px] text-muted">
                Composite {composite}% · authorship {authorship}% · threshold 70 /
                40. {passed ? 'In-track L2 badge earned.' : 'Retake when ready.'}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                <button
                  type="button"
                  onClick={() => {
                    setAnswers({})
                    setUsedDemo(false)
                    setPhase('answering')
                  }}
                  className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-canvas"
                >
                  {passed ? 'Retake (optional)' : 'Retake audit'}
                </button>
                <Link
                  to="/projects"
                  className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
                >
                  Back to lobby
                </Link>
                {journey.proIssued || celebrateOpen ? (
                  <Link
                    to="/certificate"
                    className="inline-flex items-center justify-center rounded-xl border border-verified/30 bg-verified-soft/50 px-4 py-2 text-sm font-semibold text-verified transition hover:bg-verified-soft"
                  >
                    Open certificate
                  </Link>
                ) : null}
              </div>
            </div>
            <ScoreRing
              value={composite}
              label="Composite"
              tone={passed ? 'verified' : 'danger'}
              sublabel="45% authorship + 55% architecture"
            />
          </div>
        </section>
      ) : null}

      <Modal
        open={resultOpen && !celebrateOpen}
        onClose={() => setResultOpen(false)}
        title={passed ? 'L2 audit passed' : 'L2 audit result'}
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-line bg-canvas px-4 py-5 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Composite
            </p>
            <p
              className={`mt-2 text-5xl font-semibold tabular-nums tracking-tight ${
                passed ? 'text-verified' : 'text-danger'
              }`}
            >
              {composite ?? '—'}%
            </p>
            <p className="mt-2 text-sm text-muted">
              Authorship {authorship}% · pass needs ≥70 composite and ≥40%
              authorship
            </p>
          </div>
          <button
            type="button"
            onClick={() => setResultOpen(false)}
            className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5b3ce0]"
          >
            Continue
          </button>
        </div>
      </Modal>

      <UnlockFlash show={flashUnlock} onDone={() => setFlashUnlock(false)} />

      <Modal
        open={celebrateOpen}
        onClose={() => {
          setCelebrateOpen(false)
          setResultOpen(false)
        }}
        title="Pro unlocked"
        hideClose
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-verified-soft text-verified">
            <PartyPopper className="h-7 w-7" />
          </div>
          <div>
            <p className="text-lg font-semibold text-ink">
              Pro certificate ready
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              All core L1 passes, Honesty Map reviewed, and an in-track L2 pass —
              {persona.name}&apos;s Pro credential can be issued. Share remains
              chrome-light for recruiters.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setCelebrateOpen(false)
                setResultOpen(false)
                navigate('/certificate')
              }}
              className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5b3ce0]"
            >
              Open certificate studio
            </button>
            <button
              type="button"
              onClick={() => {
                setCelebrateOpen(false)
                setResultOpen(false)
              }}
              className="flex-1 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-canvas"
            >
              Stay on audit
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
