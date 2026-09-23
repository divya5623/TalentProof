import { useMemo } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  FolderGit2,
  Lock,
  Sparkles,
  Target,
  XCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { MetricCard } from '../components/MetricCard'
import { SkillChip } from '../components/SkillChip'
import { useActivePersona, useJourney } from '../context/AppContext'
import { getRepos } from '../data/evidence'
import { getProject } from '../data/projects'
import { getSkill } from '../data/skillsCatalog'
import type { GithubRepo, JourneyProgress } from '../types'

type LobbyStatus = 'eligible' | 'passed' | 'failed' | 'no-blueprint' | 'low-authorship'

interface RepoCardModel {
  repo: GithubRepo
  status: LobbyStatus
  composite?: number
  authorship: number
  stackMatched: string[]
  stackMissing: string[]
  highlighted: boolean
  hasBlueprint: boolean
}

function resolveStatus(
  repoId: string,
  hasBlueprint: boolean,
  authorship: number,
  projectResults: JourneyProgress['projectResults'],
): LobbyStatus {
  const result = projectResults[repoId]
  if (result?.status === 'passed') return 'passed'
  if (result?.status === 'failed') return 'failed'
  if (!hasBlueprint) return 'no-blueprint'
  if (authorship < 40) return 'low-authorship'
  return 'eligible'
}

const statusStyles: Record<
  LobbyStatus,
  { label: string; chip: string; icon: typeof Lock }
> = {
  eligible: {
    label: 'Eligible',
    chip: 'bg-accent-soft text-accent border-accent/20',
    icon: Target,
  },
  passed: {
    label: 'Passed',
    chip: 'bg-verified-soft/70 text-verified border-verified/20',
    icon: CheckCircle2,
  },
  failed: {
    label: 'Failed',
    chip: 'bg-red-50 text-danger border-danger/20',
    icon: XCircle,
  },
  'no-blueprint': {
    label: 'Evidence only',
    chip: 'bg-canvas text-muted border-line',
    icon: FolderGit2,
  },
  'low-authorship': {
    label: 'Low authorship',
    chip: 'bg-amber-50 text-warning border-warning/30',
    icon: Lock,
  },
}

