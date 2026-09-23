import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Banner } from '../../components/ui/Banner'
import { personas } from '../../data/personas'
import { useApp } from '../../context/AppContext'

export function Login() {
  const { switchPersona } = useApp()
  const nav = useNavigate()
  const [email, setEmail] = useState(personas[0].email)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const match = personas.find((p) => p.email === email) ?? personas[0]
    switchPersona(match.id)
    nav(match.role === 'recruiter' ? '/recruiter' : '/student')
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold">Sign in to TALENT PROOF</h1>
          <p className="mt-1 text-sm text-ink-muted">Auth theater — pick a demo persona email</p>
        </div>
        <Card>
          <Banner tone="demo" title="Login theater">
            No real authentication. Selecting a demo email switches persona and role.
          </Banner>
          <form className="mt-4 space-y-3" onSubmit={submit}>
            <label className="block text-left text-xs font-semibold text-ink-muted">
              Email
              <select
                className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              >
                {personas.map((p) => (
                  <option key={p.id} value={p.email}>
                    {p.email} ({p.role})
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-left text-xs font-semibold text-ink-muted">
              Password
              <input
                type="password"
                defaultValue="demo-password"
                className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
              />
            </label>
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-ink-muted">
            New here? <Link to="/signup" className="font-semibold text-teal">Create account theater</Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
