import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
  Timer,
  XCircle,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { IntegrityStrip } from '../components/IntegrityStrip'
import { LockedGate } from '../components/LockedGate'
import { Modal } from '../components/Modal'
import { UnlockFlash } from '../components/UnlockFlash'
import { useApp, useActivePersona, useJourney } from '../context/AppContext'
import { DEMO_REACT_SCORE, getExam } from '../data/exams'
import { getSkill } from '../data/skillsCatalog'
import { wait } from '../lib/theater'

/** Accelerated demo timer representing the blueprint duration (e.g. 25 min). */
const DEMO_TIMER_SECONDS = 60

type Phase = 'ready' | 'active' | 'grading' | 'result'

function gradeAnswers(
  skillId: string,
  correctCount: number,
  total: number,
  usedDemoAnswers: boolean,
): number {
  if (total === 0) return 0
  const pct = Math.round((correctCount / total) * 100)
  // 90s Aarav path: React + demo answers → locked 91 theater score
  if (usedDemoAnswers && skillId === 'react') return DEMO_REACT_SCORE
  // All-correct React without demo button still lands on demo target for path reliability
  if (skillId === 'react' && pct === 100) return DEMO_REACT_SCORE
  return pct
}

export function ExamRoom() {
  const { skillId = '' } = useParams<{ skillId: string }>()
  const persona = useActivePersona()
  const journey = useJourney()
  const { dispatch, toast } = useApp()
  const navigate = useNavigate()

  const exam = getExam(skillId)
  const skill = getSkill(skillId)
  const claimed = journey.claimedSkillIds.includes(skillId)

  const [phase, setPhase] = useState<Phase>('ready')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [secondsLeft, setSecondsLeft] = useState(DEMO_TIMER_SECONDS)
  const [focused, setFocused] = useState(true)
  const [warnings, setWarnings] = useState(0)
  const [usedDemo, setUsedDemo] = useState(false)
  const [resultScore, setResultScore] = useState<number | null>(null)
  const [resultPassed, setResultPassed] = useState(false)
  const [flashUnlock, setFlashUnlock] = useState(false)
  const submittingRef = useRef(false)
  const usedDemoRef = useRef(false)

  const questions = exam?.questions ?? []
  const current = questions[index]
  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length
  const passScore = exam?.passScore ?? 70

  const existing = journey.examResults[skillId]

  const resetSession = useCallback(() => {
    setPhase('ready')
    setIndex(0)
    setAnswers({})
    setSecondsLeft(DEMO_TIMER_SECONDS)
    setFocused(true)
    setWarnings(0)
    setUsedDemo(false)
    usedDemoRef.current = false
    setResultScore(null)
    setResultPassed(false)
    submittingRef.current = false
    dispatch({ type: 'SET_UI', patch: { examSession: null } })
  }, [dispatch])

  useEffect(() => {
    resetSession()
  }, [skillId, persona.id, resetSession])

  const submitExam = useCallback(
    async (finalAnswers: Record<string, number>, fromTimer = false) => {
      if (!exam || submittingRef.current) return
      submittingRef.current = true
      setPhase('grading')

      let correct = 0
      for (const q of exam.questions) {
        if (finalAnswers[q.id] === q.correctIndex) correct += 1
      }
      const score = gradeAnswers(
        exam.skillId,
        correct,
        exam.questions.length,
        usedDemoRef.current,
      )
      const passed = score >= exam.passScore

      await wait(1000)

      const priorCorePasses = persona.coreSkillIds.filter(
        (id) => journey.examResults[id]?.status === 'passed',
      ).length
      const isCore = persona.coreSkillIds.includes(exam.skillId)
      const unlocksProjects = passed && isCore && priorCorePasses === 0

      dispatch({ type: 'SUBMIT_EXAM', skillId: exam.skillId, score })
      dispatch({ type: 'SET_UI', patch: { examSession: null } })
      setResultScore(score)
      setResultPassed(passed)
      setPhase('result')
      if (unlocksProjects) setFlashUnlock(true)

      toast(
        passed
          ? unlocksProjects
            ? `${skill?.name ?? exam.skillId} L1 passed at ${score}%. Projects unlocked.`
            : `${skill?.name ?? exam.skillId} L1 passed at ${score}%.`
          : fromTimer
            ? `Time expired — scored ${score}%. Retake available now.`
            : `${skill?.name ?? exam.skillId} scored ${score}%. Retake available now.`,
        passed ? 'success' : 'warning',
      )
      submittingRef.current = false
    },
    [exam, dispatch, toast, skill?.name, persona.coreSkillIds, journey.examResults],
  )

  // Timer while active
  useEffect(() => {
    if (phase !== 'active') return
    if (secondsLeft <= 0) {
      void submitExam(answers, true)
      return
    }
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(id)
  }, [phase, secondsLeft, answers, submitExam])

  // Focus / blur integrity theater (dedupe blur + visibilitychange)
  useEffect(() => {
    if (phase !== 'active') return
    let lastWarnAt = 0

    const warnBlur = () => {
      setFocused(false)
      const now = Date.now()
      if (now - lastWarnAt < 800) return
      lastWarnAt = now
      setWarnings((w) => w + 1)
      toast('Focus lost — stay on the exam tab during the session.', 'warning')
    }
    const onFocus = () => setFocused(true)
    const onVisibility = () => {
      if (document.hidden) warnBlur()
      else onFocus()
    }

    window.addEventListener('blur', warnBlur)
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('blur', warnBlur)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [phase, toast])

  const startExam = () => {
    if (!exam) return
    setPhase('active')
    setSecondsLeft(DEMO_TIMER_SECONDS)
    setIndex(0)
    dispatch({
      type: 'SET_UI',
      patch: {
        examSession: { skillId, startedAt: new Date().toISOString() },
      },
    })
    toast('Exam started — demo timer running (60s ≈ blueprint duration).', 'info')
  }

  const fillDemoAnswers = () => {
    if (!exam) return
    const filled: Record<string, number> = {}
    for (const q of exam.questions) filled[q.id] = q.correctIndex
    setAnswers(filled)
    setUsedDemo(true)
    usedDemoRef.current = true
    toast(
      exam.skillId === 'react'
        ? 'Demo answers loaded — React path targets 91%.'
        : 'Demo answers loaded (all correct keys).',
      'info',
    )
  }

  const selectChoice = (choiceIndex: number) => {
    if (!current || phase !== 'active') return
    setAnswers((prev) => ({ ...prev, [current.id]: choiceIndex }))
  }

  const timerLabel = useMemo(() => {
    const m = Math.floor(secondsLeft / 60)
    const s = secondsLeft % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }, [secondsLeft])

  const timerUrgent = secondsLeft <= 10

  if (!exam || !skill) {
    return (
      <LockedGate
        title="Exam not found"
        reason={`No L1 blueprint exists for “${skillId}”. Return to the lobby and pick a listed skill.`}
        ctaLabel="Back to exams"
        ctaTo="/exams"
      />
    )
  }

  if (!claimed) {
    return (
      <LockedGate
        title="Skill not claimed"
        reason={`Claim ${skill.name} on the Claims step before starting this exam.`}
        ctaLabel="Go to claims"
        ctaTo="/claims"
        secondaryLabel="Exam lobby"
        secondaryTo="/exams"
      />
    )
  }

  if (phase === 'ready') {
    return (
      <div className="mx-auto max-w-[720px] space-y-6 animate-fade-up">
        <Link
          to="/exams"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Exam lobby
        </Link>

        <div className="rounded-2xl border border-line bg-card p-8 shadow-card">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            L1 exam room
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
            {skill.name}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            {questions.length} questions · pass mark {passScore}% · blueprint{' '}
            {exam.durationMin} min. This prototype uses an accelerated{' '}
            <span className="font-semibold text-ink">demo timer ({DEMO_TIMER_SECONDS}s)</span>{' '}
            representing the full duration.
          </p>

          {existing ? (
            <div
              className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
                existing.status === 'passed'
                  ? 'border-verified/20 bg-verified-soft/50 text-verified'
                  : 'border-danger/20 bg-red-50 text-danger'
              }`}
            >
              Last attempt: {existing.score}% ({existing.status}). You can retake
              anytime — newest score wins.
            </div>
          ) : null}

          <div className="mt-6">
            <IntegrityStrip focused warnings={0} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startExam}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
            >
              Start exam
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              to="/exams"
              className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'grading') {
    return (
      <div className="mx-auto flex max-w-[480px] flex-col items-center justify-center gap-4 rounded-2xl border border-line bg-card p-12 text-center shadow-card animate-fade-up">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <h1 className="text-xl font-semibold text-ink">Grading responses…</h1>
        <p className="text-sm text-muted">
          Mock rubric theater (~1s). No server call.
        </p>
      </div>
    )
  }

  // Active exam
  return (
    <div className="mx-auto max-w-[880px] space-y-5 animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            {skill.name} · L1
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-ink">
            Question {index + 1} of {questions.length}
          </h1>
        </div>
        <div
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 tabular-nums ${
            timerUrgent
              ? 'border-danger/30 bg-red-50 text-danger'
              : 'border-line bg-card text-ink'
          }`}
          title="Demo timer (60s ≈ blueprint duration)"
        >
          <Timer className="h-4 w-4" />
          <span className="text-sm font-semibold">{timerLabel}</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted">
            demo
          </span>
        </div>
      </div>

      <IntegrityStrip focused={focused} warnings={warnings} compact />

      <div className="rounded-2xl border border-line bg-card p-6 shadow-card md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              current?.kind === 'practical'
                ? 'bg-accent-soft text-accent'
                : 'bg-canvas text-muted'
            }`}
          >
            {current?.kind === 'practical' ? 'Practical' : 'MCQ'}
          </span>
          <button
            type="button"
            onClick={fillDemoAnswers}
            className="inline-flex items-center gap-1.5 rounded-lg border border-accent/20 bg-accent-soft/60 px-3 py-1.5 text-[12px] font-semibold text-accent transition hover:bg-accent-soft"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Use demo answers
          </button>
        </div>

        <p className="mt-4 text-[17px] font-medium leading-relaxed text-ink">
          {current?.prompt}
        </p>

        <ul className="mt-6 space-y-2.5">
          {current?.choices.map((choice, choiceIndex) => {
            const selected = answers[current.id] === choiceIndex
            return (
              <li key={choiceIndex}>
                <button
                  type="button"
                  onClick={() => selectChoice(choiceIndex)}
                  className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                    selected
                      ? 'border-accent/40 bg-accent-soft text-ink'
                      : 'border-line bg-white text-ink hover:border-accent/25 hover:bg-canvas'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
                      selected
                        ? 'border-accent bg-accent text-white'
                        : 'border-line text-muted'
                    }`}
                  >
                    {String.fromCharCode(65 + choiceIndex)}
                  </span>
                  <span className="leading-snug">{choice}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <div className="flex flex-wrap gap-1.5">
            {questions.map((q, i) => {
              const answered = answers[q.id] !== undefined
              const isCurrent = i === index
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Question ${i + 1}`}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    isCurrent
                      ? 'bg-accent ring-2 ring-accent/30 ring-offset-2'
                      : answered
                        ? 'bg-accent/70'
                        : 'bg-line'
                  }`}
                />
              )
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="inline-flex items-center gap-1 rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:bg-canvas disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Prev
            </button>
            {index < questions.length - 1 ? (
              <button
                type="button"
                onClick={() =>
                  setIndex((i) => Math.min(questions.length - 1, i + 1))
                }
                className="inline-flex items-center gap-1 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void submitExam(answers)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
              >
                Submit exam
                <CheckCircle2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-3 text-[12px] text-muted">
          Answered {answeredCount}/{questions.length}
          {usedDemo ? ' · demo keys applied' : ''}
        </p>
      </div>

      <UnlockFlash show={flashUnlock} onDone={() => setFlashUnlock(false)} />

      <Modal
        open={phase === 'result' && resultScore !== null}
        onClose={() => navigate('/exams')}
        title={resultPassed ? 'L1 passed' : 'L1 below pass mark'}
        hideClose
      >
        <div className="space-y-5">
          <div className="flex flex-col items-center rounded-xl border border-line bg-canvas px-4 py-6 text-center">
            {resultPassed ? (
              <CheckCircle2 className="h-10 w-10 text-verified" />
            ) : (
              <XCircle className="h-10 w-10 text-danger" />
            )}
            <p
              className={`mt-3 text-5xl font-semibold tabular-nums tracking-tight ${
                resultPassed ? 'text-verified' : 'text-danger'
              }`}
            >
              {resultScore}%
            </p>
            <p className="mt-2 text-sm text-muted">
              {skill.name} · pass mark {passScore}%
              {usedDemo && skillId === 'react' ? ' · demo path score' : ''}
            </p>
          </div>

          {resultPassed ? (
            <p className="text-[13px] leading-relaxed text-muted">
              L1 badge recorded. Projects unlock after ≥1 core pass; Pro still
              needs every core exam.
            </p>
          ) : (
            <p className="text-[13px] leading-relaxed text-muted">
              Retake is available now from the lobby — no cooldown in this
              prototype.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate('/exams')}
              className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5b3ce0]"
            >
              Back to lobby
            </button>
            {!resultPassed ? (
              <button
                type="button"
                onClick={resetSession}
                className="flex-1 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-canvas"
              >
                Retake now
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="flex-1 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-canvas"
              >
                Open projects
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}
