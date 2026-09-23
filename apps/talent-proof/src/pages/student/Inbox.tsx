import { Check, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getPersona } from '../../data/personas'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'

export function StudentInbox() {
  const { activePersona, contacts, respondContact } = useApp()
  const mine = contacts.filter((c) => c.studentId === activePersona.id)

  return (
    <div className="animate-slide-up mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
        <p className="mt-1 text-sm text-ink-muted">Recruiter contact requests — accept or reject</p>
      </div>
      <Card>
        <CardHeader title="Requests" subtitle={`${mine.filter((c) => c.status === 'pending').length} pending`} />
        {mine.length === 0 && <p className="py-8 text-center text-sm text-ink-muted">No requests yet.</p>}
        <div className="space-y-3">
          {mine.map((c) => {
            const rec = getPersona(c.recruiterId)
            return (
              <div key={c.id} className="rounded-xl border border-border bg-canvas p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-xs font-bold text-white">
                      {rec.avatarInitials}
                    </div>
                    <div>
                      <div className="font-semibold">{rec.name}</div>
                      <div className="text-xs text-ink-muted">
                        {rec.title} · {rec.company}
                      </div>
                      <Badge tone="teal" className="mt-2">
                        Focus: {c.skillFocus}
                      </Badge>
                    </div>
                  </div>
                  <Badge tone={c.status === 'pending' ? 'amber' : c.status === 'accepted' ? 'green' : 'red'}>
                    {c.status}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-ink-muted">{c.message}</p>
                <p className="mt-2 text-[11px] text-ink-faint">
                  {new Date(c.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Calcutta' })} IST
                </p>
                {c.status === 'pending' && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={() => respondContact(c.id, 'accepted')}>
                      <Check className="h-3.5 w-3.5" /> Accept
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => respondContact(c.id, 'rejected')}>
                      <X className="h-3.5 w-3.5" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
