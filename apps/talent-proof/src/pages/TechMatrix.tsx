import { techMatrix } from '../data/techMatrix'
import { Card, CardHeader } from '../components/ui/Card'
import { SupportPill } from '../components/shared/StatusPill'
import { Banner } from '../components/ui/Banner'
import type { SupportLevel } from '../types'

const order: SupportLevel[] = ['fully', 'partial', 'manual', 'not_yet']
const labels: Record<SupportLevel, string> = {
  fully: 'Fully supported',
  partial: 'Partial',
  manual: 'Manual review',
  not_yet: 'Not yet',
}

export function TechMatrixPage() {
  return (
    <div className="animate-slide-up space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Supported tech matrix</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Honest coverage for trusted sample execution vs manual review vs not yet
        </p>
      </div>
      <Banner tone="warn" title="No real Docker sandbox on the main server">
        “Fully supported” means a controlled sample fixture exists for the hackathon demo — not arbitrary code execution.
      </Banner>
      <div className="grid gap-4 lg:grid-cols-2">
        {order.map((level) => (
          <Card key={level}>
            <CardHeader
              title={labels[level]}
              action={<SupportPill level={level} />}
              subtitle={`${techMatrix.filter((t) => t.level === level).length} entries`}
            />
            <ul className="divide-y divide-border">
              {techMatrix
                .filter((t) => t.level === level)
                .map((t) => (
                  <li key={t.id} className="flex items-start justify-between gap-3 py-2.5 text-sm">
                    <div>
                      <div className="font-semibold text-ink">{t.name}</div>
                      <div className="text-xs text-ink-faint">{t.category}</div>
                      <p className="mt-0.5 text-xs text-ink-muted">{t.notes}</p>
                    </div>
                  </li>
                ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  )
}
