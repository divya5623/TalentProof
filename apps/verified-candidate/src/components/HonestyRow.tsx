import { useState } from 'react'
import {
  AlertTriangle,
  Check,
  CircleHelp,
  FileText,
  GitBranch,
  Minus,
  X,
} from 'lucide-react'
import type { HonestyState, ReconcileDisposition } from '../types'

export interface HonestyRowData {
  skillId: string
  skillName: string
  resume: boolean
  github: boolean
  state: HonestyState
  disposition: ReconcileDisposition
  note?: string
}

interface Props {
  row: HonestyRowData
  onDisposition: (
    skillId: string,
    disposition: ReconcileDisposition,
    note?: string,
  ) => void
}

const STATE_META: Record<
  HonestyState,
  { label: string; className: string; icon: 'check' | 'warn' | 'danger' | 'missing' }
> = {
  aligned: {
    label: 'Aligned',
    // Accent/neutral — reserve verified green for post-performance Verified
    className: 'border-accent/25 bg-accent-soft text-accent',
    icon: 'check',
  },
  weak: {
    label: 'Weak',
    className: 'border-warning/30 bg-[#FFFBEB] text-[#B45309]',
    icon: 'warn',
  },
  conflict: {
    label: 'Conflict',
    className: 'border-danger/25 bg-[#FEF2F2] text-danger',
    icon: 'danger',
  },
  missing: {
    label: 'Missing',
    className: 'border-line bg-canvas text-muted',
    icon: 'missing',
  },
}

function StateBadge({ state }: { state: HonestyState }) {
  const meta = STATE_META[state]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${meta.className}`}
    >
      {meta.icon === 'check' && <Check className="h-3 w-3" strokeWidth={3} />}
      {meta.icon === 'warn' && <AlertTriangle className="h-3 w-3" strokeWidth={2.5} />}
      {meta.icon === 'danger' && <X className="h-3 w-3" strokeWidth={3} />}
      {meta.icon === 'missing' && <CircleHelp className="h-3 w-3" strokeWidth={2.5} />}
      {meta.label}
    </span>
  )
}

function ArtifactCell({ present, kind }: { present: boolean; kind: 'resume' | 'github' }) {
  const Icon = kind === 'resume' ? FileText : GitBranch
  if (present) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-accent-soft text-accent">
          <Icon className="h-3 w-3" />
        </span>
        Yes
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-muted">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-canvas text-muted">
        <Minus className="h-3 w-3" />
      </span>
      No
    </span>
  )
}

export function HonestyRow({ row, onDisposition }: Props) {
  const [noteDraft, setNoteDraft] = useState(row.note ?? '')
  const [showNote, setShowNote] = useState(
    row.disposition === 'note' || Boolean(row.note),
  )

  const needsAction = row.state === 'conflict'
  const dispositioned = needsAction && row.disposition != null

  function apply(disposition: ReconcileDisposition, note?: string) {
    onDisposition(row.skillId, disposition, note)
    if (disposition === 'note') setShowNote(true)
  }

  return (
    <tr className="border-b border-line last:border-b-0">
      <td className="px-4 py-3.5 align-top">
        <p className="text-[13px] font-semibold text-ink">{row.skillName}</p>
        {row.note && (
          <p className="mt-1 max-w-[220px] text-[11px] leading-snug text-muted">
            Note: {row.note}
          </p>
        )}
      </td>
      <td className="px-4 py-3.5 align-top">
        <ArtifactCell present={row.resume} kind="resume" />
      </td>
      <td className="px-4 py-3.5 align-top">
        <ArtifactCell present={row.github} kind="github" />
      </td>
      <td className="px-4 py-3.5 align-top">
        <StateBadge state={row.state} />
        {dispositioned && (
          <p className="mt-1.5 text-[11px] font-medium text-muted">
            Disposition:{' '}
            <span className="text-ink">
              {row.disposition === 'keep'
                ? 'Keep with acknowledgment'
                : row.disposition === 'remove'
                  ? 'Remove claim'
                  : 'Note added'}
            </span>
          </p>
        )}
      </td>
      <td className="px-4 py-3.5 align-top">
        {needsAction ? (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => apply('remove')}
                className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition ${
                  row.disposition === 'remove'
                    ? 'border-danger/40 bg-[#FEF2F2] text-danger'
                    : 'border-line bg-white text-ink hover:bg-canvas'
                }`}
              >
                Remove claim
              </button>
              <button
                type="button"
                onClick={() => apply('keep')}
                className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition ${
                  row.disposition === 'keep'
                    ? 'border-accent/40 bg-accent-soft text-accent'
                    : 'border-line bg-white text-ink hover:bg-canvas'
                }`}
              >
                Keep + acknowledge
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNote(true)
                  apply('note', noteDraft || row.note)
                }}
                className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition ${
                  row.disposition === 'note'
                    ? 'border-accent/40 bg-accent-soft text-accent'
                    : 'border-line bg-white text-ink hover:bg-canvas'
                }`}
              >
                Add note
              </button>
            </div>
            {showNote && (
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Clarifying note…"
                  className="w-full min-w-[160px] flex-1 rounded-lg border border-line bg-white px-2.5 py-1.5 text-[12px] text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
                />
                <button
                  type="button"
                  onClick={() => apply('note', noteDraft.trim())}
                  disabled={!noteDraft.trim()}
                  className="rounded-lg bg-accent px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#5b3ce0] disabled:opacity-40"
                >
                  Save note
                </button>
              </div>
            )}
          </div>
        ) : row.state === 'weak' ? (
          <div className="space-y-2">
            <p className="text-[11px] text-muted">Optional: keep, remove, or note.</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => apply('keep')}
                className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition ${
                  row.disposition === 'keep'
                    ? 'border-accent/40 bg-accent-soft text-accent'
                    : 'border-line bg-white text-ink hover:bg-canvas'
                }`}
              >
                Keep
              </button>
              <button
                type="button"
                onClick={() => apply('remove')}
                className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition ${
                  row.disposition === 'remove'
                    ? 'border-danger/40 bg-[#FEF2F2] text-danger'
                    : 'border-line bg-white text-ink hover:bg-canvas'
                }`}
              >
                Remove
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNote(true)
                  if (!row.disposition) apply('note', noteDraft || undefined)
                }}
                className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-[11px] font-semibold text-ink transition hover:bg-canvas"
              >
                Note
              </button>
            </div>
            {showNote && (
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Clarifying note…"
                  className="w-full min-w-[160px] flex-1 rounded-lg border border-line bg-white px-2.5 py-1.5 text-[12px] text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
                />
                <button
                  type="button"
                  onClick={() => apply('note', noteDraft.trim())}
                  disabled={!noteDraft.trim()}
                  className="rounded-lg bg-accent px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#5b3ce0] disabled:opacity-40"
                >
                  Save note
                </button>
              </div>
            )}
          </div>
        ) : (
          <span className="text-[12px] text-muted">No action needed</span>
        )}
      </td>
    </tr>
  )
}
