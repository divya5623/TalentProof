import { AlertTriangle, Info, Shield } from 'lucide-react'
import type { ReactNode } from 'react'

const map = {
  info: {
    icon: Info,
    cls: 'border-partial/30 bg-partial-bg text-partial',
  },
  warn: {
    icon: AlertTriangle,
    cls: 'border-warn/30 bg-warn-bg text-warn',
  },
  demo: {
    icon: Shield,
    cls: 'border-teal/25 bg-teal-light text-teal-dark',
  },
}

export function Banner({
  tone = 'demo',
  title,
  children,
}: {
  tone?: keyof typeof map
  title: string
  children?: ReactNode
}) {
  const m = map[tone]
  const Icon = m.icon
  return (
    <div className={`flex gap-3 rounded-xl border px-4 py-3 ${m.cls}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 text-sm">
        <div className="font-semibold">{title}</div>
        {children && <div className="mt-0.5 opacity-90">{children}</div>}
      </div>
    </div>
  )
}
