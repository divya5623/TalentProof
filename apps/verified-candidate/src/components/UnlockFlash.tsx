import { useEffect } from 'react'

interface Props {
  show: boolean
  /** Default 320ms — within 200–400ms unlock window */
  durationMs?: number
  onDone?: () => void
}

/**
 * Short accent flash for L1→L2 / L2→Pro unlock moments. No bounce spam.
 */
export function UnlockFlash({ show, durationMs = 320, onDone }: Props) {
  useEffect(() => {
    if (!show) return
    const t = window.setTimeout(() => onDone?.(), durationMs)
    return () => window.clearTimeout(t)
  }, [show, durationMs, onDone])

  if (!show) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[90] animate-unlock-flash"
      aria-hidden
    >
      <div className="absolute inset-0 bg-accent/20" />
      <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
    </div>
  )
}
