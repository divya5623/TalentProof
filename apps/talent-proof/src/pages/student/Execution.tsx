import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle2, CircleX, Loader2, SkipForward } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { executionFixtures } from '../../data/execution'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Metric } from '../../components/ui/Metric'
import { RestrictionBanner } from '../../components/shared/RestrictionBanner'
import { Banner } from '../../components/ui/Banner'

export function ExecutionPage() {
  const { id } = useParams()
  const { projects, updateProjectStatus } = useApp()
  const p = projects.find((x) => x.id === id)
  const fixture = id ? executionFixtures[id] : undefined
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [step, setStep] = useState(0)

  const supported = useMemo(() => {
    if (!p) return false
    return (p.supportLevel === 'fully' || p.supportLevel === 'partial') && !!fixture
  }, [p, fixture])

  if (!p) return <p>Not found</p>

  const runDemo = async () => {
    if (!fixture) return
    setRunning(true)
    setDone(false)
    setStep(0)
    for (let i = 0; i < fixture.commands.length; i++) {
      setStep(i + 1)
      await new Promise((r) => setTimeout(r, 700))
    }
    setRunning(false)
    setDone(true)
    if (p.status !== 'verified') updateProjectStatus(p.id, 'assessment_ready')
  }

  return (
    <div className="animate-slide-up space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trusted execution</h1>
          <p className="mt-1 text-sm text-ink-muted">{p.title}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" to={`/student/projects/${p.id}/analysis`}>
            Analysis
          </Button>
          {supported && p.questions.length > 0 && (
            <Button to={`/student/projects/${p.id}/assessment`}>Start assessment</Button>
          )}
          {!supported && <Button to={`/student/projects/${p.id}/report`}>View report path</Button>}
        </div>
      </div>

      <RestrictionBanner kind="sandbox" />

      {!supported && (
        <Banner tone="warn" title="Manual review path">
          This stack is not covered by a trusted sample fixture. A human reviewer would validate setup notes offline.
          No fake live test results are shown.
        </Banner>
      )}

      {supported && fixture && (
        <>
          <RestrictionBanner kind="sample-exec" />
          <div className="flex items-center gap-2">
            <Badge tone="teal">{fixture.labeledAs}</Badge>
            <Badge tone="green">Stack supported</Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <Metric label="Passed" value={done ? fixture.summary.passed : '—'} />
            <Metric label="Failed" value={done ? fixture.summary.failed : '—'} />
            <Metric label="Skipped" value={done ? fixture.summary.skipped : '—'} />
            <Metric label="Duration" value={done ? `${(fixture.summary.durationMs / 1000).toFixed(2)}s` : '—'} />
          </div>

          <Card>
            <CardHeader
              title="Replay sample runner"
              subtitle="Animates fixture output — not executing your upload on this host"
              action={
                <Button size="sm" onClick={runDemo} disabled={running}>
                  {running ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Running…
                    </>
                  ) : done ? (
                    'Replay again'
                  ) : (
                    'Run trusted sample'
                  )}
                </Button>
              }
            />
            <div className="space-y-3">
              {fixture.commands.map((c, i) => {
                const active = running && step === i + 1
                const complete = done || step > i + 1
                return (
                  <div key={c.cmd} className="rounded-lg border border-border bg-stone-950 p-3 font-mono text-xs text-stone-200">
                    <div className="flex items-center justify-between gap-2 text-teal-mid">
                      <span>$ {c.cmd}</span>
                      {active && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      {complete && c.status === 'ok' && <CheckCircle2 className="h-3.5 w-3.5 text-verified" />}
                      {complete && c.status === 'fail' && <CircleX className="h-3.5 w-3.5 text-danger" />}
                      {complete && c.status === 'skip' && <SkipForward className="h-3.5 w-3.5 text-ink-faint" />}
                    </div>
                    {(complete || active) && (
                      <pre className="mt-2 whitespace-pre-wrap text-stone-400">{c.output}</pre>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>

          {done && (
            <Card>
              <CardHeader title="Test results (fixture)" />
              <ul className="divide-y divide-border text-sm">
                {fixture.tests.map((t) => (
                  <li key={t.name} className="flex items-center justify-between py-2">
                    <span className="font-mono text-xs">{t.name}</span>
                    <Badge tone={t.status === 'passed' ? 'green' : t.status === 'failed' ? 'red' : 'ink'}>
                      {t.status} · {t.durationMs}ms
                    </Badge>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-ink-muted">{fixture.notes}</p>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
