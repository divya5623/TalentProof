import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Search, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SkillChip } from '../components/SkillChip'
import { useApp, useActivePersona, useJourney } from '../context/AppContext'
import { skillsByTrack } from '../data/skillsCatalog'

const MAX_CLAIMS_SOFT = 12

export function Claims() {
  const persona = useActivePersona()
  const journey = useJourney()
  const { dispatch, toast } = useApp()
  const navigate = useNavigate()

  const catalog = useMemo(() => skillsByTrack(persona.trackId), [persona.trackId])
  const coreSkills = catalog.filter((s) => s.core)
  const additionalSkills = catalog.filter((s) => !s.core)

  const [selected, setSelected] = useState<string[]>(() => [...journey.claimedSkillIds])
  const [query, setQuery] = useState('')

  useEffect(() => {
    setSelected([...journey.claimedSkillIds])
    setQuery('')
  }, [persona.id, journey.claimedSkillIds])

  const selectedSet = useMemo(() => new Set(selected), [selected])
  const coreSelected = persona.coreSkillIds.filter((id) => selectedSet.has(id)).length
  const overClaim = selected.length > MAX_CLAIMS_SOFT

  const dirty =
    selected.length !== journey.claimedSkillIds.length ||
    selected.some((id) => !journey.claimedSkillIds.includes(id))

  function matchesQuery(name: string) {
    if (!query.trim()) return true
    return name.toLowerCase().includes(query.trim().toLowerCase())
  }

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function selectAllCore() {
    setSelected((prev) => {
      const next = new Set(prev)
      persona.coreSkillIds.forEach((id) => next.add(id))
      return [...next]
    })
  }

  function save() {
    if (selected.length === 0) {
      toast('Select at least one skill to continue.', 'warning')
      return
    }
    dispatch({ type: 'SET_CLAIMS', skillIds: selected })
    toast(
      overClaim
        ? `Saved ${selected.length} claims (consider focusing — over 12). Evidence unlocked.`
        : `Saved ${selected.length} skill claims. Evidence unlocked.`,
      overClaim ? 'warning' : 'success',
    )
    navigate('/evidence/resume')
  }

  const filteredCore = coreSkills.filter((s) => matchesQuery(s.name))
  const filteredAdditional = additionalSkills.filter((s) => matchesQuery(s.name))

  return (
    <div className="mx-auto max-w-[960px] space-y-8 animate-fade-up">
      <header className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          Claims
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Declare skills to verify
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          Claims are self-reported until evidence and exams prove them. Core skills are required
          for the{' '}
          <span className="font-semibold text-ink">{persona.trackTitle}</span> Pro certificate.
        </p>
      </header>

      <div className="flex flex-wrap items-start gap-4 rounded-2xl border border-line bg-card p-5 shadow-card">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-ink">Pro core requirements</p>
          <p className="mt-1 text-[13px] text-muted">
            Claim and later pass all{' '}
            <span className="font-semibold text-ink">{coreSkills.length} core</span> skills
            for this track. Currently selected:{' '}
            <span className="font-semibold tabular-nums text-ink">
              {coreSelected}/{coreSkills.length}
            </span>
            .
          </p>
          {coreSelected < coreSkills.length && (
            <button
              type="button"
              onClick={selectAllCore}
              className="mt-3 text-[12px] font-semibold text-accent hover:underline"
            >
              Select all core skills
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills…"
            className="w-full rounded-xl border border-line bg-card py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/15"
          />
        </div>
        <div className="rounded-xl border border-line bg-canvas px-3 py-2 text-[12px] font-semibold tabular-nums text-ink">
          {selected.length} selected
        </div>
      </div>

      {overClaim && (
        <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-[#FFFBEB] px-4 py-3 text-[13px] text-ink">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <p>
            You&apos;ve claimed more than {MAX_CLAIMS_SOFT} skills. Focus improves verification
            quality — consider trimming additional claims.
          </p>
        </div>
      )}

      <section className="rounded-2xl border border-line bg-card p-6 shadow-card md:p-8">
        <div>
          <h2 className="text-lg font-semibold text-ink">Core skills</h2>
          <p className="mt-1 text-[13px] text-muted">Required for Pro. Toggle to claim.</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {filteredCore.map((skill) => (
            <SkillChip
              key={skill.id}
              name={skill.name}
              core
              selected={selectedSet.has(skill.id)}
              variant={selectedSet.has(skill.id) ? 'claimed' : 'available'}
              onClick={() => toggle(skill.id)}
            />
          ))}
          {filteredCore.length === 0 && (
            <p className="text-sm text-muted">No core skills match your search.</p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-card p-6 shadow-card md:p-8">
        <div>
          <h2 className="text-lg font-semibold text-ink">Additional skills</h2>
          <p className="mt-1 text-[13px] text-muted">
            Optional depth. Shown as self-reported until verified.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {filteredAdditional.map((skill) => (
            <SkillChip
              key={skill.id}
              name={skill.name}
              selected={selectedSet.has(skill.id)}
              variant={selectedSet.has(skill.id) ? 'claimed' : 'available'}
              onClick={() => toggle(skill.id)}
            />
          ))}
          {filteredAdditional.length === 0 && (
            <p className="text-sm text-muted">No additional skills match your search.</p>
          )}
        </div>
      </section>

      <div className="sticky bottom-4 z-20">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white/95 px-5 py-4 shadow-lift backdrop-blur">
          <div>
            <p className="text-[13px] font-semibold text-ink">
              {selected.length === 0
                ? 'Select skills to unlock Evidence'
                : dirty
                  ? `${selected.length} skills ready to save`
                  : 'Claims saved'}
            </p>
            <p className="text-[12px] text-muted">
              Saving unlocks Resume + GitHub evidence steps.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelected([...journey.claimedSkillIds])}
              disabled={!dirty}
              className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas disabled:opacity-40"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
            >
              Save claims
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
