import {
  Award,
  ClipboardCheck,
  FileText,
  FolderGit2,
  Home,
  Lock,
  Scale,
  Settings,
  Sparkles,
  User,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { isStepUnlocked, lockReason } from '../lib/journey'
import type { JourneyStep } from '../types'
import { PersonaSwitcher } from './PersonaSwitcher'

const journeyNav: {
  to: string
  label: string
  icon: typeof Home
  end?: boolean
  step?: JourneyStep
}[] = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/onboarding', label: 'Onboarding', icon: Sparkles, step: 'onboarding' },
  { to: '/claims', label: 'Claims', icon: FileText, step: 'claims' },
  { to: '/evidence/resume', label: 'Resume', icon: FileText, step: 'evidence' },
  { to: '/evidence/github', label: 'GitHub', icon: FolderGit2, step: 'evidence' },
  { to: '/reconcile', label: 'Reconcile', icon: Scale, step: 'reconcile' },
  { to: '/exams', label: 'Exams', icon: ClipboardCheck, step: 'exams' },
  { to: '/projects', label: 'Projects', icon: FolderGit2, step: 'projects' },
  { to: '/certificate', label: 'Certificate', icon: Award, step: 'certificate' },
]

const secondary = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const

export function Sidebar() {
  const { persona, journey, toast } = useApp()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col border-r border-line bg-white">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3.5 8.25L6.5 11.25L12.5 4.75"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-bold tracking-[0.18em] text-ink">VERIFIED</p>
            <p className="text-[10px] font-medium tracking-wide text-muted">Candidate</p>
          </div>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-muted">
          Don&apos;t trust the claim. Verify the skill.
        </p>
        <div className="mt-3 inline-flex items-center rounded-full border border-line bg-canvas px-2.5 py-1 text-[10px] font-semibold text-ink">
          Track: {persona.trackTitle.replace(/^Verified\s+/i, '')}
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        <div className="space-y-0.5">
          {journeyNav.map((item) => {
            const locked = item.step
              ? !isStepUnlocked(item.step, journey, persona)
              : false
            const reason = item.step ? lockReason(item.step, journey, persona) : ''
            return (
              <SideLink
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
                end={item.end}
                locked={locked}
                lockTitle={reason || 'Complete prior steps to unlock'}
                onLockedClick={() => toast(reason || 'Complete prior steps to unlock', 'info')}
              />
            )
          })}
        </div>
        <div>
          <div className="mx-2 mb-2 border-t border-line" />
          <div className="space-y-0.5">
            {secondary.map((item) => (
              <SideLink key={item.to} {...item} />
            ))}
          </div>
        </div>
      </nav>

      <div className="border-t border-line p-4">
        <PersonaSwitcher />
      </div>
    </aside>
  )
}

function SideLink({
  to,
  label,
  icon: Icon,
  end,
  locked,
  lockTitle,
  onLockedClick,
}: {
  to: string
  label: string
  icon: typeof Home
  end?: boolean
  locked?: boolean
  lockTitle?: string
  onLockedClick?: () => void
}) {
  return (
    <NavLink
      to={to}
      end={end}
      title={locked ? lockTitle : undefined}
      onClick={(e) => {
        if (locked) {
          e.preventDefault()
          onLockedClick?.()
        }
      }}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition ${
          locked
            ? 'cursor-not-allowed text-muted/70'
            : isActive
              ? 'bg-accent-soft text-accent'
              : 'text-muted hover:bg-canvas hover:text-ink'
        }`
      }
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      <span className="flex-1 truncate">{label}</span>
      {locked && <Lock className="h-3 w-3 shrink-0 opacity-50" strokeWidth={2} />}
    </NavLink>
  )
}
