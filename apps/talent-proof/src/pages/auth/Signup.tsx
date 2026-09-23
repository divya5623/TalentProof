import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Banner } from '../../components/ui/Banner'
import { useApp } from '../../context/AppContext'

export function Signup() {
  const { switchPersona } = useApp()
  const nav = useNavigate()
  const [role, setRole] = useState<'student' | 'recruiter'>('student')
  const [name, setName] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    switchPersona(role === 'recruiter' ? 'rec-jordan' : 'stu-alex')
    nav(role === 'recruiter' ? '/recruiter' : '/student/profile')
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-lg animate-slide-up">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold">Create your Talent Proof profile</h1>
          <p className="mt-1 text-sm text-ink-muted">Signup theater → technical profile</p>
        </div>
        <Card>
          <Banner tone="demo" title="Signup is simulated">
            Submitting maps you onto a demo persona so the full spine stays clickable.
          </Banner>
          <form className="mt-4 space-y-3" onSubmit={submit}>
            <div className="grid grid-cols-2 gap-2">
              {(['student', 'recruiter'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold capitalize ${
                    role === r ? 'border-teal bg-teal-light text-teal' : 'border-border bg-white text-ink-muted'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <label className="block text-left text-xs font-semibold text-ink-muted">
              Full name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-left text-xs font-semibold text-ink-muted">
              Email
              <input
                required
                type="email"
                placeholder="you@school.edu"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </label>
            {role === 'student' ? (
              <label className="block text-left text-xs font-semibold text-ink-muted">
                School / program
                <input
                  placeholder="University · CS Year 3"
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </label>
            ) : (
              <label className="block text-left text-xs font-semibold text-ink-muted">
                Company
                <input
                  placeholder="Meridian Labs"
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </label>
            )}
            <Button type="submit" className="w-full">
              Continue to {role === 'student' ? 'technical profile' : 'discover'}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-ink-muted">
            Have an account? <Link to="/login" className="font-semibold text-teal">Sign in</Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
