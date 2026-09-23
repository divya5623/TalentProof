import { BadgeCheck, Calendar, FileText, ShieldCheck } from 'lucide-react';
import type { VerifiedSkill } from '../types';

interface Props {
  skill: VerifiedSkill;
  candidateName?: string;
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-medium text-ink">{label}</span>
        <span className="text-[13px] font-semibold tabular-nums text-ink">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-verified transition-all duration-700 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function EvidenceCard({ skill, candidateName }: Props) {
  const { evidence } = skill;
  const verifiedLabel = new Date(evidence.verifiedOn).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="overflow-hidden">
      {/* Audit document header */}
      <div className="border-b border-line bg-canvas/80 px-1 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-verified shadow-sm">
              <FileText className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                Evidence record · Independently assessed
              </p>
              <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-ink">
                {skill.name}
              </h3>
              <p className="mt-1 text-sm text-muted">
                {candidateName ? (
                  <>
                    Demonstrated by <span className="font-medium text-ink">{candidateName}</span>
                    <span className="mx-1.5 text-line">·</span>
                  </>
                ) : null}
                Level <span className="font-medium text-ink">{skill.level}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-verified px-2.5 py-1 text-[11px] font-semibold text-white">
              <BadgeCheck className="h-3.5 w-3.5" />
              Authentic
            </span>
            <p className="text-2xl font-semibold tabular-nums tracking-tight text-verified">
              {skill.score}
              <span className="ml-0.5 text-sm font-semibold text-verified/70">%</span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-1 pt-6">
        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Assessment breakdown
          </p>
          <div className="space-y-5">
            <Bar label="Practical Assessment" value={evidence.practicalAssessment} />
            <Bar label="Technical Knowledge" value={evidence.technicalKnowledge} />
            <Bar label="Project Evaluation" value={evidence.projectEvaluation} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2.5 rounded-xl border border-line bg-canvas px-4 py-3">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                Verification date
              </p>
              <p className="mt-0.5 text-sm font-semibold text-ink">{verifiedLabel}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl border border-line bg-canvas px-4 py-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-verified" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                Status
              </p>
              <p className="mt-0.5 text-sm font-semibold text-verified">Verified</p>
            </div>
          </div>
        </div>

        {skill.credentialId && (
          <div className="rounded-xl border border-dashed border-line px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              Linked credential
            </p>
            <p className="mt-1 font-mono text-sm font-semibold tracking-wide text-ink">
              {skill.credentialId}
            </p>
          </div>
        )}

        <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
          Independently verified through the VERIFIED assessment process. Scores reflect
          demonstrated ability — not self-claimed proficiency.
        </p>
      </div>
    </div>
  );
}
