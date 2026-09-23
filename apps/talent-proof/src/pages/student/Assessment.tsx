import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ShieldAlert,
  Save,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Banner } from '../../components/ui/Banner'

const DURATION_SEC = 15 * 60

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}

export function AssessmentPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const { projects, assessment, setAssessment, patchAssessment, addIntegrity, updateProjectStatus } = useApp()
  const p = projects.find((x) => x.id === id)
  const [consent, setConsent] = useState(false)
  const [started, setStarted] = useState(false)
  const [now, setNow] = useState(Date.now())
  const [savedFlash, setSavedFlash] = useState(false)
  const [confirmSubmit, setConfirmSubmit] = useState(false)

  useEffect(() => {
    if (!started) return
    const t = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(t)
  }, [started])

  useEffect(() => {
    if (!started) return
    const onBlur = () =>
      addIntegrity({
        at: new Date().toISOString(),
        type: 'focus_lost',
        detail: 'Window/tab blurred during assessment',
        severity: 'warn',
      })
    const onVis = () => {
      if (document.hidden) {
        addIntegrity({
          at: new Date().toISOString(),
          type: 'tab_hidden',
          detail: 'Document became hidden',
          severity: 'warn',
        })
      }
    }
    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [started, addIntegrity])

  // autosave theater
  useEffect(() => {
    if (!started || !assessment || assessment.submitted) return
    const t = setInterval(() => {
      setSavedFlash(true)
      addIntegrity({
        at: new Date().toISOString(),
        type: 'autosave',
        detail: 'Answers autosaved (theater)',
        severity: 'info',
      })
      setTimeout(() => setSavedFlash(false), 1200)
    }, 45000)
    return () => clearInterval(t)
  }, [started, assessment, addIntegrity])

  const remaining = useMemo(() => {
    if (!assessment?.endsAt) return DURATION_SEC
    return Math.max(0, Math.floor((new Date(assessment.endsAt).getTime() - now) / 1000))
  }, [assessment, now])

  if (!p) return <p>Not found</p>
  if (p.questions.length === 0) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-16 text-center">
        <p className="text-sm text-ink-muted">No project-specific questions on this stub submission.</p>
        <Button to={`/student/projects/${p.id}`}>Back</Button>
      </div>
    )
  }

  const start = () => {
    const startedAt = new Date()
    const endsAt = new Date(startedAt.getTime() + DURATION_SEC * 1000)
    setAssessment({
      projectId: p.id,
      startedAt: startedAt.toISOString(),
      endsAt: endsAt.toISOString(),
      answers: {},
      consent: true,
      submitted: false,
      integrity: [
        {
          id: 'ie-start',
          at: startedAt.toISOString(),
          type: 'session_start',
          detail: 'Assessment started with consent',
          severity: 'info',
        },
      ],
      currentIndex: 0,
    })
    updateProjectStatus(p.id, 'assessment_in_progress')
    setStarted(true)
  }

  if (!started || !assessment || assessment.projectId !== p.id) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-canvas px-4">
        <Card className="w-full max-w-lg animate-slide-up">
          <Badge tone="teal">Live timed assessment</Badge>
          <h1 className="mt-3 text-xl font-bold">{p.title}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {p.questions.length} questions · {DURATION_SEC / 60} minutes · references your mock files
          </p>
          <Banner tone="demo" title="Integrity transparency">
            Focus-loss and tab-hide events are logged and shown to you. Autosave is simulated.
          </Banner>
          <ul className="mt-4 space-y-2 text-sm text-ink-muted">
            <li>• Questions cite specific files/functions from your submission.</li>
            <li>• AI-generated bank is fixture-based — not a live LLM call.</li>
            <li>• Leaving the tab is recorded (not auto-fail in this MVP).</li>
          </ul>
          <label className="mt-5 flex items-start gap-2 text-sm">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
            <span>I consent to a timed assessment with a transparent integrity event log for this demo.</span>
          </label>
          <div className="mt-5 flex gap-2">
            <Button variant="secondary" to={`/student/projects/${p.id}/execution`}>
              Cancel
            </Button>
            <Button disabled={!consent} onClick={start} className="flex-1">
              Begin assessment
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (assessment.submitted || remaining === 0) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-canvas px-4">
        <Card className="w-full max-w-lg animate-slide-up text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-verified" />
          <h1 className="mt-3 text-xl font-bold">Assessment submitted</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Answers recorded in-session. Review your skill verification report next.
          </p>
          <div className="mt-4 max-h-40 overflow-y-auto rounded-lg border border-border bg-canvas p-3 text-left text-xs">
            {assessment.integrity.map((e) => (
              <div key={e.id} className="border-b border-border py-1.5 last:border-0">
                <span className="font-mono text-ink-faint">{new Date(e.at).toLocaleTimeString()}</span> ·{' '}
                <strong>{e.type}</strong> — {e.detail}
              </div>
            ))}
          </div>
          <Button
            className="mt-5 w-full"
            onClick={() => {
              updateProjectStatus(p.id, 'assessment_complete')
              // grant explained badge in place
              nav(`/student/projects/${p.id}/report`)
            }}
          >
            View verification report
          </Button>
        </Card>
      </div>
    )
  }

  const q = p.questions[assessment.currentIndex]
  const progress = ((assessment.currentIndex + 1) / p.questions.length) * 100

  const setAnswer = (val: string | number) => {
    patchAssessment({ answers: { ...assessment.answers, [q.id]: val } })
  }

  const submitAll = () => {
    addIntegrity({
      at: new Date().toISOString(),
      type: 'submit',
      detail: 'Candidate submitted assessment',
      severity: 'info',
    })
    patchAssessment({ submitted: true })
    updateProjectStatus(p.id, 'assessment_complete')
  }

  return (
    <div className="min-h-svh bg-canvas">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Talent Proof Assessment</div>
            <div className="text-sm font-semibold">{p.title}</div>
          </div>
          <div className="flex items-center gap-3">
            {savedFlash && (
              <span className="flex items-center gap-1 text-xs font-medium text-teal animate-pulse-soft">
                <Save className="h-3.5 w-3.5" /> Autosaved
              </span>
            )}
            <div
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-sm font-bold ${
                remaining < 60 ? 'border-danger/30 bg-danger-bg text-danger' : 'border-border bg-white text-ink'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              {formatTime(remaining)}
            </div>
          </div>
        </div>
        <div className="h-1 bg-stone-100">
          <div className="h-full bg-teal transition-all" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <div className="mx-auto grid max-w-4xl gap-4 px-4 py-6 lg:grid-cols-[1fr_240px]">
        <Card className="animate-slide-up">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="ink">
              Q{assessment.currentIndex + 1} / {p.questions.length}
            </Badge>
            <Badge tone={q.type === 'mcq' ? 'blue' : q.type === 'debug' ? 'amber' : 'teal'}>{q.type}</Badge>
            <Badge tone="white">{q.points} pts</Badge>
          </div>
          <h2 className="mt-4 text-lg font-semibold leading-snug text-ink">{q.prompt}</h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {q.references.map((r) => (
              <span key={r.file + (r.symbol || '')} className="rounded-md bg-stone-900 px-2 py-1 font-mono text-[10px] text-teal-mid">
                {r.file}
                {r.symbol ? `::${r.symbol}` : ''}
              </span>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            {q.type === 'mcq' &&
              q.options?.map((opt, i) => (
                <label
                  key={opt}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                    assessment.answers[q.id] === i ? 'border-teal bg-teal-light/50' : 'border-border hover:bg-surface-2'
                  }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={assessment.answers[q.id] === i}
                    onChange={() => setAnswer(i)}
                    className="mt-0.5"
                  />
                  {opt}
                </label>
              ))}
            {(q.type === 'written' || q.type === 'debug') && (
              <textarea
                rows={8}
                value={(assessment.answers[q.id] as string) || ''}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your answer… cite the referenced symbols."
                className="w-full rounded-xl border border-border bg-white px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              disabled={assessment.currentIndex === 0}
              onClick={() => patchAssessment({ currentIndex: assessment.currentIndex - 1 })}
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            {assessment.currentIndex < p.questions.length - 1 ? (
              <Button size="sm" onClick={() => patchAssessment({ currentIndex: assessment.currentIndex + 1 })}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={() => setConfirmSubmit(true)}>
                Submit assessment
              </Button>
            )}
          </div>
        </Card>

        <div className="space-y-3">
          <Card className="!p-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Nav</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.questions.map((qq, i) => {
                const answered = assessment.answers[qq.id] !== undefined && assessment.answers[qq.id] !== ''
                return (
                  <button
                    key={qq.id}
                    type="button"
                    onClick={() => patchAssessment({ currentIndex: i })}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                      i === assessment.currentIndex
                        ? 'bg-teal text-white'
                        : answered
                          ? 'bg-verified-bg text-verified'
                          : 'bg-stone-100 text-ink-muted'
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </Card>
          <Card className="!p-3">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-faint">
              <ShieldAlert className="h-3.5 w-3.5" /> Integrity log
            </div>
            <div className="max-h-56 space-y-1.5 overflow-y-auto text-[11px]">
              {[...assessment.integrity].reverse().map((e) => (
                <div key={e.id} className={`rounded-md px-2 py-1 ${e.severity === 'warn' ? 'bg-warn-bg' : 'bg-canvas'}`}>
                  <div className="font-semibold">{e.type}</div>
                  <div className="text-ink-muted">{e.detail}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {confirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
          <Card className="w-full max-w-md">
            <h3 className="text-lg font-bold">Submit assessment?</h3>
            <p className="mt-1 text-sm text-ink-muted">You can&apos;t change answers after submit in this demo.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setConfirmSubmit(false)}>
                Keep editing
              </Button>
              <Button onClick={submitAll}>Confirm submit</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
