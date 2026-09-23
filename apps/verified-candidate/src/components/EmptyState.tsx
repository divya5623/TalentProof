import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface Props {
  icon?: LucideIcon
  title: string
  body: string
  ctaLabel?: string
  ctaTo?: string
  onCta?: () => void
  secondary?: ReactNode
  tone?: 'default' | 'warning' | 'accent'
}

/**
 * Soft empty / teaching-state panel for cockpits and lobbies.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  body,
  ctaLabel,
  ctaTo,
  onCta,
  secondary,
  tone = 'default',
}: Props) {
  const shell =
    tone === 'warning'
      ? 'border-warning/30 bg-[#FFFBEB]'
      : tone === 'accent'
        ? 'border-accent/25 bg-accent-soft/50'
        : 'border-line bg-card'

  return (
    <div
      className={`animate-fade-up rounded-2xl border px-6 py-8 text-center shadow-card md:px-10 ${shell}`}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-muted shadow-sm">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <h2 className="mt-4 text-lg font-semibold tracking-tight text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-muted">{body}</p>
      {(ctaLabel && (ctaTo || onCta)) || secondary ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {ctaLabel && ctaTo ? (
            <Link
              to={ctaTo}
              className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
            >
              {ctaLabel}
            </Link>
          ) : null}
          {ctaLabel && onCta && !ctaTo ? (
            <button
              type="button"
              onClick={onCta}
              className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
            >
              {ctaLabel}
            </button>
          ) : null}
          {secondary}
        </div>
      ) : null}
    </div>
  )
}
