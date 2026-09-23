import { Camera, Eye, EyeOff, Shield } from 'lucide-react'

interface Props {
  focused: boolean
  warnings: number
  /** Compact bar for exam room header. */
  compact?: boolean
}

/**
 * Exam theater integrity chrome — fake webcam lite + focus status.
 * No real camera / proctoring; blur events are handled by ExamRoom.
 */
export function IntegrityStrip({ focused, warnings, compact = false }: Props) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 rounded-xl border border-line bg-canvas/80 ${
        compact ? 'px-3 py-2' : 'px-4 py-3'
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-line bg-ink/90">
          <Camera className="h-3.5 w-3.5 text-white/70" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 animate-pulse-dot rounded-full bg-danger" />
        </div>
        <div className="leading-tight">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Camera
          </p>
          <p className="text-[12px] font-medium text-ink">Mock · theater only</p>
        </div>
      </div>

      <div className="hidden h-8 w-px bg-line sm:block" />

      <div className="flex items-center gap-2">
        {focused ? (
          <Eye className="h-4 w-4 text-accent" />
        ) : (
          <EyeOff className="h-4 w-4 text-warning" />
        )}
        <div className="leading-tight">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Focus
          </p>
          <p
            className={`text-[12px] font-medium ${
              focused ? 'text-ink' : 'text-warning'
            }`}
          >
            {focused ? 'Window active' : 'Tab blurred'}
          </p>
        </div>
      </div>

      <div className="hidden h-8 w-px bg-line sm:block" />

      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-muted" />
        <div className="leading-tight">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Integrity
          </p>
          <p className="text-[12px] font-medium text-ink">
            {warnings === 0
              ? 'Clean session'
              : `${warnings} focus warning${warnings === 1 ? '' : 's'}`}
          </p>
        </div>
      </div>

      {!compact ? (
        <p className="ml-auto max-w-[240px] text-right text-[11px] leading-snug text-muted">
          Prototype theater — no webcam capture or remote proctoring.
        </p>
      ) : null}
    </div>
  )
}
