import type { ScoreComponents } from '../types'

interface Props {
  score: ScoreComponents
  /** Compact row for side panels; default is stacked bars. */
  compact?: boolean
}

const ROWS: {
  key: keyof Pick<ScoreComponents, 'l1' | 'l2' | 'alignment' | 'integrity'>
  label: string
  weight: number
}[] = [
  { key: 'l1', label: 'L1 exam aggregate', weight: 40 },
  { key: 'l2', label: 'L2 project aggregate', weight: 35 },
  { key: 'alignment', label: 'Evidence alignment', weight: 15 },
  { key: 'integrity', label: 'Consistency / integrity', weight: 10 },
]

function fmt(n: number | null): string {
  if (n == null) return '—'
  return `${Math.round(n)}%`
}

/**
 * Always-visible 40 / 35 / 15 / 10 score transparency panel.
 */
export function ScoreBreakdown({ score, compact = false }: Props) {
  const overall =
    score.overall != null ? `${Math.round(score.overall)}%` : 'In progress'

  return (
    <div
      className={`rounded-2xl border border-line bg-card shadow-card ${
        compact ? 'p-5' : 'p-6'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Score blend
          </p>
          <h3 className="mt-1.5 text-base font-semibold tracking-tight text-ink">
            How overall is calculated
          </h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Overall
          </p>
          <p
            className={`mt-0.5 text-2xl font-semibold tabular-nums tracking-tight ${
              score.overall != null ? 'text-verified' : 'text-muted'
            }`}
          >
            {overall}
          </p>
        </div>
      </div>

      <ul className={`mt-5 space-y-4 ${compact ? 'mt-4 space-y-3' : ''}`}>
        {ROWS.map((row) => {
          const raw = score[row.key]
          const pct = raw == null ? 0 : Math.max(0, Math.min(100, raw))
          const pending = raw == null
          return (
            <li key={row.key}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-ink">{row.label}</p>
                  <p className="text-[11px] text-muted">{row.weight}% weight</p>
                </div>
                <span
                  className={`shrink-0 text-[13px] font-semibold tabular-nums ${
                    pending ? 'text-muted' : 'text-ink'
                  }`}
                >
                  {fmt(raw)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    pending ? 'bg-line' : 'bg-accent'
                  }`}
                  style={{ width: `${pending ? 8 : pct}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>

      <p className="mt-5 border-t border-line pt-4 text-[12px] leading-relaxed text-muted">
        Overall weights L1 (40%) + L2 (35%) + evidence alignment (15%) + integrity
        (10%). Overall stays &ldquo;In progress&rdquo; until both L1 and L2 aggregates
        exist.
      </p>
    </div>
  )
}
