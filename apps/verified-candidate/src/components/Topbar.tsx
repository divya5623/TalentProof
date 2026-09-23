import { Bell, ExternalLink } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { JourneySpine } from './JourneySpine'

const STEP_LABELS: Record<string, { label: string; index: number }> = {
  '/': { label: 'Home', index: 0 },
  '/onboarding': { label: 'Onboarding', index: 0 },
  '/claims': { label: 'Claims', index: 1 },
  '/evidence/resume': { label: 'Resume evidence', index: 2 },
  '/evidence/github': { label: 'GitHub evidence', index: 2 },
  '/reconcile': { label: 'Honesty Map', index: 3 },
  '/exams': { label: 'L1 Exams', index: 4 },
  '/projects': { label: 'L2 Projects', index: 5 },
  '/certificate': { label: 'Certificate', index: 6 },
  '/profile': { label: 'Recruiter preview', index: 0 },
  '/settings': { label: 'Settings', index: 0 },
}

function resolveStep(pathname: string) {
  if (pathname.startsWith('/exams/')) return { label: 'Exam room', index: 4 }
  if (pathname.startsWith('/projects/')) return { label: 'Project audit', index: 5 }
  return STEP_LABELS[pathname] ?? { label: 'Journey', index: 0 }
}

function overallLabel(
  overall: number | null,
  journeyHasProgress: boolean,
): string {
  if (overall != null) return String(Math.round(overall))
  if (journeyHasProgress) return 'In progress'
  return 'Not scored yet'
}

export function Topbar() {
  const { pathname } = useLocation()
  const { toast, score, journey } = useApp()
  const step = resolveStep(pathname)

  const journeyHasProgress =
    journey.claimedSkillIds.length > 0 ||
    journey.resumeAttached ||
    journey.githubConnected ||
    Object.keys(journey.examResults).length > 0 ||
    Object.keys(journey.projectResults).length > 0

  const overall = overallLabel(score.overall, journeyHasProgress)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-line bg-white/90 px-8 backdrop-blur-sm">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold text-ink">{step.label}</p>
          <JourneySpine currentIndex={step.index} variant="compact" />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden rounded-xl border border-line bg-canvas px-3 py-1.5 sm:block">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted">Overall</p>
          <p
            className={`text-sm font-bold text-ink ${
              score.overall == null ? 'text-[11px] font-semibold text-muted' : ''
            }`}
          >
            {overall}
          </p>
        </div>

        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[12px] font-semibold text-ink transition hover:border-accent hover:text-accent"
        >
          Recruiter preview
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        <button
          type="button"
          className="relative rounded-lg p-2.5 text-muted transition hover:bg-canvas hover:text-ink"
          aria-label="Notifications"
          onClick={() =>
            toast('Journey tip: complete Claims, then attach resume + GitHub.', 'info')
          }
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
      </div>
    </header>
  )
}
