import { Link, useParams } from 'react-router-dom';
import { jobs, getJob } from '../data/jobs';
import { candidates } from '../data/candidates';
import { jobMatchExplanation } from '../lib/search';
import { EmptyState } from '../components/EmptyState';
import { Avatar } from '../components/Avatar';
import { useApp } from '../context/AppContext';

export function JobsIndex() {
  const { toast } = useApp();
  return (
    <div className="mx-auto max-w-[1100px] space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            Requisitions
          </p>
          <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-ink">Jobs</h1>
          <p className="mt-2 text-sm text-muted">
            Match open roles to independently assessed skills — with explanations, not opaque scores.
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast('Job draft created (demo)', 'success')}
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white"
        >
          Create Job
        </button>
      </div>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <Link
            key={job.id}
            to={`/jobs/${job.id}`}
            className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-lift)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold tracking-tight text-ink">{job.title}</h2>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                      job.status === 'Active'
                        ? 'bg-verified-soft text-verified'
                        : 'bg-canvas text-muted'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {job.department} · {job.location}
                </p>
              </div>
              <div className="flex gap-6 text-center">
                <Stat label="Matches" value={job.stats.matches} />
                <Stat label="Shortlisted" value={job.stats.shortlisted} />
                <Stat label="Contacted" value={job.stats.contacted} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-2xl font-semibold tabular-nums text-ink">{value}</p>
      <p className="text-[11px] text-muted">{label}</p>
    </div>
  );
}

export function JobDetail() {
  const { id } = useParams();
  const job = getJob(id ?? '');

  if (!job) {
    return (
      <EmptyState
        title="Job not found"
        description="This requisition isn’t available."
        action={
          <Link to="/jobs" className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white">
            All jobs
          </Link>
        }
      />
    );
  }

  const matches = candidates
    .map((c) => {
      const exp = jobMatchExplanation(c, job.requiredSkills, job.preferredSkills);
      const score =
        exp.matchedRequired.length * 3 +
        exp.matchedPreferred.length * 1 +
        c.verificationScore / 100;
      return { c, exp, score };
    })
    .filter((m) => m.exp.matchedRequired.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 animate-fade-up">
      <div>
        <Link to="/jobs" className="text-sm font-medium text-accent hover:underline">
          ← Jobs
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">{job.title}</h1>
          <span className="rounded-md bg-verified-soft px-2 py-0.5 text-[11px] font-semibold text-verified">
            {job.status}
          </span>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{job.description}</p>
        <Link
          to={`/talent?q=${encodeURIComponent(job.requiredSkills[0] + ' Developer')}`}
          className="mt-4 inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white"
        >
          Find Verified Candidates
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Required skills
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {job.requiredSkills.map((s) => (
              <span
                key={s}
                className="rounded-lg border border-line bg-canvas px-3 py-1 text-sm font-medium text-ink"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Preferred skills
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {job.preferredSkills.map((s) => (
              <span
                key={s}
                className="rounded-lg border border-line px-3 py-1 text-sm font-medium text-muted"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Verified matches with explanation
        </h2>
        <p className="mt-1 text-sm text-muted">
          Matched required / preferred skills — never an unexplained percentage alone.
        </p>
        <ul className="mt-4 space-y-3">
          {matches.map(({ c, exp }) => (
            <li
              key={c.id}
              className="rounded-2xl border border-line bg-white p-5 shadow-[var(--shadow-card)]"
            >
              <div className="flex flex-wrap items-start gap-4">
                <Avatar initials={c.avatarInitials} hue={c.avatarHue} size="md" />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/talent/${c.id}`}
                    className="font-semibold text-ink hover:text-accent"
                  >
                    {c.name}
                  </Link>
                  <p className="text-sm text-muted">
                    {c.role} · {c.verificationScore}% Verified
                  </p>
                  <div className="mt-3 space-y-1 text-sm">
                    <p>
                      <span className="font-medium text-ink">Matched required: </span>
                      <span className="text-verified">
                        {exp.matchedRequired.join(', ') || '—'}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-ink">Matched preferred: </span>
                      <span className="text-muted">
                        {exp.matchedPreferred.join(', ') || '—'}
                      </span>
                    </p>
                    {exp.additional.length > 0 && (
                      <p>
                        <span className="font-medium text-ink">Additional verified: </span>
                        <span className="text-muted">{exp.additional.slice(0, 4).join(', ')}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
