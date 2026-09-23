import { Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Props {
  title?: string
  reason: string
  ctaLabel?: string
  ctaTo?: string
  secondaryLabel?: string
  secondaryTo?: string
}

/**
 * Institutional locked-step panel. Prefer RequireStep for deep-link redirects;
 * use LockedGate for in-page incomplete prerequisites.
 */
export function LockedGate({
  title = 'Step locked',
  reason,
  ctaLabel,
  ctaTo,
  secondaryLabel,
  secondaryTo,
}: Props) {
  return (
    <div className="mx-auto max-w-[560px] animate-fade-up rounded-2xl border border-line bg-card p-8 text-center shadow-card md:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-canvas text-muted">
        <Lock className="h-6 w-6" strokeWidth={2} />
      </div>
      <h1 className="mt-5 text-xl font-semibold tracking-tight text-ink">{title}</h1>
      <p className="mt-2 text-[14px] leading-relaxed text-muted">{reason}</p>
      {(ctaTo && ctaLabel) || (secondaryTo && secondaryLabel) ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {ctaTo && ctaLabel && (
            <Link
              to={ctaTo}
              className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
            >
              {ctaLabel}
            </Link>
          )}
          {secondaryTo && secondaryLabel && (
            <Link
              to={secondaryTo}
              className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      ) : null}
    </div>
  )
}
