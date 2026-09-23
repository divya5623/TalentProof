interface Props {
  /** 0–100 */
  value: number
  size?: number
  strokeWidth?: number
  label?: string
  /** Use verified green only for success / pass thresholds. */
  tone?: 'accent' | 'verified' | 'warning' | 'danger' | 'muted'
  sublabel?: string
}

const strokeByTone: Record<NonNullable<Props['tone']>, string> = {
  accent: '#6D4AFF',
  verified: '#16A34A',
  warning: '#F59E0B',
  danger: '#DC2626',
  muted: '#A1A1AA',
}

/**
 * SVG ring for L2 authorship / overall scores.
 */
export function ScoreRing({
  value,
  size = 120,
  strokeWidth = 10,
  label,
  tone = 'accent',
  sublabel,
}: Props) {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - clamped / 100)
  const color = strokeByTone[tone]

  return (
    <div
      className="inline-flex flex-col items-center gap-2"
      role="img"
      aria-label={`${label ?? 'Score'} ${Math.round(clamped)} percent`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E4E4E7"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          className="fill-ink"
          style={{
            fontSize: size * 0.22,
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {Math.round(clamped)}%
        </text>
      </svg>
      {label ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          {label}
        </p>
      ) : null}
      {sublabel ? (
        <p className="-mt-1 text-[12px] text-muted">{sublabel}</p>
      ) : null}
    </div>
  )
}
