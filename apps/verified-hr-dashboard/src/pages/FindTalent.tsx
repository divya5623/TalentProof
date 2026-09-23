import { Filter, Save, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { CandidateCard } from '../components/CandidateCard';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { ShortlistPicker } from './Overview';
import { candidates } from '../data/candidates';
import { useApp } from '../context/AppContext';
import { filterCandidates, parseSearchQuery } from '../lib/search';
import { emptyFilters, type TalentFilters } from '../types';

const ROLE_OPTIONS = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'AI/ML Engineer',
  'Data Scientist',
  'Data Analyst',
  'DevOps Engineer',
  'Cybersecurity Analyst',
  'Cybersecurity Engineer',
];
const SKILL_OPTIONS = [
  'React',
  'JavaScript',
  'TypeScript',
  'Next.js',
  'Python',
  'Node.js',
  'Java',
  'SQL',
  'AWS',
  'Kubernetes',
];
const EXP_OPTIONS = [
  { label: 'Any', value: null },
  { label: '1+ years', value: 1 },
  { label: '2+ years', value: 2 },
  { label: '3+ years', value: 3 },
  { label: '5+ years', value: 5 },
];

type TalentNavState = {
  query?: string;
  filters?: TalentFilters;
};

export function FindTalent() {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [filters, setFilters] = useState<TalentFilters>(emptyFilters());
  const [shortlistFor, setShortlistFor] = useState<string | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const { shortlists, addToShortlist, saveSearch } = useApp();

  // Keep search box in sync with URL (topbar / saved search / external links)
  useEffect(() => {
    const q = params.get('q') ?? '';
    setQuery((prev) => (prev === q ? prev : q));
  }, [params]);

  // Restore full filter set from Saved Searches (location.state)
  useEffect(() => {
    const st = (location.state as TalentNavState | null) ?? null;
    if (!st) return;
    if (st.filters) setFilters(st.filters);
    if (typeof st.query === 'string') {
      setQuery(st.query);
      setParams(st.query ? { q: st.query } : {});
    }
  }, [location.state, setParams]);

  const results = useMemo(() => {
    const list = filterCandidates(candidates, query, filters);
    return [...list].sort((a, b) => b.verificationScore - a.verificationScore);
  }, [query, filters]);

  const parsed = parseSearchQuery(query);
  const chips: { key: string; label: string; clear: () => void }[] = [];
  filters.skills.forEach((s) =>
    chips.push({
      key: `sk-${s}`,
      label: s,
      clear: () => setFilters((f) => ({ ...f, skills: f.skills.filter((x) => x !== s) })),
    }),
  );
  filters.roles.forEach((r) =>
    chips.push({
      key: `ro-${r}`,
      label: r,
      clear: () => setFilters((f) => ({ ...f, roles: f.roles.filter((x) => x !== r) })),
    }),
  );
  if (filters.minExperience != null) {
    chips.push({
      key: 'exp',
      label: `${filters.minExperience}+ years`,
      clear: () => setFilters((f) => ({ ...f, minExperience: null })),
    });
  }
  if (filters.minVerification != null) {
    chips.push({
      key: 'ver',
      label: `${filters.minVerification}%+ verified`,
      clear: () => setFilters((f) => ({ ...f, minVerification: null })),
    });
  }

  function toggleSkill(skill: string) {
    setFilters((f) => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter((s) => s !== skill)
        : [...f.skills, skill],
    }));
  }

  function toggleRole(role: string) {
    setFilters((f) => ({
      ...f,
      roles: f.roles.includes(role) ? f.roles.filter((r) => r !== role) : [...f.roles, role],
    }));
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 animate-fade-up">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          Discovery · Evidence-backed
        </p>
        <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-ink">
          Find Verified Talent
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Search by demonstrated skills — not just résumé claims. Green means independently
          assessed with evidence available.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)] md:p-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setParams(e.target.value ? { q: e.target.value } : {});
            }}
            placeholder="Search by role, skill, technology or candidate name..."
            className="h-14 w-full rounded-xl border border-line bg-canvas pl-12 pr-4 text-base text-ink outline-none transition placeholder:text-muted focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15"
          />
        </div>

        {(parsed.inferredRoles.length > 0 || parsed.inferredSkills.length > 0) && query && (
          <p className="mt-3 text-xs text-muted">
            Understanding “{query}” as{' '}
            <span className="font-medium text-ink">
              {[...parsed.inferredRoles, ...parsed.inferredSkills].join(', ')}
            </span>
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            <Filter className="h-3.5 w-3.5" /> Filters
          </span>

          <select
            className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink"
            value=""
            onChange={(e) => e.target.value && toggleRole(e.target.value)}
          >
            <option value="">Role</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink"
            value=""
            onChange={(e) => e.target.value && toggleSkill(e.target.value)}
          >
            <option value="">Skills</option>
            {SKILL_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink"
            value={filters.minExperience ?? ''}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                minExperience: e.target.value === '' ? null : Number(e.target.value),
              }))
            }
          >
            {EXP_OPTIONS.map((o) => (
              <option key={String(o.value)} value={o.value ?? ''}>
                Experience: {o.label}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink"
            value={filters.minVerification ?? ''}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                minVerification: e.target.value === '' ? null : Number(e.target.value),
              }))
            }
          >
            <option value="">Verification Score</option>
            <option value="70">70%+</option>
            <option value="80">80%+</option>
            <option value="90">90%+</option>
          </select>

          <div className="ml-auto">
            <button
              type="button"
              onClick={() => setSaveOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:bg-canvas"
            >
              <Save className="h-3.5 w-3.5" />
              Save Search
            </button>
          </div>
        </div>

        {/* Quick skill chips for demo */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {['React', 'JavaScript', 'TypeScript'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSkill(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                filters.skills.includes(s)
                  ? 'bg-accent text-white'
                  : 'border border-line bg-white text-muted hover:text-ink'
              }`}
            >
              {s}
            </button>
          ))}
          <button
            type="button"
            onClick={() =>
              setFilters((f) => ({
                ...f,
                minExperience: f.minExperience === 2 ? null : 2,
              }))
            }
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              filters.minExperience === 2
                ? 'bg-accent text-white'
                : 'border border-line bg-white text-muted hover:text-ink'
            }`}
          >
            2+ years
          </button>
        </div>

        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {chips.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={c.clear}
                className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent"
              >
                {c.label}
                <X className="h-3 w-3" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setFilters(emptyFilters())}
              className="text-xs font-medium text-muted hover:text-ink"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <p className="text-sm text-muted">
          <span className="font-semibold text-ink">{results.length}</span> verified candidates
          <span className="mx-1.5 text-line">·</span>
          sorted by verification score
        </p>
      </div>

      {results.length === 0 ? (
        <EmptyState
          title="No matches for these filters"
          description="Try clearing a skill chip or broadening experience. Verified talent is still out there."
          action={
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setFilters(emptyFilters());
                setParams({});
              }}
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((c) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              onShortlist={(id) => setShortlistFor(id)}
            />
          ))}
        </div>
      )}

      <ShortlistPicker
        open={!!shortlistFor}
        candidateId={shortlistFor}
        onClose={() => setShortlistFor(null)}
        shortlists={shortlists}
        onPick={(slId) => {
          if (shortlistFor) addToShortlist(slId, shortlistFor);
          setShortlistFor(null);
        }}
      />

      <Modal open={saveOpen} onClose={() => setSaveOpen(false)} title="Save this search">
        <label className="block text-sm font-medium text-ink">
          Name
          <input
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-lg border border-line px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
            placeholder="e.g. React Developers 2y+"
          />
        </label>
        <button
          type="button"
          disabled={!saveName.trim()}
          onClick={() => {
            saveSearch(saveName.trim(), query, filters);
            setSaveOpen(false);
            setSaveName('');
          }}
          className="mt-4 w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          Save Search
        </button>
      </Modal>
    </div>
  );
}
