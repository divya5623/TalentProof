import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, Search } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getPersona } from '../../data/personas'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Metric } from '../../components/ui/Metric'

export function RecruiterDiscover() {
  const { projects, activePersona } = useApp()
  const [skill, setSkill] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const candidates = useMemo(() => {
    const byStudent = new Map<string, typeof projects>()
    for (const p of projects) {
      const list = byStudent.get(p.studentId) || []
      list.push(p)
      byStudent.set(p.studentId, list)
    }
    return [...byStudent.entries()]
      .map(([studentId, projs]) => {
        const student = getPersona(studentId)
        const skills = [...new Set(projs.flatMap((p) => p.skillTags))]
        const hasVerified = projs.some((p) => p.status === 'verified')
        return { student, projs, skills, hasVerified }
      })
      .filter((c) => c.student.role === 'student')
      .filter((c) => !verifiedOnly || c.hasVerified)
      .filter((c) => !skill || c.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase())))
  }, [projects, skill, verifiedOnly])

  return (
    <div className="animate-slide-up space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Discover talent</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {activePersona.name} · {activePersona.company} — filter by proven skills
          </p>
        </div>
        <Button variant="secondary" to="/recruiter/requests">
          Your requests
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Candidates" value={candidates.length} />
        <Metric label="Verified projects" value={projects.filter((p) => p.status === 'verified').length} />
        <Metric label="Skill filter" value={skill || 'All'} />
      </div>

      <Card>
        <CardHeader title="Filters" />
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="Skill e.g. Python, React, pytest…"
              className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
            Verified only
          </label>
          <div className="flex flex-wrap gap-1">
            {['Python', 'React', 'TypeScript', 'Flask', 'pytest'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSkill(s)}
                className="rounded-full border border-border px-2.5 py-1 text-xs font-medium hover:border-teal hover:text-teal"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-3">
        {candidates.map(({ student, projs, skills, hasVerified }) => (
          <Card key={student.id} className="!p-0 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal text-sm font-bold text-white">
                  {student.avatarInitials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-ink">{student.name}</h3>
                    {hasVerified && (
                      <Badge tone="green">
                        <BadgeCheck className="h-3 w-3" /> Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-ink-muted">
                    {student.title} · {student.location}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {skills.map((s) => (
                      <span key={s} className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Button size="sm" to={`/recruiter/candidates/${student.id}`}>
                View evidence
              </Button>
            </div>
            <div className="border-t border-border bg-surface-2 px-5 py-3 text-xs text-ink-muted">
              Projects:{' '}
              {projs.map((p, i) => (
                <span key={p.id}>
                  {i > 0 && ' · '}
                  <Link className="text-teal hover:underline" to={`/share/${p.shareId}`}>
                    {p.title}
                  </Link>
                </span>
              ))}
            </div>
          </Card>
        ))}
        {candidates.length === 0 && (
          <p className="py-12 text-center text-sm text-ink-muted">No candidates match this filter.</p>
        )}
      </div>
    </div>
  )
}
