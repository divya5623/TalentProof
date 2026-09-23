import { Link, useParams } from 'react-router-dom';
import { candidates } from '../data/candidates';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/Avatar';
import { EmptyState } from '../components/EmptyState';
import { CandidateCard } from '../components/CandidateCard';

export function ShortlistsIndex() {
  const { shortlists } = useApp();

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 animate-fade-up">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          Pipelines
        </p>
        <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-ink">Shortlists</h1>
        <p className="mt-2 text-sm text-muted">
          Curate verified talent — evidence first, claims second.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shortlists.map((s) => {
          const members = s.candidateIds
            .map((id) => candidates.find((c) => c.id === id))
            .filter(Boolean);
          const avg =
            members.length === 0
              ? 0
              : Math.round(
                  members.reduce((a, c) => a + (c?.verificationScore ?? 0), 0) / members.length,
                );
          return (
            <Link
              key={s.id}
              to={`/shortlists/${s.id}`}
              className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                Shortlist
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">{s.name}</h2>
              <p className="mt-2 text-sm text-muted">{s.description}</p>
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="text-3xl font-semibold tabular-nums text-ink">
                    {s.candidateIds.length}
                  </p>
                  <p className="text-xs text-muted">candidates</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold tabular-nums text-verified">{avg}%</p>
                  <p className="text-xs text-muted">avg verified</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function ShortlistDetail() {
  const { id } = useParams();
  const { shortlists, removeFromShortlist } = useApp();
  const shortlist = shortlists.find((s) => s.id === id);

  if (!shortlist) {
    return (
      <EmptyState
        title="Shortlist not found"
        description="It may have been removed."
        action={
          <Link to="/shortlists" className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white">
            All shortlists
          </Link>
        }
      />
    );
  }

  const members = shortlist.candidateIds
    .map((cid) => candidates.find((c) => c.id === cid))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 animate-fade-up">
      <div>
        <Link to="/shortlists" className="text-sm font-medium text-accent hover:underline">
          ← Shortlists
        </Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">{shortlist.name}</h1>
        <p className="mt-1 text-sm text-muted">{shortlist.description}</p>
      </div>

      {members.length === 0 ? (
        <EmptyState
          title="No candidates yet"
          description="Add talent from Find Talent or a profile Shortlist action."
          action={
            <Link to="/talent" className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white">
              Find Talent
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
            {members.map((c) =>
              c ? (
                <li key={c.id} className="flex items-center gap-4 px-5 py-4">
                  <Avatar initials={c.avatarInitials} hue={c.avatarHue} size="md" />
                  <div className="flex-1">
                    <Link
                      to={`/talent/${c.id}`}
                      className="font-semibold text-ink hover:text-accent"
                    >
                      {c.name}
                    </Link>
                    <p className="text-sm text-muted">
                      {c.role} · {c.verificationScore}% Verified
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromShortlist(shortlist.id, c.id)}
                    className="text-xs font-medium text-muted hover:text-danger"
                  >
                    Remove
                  </button>
                </li>
              ) : null,
            )}
          </ul>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {members.map((c) => (c ? <CandidateCard key={c.id} candidate={c} /> : null))}
          </div>
        </div>
      )}
    </div>
  );
}
