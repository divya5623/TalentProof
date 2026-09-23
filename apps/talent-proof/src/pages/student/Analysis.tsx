import { useParams, Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { RestrictionBanner } from '../../components/shared/RestrictionBanner'

export function AnalysisReport() {
  const { id } = useParams()
  const { projects } = useApp()
  const p = projects.find((x) => x.id === id)
  if (!p) return <p>Not found</p>

  const signal = p.ai.aiDetectSignal

  return (
    <div className="animate-slide-up space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analysis report</h1>
          <p className="mt-1 text-sm text-ink-muted">{p.title}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" to={`/student/projects/${p.id}`}>
            Project
          </Button>
          <Button to={`/student/projects/${p.id}/execution`}>Continue to execution</Button>
        </div>
      </div>

      <RestrictionBanner kind="llm" />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1 border-teal/30">
          <div className="mb-2">
            <Badge tone="teal">Observed evidence</Badge>
          </div>
          <CardHeader title="What we scanned" subtitle="Deterministic / fixture observations" />
          <ul className="space-y-2 text-sm">
            {p.observed.structure.map((s) => (
              <li key={s.label} className="flex justify-between gap-2 border-b border-border pb-2">
                <span className="text-ink-muted">{s.label}</span>
                <span className="text-right font-medium">{s.value}</span>
              </li>
            ))}
          </ul>
          <h4 className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">Languages</h4>
          <div className="mt-2 space-y-2">
            {p.observed.languages.map((l) => (
              <div key={l.name}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{l.name}</span>
                  <span className="text-ink-muted">
                    {l.pct}% · {l.files} files
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
                  <div className="h-full rounded-full bg-teal" style={{ width: `${l.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <h4 className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">Frameworks</h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {p.observed.frameworks.map((f) => (
              <Badge key={f} tone="white">
                {f}
              </Badge>
            ))}
          </div>
          <h4 className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">Quality signals</h4>
          <ul className="mt-2 space-y-2">
            {p.observed.qualitySignals.map((q) => (
              <li key={q.label} className="rounded-lg border border-border bg-canvas px-3 py-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{q.label}</span>
                  <Badge tone={q.status === 'pass' ? 'green' : q.status === 'warn' ? 'amber' : 'blue'}>{q.status}</Badge>
                </div>
                <p className="mt-1 text-ink-muted">{q.detail}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-1 border-partial/30">
          <Badge tone="blue">AI interpretation</Badge>
          <CardHeader title="Model reading (fixture)" subtitle="Not a live LLM API call" />
          <p className="text-sm text-ink-muted">{p.ai.summary}</p>
          <h4 className="mt-4 text-xs font-semibold text-verified">Strengths</h4>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-sm">
            {p.ai.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <h4 className="mt-4 text-xs font-semibold text-warn">Concerns</h4>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-sm">
            {p.ai.concerns.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl border border-amber-200 bg-warn-bg p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-warn">AI-detect signal only</div>
            <div className="mt-1 text-2xl font-bold text-ink">{Math.round(signal.score * 100)}%</div>
            <div className="text-sm font-medium">{signal.label}</div>
            <p className="mt-2 text-xs text-ink-muted">{signal.disclaimer}</p>
          </div>
        </Card>

        <Card className="lg:col-span-1 border-warn/30">
          <Badge tone="amber">Uncertainty</Badge>
          <CardHeader title="What we don't claim" subtitle="Honest gaps + mitigations" />
          <div className="space-y-3">
            {p.uncertainty.map((u) => (
              <div key={u.area} className="rounded-lg border border-border bg-canvas p-3 text-sm">
                <div className="font-semibold">{u.area}</div>
                <p className="mt-1 text-xs text-ink-muted">
                  <strong>Why:</strong> {u.reason}
                </p>
                <p className="mt-1 text-xs text-teal">
                  <strong>Mitigation:</strong> {u.mitigation}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <p className="text-center text-xs text-ink-faint">
        Next:{' '}
        <Link className="text-teal underline" to={`/student/projects/${p.id}/execution`}>
          Trusted sample execution
        </Link>
      </p>
    </div>
  )
}
