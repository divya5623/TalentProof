import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { useApp } from '../context/AppContext'

export type ToastType = 'success' | 'info' | 'warning' | 'error'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
}

/** @deprecated Toasts live in AppProvider — kept as a no-op for compatibility. */
export function ToastProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function useToast() {
  const { toasts, toast, dismissToast } = useApp()
  return { toasts, toast, dismissToast }
}

export function ToastHost() {
  const { toasts, dismissToast } = useApp()

  return (
    <div className="pointer-events-none fixed right-6 bottom-6 z-[90] flex w-[320px] flex-col gap-2">
      {toasts.map((t) => (
        <ToastCard key={t.id} {...t} onDismiss={dismissToast} />
      ))}
    </div>
  )
}

function ToastCard({
  id,
  message,
  type,
  onDismiss,
}: ToastItem & { onDismiss: (id: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(id), 3200)
    return () => clearTimeout(t)
  }, [id, onDismiss])

  const Icon =
    type === 'success'
      ? CheckCircle2
      : type === 'warning' || type === 'error'
        ? AlertTriangle
        : Info
  const color =
    type === 'success'
      ? 'text-verified'
      : type === 'error'
        ? 'text-danger'
        : type === 'warning'
          ? 'text-warning'
          : 'text-accent'

  return (
    <div className="pointer-events-auto animate-toast-in flex items-start gap-3 rounded-xl border border-line bg-white px-4 py-3 shadow-[var(--shadow-lift)]">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
      <p className="flex-1 text-sm font-medium text-ink">{message}</p>
      <button type="button" onClick={() => onDismiss(id)} className="text-muted hover:text-ink">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
