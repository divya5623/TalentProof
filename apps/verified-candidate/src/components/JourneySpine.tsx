const STEPS = [
  'Onboard',
  'Claims',
  'Evidence',
  'Reconcile',
  'Exams',
  'Projects',
  'Certificate',
  'Share',
] as const

interface Props {
  /** 0-based index of current step; later tasks will drive this from journey state */
  currentIndex?: number
  variant?: 'compact' | 'large'
}

export function JourneySpine({ currentIndex = 0, variant = 'compact' }: Props) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1.5" aria-label="Journey progress">
        {STEPS.map((step, i) => {
          const done = i < currentIndex
          const current = i === currentIndex
          return (
            <div key={step} className="flex items-center gap-1.5">
              <span
                title={step}
                className={`h-1.5 w-1.5 rounded-full ${
                  done
                    ? 'bg-accent'
                    : current
                      ? 'bg-accent animate-pulse-dot'
                      : 'bg-line'
                }`}
              />
              {i < STEPS.length - 1 && (
                <span className={`h-px w-2 ${done ? 'bg-accent/40' : 'bg-line'}`} />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <ol className="flex flex-wrap items-center gap-2">
      {STEPS.map((step, i) => {
        const done = i < currentIndex
        const current = i === currentIndex
        return (
          <li key={step} className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
                current
                  ? 'border-accent bg-accent-soft text-accent'
                  : done
                    ? 'border-line bg-white text-ink'
                    : 'border-line bg-canvas text-muted'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  current || done ? 'bg-accent text-white' : 'bg-line text-muted'
                }`}
              >
                {i + 1}
              </span>
              {step}
            </span>
            {i < STEPS.length - 1 && <span className="h-px w-3 bg-line" />}
          </li>
        )
      })}
    </ol>
  )
}

export { STEPS }
