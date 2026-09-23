import { Check, Minus } from 'lucide-react'

export type SkillChipVariant =
  | 'available'
  | 'claimed'
  | 'core'
  | 'verified'
  | 'self-reported'

interface Props {
  name: string
  variant?: SkillChipVariant
  selected?: boolean
  core?: boolean
  onClick?: () => void
  disabled?: boolean
}

/**
 * Claim / verified / self-reported skill chips.
 * Green (`verified`) is reserved for post-performance verification only.
 */
export function SkillChip({
  name,
  variant,
  selected = false,
  core = false,
  onClick,
  disabled = false,
}: Props) {
  const resolved: SkillChipVariant =
    variant ??
    (selected ? 'claimed' : core ? 'core' : 'available')

  const interactive = Boolean(onClick) && !disabled

  const base =
    'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium leading-5 transition select-none'

  const styles: Record<SkillChipVariant, string> = {
    available:
      'border-line bg-card text-muted hover:border-accent/40 hover:text-ink',
    claimed:
      'border-accent/30 bg-accent-soft text-accent',
    core:
      'border-line bg-canvas text-ink hover:border-accent/40',
    verified:
      'border-verified/20 bg-verified-soft/60 text-verified',
    'self-reported':
      'border-line/80 bg-canvas/80 text-muted',
  }

  const className = `${base} ${styles[resolved]} ${
    interactive ? 'cursor-pointer' : 'cursor-default'
  } ${disabled ? 'opacity-50 pointer-events-none' : ''}`

  const content = (
    <>
      {resolved === 'verified' && (
        <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-verified text-white">
          <Check className="h-2.5 w-2.5" strokeWidth={3} />
        </span>
      )}
      {resolved === 'claimed' && (
        <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent text-white">
          <Check className="h-2.5 w-2.5" strokeWidth={3} />
        </span>
      )}
      {resolved === 'self-reported' && (
        <Minus className="h-3 w-3 text-muted" strokeWidth={2.5} />
      )}
      <span className="tracking-tight">{name}</span>
      {core && resolved !== 'verified' && (
        <span className="rounded bg-white/70 px-1 py-px text-[9px] font-bold uppercase tracking-wider text-muted">
          Core
        </span>
      )}
    </>
  )

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={className}
        aria-pressed={selected}
      >
        {content}
      </button>
    )
  }

  return <span className={className}>{content}</span>
}
