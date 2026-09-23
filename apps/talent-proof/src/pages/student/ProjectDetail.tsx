import { Link, useParams } from 'react-router-dom'
import {
  ArrowRight,
  Beaker,
  FileCode2,
  ScrollText,
  Share2,
  Timer,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { ProjectStatusPill, SupportPill } from '../../components/shared/StatusPill'
import { RestrictionBanner } from '../../components/shared/RestrictionBanner'

export function ProjectDetail() {
  const { id } = useParams()
  const { projects } = useApp()
  const p = projects.find((x) => x.id === id)

  if (!p) {
    return <p className="text-sm text-ink-muted">Project not found.</p>
  }

  const links = [
    { to: `/student/projects/${p.id}/analysis`, label: 'Analysis report', icon: FileCode2, desc: 'Observed vs AI vs uncertainty' },
    {
      to: `/student/projects/${p.id}/execution`,
      label: 'Trusted sample execution',
      icon: Beaker,
      desc: p.supportLevel === 'fully' || p.supportLevel === 'partial' ? 'Fixture build/test results' : 'Manual review path',
    },
    {
      to: `/student/projects/${p.id}/assessment`,
      label: 'Live assessment',
      icon: Timer,
      desc: p.questions.length ? `${p.questions.length} project-specific questions` : 'No questions on stub submit',
      disabled: p.questions.length === 0,
    },
    { to: `/student/projects/${p.id}/report`, label: 'Skill verification report', icon: ScrollText, desc: 'Badges & explicit rules' },
    { to: `/share/${p.shareId}`, label: 'Public share page', icon: Share2, desc: 'Verified evidence link' },
  ]

  return (
    <div className="animate-slide-up space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <ProjectStatusPill status={p.status} />
            <SupportPill level={p.supportLevel} />
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">{p.title}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {p.category} · {p.sourceLabel}
          </p>
        </div>
        <Button variant="secondary" to="/student">
          Back to dashboard
        </Button>
      </div>

      {(p.supportLevel === 'manual' || p.supportLevel === 'not_yet') && <RestrictionBanner kind="sandbox" />}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: 'Stack', v: p.stack.join(', ') },
          { l: 'Contribution', v: p.contribution },
          { l: 'Teammates', v: p.teammates.length ? p.teammates.join(', ') : '—' },
          { l: 'Files indexed', v: String(p.files.length) },
        ].map((m) => (
          <Card key={m.l} className="!p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint">{m.l}</div>
            <div className="mt-1 text-sm font-medium text-ink">{m.v}</div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Setup notes" />
        <pre className="overflow-x-auto rounded-lg bg-stone-900 p-4 font-mono text-xs text-teal-mid">{p.setupNotes}</pre>
      </Card>

      <Card>
        <CardHeader title="Continue the spine" subtitle="Hackathon path — each step is clickable" />
        <div className="space-y-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.disabled ? '#' : l.to}
              className={`flex items-center justify-between rounded-xl border border-border px-4 py-3 transition ${
                l.disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-teal/40 hover:bg-teal-light/30'
              }`}
              onClick={(e) => l.disabled && e.preventDefault()}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-canvas text-teal">
                  <l.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">{l.label}</div>
                  <div className="text-xs text-ink-muted">{l.desc}</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-faint" />
            </Link>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Mock file inventory" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-ink-faint">
              <tr>
                <th className="pb-2 font-medium">Path</th>
                <th className="pb-2 font-medium">Lang</th>
                <th className="pb-2 font-medium">Lines</th>
                <th className="pb-2 font-medium">Symbols</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {p.files.map((f) => (
                <tr key={f.path}>
                  <td className="py-2 font-mono text-xs">{f.path}</td>
                  <td className="py-2 text-ink-muted">{f.language}</td>
                  <td className="py-2">{f.lines}</td>
                  <td className="py-2 text-xs text-ink-muted">{f.functions?.join(', ') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
