import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { Avatar } from '../components/Avatar';
import { VerificationScore } from '../components/VerificationScore';
import { useApp } from '../context/AppContext';
import { candidates } from '../data/candidates';
import { useState } from 'react';
import { ShortlistPicker } from './Overview';

export function Compare() {
  const { compareIds, toggleCompare, shortlists, addToShortlist, toast } = useApp();
  const [shortlistFor, setShortlistFor] = useState<string | null>(null);
  const selected = compareIds
    .map((id) => candidates.find((c) => c.id === id))
    .filter(Boolean) as typeof candidates;

  if (selected.length < 2) {
    return (
      <div className="mx-auto max-w-[900px] animate-fade-up">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Compare candidates</h1>
        <p className="mt-2 text-sm text-muted">
          Select 2–4 verified candidates from Find Talent, or use Compare 3 on a profile.
        </p>
        <div className="mt-8">
          <EmptyState
            title="Not enough candidates selected"
            description="Use the checkbox on candidate cards, then open Compare when you have at least two. No automatic winner — you decide."
            action={
              <Link
                to="/talent"
                className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white"
              >
                Find Talent
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const skillUnion = Array.from(
    new Set(selected.flatMap((c) => c.verifiedSkills.map((s) => s.name))),
  ).sort();

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Side-by-side · Evidence-backed
          </p>
          <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-ink">
            Candidate Comparison
          </h1>
          <p className="mt-2 text-sm text-muted">
            Verified scores only. No automatic winner — HR decides.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="sticky left-0 bg-white px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                Attribute
              </th>
              {selected.map((c) => (
                <th key={c.id} className="min-w-[200px] px-5 py-4">
                  <div className="flex flex-col items-start gap-3">
                    <Avatar initials={c.avatarInitials} hue={c.avatarHue} size="md" />
                    <div>
                      <Link
                        to={`/talent/${c.id}`}
                        className="font-semibold text-ink hover:text-accent"
                      >
                        {c.name}
                      </Link>
                      <p className="text-xs text-muted">{c.role}</p>
                    </div>
                    <VerificationScore score={c.verificationScore} size="sm" />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setShortlistFor(c.id)}
                        className="rounded-lg bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent"
                      >
                        Shortlist
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          toast(`Contact draft ready for ${c.name.split(' ')[0]} (demo)`, 'success')
                        }
                        className="rounded-lg border border-line px-2.5 py-1 text-[11px] font-semibold text-ink"
                      >
                        Contact
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCompare(c.id)}
                        className="text-[11px] font-medium text-muted hover:text-danger"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line">
              <td className="sticky left-0 bg-white px-5 py-3 font-medium text-muted">
                Experience
              </td>
              {selected.map((c) => (
                <td key={c.id} className="px-5 py-3 font-semibold tabular-nums text-ink">
                  {c.experienceYears} yrs
                </td>
              ))}
            </tr>
            <tr className="border-b border-line">
              <td className="sticky left-0 bg-white px-5 py-3 font-medium text-muted">
                Location
              </td>
              {selected.map((c) => (
                <td key={c.id} className="px-5 py-3 text-ink">
                  {c.location}
                </td>
              ))}
            </tr>
            <tr className="border-b border-line">
              <td className="sticky left-0 bg-white px-5 py-3 font-medium text-muted">
                Overall verification
              </td>
              {selected.map((c) => (
                <td key={c.id} className="px-5 py-3 font-semibold tabular-nums text-verified">
                  {c.verificationScore}% Verified
                </td>
              ))}
            </tr>
            <tr className="border-b border-line">
              <td className="sticky left-0 bg-white px-5 py-3 font-medium text-muted">
                Problem solving
              </td>
              {selected.map((c) => (
                <td key={c.id} className="px-5 py-3 tabular-nums text-ink">
                  {c.breakdown.problemSolving}
                </td>
              ))}
            </tr>
            <tr className="border-b border-line bg-canvas/50">
              <td
                colSpan={selected.length + 1}
                className="px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
              >
                Verified skill scores
              </td>
            </tr>
            {skillUnion.map((skill) => (
              <tr key={skill} className="border-b border-line">
                <td className="sticky left-0 bg-white px-5 py-3 font-medium text-muted">
                  {skill}
                </td>
                {selected.map((c) => {
                  const s = c.verifiedSkills.find((x) => x.name === skill);
                  return (
                    <td key={c.id} className="px-5 py-3">
                      {s ? (
                        <span className="font-semibold tabular-nums text-verified">{s.score}%</span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
    </div>
  );
}
