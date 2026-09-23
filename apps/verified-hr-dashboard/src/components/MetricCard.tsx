import type { ReactNode } from 'react';

interface Props {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
  icon?: ReactNode;
  /** Optional quiet sparkline points (0–100 normalized). */
  spark?: number[];
}

function MiniSpark({ points }: { points: number[] }) {
  if (points.length < 2) return null;
  const w = 56;
  const h = 18;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / range) * (h - 2) - 1;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-70" aria-hidden>
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords}
      />
    </svg>
  );
}

export function MetricCard({ label, value, delta, positive = true, icon, spark }: Props) {
  const showUpPill = Boolean(delta && positive && delta.trim().startsWith('+'));

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-0.5 hover:border-accent/15 hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
        {icon ? (
          <div className="rounded-md bg-canvas p-1.5 text-muted/70 transition group-hover:text-accent">{icon}</div>
        ) : spark ? (
          <div className={positive ? 'text-verified' : 'text-muted'}>
            <MiniSpark points={spark} />
          </div>
        ) : null}
      </div>
      <p className="mt-5 text-5xl font-semibold leading-none tracking-tight text-ink tabular-nums">
        {value}
      </p>
      {delta && (
        <p
          className={`mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium ${
            positive ? 'text-verified' : 'text-muted'
          }`}
        >
          {showUpPill && (
            <span className="inline-flex items-center rounded-full bg-verified-soft/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-verified">
              Up
            </span>
          )}
          <span>{delta}</span>
        </p>
      )}
    </div>
  );
}
