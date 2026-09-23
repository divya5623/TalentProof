import { useMemo, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Filter,
  ShieldAlert,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { HonestyRow, type HonestyRowData } from '../components/HonestyRow'
import { LockedGate } from '../components/LockedGate'
import { useApp, useActivePersona, useJourney } from '../context/AppContext'
import { getHonestyMap } from '../data/honestyMaps'
import { getSkill } from '../data/skillsCatalog'
import type { HonestyState, ReconcileDisposition } from '../types'

type FilterKey = 'all' | HonestyState

export function Reconcile() {
  const persona = useActivePersona()
  const journey = useJourney()
  const { dispatch, toast } = useApp()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterKey>('all')

  const bothEvidence = journey.resumeAttached && journey.githubConnected

  const rows: HonestyRowData[] = useMemo(() => {
    const claimed = new Set(journey.claimedSkillIds)
    return getHonestyMap(persona.id)
      .filter((row) => claimed.has(row.skillId))
      .map((row) => ({
        skillId: row.skillId,
        skillName: getSkill(row.skillId)?.name ?? row.skillId,
        resume: row.resume && journey.resumeAttached,
        github: row.github && journey.githubConnected,
        state: row.state,
        disposition: journey.dispositions[row.skillId] ?? null,
        note: journey.evidenceNotes[row.skillId],
      }))
  }, [
    persona.id,
    journey.claimedSkillIds,
    journey.dispositions,
    journey.evidenceNotes,
    journey.resumeAttached,
    journey.githubConnected,
  ])

  const counts = useMemo(() => {
    const base = { all: rows.length, aligned: 0, weak: 0, conflict: 0, missing: 0 }
    for (const r of rows) base[r.state] += 1
    return base
  }, [rows])

  const pendingConflicts = rows.filter(
    (r) => r.state === 'conflict' && r.disposition == null,
  )

  const filtered =
    filter === 'all' ? rows : rows.filter((r) => r.state === filter)

  function onDisposition(
    skillId: string,
    disposition: ReconcileDisposition,
    note?: string,
  ) {
    dispatch({ type: 'SET_DISPOSITION', skillId, disposition, note })
    const label =
      disposition === 'remove'
        ? 'Claim marked for removal'
        : disposition === 'keep'
          ? 'Claim kept with acknowledgment'
          : 'Note saved'
    toast(label, 'info')
  }

  function markReviewed() {
    if (pendingConflicts.length > 0) {
      toast(
        `Disposition ${pendingConflicts.length} conflict${pendingConflicts.length === 1 ? '' : 's'} before marking reviewed.`,
        'warning',
      )
      setFilter('conflict')
      return
    }
    if (!bothEvidence) {
      toast('Attach resume and connect GitHub before unlocking exams.', 'warning')
      return
    }
    dispatch({ type: 'MARK_RECONCILE_REVIEWED' })
    toast('Honesty Map reviewed. L1 exams unlocked.', 'success')
    navigate('/exams')
  }

  if (!journey.resumeAttached && !journey.githubConnected) {
    return (
      <LockedGate
        title="Honesty Map locked"
        reason="Attach a resume or connect GitHub so claims can be compared to artifacts."
        ctaLabel="Attach resume"
        ctaTo="/evidence/resume"
        secondaryLabel="Connect GitHub"
        secondaryTo="/evidence/github"
      />
    )
  }

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'aligned', label: 'Aligned' },
    { key: 'weak', label: 'Weak' },
    { key: 'conflict', label: 'Conflict' },
    { key: 'missing', label: 'Missing' },
  ]

  return (
    <div className="mx-auto max-w-[1100px] space-y-8 animate-fade-up">
      <header className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          Reconcile
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Honesty Map</h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          Confront claims with resume and GitHub artifacts. Conflicts must be dispositioned
          before L1 exams unlock. Aligned is not the same as Verified — performance still
          required.
        </p>
      </header>

      {!bothEvidence && (
        <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-[#FFFBEB] px-4 py-3 text-[13px] text-ink">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <p>
            Partial evidence:{' '}
            {!journey.resumeAttached && (
              <Link to="/evidence/resume" className="font-semibold text-accent hover:underline">
                attach resume
              </Link>
            )}
            {!journey.resumeAttached && !journey.githubConnected && ' and '}
            {!journey.githubConnected && (
              <Link to="/evidence/github" className="font-semibold text-accent hover:underline">
                connect GitHub
              </Link>
            )}
            . Both are required before exams unlock.
          </p>
        </div>
      )}

      {journey.reconcileReviewed && (
        <div className="flex items-start gap-3 rounded-xl border border-accent/25 bg-accent-soft/60 px-4 py-3 text-[13px] text-ink">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <p>
            Honesty Map already marked reviewed for {persona.name}. You can still adjust
            dispositions; exams stay unlocked while both evidence artifacts remain attached.
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {(
          [
            ['all', 'Rows', counts.all],
            ['aligned', 'Aligned', counts.aligned],
            ['weak', 'Weak', counts.weak],
            ['conflict', 'Conflict', counts.conflict],
            ['missing', 'Missing', counts.missing],
          ] as const
        ).map(([key, label, value]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-2xl border px-4 py-3 text-left shadow-card transition ${
              filter === key
                ? 'border-accent/40 bg-accent-soft ring-2 ring-accent/10'
                : 'border-line bg-card hover:border-accent/25'
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              {label}
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-ink">{value}</p>
          </button>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-line bg-card shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-ink">
            <Filter className="h-4 w-4 text-muted" />
            Claim ↔ artifact matrix
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition ${
                  filter === f.key
                    ? 'bg-ink text-white'
                    : 'bg-canvas text-muted hover:text-ink'
                }`}
              >
                {f.label}
                {f.key !== 'all' ? ` (${counts[f.key]})` : ''}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-muted">
            No rows match this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="bg-canvas text-[11px] font-semibold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Claim</th>
                  <th className="px-4 py-3">Resume</th>
                  <th className="px-4 py-3">GitHub</th>
                  <th className="px-4 py-3">State</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <HonestyRow
                    key={row.skillId}
                    row={row}
                    onDisposition={onDisposition}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {pendingConflicts.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-danger/25 bg-[#FEF2F2] px-4 py-3 text-[13px] text-ink">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          <p>
            <span className="font-semibold text-danger">
              {pendingConflicts.length} conflict
              {pendingConflicts.length === 1 ? '' : 's'} pending
            </span>
            :{' '}
            {pendingConflicts.map((r) => r.skillName).join(', ')}. Remove, keep with
            acknowledgment, or add a note before marking reviewed.
          </p>
        </div>
      )}

      <div className="sticky bottom-4 z-20">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white/95 px-5 py-4 shadow-lift backdrop-blur">
          <div>
            <p className="text-[13px] font-semibold text-ink">
              {pendingConflicts.length > 0
                ? 'Resolve conflicts to unlock Mark reviewed'
                : journey.reconcileReviewed
                  ? 'Reviewed — exams available'
                  : bothEvidence
                    ? 'Ready to mark reviewed'
                    : 'Finish both evidence steps first'}
            </p>
            <p className="text-[12px] text-muted">
              Marking reviewed unlocks L1 only when resume + GitHub are both attached.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/evidence/github"
              className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas"
            >
              Evidence
            </Link>
            <button
              type="button"
              onClick={markReviewed}
              disabled={pendingConflicts.length > 0 || !bothEvidence}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {journey.reconcileReviewed ? 'Re-confirm reviewed' : 'Mark reviewed'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
