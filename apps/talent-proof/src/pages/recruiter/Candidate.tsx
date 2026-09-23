import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BadgeCheck } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getPersona } from '../../data/personas'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Banner } from '../../components/ui/Banner'
import { ProjectStatusPill } from '../../components/shared/StatusPill'

export function CandidatePage() {
  const { id } = useParams()
  const { projects, activePersona, requestContact, contacts } = useApp()
  const student = id ? getPersona(id) : null
  const projs = projects.filter((p) => p.studentId === id)
  const [message, setMessage] = useState('')
  const [skillFocus, setSkillFocus] = useState(projs[0]?.skillTags[0] || 'General')
  const [sent, setSent] = useState(false)

  if (!student || student.role !== 'student') {
    return <p className="text-sm text-ink-muted">Candidate not found.</p>
  }

  const already = contacts.some(
    (c) => c.studentId === student.id && c.recruiterId === activePersona.id && c.status === 'pending',
  )

  const send = () => {
    requestContact({
      recruiterId: activePersona.id,
      studentId: student.id,
      message:
        message ||
        `Hi ${student.name.split(' ')[0]} — interested in your verified work. Let's connect about roles at ${activePersona.company}.`,
      skillFocus,
    })
    setSent(true)
  }

  return (
    <div className="animate-slide-up space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal text-xl font-bold text-white">
            {student.avatarInitials}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{student.name}</h1>
            <p className="text-sm text-ink-muted">
              {student.title} · {student.school} · {student.location}
            </p>
            <p className="mt-2 max-w-xl text-sm text-ink-muted">{student.bio}</p>
          </div>
        </div>
        <Button variant="secondary" to="/recruiter">
          Back
        </Button>
      </div>

      <Card>
        <CardHeader title="Projects & evidence" />
        <div className="space-y-3">
          {projs.map((p) => (
            <div key={p.id} className="rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold">{p.title}</div>
                <ProjectStatusPill status={p.status} />
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {p.skillTags.map((t) => (
                  <Badge key={t} tone="teal">
                    {t}
                  </Badge>
                ))}
              </div>
              <p className="mt-2 text-xs text-ink-muted">{p.contribution}</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" to={`/share/${p.shareId}`}>
                  Public share
                </Button>
                {p.status === 'verified' && (
                  <Badge tone="green">
                    <BadgeCheck className="h-3 w-3" /> Verified evidence
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Request contact" subtitle="Student accepts/rejects in their inbox" />
        {already || sent ? (
          <Banner tone="demo" title="Request sent">
            Pending in {student.name}&apos;s inbox. Switch persona to accept/reject.
          </Banner>
        ) : (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-ink-muted">
              Skill focus
              <select
                value={skillFocus}
                onChange={(e) => setSkillFocus(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              >
                {[...new Set(projs.flatMap((p) => p.skillTags))].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-semibold text-ink-muted">
              Message
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Why you're reaching out…"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </label>
            <Button onClick={send}>Send contact request</Button>
          </div>
        )}
        <p className="mt-3 text-xs text-ink-faint">
          Tip: after sending, switch header persona to {student.name} → Inbox.{' '}
          <Link to="/student/inbox" className="text-teal underline">
            Open inbox route
          </Link>
        </p>
      </Card>
    </div>
  )
}
