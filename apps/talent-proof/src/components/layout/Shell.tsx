import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Award,
  Briefcase,
  ChevronDown,
  Grid3X3,
  Inbox,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Upload,
} from 'lucide-react'
import { personas } from '../../data/personas'
import { useApp } from '../../context/AppContext'
import { Badge } from '../ui/Badge'

const studentNav = [
  { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/student/submit', label: 'Submit project', icon: Upload },
  { to: '/student/inbox', label: 'Inbox', icon: Inbox },
  { to: '/tech-matrix', label: 'Tech matrix', icon: Grid3X3 },
]

const recruiterNav = [
  { to: '/recruiter', label: 'Discover', icon: Search, end: true },
  { to: '/recruiter/requests', label: 'Requests', icon: Briefcase },
  { to: '/tech-matrix', label: 'Tech matrix', icon: Grid3X3 },
]

export function Shell() {
  const { role, activePersona, switchPersona, contacts } = useApp()
  const loc = useLocation()
  const isAuth = loc.pathname.startsWith('/login') || loc.pathname.startsWith('/signup')
  const isShare = loc.pathname.startsWith('/share')
  const isAssessment = loc.pathname.includes('/assessment')
  const isLanding = loc.pathname === '/'

  if (isAuth || isShare || isAssessment || isLanding) {
    return <Outlet />
  }

  const nav = role === 'recruiter' ? recruiterNav : studentNav
  const pendingInbox =
    role === 'student'
      ? contacts.filter((c) => c.studentId === activePersona.id && c.status === 'pending').length
      : 0

  return (
    <div className="min-h-svh bg-canvas">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal text-white">
              <ShieldCheck className="h-4.5 w-4.5" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-wide text-ink">TALENT PROOF</div>
              <div className="hidden text-[10px] text-ink-faint sm:block">Prove · Trust · Discover</div>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    isActive ? 'bg-teal-light text-teal' : 'text-ink-muted hover:bg-stone-100 hover:text-ink'
                  }`
                }
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
                {item.to === '/student/inbox' && pendingInbox > 0 && (
                  <span className="ml-1 rounded-full bg-teal px-1.5 text-[10px] font-bold text-white">
                    {pendingInbox}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Badge tone="teal">
              <Award className="h-3 w-3" />
              Demo MVP
            </Badge>
            <div className="relative">
              <select
                aria-label="Switch demo persona"
                className="appearance-none rounded-lg border border-border bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-teal/30"
                value={activePersona.id}
                onChange={(e) => switchPersona(e.target.value)}
              >
                {personas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {p.role}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-xs font-bold text-white">
              {activePersona.avatarInitials}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-ink-faint">
        TALENT PROOF · Hackathon MVP · Sandbox / OAuth / live LLM labeled as theater where simulated
      </footer>
    </div>
  )
}
