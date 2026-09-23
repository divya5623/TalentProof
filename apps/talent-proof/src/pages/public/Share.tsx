import { Link, useParams } from 'react-router-dom'
import { BadgeCheck, ShieldCheck } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getPersona } from '../../data/personas'
import { Card, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Banner } from '../../components/ui/Banner'

export function SharePage() {
  const { shareId } = useParams()
  const { projects } = useApp()
  const p = projects.find((x) => x.shareId === shareId)
  if (!p) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-canvas">
        <p className="text-sm text-ink-muted">Share link not found.</p>
      </div>
    )
  }
  const student = getPersona(p.studentId)
  const verified = p.status === 'verified' || p.badges.some((b) => b.level === 'verified' && b.earned)

  return (
    <div className="min-h-svh bg-canvas">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold">TALENT PROOF</span>
          </Link>
          <Badge tone="white">Public verified evidence</Badge>
        </div>
      </header>
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-10">
        <Banner tone="demo" title="Shared evidence page">
          Recruiters can review badges and observed skills without private assessment answers.
        </Banner>
        <Card>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal text-lg font-bold text-white">
              {student.avatarInitials}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{student.name}</h1>
              <p className="text-sm text-ink-muted">
                {student.title} · {student.school}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {verified ? (
                  <Badge tone="green">
                    <BadgeCheck className="h-3 w-3" /> Skill verified
                  </Badge>
                ) : (
                  <Badge tone="amber">Verification in progress</Badge>
                )}
                <Badge tone="teal">{p.title}</Badge>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader title="Verified skills" subtitle="From project evidence + assessment rules" />
          <div className="flex flex-wrap gap-2">
            {p.skillTags.map((t) => (
              <span key={t} className="rounded-full border border-verified/30 bg-verified-bg px-3 py-1 text-sm font-semibold text-verified">
                {t}
              </span>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Badges" />
          <ul className="space-y-3">
            {p.badges.map((b) => (
              <li key={b.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                <div>
                  <div className="font-semibold">{b.name}</div>
                  <div className="text-xs capitalize text-ink-muted">{b.level}</div>
                </div>
                <Badge tone={b.earned || (b.level === 'verified' && verified) ? 'green' : 'ink'}>
                  {b.earned || (b.level === 'verified' && verified) ? 'Earned' : '—'}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader title="Project snapshot" />
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-ink-faint">Category</dt>
              <dd>{p.category}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-faint">Stack</dt>
              <dd>{p.stack.join(', ')}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-ink-faint">Contribution</dt>
              <dd>{p.contribution}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-ink-faint">Observed highlights</dt>
              <dd className="text-ink-muted">{p.observed.qualitySignals.map((q) => q.label).join(' · ')}</dd>
            </div>
          </dl>
        </Card>
        <p className="text-center text-xs text-ink-faint">
          AI-detect and raw answers are not exposed on public share ·{' '}
          <Link to="/recruiter" className="text-teal underline">
            Recruiter discover
          </Link>
        </p>
      </main>
    </div>
  )
}
