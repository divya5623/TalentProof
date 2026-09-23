import type { ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  avgVerificationScore,
  demandVsSupply,
  funnel,
  mostRequestedSkills,
  talentAvailability,
  verifiedBySkill,
} from '../data/analytics';

export function Analytics() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-6 animate-fade-up">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          Recruitment intelligence
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">Analytics</h1>
        <p className="mt-2 text-sm text-muted">
          Verification-focused hiring signal — independently assessed talent, not a vanity dashboard.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Avg verification score
          </p>
          <p className="mt-3 text-4xl font-semibold tabular-nums text-ink">
            {avgVerificationScore}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Available now
          </p>
          <p className="mt-3 text-4xl font-semibold tabular-nums text-ink">
            {talentAvailability[0].value}%
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Hired this quarter
          </p>
          <p className="mt-3 text-4xl font-semibold tabular-nums text-ink">
            {funnel[funnel.length - 1].value}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Verified candidates by skill">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={verifiedBySkill}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
              <XAxis dataKey="skill" tick={{ fill: '#71717A', fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: '#71717A', fontSize: 12 }} axisLine={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6D4AFF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Most requested skills">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mostRequestedSkills} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#71717A', fontSize: 12 }} axisLine={false} />
              <YAxis
                type="category"
                dataKey="skill"
                width={90}
                tick={{ fill: '#71717A', fontSize: 12 }}
                axisLine={false}
              />
              <Tooltip />
              <Bar dataKey="requests" fill="#6D4AFF" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Skill demand vs verified talent">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={demandVsSupply}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
              <XAxis dataKey="skill" tick={{ fill: '#71717A', fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: '#71717A', fontSize: 12 }} axisLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="demand" fill="#A1A1AA" radius={[4, 4, 0, 0]} />
              <Bar dataKey="verified" fill="#16A34A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Hiring funnel">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={funnel}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
              <XAxis dataKey="stage" tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: '#71717A', fontSize: 12 }} axisLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6D4AFF"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#6D4AFF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Talent availability">
        <div className="flex flex-wrap gap-6 py-2">
          {talentAvailability.map((t) => (
            <div key={t.status} className="min-w-[140px]">
              <p className="text-3xl font-semibold tabular-nums text-ink">{t.value}%</p>
              <p className="text-sm text-muted">{t.status}</p>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)]">
      <h2 className="mb-4 text-base font-semibold tracking-tight text-ink">{title}</h2>
      {children}
    </div>
  );
}
