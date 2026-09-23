import { Link } from 'react-router-dom'
import { ArrowRight, FolderGit2, Plus } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Metric } from '../../components/ui/Metric'
import { ProjectStatusPill } from '../../components/shared/StatusPill'
import { getPersona } from '../../data/personas'

export function StudentDashboard() {
  const { activePersona, projects, contacts } = useApp()
  const mine = projects.filter((p) => p.studentId === activePersona.id)
  const verified = mine.filter((p) => p.status === 'verified').length
  const pending = contacts.filter((c) => c.studentId === activePersona.id && c.status === 'pending').length

  return (
    <div className="animate-slide-up space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome, {activePersona.name.split(' ')[0]}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {activePersona.title}
            {activePersona.school ? ` · ${activePersona.school}` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" to="/student/profile">
            Technical profile
          </Button>
          <Button to="/student/submit">
            <Plus className="h-4 w-4" />
            Submit project
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Projects" value={mine.length} hint="Submitted evidence" />
        <Metric label="Verified" value={verified} hint="Badge rules satisfied" />
        <Metric label="Inbox" value={pending} hint="Pending recruiter requests" />
      </div>

      <Card>
        <CardHeader
          title="Your projects"
          subtitle="Click through analysis → sample execution → assessment → report"
          action={
            <Button size="sm" variant="outline" to="/student/submit">
              New
            </Button>
          }
        />
        <div className="divide-y divide-border">
          {mine.length === 0 && (
            <p className="py-8 text-center text-sm text-ink-muted">No projects yet — submit your first evidence pack.</p>
          )}
          {mine.map((p) => (
            <Link
              key={p.id}
              to={`/student/projects/${p.id}`}
              className="flex items-center justify-between gap-4 py-4 transition hover:bg-surface-2/80"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-light text-teal">
                  <FolderGit2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-ink">{p.title}</div>
                  <div className="mt-0.5 text-xs text-ink-muted">
                    {p.category} · {p.stack.join(', ')}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.skillTags.slice(0, 4).map((t) => (
                      <span key={t} className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ProjectStatusPill status={p.status} />
                <ArrowRight className="h-4 w-4 text-ink-faint" />
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {activePersona.id === 'stu-priya' && (
        <Card className="border-teal/20 bg-gradient-to-br from-teal-light/40 to-surface">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal">90s demo hint</div>
          <p className="mt-1 text-sm text-ink-muted">
            Open <strong>LedgerLite</strong> → Analysis → Trusted sample execution → Report / Share. Switch to Jordan
            recruiter to discover Priya and request contact; accept in Inbox.
          </p>
        </Card>
      )}

      <Card padding={false}>
        <div className="border-b border-border px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink-faint">
          Also try
        </div>
        <div className="grid sm:grid-cols-2">
          {['stu-priya', 'stu-alex']
            .filter((id) => id !== activePersona.id)
            .map((id) => {
              const p = getPersona(id)
              return (
                <div key={id} className="px-5 py-4 text-sm">
                  Switch persona to <strong>{p.name}</strong> for their sample project spine.
                </div>
              )
            })}
        </div>
      </Card>
    </div>
  )
}
