import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Award, BadgeCheck, Check, Circle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Banner } from '../../components/ui/Banner'

export function VerificationReport() {
  const { id } = useParams()
  const { projects, assessment, updateProjectStatus } = useApp()
  const p = projects.find((x) => x.id === id)

  const score = useMemo(() => {
    if (!p || !assessment || assessment.projectId !== p.id) return null
    let earned = 0
    let total = 0
    for (const q of p.questions) {
      total += q.points
      const a = assessment.answers[q.id]
      if (q.type === 'mcq' && typeof a === 'number' && a === q.correctIndex) earned += q.points
      else if (q.type !== 'mcq' && typeof a === 'string' && a.trim().length > 40) earned += Math.round(q.points * 0.85)
    }
    return { earned, total, pct: total ? Math.round((earned / total) * 100) : 0 }
  }, [p, assessment])

  if (!p) return <p>Not found</p>

  const explainedOk = score ? score.pct >= 70 : p.badges.find((b) => b.level === 'explained')?.earned
  const canVerify =
    explainedOk &&
    (p.supportLevel === 'fully' || p.supportLevel === 'partial') &&
    p.badges.some((b) => b.level === 'observed' && b.earned)

  // reflect runtime badge state for display
  const badges = p.badges.map((b) => {
    if (b.level === 'explained' && explainedOk) {
      return { ...b, earned: true, earnedAt: b.earnedAt || new Date().toISOString() }
    }
    if (b.level === 'verified' && (p.status === 'verified' || canVerify)) {
      return { ...b, earned: p.status === 'verified' || canVerify, earnedAt: b.earnedAt || new Date().toISOString() }
    }
    return b
  })

  const markVerified = () => {
    if (canVerify) updateProjectStatus(p.id, 'verified')
  }

  return (
    <div className="animate-slide-up space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skill verification report</h1>
          <p className="mt-1 text-sm text-ink-muted">{p.title}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" to={`/share/${p.shareId}`}>
            Open public share
          </Button>
          {canVerify && p.status !== 'verified' && (
            <Button onClick={markVerified}>
              <BadgeCheck className="h-4 w-4" />
              Issue verified badge
            </Button>
          )}
        </div>
      </div>

      <Banner tone="info" title="Badge rules are explicit">
        Observed = structure scanned. Explained = timed assessment ≥ 70% on project-specific questions. Verified =
        Explained + trusted sample execution path for supported stacks + no unresolved critical integrity issues.
      </Banner>

      {score && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="!p-4">
            <div className="text-xs uppercase tracking-wider text-ink-faint">Assessment score</div>
            <div className="mt-1 text-3xl font-bold text-ink">{score.pct}%</div>
            <div className="text-xs text-ink-muted">
              {score.earned}/{score.total} pts (written partial credit theater)
            </div>
          </Card>
          <Card className="!p-4">
            <div className="text-xs uppercase tracking-wider text-ink-faint">Integrity events</div>
            <div className="mt-1 text-3xl font-bold">{assessment?.integrity.length ?? 0}</div>
            <div className="text-xs text-ink-muted">Transparent log from session</div>
          </Card>
          <Card className="!p-4">
            <div className="text-xs uppercase tracking-wider text-ink-faint">Skill tags</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {p.skillTags.map((t) => (
                <Badge key={t} tone="teal">
                  {t}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {badges.map((b) => (
          <Card key={b.id} className={b.earned ? 'border-verified/40' : ''}>
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-light text-teal">
                <Award className="h-5 w-5" />
              </div>
              <Badge tone={b.earned ? 'green' : 'ink'}>{b.earned ? 'Earned' : 'Locked'}</Badge>
            </div>
            <h3 className="mt-3 font-bold text-ink">{b.name}</h3>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink-faint">{b.level}</div>
            <ul className="mt-3 space-y-2">
              {b.criteria.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-ink-muted">
                  {b.earned ? <Check className="mt-0.5 h-4 w-4 text-verified" /> : <Circle className="mt-0.5 h-4 w-4" />}
                  {c}
                </li>
              ))}
            </ul>
            {b.earnedAt && (
              <p className="mt-3 text-[11px] text-ink-faint">
                Earned {new Date(b.earnedAt).toLocaleString('en-IN', { timeZone: 'Asia/Calcutta' })} IST
              </p>
            )}
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Evidence summary" />
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-ink-faint">Contribution</dt>
            <dd className="font-medium">{p.contribution}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-faint">Support path</dt>
            <dd className="font-medium capitalize">{p.supportLevel.replace('_', ' ')}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-faint">AI-detect</dt>
            <dd className="font-medium">
              {Math.round(p.ai.aiDetectSignal.score * 100)}% — signal only, never definitive
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-faint">Share ID</dt>
            <dd className="font-mono text-xs">{p.shareId}</dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}
