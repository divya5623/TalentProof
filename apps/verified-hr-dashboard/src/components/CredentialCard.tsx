import { BadgeCheck, Eye, ShieldCheck } from 'lucide-react';
import type { Credential } from '../types';

interface Props {
  credential: Credential;
  onVerify: () => void;
  onView: () => void;
}

export function CredentialCard({ credential, onVerify, onView }: Props) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Verified credential
          </p>
          <h4 className="mt-1.5 text-base font-semibold tracking-tight text-ink">
            {credential.title}
          </h4>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-verified-soft px-2 py-1 text-[11px] font-semibold text-verified">
          <BadgeCheck className="h-3.5 w-3.5" />
          Authentic
        </span>
      </div>

      <dl className="mt-5 space-y-3 rounded-xl border border-line bg-canvas/70 px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
            Issued
          </dt>
          <dd className="text-sm font-semibold text-ink">
            {new Date(credential.issuedOn).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </dd>
        </div>
        <div className="border-t border-line/80 pt-3">
          <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
            Verification ID
          </dt>
          <dd className="mt-1 font-mono text-[13px] font-semibold tracking-wide text-ink">
            {credential.verificationId}
          </dd>
        </div>
        {credential.skills && credential.skills.length > 0 && (
          <div className="border-t border-line/80 pt-3">
            <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              Covered skills
            </dt>
            <dd className="mt-1.5 flex flex-wrap gap-1.5">
              {credential.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-verified/15 bg-verified-soft/40 px-2 py-0.5 text-[11px] font-medium text-verified"
                >
                  {s}
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onView}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2.5 text-xs font-semibold text-ink transition hover:bg-canvas"
        >
          <Eye className="h-3.5 w-3.5" />
          View Certificate
        </button>
        <button
          type="button"
          onClick={onVerify}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-accent px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5b3ce0]"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Verify Credential
        </button>
      </div>
    </div>
  );
}
