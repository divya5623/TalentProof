import type { ReactNode } from 'react'

export function Card({
  children,
  className = '',
  padding = true,
}: {
  children: ReactNode
  className?: string
  padding?: boolean
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface shadow-[0_1px_2px_rgba(12,10,9,0.04)] ${padding ? 'p-5' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-base font-semibold tracking-tight text-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
