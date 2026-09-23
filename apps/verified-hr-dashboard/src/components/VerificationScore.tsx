interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  label?: boolean;
}

const sizes = {
  sm: { box: 48, stroke: 3.5, font: 'text-[13px]', sub: 'text-[7px]' },
  md: { box: 68, stroke: 4.5, font: 'text-lg', sub: 'text-[9px]' },
  lg: { box: 96, stroke: 5, font: 'text-2xl', sub: 'text-[10px]' },
  hero: { box: 132, stroke: 6, font: 'text-4xl', sub: 'text-xs' },
};

function scoreColor(score: number): string {
  // Green reserved for strongly verified — calm amber / muted otherwise
  if (score >= 85) return '#16A34A';
  if (score >= 70) return '#D97706';
  return '#A1A1AA';
}

export function VerificationScore({ score, size = 'md', label = true }: Props) {
  const s = sizes[size];
  const r = (s.box - s.stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = scoreColor(score);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: s.box, height: s.box }}
      title={`${score}% verified`}
    >
      <svg width={s.box} height={s.box} className="-rotate-90" aria-hidden>
        <circle
          cx={s.box / 2}
          cy={s.box / 2}
          r={r}
          fill="none"
          stroke="#F4F4F5"
          strokeWidth={s.stroke}
        />
        <circle
          cx={s.box / 2}
          cy={s.box / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={s.stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="animate-ring-draw"
          style={{
            ['--ring-from' as string]: String(c),
            ['--ring-to' as string]: String(offset),
            transition: 'stroke-dashoffset 0.85s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${s.font} font-semibold tracking-tight text-ink tabular-nums leading-none`}>
          {score}
        </span>
        {label && size !== 'sm' && (
          <span className={`${s.sub} mt-0.5 font-semibold uppercase tracking-[0.14em] text-muted`}>
            {size === 'hero' || size === 'lg' ? 'Verified' : '%'}
          </span>
        )}
        {!label && size === 'sm' && (
          <span className="mt-0.5 text-[8px] font-semibold uppercase leading-none tracking-[0.08em] text-muted">
            %
          </span>
        )}
      </div>
    </div>
  );
}
