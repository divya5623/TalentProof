import { useApp } from '../../context/AppContext'
import { getPersona } from '../../data/personas'
import { Card, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

export function RecruiterRequests() {
  const { contacts, activePersona } = useApp()
  const mine = contacts.filter((c) => c.recruiterId === activePersona.id)

  return (
    <div className="animate-slide-up mx-auto max-w-2xl space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contact requests</h1>
          <p className="mt-1 text-sm text-ink-muted">Sent from {activePersona.name}</p>
        </div>
        <Button variant="secondary" size="sm" to="/recruiter">
          Discover
        </Button>
      </div>
      <Card>
        <CardHeader title="Outbound" />
        {mine.length === 0 && <p className="py-8 text-center text-sm text-ink-muted">No requests sent yet.</p>}
        <div className="space-y-3">
          {mine.map((c) => {
            const stu = getPersona(c.studentId)
            return (
              <div key={c.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{stu.name}</div>
                  <Badge tone={c.status === 'pending' ? 'amber' : c.status === 'accepted' ? 'green' : 'red'}>
                    {c.status}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-ink-muted">Focus: {c.skillFocus}</p>
                <p className="mt-2 text-sm text-ink-muted">{c.message}</p>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