export function ProjectsLobby() {
  const persona = useActivePersona()
  const journey = useJourney()

  const claimed = useMemo(
    () => new Set(journey.claimedSkillIds),
    [journey.claimedSkillIds],
  )

  const cards: RepoCardModel[] = useMemo(() => {
    const allRepos = getRepos(persona.id)
    const included = new Set(journey.includedRepoIds)
    const list = allRepos.filter((r) => included.has(r.id))
    // Prefer primary L2 first, then by authorship
    list.sort((a, b) => {
      if (a.primaryL2 !== b.primaryL2) return a.primaryL2 ? -1 : 1
      return b.authorshipPct - a.authorshipPct
    })

    return list.map((repo) => {
      const def = getProject(repo.id)
      const hasBlueprint = Boolean(def)
      const stackIds = def?.stackMatchSkillIds ?? []
      const stackMatched = stackIds.filter((id) => claimed.has(id))
      const stackMissing = stackIds.filter((id) => !claimed.has(id))
      const status = resolveStatus(
        repo.id,
        hasBlueprint,
        repo.authorshipPct,
        journey.projectResults,
      )
      const result = journey.projectResults[repo.id]
      const highlighted =
        repo.id === 'shopkart-ecommerce' || (persona.id === 'aarav' && repo.primaryL2)
      return {
        repo,
        status,
        composite: result?.composite,
        authorship: result?.authorship ?? repo.authorshipPct,
        stackMatched,
        stackMissing,
        highlighted,
        hasBlueprint,
      }
    })
  }, [
    persona.id,
    journey.includedRepoIds,
    journey.projectResults,
    claimed,
  ])

  const passedCount = cards.filter((c) => c.status === 'passed').length
  const eligibleCount = cards.filter((c) => c.status === 'eligible').length
  const corePassed = persona.coreSkillIds.filter(
    (id) => journey.examResults[id]?.status === 'passed',
  ).length
  const allCores = corePassed === persona.coreSkillIds.length

  return (
    <div className="mx-auto max-w-[1040px] space-y-8 animate-fade-up">
      <header className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          L2 Projects
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Project verification lobby
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          Audit included GitHub repos for authorship and architecture. Pass requires
          composite ≥ <span className="font-semibold text-ink">70</span> and authorship ≥{' '}
          <span className="font-semibold text-ink">40%</span>. One in-track L2 pass
          unlocks Pro when all core L1s are done.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="L2 passed"
          value={String(passedCount)}
          hint="In-track audits complete"
          tone={passedCount > 0 ? 'verified' : 'muted'}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <MetricCard
          label="Eligible now"
          value={String(eligibleCount)}
          hint="Ready to open audit"
          tone="accent"
          icon={<Target className="h-4 w-4" />}
        />
        <MetricCard
          label="Core L1"
          value={`${corePassed}/${persona.coreSkillIds.length}`}
          hint={allCores ? 'Pro gate L1 ready' : 'Need all cores for Pro'}
          tone={allCores ? 'verified' : 'default'}
          icon={<Sparkles className="h-4 w-4" />}
        />
      </div>

      {cards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-card px-6 py-12 text-center shadow-card">
          <FolderGit2 className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-3 text-sm font-semibold text-ink">No included repos</p>
          <p className="mt-1 text-[13px] text-muted">
            Connect GitHub and include repos in Evidence before auditing.
          </p>
          <Link
            to="/evidence/github"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            Open GitHub evidence
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => {
            const meta = statusStyles[card.status]
            const StatusIcon = meta.icon
            const canAudit =
              card.hasBlueprint &&
              (card.status === 'eligible' ||
                card.status === 'passed' ||
                card.status === 'failed')
            const highlightRing = card.highlighted
              ? 'ring-2 ring-accent/30 border-accent/25'
              : ''

            return (
              <article
                key={card.repo.id}
                className={`flex flex-col rounded-2xl border border-line bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-accent/15 hover:shadow-lift ${highlightRing}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-semibold tracking-tight text-ink">
                        {card.repo.name}
                      </h2>
                      {card.repo.primaryL2 ? (
                        <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                          Primary L2
                        </span>
                      ) : null}
                      {card.highlighted ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                          <Sparkles className="h-3 w-3 text-accent" />
                          Demo highlight
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">
                      {card.repo.description}
                    </p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${meta.chip}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {meta.label}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-[12px] text-muted">
                  <span className="font-semibold tabular-nums text-ink">
                    Authorship {card.authorship}%
                  </span>
                  {typeof card.composite === 'number' ? (
                    <span
                      className={`font-semibold tabular-nums ${
                        card.status === 'passed'
                          ? 'text-verified'
                          : card.status === 'failed'
                            ? 'text-danger'
                            : 'text-ink'
                      }`}
                    >
                      Composite {card.composite}%
                    </span>
                  ) : null}
                  <span>
                    {card.repo.languages
                      .slice(0, 3)
                      .map((l) => l.name)
                      .join(' · ')}
                  </span>
                </div>

                {card.stackMatched.length + card.stackMissing.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {card.stackMatched.map((id) => (
                      <SkillChip
                        key={id}
                        name={getSkill(id)?.name ?? id}
                        variant="claimed"
                      />
                    ))}
                    {card.stackMissing.map((id) => (
                      <SkillChip
                        key={id}
                        name={getSkill(id)?.name ?? id}
                        variant="self-reported"
                      />
                    ))}
                  </div>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
                  {canAudit ? (
                    <Link
                      to={`/projects/${card.repo.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
                    >
                      {card.status === 'passed'
                        ? 'Review audit'
                        : card.status === 'failed'
                          ? 'Retake audit'
                          : 'Open audit'}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : card.status === 'low-authorship' ? (
                    <p className="text-[13px] text-muted">
                      Authorship below 40% — not eligible for L2 pass on this repo.
                    </p>
                  ) : (
                    <p className="text-[13px] text-muted">
                      Supporting evidence only — no L2 architecture blueprint.
                    </p>
                  )}
                </div>
              </article>
            )
          })}
        </section>
      )}

      {persona.id === 'aarav' && cards.some((c) => c.repo.id === 'shopkart-ecommerce') ? (
        <div className="rounded-2xl border border-accent/15 bg-accent-soft/40 px-5 py-4">
          <p className="text-sm font-semibold text-ink">90s demo path</p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            Highlighted <span className="font-semibold text-ink">shopkart-ecommerce</span>{' '}
            is Aarav&apos;s primary L2. After core L1s, submit the audit with demo
            architecture answers to unlock Pro celebration.
          </p>
        </div>
      ) : null}
    </div>
  )
}
