import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Check,
  FileText,
  Loader2,
  Upload,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp, useActivePersona, useJourney } from '../context/AppContext'
import { getResume } from '../data/evidence'
import { getSkill } from '../data/skillsCatalog'
import { wait } from '../lib/theater'

type LocalPhase = 'idle' | 'uploading' | 'parsing' | 'extracted'

const WEAK_THRESHOLD = 0.6

export function ResumeEvidence() {
  const persona = useActivePersona()
  const journey = useJourney()
  const { dispatch, toast, ui } = useApp()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const resume = useMemo(() => getResume(persona.id), [persona.id])

  const [phase, setPhase] = useState<LocalPhase>(() =>
    journey.resumeAttached || ui.resumeParsePhase === 'extracted'
      ? 'extracted'
      : (ui.resumeParsePhase as LocalPhase) || 'idle',
  )
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (journey.resumeAttached) {
      setPhase('extracted')
      return
    }
    setPhase(
      ui.resumeParsePhase === 'extracted'
        ? 'extracted'
        : ui.resumeParsePhase === 'uploading' || ui.resumeParsePhase === 'parsing'
          ? ui.resumeParsePhase
          : 'idle',
    )
  }, [persona.id, journey.resumeAttached, ui.resumeParsePhase])

  const weakSkills = resume.skills.filter((s) => s.confidence < WEAK_THRESHOLD)

  async function runParseTheater() {
    if (busy) return
    setBusy(true)
    try {
      setPhase('uploading')
      dispatch({ type: 'SET_UI', patch: { resumeParsePhase: 'uploading' } })
      await wait(700)
      setPhase('parsing')
      dispatch({ type: 'SET_UI', patch: { resumeParsePhase: 'parsing' } })
      await wait(1400)
      setPhase('extracted')
      dispatch({ type: 'SET_UI', patch: { resumeParsePhase: 'extracted' } })
      toast('Resume parsed — review extracted skills.', 'success')
    } finally {
      setBusy(false)
    }
  }

  function onDropzoneClick() {
    if (busy || phase === 'uploading' || phase === 'parsing') return
    inputRef.current?.click()
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    void runParseTheater()
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    if (busy) return
    if (e.dataTransfer.files?.length) void runParseTheater()
  }

  function attach() {
    dispatch({ type: 'ATTACH_RESUME' })
    toast('Resume attached to your verification dossier.', 'success')
    navigate('/evidence/github')
  }

  const phases: { id: LocalPhase; label: string }[] = [
    { id: 'uploading', label: 'Upload' },
    { id: 'parsing', label: 'OCR / Parse' },
    { id: 'extracted', label: 'Skill extract' },
  ]

  const phaseIndex =
    phase === 'idle' ? -1 : phases.findIndex((p) => p.id === phase)

  return (
    <div className="mx-auto max-w-[960px] space-y-8 animate-fade-up">
      <header className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          Evidence · Resume
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Attach resume evidence
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          We extract skill signals from your resume as artifacts — claims stay self-reported
          until performance exams verify them.
        </p>
      </header>

      {journey.resumeAttached && (
        <div className="flex items-start gap-3 rounded-xl border border-accent/25 bg-accent-soft/60 px-4 py-3 text-[13px] text-ink">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} />
          <p>
            Resume <span className="font-semibold">{resume.fileName}</span> is attached.
            You can re-parse the sample or continue to GitHub.
          </p>
        </div>
      )}

      {(phase === 'idle' || phase === 'uploading' || phase === 'parsing') && (
        <section className="rounded-2xl border border-line bg-card p-6 shadow-card md:p-8">
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={onFileChange}
          />
          <button
            type="button"
            onClick={onDropzoneClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            disabled={busy}
            className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-line bg-canvas/60 px-6 py-14 text-center transition hover:border-accent/40 hover:bg-accent-soft/30 disabled:opacity-60"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-accent shadow-card">
              {busy ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="text-[15px] font-semibold text-ink">
                {busy ? 'Processing resume…' : 'Drop a PDF here, or click to browse'}
              </p>
              <p className="mt-1 text-[13px] text-muted">
                Demo accepts any file — we run a timed parse theater over mock data.
              </p>
            </div>
          </button>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => void runParseTheater()}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas disabled:opacity-40"
            >
              <FileText className="h-4 w-4 text-accent" />
              Use sample resume ({resume.fileName})
            </button>
            {phase !== 'idle' && (
              <div className="flex items-center gap-2">
                {phases.map((p, i) => {
                  const done = i < phaseIndex
                  const active = i === phaseIndex
                  return (
                    <div key={p.id} className="flex items-center gap-2">
                      {i > 0 && <div className="h-px w-4 bg-line" />}
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          done
                            ? 'bg-accent-soft text-accent'
                            : active
                              ? 'bg-ink text-white'
                              : 'bg-canvas text-muted'
                        }`}
                      >
                        {active && <Loader2 className="h-3 w-3 animate-spin" />}
                        {done && <Check className="h-3 w-3" strokeWidth={3} />}
                        {p.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {phase === 'extracted' && (
        <>
          <section className="rounded-2xl border border-line bg-card p-6 shadow-card md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-ink">Extracted skills</h2>
                <p className="mt-1 text-[13px] text-muted">
                  From <span className="font-medium text-ink">{resume.fileName}</span> — confidence
                  and source snippets.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPhase('idle')
                  dispatch({ type: 'SET_UI', patch: { resumeParsePhase: 'idle' } })
                }}
                className="text-[12px] font-semibold text-accent hover:underline"
              >
                Re-parse
              </button>
            </div>

            <div className="mt-5 overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[640px] text-left">
                <thead className="bg-canvas text-[11px] font-semibold uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-4 py-3">Skill</th>
                    <th className="px-4 py-3">Confidence</th>
                    <th className="px-4 py-3">Snippet</th>
                  </tr>
                </thead>
                <tbody>
                  {resume.skills.map((row) => {
                    const skill = getSkill(row.skillId)
                    const weak = row.confidence < WEAK_THRESHOLD
                    return (
                      <tr key={row.skillId} className="border-t border-line">
                        <td className="px-4 py-3 text-[13px] font-semibold text-ink">
                          {skill?.name ?? row.skillId}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-canvas">
                              <div
                                className={`h-full rounded-full ${
                                  weak ? 'bg-warning' : 'bg-accent'
                                }`}
                                style={{ width: `${Math.round(row.confidence * 100)}%` }}
                              />
                            </div>
                            <span
                              className={`text-[12px] font-semibold tabular-nums ${
                                weak ? 'text-[#B45309]' : 'text-ink'
                              }`}
                            >
                              {Math.round(row.confidence * 100)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[12px] leading-relaxed text-muted">
                          {row.snippet}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {weakSkills.length > 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-[#FFFBEB] px-4 py-3 text-[13px] text-ink">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <div>
                <p className="font-semibold">Weak confidence signals</p>
                <p className="mt-0.5 text-muted">
                  {weakSkills
                    .map((s) => getSkill(s.skillId)?.name ?? s.skillId)
                    .join(', ')}{' '}
                  — expect Honesty Map Weak/Conflict rows for these claims.
                </p>
              </div>
            </div>
          )}

          <div className="sticky bottom-4 z-20">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white/95 px-5 py-4 shadow-lift backdrop-blur">
              <div>
                <p className="text-[13px] font-semibold text-ink">
                  {journey.resumeAttached ? 'Resume already attached' : 'Ready to attach'}
                </p>
                <p className="text-[12px] text-muted">
                  Attaching confirms resume as an artifact for Honesty Map.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/evidence/github"
                  className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas"
                >
                  Skip to GitHub
                </Link>
                <button
                  type="button"
                  onClick={attach}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
                >
                  {journey.resumeAttached ? 'Continue' : 'Attach resume'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
