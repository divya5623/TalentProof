import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { Banner } from '../../components/ui/Banner'
import { useApp } from '../../context/AppContext'

const SKILL_OPTS = ['Python', 'Flask', 'SQL', 'pytest', 'TypeScript', 'React', 'Vite', 'Tailwind', 'Node.js', 'Git']

export function StudentProfile() {
  const { activePersona } = useApp()
  const nav = useNavigate()
  const [skills, setSkills] = useState<string[]>(activePersona.skills)
  const [bio, setBio] = useState(activePersona.bio)
  const [saved, setSaved] = useState(false)

  const toggle = (s: string) =>
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))

  return (
    <div className="animate-slide-up mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Technical profile</h1>
        <p className="mt-1 text-sm text-ink-muted">Shown to recruiters alongside verified evidence</p>
      </div>
      <Banner tone="demo" title="Profile theater">
        Edits stay in-session for this demo persona ({activePersona.name}).
      </Banner>
      <Card>
        <CardHeader title="Basics" />
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-ink-muted">
            Name
            <input readOnly value={activePersona.name} className="mt-1 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs font-semibold text-ink-muted">
            Email
            <input readOnly value={activePersona.email} className="mt-1 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs font-semibold text-ink-muted sm:col-span-2">
            Title
            <input readOnly value={activePersona.title} className="mt-1 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs font-semibold text-ink-muted sm:col-span-2">
            Bio
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </label>
        </div>
      </Card>
      <Card>
        <CardHeader title="Skills" subtitle="Select what you want to prove with projects" />
        <div className="flex flex-wrap gap-2">
          {SKILL_OPTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                skills.includes(s) ? 'border-teal bg-teal-light text-teal' : 'border-border bg-white text-ink-muted'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Card>
      <div className="flex justify-end gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            setSaved(true)
            setTimeout(() => nav('/student'), 600)
          }}
        >
          {saved ? 'Saved ✓' : 'Save & continue'}
        </Button>
        <Button to="/student/submit">Submit a project</Button>
      </div>
    </div>
  )
}
