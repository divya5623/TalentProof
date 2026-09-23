import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';

export function SavedSearches() {
  const { savedSearches, deleteSavedSearch, toast } = useApp();

  return (
    <div className="mx-auto max-w-[900px] space-y-6 animate-fade-up">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          Shortcuts
        </p>
        <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-ink">Saved Searches</h1>
        <p className="mt-2 text-sm text-muted">
          Revisit verified talent pools with the same evidence-backed filters.
        </p>
      </div>

      {savedSearches.length === 0 ? (
        <EmptyState
          title="No saved searches"
          description="Save a filter set from Find Talent to revisit verified pools in one click."
          action={
            <Link to="/talent" className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white">
              Find Talent
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {savedSearches.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)]"
            >
              <div>
                <h2 className="font-semibold text-ink">{s.name}</h2>
                <p className="mt-1 text-sm text-muted">
                  Query: “{s.query || '—'}”
                  {s.filters.skills.length > 0 && ` · Skills: ${s.filters.skills.join(', ')}`}
                  {s.filters.minExperience != null && ` · ${s.filters.minExperience}+ yrs`}
                  {s.filters.minVerification != null &&
                    ` · ${s.filters.minVerification}%+ verified`}
                </p>
                <p className="mt-1 text-xs text-muted">Saved {s.createdOn}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/talent"
                  state={{ query: s.query, filters: s.filters }}
                  className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white"
                >
                  Run
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    deleteSavedSearch(s.id);
                    toast('Saved search removed', 'info');
                  }}
                  className="rounded-lg border border-line px-3 py-2 text-xs font-semibold text-muted hover:text-danger"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
