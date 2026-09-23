import type { ReactNode } from 'react'

interface Props {
  label: string
  value: string
  hint?: string
  icon?: ReactNode
  /** Use verified green only for true verification / Pro success states. */
  tone?: 'default' | 'accent' | 'verified' | 'muted' | 'warning'
}

const toneValue: Record<NonNullable<Props['tone']>, string> = {
  default: 'text-ink',
  accent: 'text-accent',
  verified: 'text-verified',
  muted: 'text-muted',
  warning: 'text-warning',
}

export function MetricCard({
  label,
  value,
  hint,
  icon,
  tone = 'default',
}: Props) {
  const compact = value.length > 4

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-card p-6 shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-accent/15 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
          {label}
        </p>
        {icon ? (
          <div className="rounded-md bg-canvas p-1.5 text-muted/70 transition group-hover:text-accent">
            {icon}
          </div>
        ) : null}
      </div>
      <p
        className={`mt-5 font-semibold leading-none tracking-tight tabular-nums ${
          compact ? 'text-2xl' : 'text-5xl'
        } ${toneValue[tone]}`}
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-3 text-[13px] font-medium text-muted">{hint}</p>
      ) : null}
    </div>
  )
}
