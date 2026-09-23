import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  wide?: boolean
  /** Hide the default header close when embedding custom footer CTAs only. */
  hideClose?: boolean
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
  hideClose = false,
}: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog backdrop"
        className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative w-full animate-fade-up rounded-2xl border border-line bg-white shadow-[var(--shadow-lift)] ${
          wide ? 'max-w-2xl' : 'max-w-lg'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2
            id="modal-title"
            className="text-base font-semibold tracking-tight text-ink"
          >
            {title}
          </h2>
          {!hideClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted transition hover:bg-canvas hover:text-ink"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <span className="w-7" />
          )}
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
