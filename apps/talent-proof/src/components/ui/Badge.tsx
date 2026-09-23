import type { ReactNode } from 'react'

const tones: Record<string, string> = {
  teal: 'bg-teal-light text-teal border-teal/20',
  green: 'bg-verified-bg text-verified border-verified/20',
  amber: 'bg-warn-bg text-warn border-warn/25',
  red: 'bg-danger-bg text-danger border-danger/20',
  blue: 'bg-partial-bg text-partial border-partial/20',
  ink: 'bg-stone-100 text-ink-muted border-border',
  white: 'bg-white text-ink-muted border-border',
}

export function Badge({
  children,
  tone = 'ink',
  className = '',
}: {
  children: ReactNode
  tone?: keyof typeof tones
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
