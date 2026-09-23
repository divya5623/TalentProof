import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  FolderGit2,
  Loader2,
  Star,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp, useActivePersona, useJourney } from '../context/AppContext'
import { getRepos } from '../data/evidence'
import { wait } from '../lib/theater'
import type { GithubRepo } from '../types'

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3776AB',
  CSS: '#563D7C',
  SQL: '#E38C00',
  Shell: '#89E051',
  Dart: '#00B4AB',
  Kotlin: '#A97BFF',
  HTML: '#E34F26',
  MDX: '#F9AC00',
  Jupyter: '#F37626',
  Dockerfile: '#2496ED',
  YAML: '#CB171E',
  Markdown: '#083FA1',
  Other: '#A1A1AA',
}

const LOW_OWNERSHIP = 40

type ConnectPhase = 'idle' | 'connecting' | 'connected'

function LanguageBar({ languages }: { languages: GithubRepo['languages'] }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-canvas">
      <div className="flex h-full w-full">
        {languages.map((lang) => (
          <div
            key={lang.name}
            title={`${lang.name} ${lang.pct}%`}
            style={{
              width: `${lang.pct}%`,
              backgroundColor: LANG_COLORS[lang.name] ?? LANG_COLORS.Other,
            }}
            className="h-full"
          />
        ))}
      </div>
    </div>
  )
}

