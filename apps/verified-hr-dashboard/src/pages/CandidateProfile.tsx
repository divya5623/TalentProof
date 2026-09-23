import {
  BookmarkPlus,
  GitCompare,
  Mail,
  MapPin,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { CredentialCard } from '../components/CredentialCard';
import { EmptyState } from '../components/EmptyState';
import { EvidenceCard } from '../components/EvidenceCard';
import { Modal } from '../components/Modal';
import { SkillBadge } from '../components/SkillBadge';
import { VerificationBadge } from '../components/VerificationBadge';
import { VerificationScore } from '../components/VerificationScore';
import { useApp } from '../context/AppContext';
import { candidates, getCandidate } from '../data/candidates';
import { ShortlistPicker } from './Overview';
import type { Credential, VerifiedSkill } from '../types';

export function CandidateProfile() {
  const { id } = useParams();
  const candidate = getCandidate(id ?? '');
  const navigate = useNavigate();
  const { setCompare, isComparing, shortlists, addToShortlist, toast } = useApp();
  const [evidenceSkill, setEvidenceSkill] = useState<VerifiedSkill | null>(null);
  const [shortlistOpen, setShortlistOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [verifyCred, setVerifyCred] = useState<Credential | null>(null);
  const [certCred, setCertCred] = useState<Credential | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const breakdownRows = useMemo(() => {
    if (!candidate) return [];
    return [
      { label: 'Technical Knowledge', value: candidate.breakdown.technicalKnowledge },
      { label: 'Practical Ability', value: candidate.breakdown.practicalAbility },
      { label: 'Problem Solving', value: candidate.breakdown.problemSolving },
      { label: 'Communication', value: candidate.breakdown.communication },
    ];
  }, [candidate]);

  if (!candidate) {
    return (
      <EmptyState
        title="Candidate not found"
        description="This profile isn’t in your verified talent pool."
        action={
          <Link to="/talent" className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white">
            Back to Find Talent
          </Link>
        }
      />
    );
  }

  function startCompareWithPeers() {
    const peers = candidates
      .filter((c) => c.id !== candidate!.id && c.role === candidate!.role)
      .sort((a, b) => b.verificationScore - a.verificationScore)
      .slice(0, 2)
      .map((c) => c.id);
    const ids = [candidate!.id, ...peers].slice(0, 3);
    setCompare(ids);
    toast(`Comparing ${ids.length} verified candidates`, 'info');
    navigate('/compare');
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-8 animate-fade-up pb-8">
      <section className="rounded-3xl border border-line bg-white p-8 shadow-[var(--shadow-card)] md:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-5">
            <Avatar
              initials={candidate.avatarInitials}
              hue={candidate.avatarHue}
              size="xl"
              name={candidate.name}
            />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                Independently assessed profile
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink md:text-[2.15rem]">
                {candidate.name}
              </h1>
              <p className="mt-1.5 text-base text-muted">{candidate.role}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {candidate.location}
                </span>
                <span className="text-line">·</span>
                <span>{candidate.experienceYears} years experience</span>
                <span className="text-line">·</span>
                <span>{candidate.availability}</span>
              </div>
              <p className="mt-2.5 inline-flex items-center gap-1.5 text-sm text-muted">
                <GraduationCap className="h-3.5 w-3.5" />
                {candidate.education}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 sm:flex-row lg:flex-col">
            <VerificationScore score={candidate.verificationScore} size="hero" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Verification Score
            </p>
            <p className="max-w-[160px] text-center text-[12px] leading-snug text-muted">
              Transparent breakdown of demonstrated skill — not a résumé claim.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2.5 border-t border-line pt-6">
          <button
            type="button"
            onClick={() => setShortlistOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5b3ce0]"
          >
            <BookmarkPlus className="h-4 w-4" />
            Shortlist
          </button>
          <button
            type="button"
            onClick={startCompareWithPeers}
            className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:bg-canvas"
          >
            <GitCompare className="h-4 w-4" />
            {isComparing(candidate.id) ? 'Compare (ready)' : 'Compare 3'}
          </button>
          <button
            type="button"
            onClick={() => {
              setSubject(`Opportunity for ${candidate.role}`);
              setMessage(
                `Hi ${candidate.name.split(' ')[0]},\n\nWe reviewed your verified profile on VERIFIED and would love to connect about an open role.\n\nBest,\nRahul Mehta`,
              );
              setContactOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:bg-canvas"
          >
            <Mail className="h-4 w-4" />
            Contact
          </button>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-5">
        <section className="space-y-8 lg:col-span-3">
          <div className="rounded-2xl border border-line bg-white p-7 shadow-[var(--shadow-card)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Overall verification
            </p>
            <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-ink">
              Score breakdown
            </h2>
            <p className="mt-1 text-sm text-muted">
              How the {candidate.verificationScore}% Verification Score was composed.
            </p>
            <div className="mt-7 space-y-5">
              {breakdownRows.map((row) => (
                <div key={row.label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-ink">{row.label}</span>
                    <span className="font-semibold tabular-nums text-ink">{row.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${row.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-7 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Independently assessed
                </p>
                <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-ink">
                  Verified Skills
                </h2>
              </div>
              <VerificationBadge />
            </div>
            <ul className="mt-5 divide-y divide-line">
              {candidate.verifiedSkills.map((skill) => (
                <li key={skill.name}>
                  <button
                    type="button"
                    onClick={() => setEvidenceSkill(skill)}
                    className="flex w-full items-center gap-4 rounded-xl px-2 py-4 text-left transition hover:bg-canvas/70"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-ink">{skill.name}</span>
                        <VerificationBadge compact />
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {skill.level}
                        <span className="mx-1.5 text-line">·</span>
                        Evidence available
                      </p>
                    </div>
                    <span className="text-lg font-semibold tabular-nums text-verified">
                      {skill.score}%
                    </span>
                    <span className="hidden text-xs font-semibold text-accent sm:inline">
                      View evidence →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">
              Open any skill to inspect the practical, knowledge, and project evidence record.
            </p>
          </div>

          {candidate.selfReportedSkills.length > 0 && (
            <div className="rounded-2xl border border-dashed border-line bg-white p-7 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-ink">
                    Self-reported skills
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Claimed by the candidate — not platform-verified.
                  </p>
                </div>
                <VerificationBadge variant="self-reported" />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {candidate.selfReportedSkills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-2">
                    <SkillBadge name={s} />
                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
                      Self-reported
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="space-y-8 lg:col-span-2">
          <div className="rounded-2xl border border-line bg-white p-7 shadow-[var(--shadow-card)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Credentials
            </p>
            <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-ink">
              Verified Credentials
            </h2>
            <p className="mt-1 text-sm text-muted">
              Registry-backed IDs you can authenticate instantly.
            </p>
            <div className="mt-5 space-y-4">
              {candidate.credentials.map((c) => (
                <CredentialCard
                  key={c.verificationId}
                  credential={c}
                  onVerify={() => setVerifyCred(c)}
                  onView={() => setCertCred(c)}
                />
              ))}
            </div>
          </div>

          {candidate.summary && (
            <div className="rounded-2xl border border-line bg-accent-soft/40 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                Recruiter note
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink">{candidate.summary}</p>
            </div>
          )}

          <div className="rounded-2xl border border-line bg-canvas/80 p-5">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-verified" />
              <p className="text-[13px] leading-relaxed text-muted">
                <span className="font-medium text-ink">Don&apos;t trust the claim. Verify the skill.</span>{' '}
                Green marks only appear on platform-verified evidence.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Modal
        open={!!evidenceSkill}
        onClose={() => setEvidenceSkill(null)}
        title="Skill evidence"
        wide
      >
        {evidenceSkill && (
          <EvidenceCard skill={evidenceSkill} candidateName={candidate.name} />
        )}
      </Modal>

      <ShortlistPicker
        open={shortlistOpen}
        candidateId={candidate.id}
        onClose={() => setShortlistOpen(false)}
        shortlists={shortlists}
        onPick={(slId) => {
          addToShortlist(slId, candidate.id);
          setShortlistOpen(false);
        }}
      />

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} title={`Contact ${candidate.name}`}>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-ink">
            Subject
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-line px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
          </label>
          <label className="block text-sm font-medium text-ink">
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="mt-1.5 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              setContactOpen(false);
              toast('Message sent successfully (demo — no email delivered)', 'success');
            }}
            className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-white"
          >
            Send message
          </button>
        </div>
      </Modal>

      <Modal
        open={!!verifyCred}
        onClose={() => setVerifyCred(null)}
        title="Credential authentic"
      >
        {verifyCred && (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-verified-soft text-verified">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <p className="mt-4 text-base font-semibold text-ink">
              {verifyCred.verificationId} is authentic
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Issued by VERIFIED on{' '}
              {new Date(verifyCred.issuedOn).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
              . Credential status confirmed against the registry.
            </p>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-verified">
              Status · Authentic
            </p>
            <button
              type="button"
              onClick={() => setVerifyCred(null)}
              className="mt-6 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white"
            >
              Done
            </button>
          </div>
        )}
      </Modal>

      <Modal open={!!certCred} onClose={() => setCertCred(null)} title="Certificate preview">
        {certCred && (
          <div className="rounded-xl border border-line bg-canvas p-8 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              VERIFIED
            </p>
            <p className="mt-4 text-xl font-semibold text-ink">{certCred.title}</p>
            <p className="mt-2 text-sm text-muted">Awarded to {candidate.name}</p>
            <p className="mt-6 font-mono text-xs font-semibold tracking-wide text-ink">
              {certCred.verificationId}
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-verified">
              Authentic
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
