import { BookmarkPlus, FileCheck2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Candidate } from '../types';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';
import { SkillBadge } from './SkillBadge';
import { VerificationScore } from './VerificationScore';

interface Props {
  candidate: Candidate;
  onShortlist?: (id: string) => void;
}

export function CandidateCard({ candidate, onShortlist }: Props) {
  const { isComparing, toggleCompare } = useApp();
  const selected = isComparing(candidate.id);
  const topSkills = candidate.verifiedSkills.slice(0, 4);
  const hasEvidence = candidate.verifiedSkills.some((s) => s.evidence);

  return (
    <article className="group relative flex flex-col rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)] transition duration-300 ease-out hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            initials={candidate.avatarInitials}
            hue={candidate.avatarHue}
            size="md"
            name={candidate.name}
          />
          <div className="min-w-0">
            <Link
              to={`/talent/${candidate.id}`}
              className="block truncate text-[15px] font-semibold tracking-tight text-ink transition hover:text-accent"
            >
              {candidate.name}
            </Link>
            <p className="truncate text-[13px] text-muted">{candidate.role}</p>
          </div>
        </div>
        {/* Score-first: ring is the primary trust signal */}
        <div className="flex flex-col items-center gap-1">
          <VerificationScore score={candidate.verificationScore} size="sm" label={false} />
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-verified">
            Verified
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-muted">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3 opacity-70" />
          {candidate.location}
        </span>
        <span className="h-0.5 w-0.5 rounded-full bg-line" />
        <span>
          {candidate.experienceYears} yr{candidate.experienceYears === 1 ? '' : 's'}
        </span>
        {hasEvidence && (
          <>
            <span className="h-0.5 w-0.5 rounded-full bg-line" />
            <span className="inline-flex items-center gap-1 font-medium text-verified">
              <FileCheck2 className="h-3 w-3" />
              Evidence available
            </span>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {topSkills.map((s) => (
          <SkillBadge key={s.name} name={s.name} verified score={s.score} />
        ))}
      </div>

      <div className="mt-auto flex items-center gap-2 border-t border-line/80 pt-4 mt-5">
        <label className="flex cursor-pointer items-center gap-2 text-[11px] font-medium text-muted transition hover:text-ink">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => toggleCompare(candidate.id)}
            className="h-3.5 w-3.5 rounded border-line text-accent focus:ring-accent"
          />
          Compare
        </label>
        <div className="flex-1" />
        <Link
          to={`/talent/${candidate.id}`}
          className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-muted transition hover:bg-canvas hover:text-ink"
        >
          View profile
        </Link>
        <button
          type="button"
          onClick={() => onShortlist?.(candidate.id)}
          className="inline-flex items-center gap-1 rounded-lg border border-accent/20 bg-accent-soft/60 px-2.5 py-1.5 text-[11px] font-semibold text-accent transition hover:border-accent/40 hover:bg-accent-soft"
        >
          <BookmarkPlus className="h-3.5 w-3.5" />
          Shortlist
        </button>
      </div>
    </article>
  );
}