export function GitHubEvidence() {
  const persona = useActivePersona()
  const journey = useJourney()
  const { dispatch, toast, ui } = useApp()
  const navigate = useNavigate()

  const repos = useMemo(() => getRepos(persona.id), [persona.id])

  const [phase, setPhase] = useState<ConnectPhase>(() =>
    journey.githubConnected || ui.githubConnectPhase === 'connected'
      ? 'connected'
      : 'idle',
  )
  const [busy, setBusy] = useState(false)
  const [included, setIncluded] = useState<Set<string>>(() => {
    if (journey.includedRepoIds.length > 0) {
      return new Set(journey.includedRepoIds)
    }
    return new Set(repos.filter((r) => r.primaryL2 || r.authorshipPct >= 60).map((r) => r.id))
  })

  useEffect(() => {
    if (journey.githubConnected) {
      setPhase('connected')
      setIncluded(
        new Set(
          journey.includedRepoIds.length > 0
            ? journey.includedRepoIds
            : repos.filter((r) => r.primaryL2).map((r) => r.id),
        ),
      )
      return
    }
    setPhase(ui.githubConnectPhase === 'connected' ? 'connected' : 'idle')
    setIncluded(
      new Set(repos.filter((r) => r.primaryL2 || r.authorshipPct >= 60).map((r) => r.id)),
    )
  }, [persona.id, journey.githubConnected, journey.includedRepoIds, repos, ui.githubConnectPhase])

  const lowOwnershipIncluded = repos.filter(
    (r) => included.has(r.id) && r.authorshipPct < LOW_OWNERSHIP,
  )

  async function connect() {
    if (busy) return
    setBusy(true)
    try {
      setPhase('connecting')
      dispatch({ type: 'SET_UI', patch: { githubConnectPhase: 'connecting' } })
      await wait(1500)
      setPhase('connected')
      dispatch({ type: 'SET_UI', patch: { githubConnectPhase: 'connected' } })
      toast(`Connected as @${persona.githubHandle}`, 'success')
    } finally {
      setBusy(false)
    }
  }

  function toggleRepo(id: string) {
    setIncluded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function continueConnect() {
    if (included.size === 0) {
      toast('Include at least one repository.', 'warning')
      return
    }
    if (lowOwnershipIncluded.length > 0) {
      toast(
        `Warning: ${lowOwnershipIncluded.map((r) => r.name).join(', ')} under ${LOW_OWNERSHIP}% authorship.`,
        'warning',
      )
    }
    dispatch({
      type: 'CONNECT_GITHUB',
      includedRepoIds: [...included],
    })
    toast('GitHub evidence saved. Honesty Map unlocked.', 'success')
    navigate('/reconcile')
  }

  return (
    <div className="mx-auto max-w-[960px] space-y-8 animate-fade-up">
      <header className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          Evidence · GitHub
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Connect GitHub ownership
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          Mock OAuth connects your handle and surfaces repo ownership. Include repos for L2
          project audits — low authorship (&lt;{LOW_OWNERSHIP}%) is flagged.
        </p>
      </header>

      {phase === 'idle' && (
        <section className="rounded-2xl border border-line bg-card p-8 shadow-card text-center md:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-canvas text-ink">
            <FolderGit2 className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-ink">Connect GitHub</h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-muted">
            Demo theater — no real OAuth. We load @{persona.githubHandle}&apos;s mock repos
            after a short delay.
          </p>
          <button
            type="button"
            onClick={() => void connect()}
            disabled={busy}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0] disabled:opacity-50"
          >
            <FolderGit2 className="h-4 w-4" />
            Connect GitHub
          </button>
        </section>
      )}

      {phase === 'connecting' && (
        <section className="rounded-2xl border border-line bg-card p-10 shadow-card text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
          <p className="mt-4 text-[15px] font-semibold text-ink">Connecting to GitHub…</p>
          <p className="mt-1 text-[13px] text-muted">Resolving ownership map for mock repos.</p>
        </section>
      )}

      {phase === 'connected' && (
        <>
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-card px-5 py-4 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white">
              <FolderGit2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-ink">@{persona.githubHandle}</p>
              <p className="text-[12px] text-muted">
                Connected · {repos.length} repos · {included.size} included
              </p>
            </div>
            {journey.githubConnected && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-accent/25 bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent">
                <Check className="h-3 w-3" strokeWidth={3} />
                Saved
              </span>
            )}
          </div>

          {lowOwnershipIncluded.length > 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-[#FFFBEB] px-4 py-3 text-[13px] text-ink">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <p>
                Low ownership (&lt;{LOW_OWNERSHIP}%):{' '}
                <span className="font-semibold">
                  {lowOwnershipIncluded.map((r) => r.name).join(', ')}
                </span>
                . L2 audits may fail authorship gates.
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {repos.map((repo) => {
              const selected = included.has(repo.id)
              const low = repo.authorshipPct < LOW_OWNERSHIP
              const highlight =
                persona.id === 'aarav' && repo.id === 'shopkart-ecommerce'
              return (
                <article
                  key={repo.id}
                  className={`rounded-2xl border bg-card p-5 shadow-card transition ${
                    highlight
                      ? 'border-accent/40 ring-2 ring-accent/15'
                      : selected
                        ? 'border-accent/30'
                        : 'border-line'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-[15px] font-semibold text-ink">
                          {repo.name}
                        </h3>
                        {repo.primaryL2 && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                            <Star className="h-2.5 w-2.5" fill="currentColor" />
                            Primary L2
                          </span>
                        )}
                        {highlight && (
                          <span className="rounded-md bg-canvas px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                            Demo path
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                        {repo.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <LanguageBar languages={repo.languages} />
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted">
                      {repo.languages.map((lang) => (
                        <span key={lang.name} className="inline-flex items-center gap-1">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor: LANG_COLORS[lang.name] ?? LANG_COLORS.Other,
                            }}
                          />
                          {lang.name} {lang.pct}%
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                        Authorship
                      </p>
                      <p
                        className={`text-[18px] font-semibold tabular-nums ${
                          low ? 'text-[#B45309]' : 'text-ink'
                        }`}
                      >
                        {repo.authorshipPct}%
                      </p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-[12px] font-semibold text-ink transition hover:bg-canvas">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleRepo(repo.id)}
                        className="h-3.5 w-3.5 rounded border-line accent-[#6D4AFF]"
                      />
                      Include in verification
                    </label>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="sticky bottom-4 z-20">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white/95 px-5 py-4 shadow-lift backdrop-blur">
              <div>
                <p className="text-[13px] font-semibold text-ink">
                  {included.size} repo{included.size === 1 ? '' : 's'} selected
                </p>
                <p className="text-[12px] text-muted">
                  Continue saves inclusion and unlocks Honesty Map.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/evidence/resume"
                  className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas"
                >
                  Back to resume
                </Link>
                <button
                  type="button"
                  onClick={continueConnect}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
