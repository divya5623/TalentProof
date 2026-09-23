import { ArrowRight, Briefcase, CheckCircle2, Plus, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CandidateCard } from '../components/CandidateCard';
import { MetricCard } from '../components/MetricCard';
import { candidates, recommendedCandidateIds } from '../data/candidates';
import { jobs } from '../data/jobs';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { Modal } from '../components/Modal';

export function Overview() {
  const { shortlists, addToShortlist, toast } = useApp();
  const [shortlistFor, setShortlistFor] = useState<string | null>(null);
  const recommended = recommendedCandidateIds
    .map((id) => candidates.find((c) => c.id === id)!)
    .filter(Boolean);
  const activeJobs = jobs.filter((j) => j.status === 'Active').slice(0, 4);
  const totalMatches = activeJobs.reduce((n, j) => n + j.stats.matches, 0);

  return (
    <div className="mx-auto max-w-[1200px] space-y-10 animate-fade-up">
      {/* Cinematic editorial hero */}
      <section className="relative overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-card)]">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-accent-soft/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-verified-soft/40 blur-3xl" />

        <div className="relative grid gap-10 px-8 py-10 md:grid-cols-[1.35fr_0.9fr] md:px-12 md:py-12 lg:gap-14">
          <div className="flex flex-col justify-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Don&apos;t trust the claim. Verify the skill.
            </p>
            <h1 className="mt-4 max-w-xl text-[2.75rem] font-semibold leading-[1.08] tracking-tight text-ink md:text-5xl">
              Talent Overview
            </h1>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
              Discover candidates based on skills they&apos;ve actually demonstrated —
              independently assessed, evidence-backed, ready to shortlist.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/talent"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5b3ce0]"
              >
                Find Verified Talent
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/jobs"
                onClick={() => toast('Open a requisition to review verified matches', 'info')}
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3.5 text-sm font-semibold text-ink transition hover:bg-canvas"
              >
                <Plus className="h-4 w-4" />
                Create Job
              </Link>
            </div>
          </div>

          {/* Trust stack */}
          <aside className="flex flex-col justify-center">
            <div className="rounded-2xl border border-line/80 bg-canvas/60 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Live verified pool
                </p>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-verified">
                  <span className="h-1.5 w-1.5 rounded-full bg-verified animate-pulse-dot" />
                  Updating
                </span>
              </div>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-ink tabular-nums">
                2,481
              </p>
              <p className="mt-1 text-[13px] text-muted">independently assessed professionals</p>

              <ul className="mt-5 space-y-3 border-t border-line/70 pt-4">
                <li className="flex items-start gap-2.5 text-[13px] text-ink">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-verified" />
                  <span>
                    <span className="font-medium">Evidence on every skill</span>
                    <span className="text-muted"> — practical + knowledge scored</span>
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-[13px] text-ink">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-verified" />
                  <span>
                    <span className="font-medium">184 newly verified</span>
                    <span className="text-muted"> this week across your markets</span>
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-[13px] text-ink">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>
                    <span className="font-medium">{totalMatches} role matches</span>
                    <span className="text-muted"> waiting on open positions</span>
                  </span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Hiring pulse — slim strip to Find Talent */}
      <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 px-5 py-3">
          <div className="flex items-center gap-2.5">
            <Briefcase className="h-3.5 w-3.5 text-muted" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              Hiring pulse
            </p>
            <span className="text-[12px] text-muted">
              {activeJobs.length} active roles · {totalMatches} verified matches
            </span>
          </div>
          <Link
            to="/talent"
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-accent transition hover:underline"
          >
            Browse matches
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="flex gap-0 overflow-x-auto divide-x divide-line/70">
          {activeJobs.map((job) => (
            <Link
              key={job.id}
              to="/talent"
              className="group flex min-w-[180px] flex-1 flex-col gap-1 px-5 py-3.5 transition hover:bg-accent-soft/30"
            >
              <span className="truncate text-[13px] font-semibold tracking-tight text-ink group-hover:text-accent">
                {job.title}
              </span>
              <span className="text-[11px] text-muted">
                <span className="font-medium tabular-nums text-ink">{job.stats.matches}</span> matches
                <span className="mx-1.5 text-line">·</span>
                {job.location.split('/')[0].trim()}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Metrics — Midday calm */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Verified Talent"
          value="2,481"
          delta="+12% this month"
          spark={[42, 48, 45, 52, 58, 61, 68, 74]}
        />
        <MetricCard
          label="New Verified"
          value="184"
          delta="+28 this week"
          spark={[20, 28, 24, 35, 40, 48, 55, 62]}
        />
        <MetricCard
          label="Active Shortlists"
          value="12"
          delta={`${shortlists.length} on your desk`}
          spark={[8, 9, 9, 10, 11, 11, 12, 12]}
        />
        <MetricCard
          label="Open Positions"
          value="8"
          delta="3 need matches"
          positive={false}
          spark={[10, 9, 9, 8, 8, 8, 8, 8]}
        />
      </section>

      {/* Recommended */}
      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              Curated for you
            </p>
            <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-ink">
              Recommended Talent
            </h2>
            <p className="mt-1.5 text-[13px] text-muted">
              Matching your open roles — verified skills first, claims second.
            </p>
          </div>
          <Link
            to="/talent"
            className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {recommended.map((c) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              onShortlist={(id) => setShortlistFor(id)}
            />
          ))}
        </div>
      </section>

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

export function ShortlistPicker({
  open,
  onClose,
  shortlists,
  onPick,
  candidateId,
}: {
  open: boolean;
  onClose: () => void;
  shortlists: { id: string; name: string; candidateIds: string[] }[];
  onPick: (id: string) => void;
  candidateId: string | null;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Add to shortlist">
      <p className="mb-4 text-sm text-muted">
        Choose where to save this verified candidate. Prefer{' '}
        <span className="font-medium text-ink">Frontend Engineers</span> for the demo path.
      </p>
      <ul className="space-y-2">
        {shortlists.map((s) => {
          const already = candidateId ? s.candidateIds.includes(candidateId) : false;
          const demo = s.id === 'sl-frontend-engineers' || s.name === 'Frontend Engineers';
          return (
            <button
              key={s.id}
              type="button"
              disabled={already}
              onClick={() => onPick(s.id)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                demo
                  ? 'border-accent/40 bg-accent-soft/50 hover:border-accent hover:bg-accent-soft'
                  : 'border-line hover:border-accent hover:bg-accent-soft/40'
              }`}
            >
              <span className="font-medium text-ink">
                {s.name}
                {demo && (
                  <span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
                    Demo
                  </span>
                )}
              </span>
              <span className="text-xs text-muted">
                {already ? 'Already added' : `${s.candidateIds.length} candidates`}
              </span>
            </button>
          );
        })}
      </ul>
    </Modal>
  );
}
