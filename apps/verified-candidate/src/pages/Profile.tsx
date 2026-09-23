import {
  ArrowRight,
  BadgeCheck,
  Eye,
  GraduationCap,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { ScoreBreakdown } from '../components/ScoreBreakdown'
import { SkillChip } from '../components/SkillChip'
import { useActivePersona, useJourney, useScore } from '../context/AppContext'
import { getCertificate } from '../data/certificates'
import { getSkill } from '../data/skillsCatalog'

function evidenceTriple(l1Score: number | undefined, l2Composite: number | null) {
  const knowledge = l1Score ?? 0
  const project = l2Composite ?? Math.max(0, knowledge - 4)
  const practical = Math.round(
    (knowledge * 0.4 + project * 0.4 + (l1Score != null ? l1Score : 70) * 0.2),
  )
  return { practical, knowledge, project }
}

export function Profile() {
  const persona = useActivePersona()
  const journey = useJourney()
  const score = useScore()
  const certificate = getCertificate(persona.id)

  const verifiedSkillIds = persona.coreSkillIds.filter(
    (id) => journey.examResults[id]?.status === 'passed',
  )
  const selfReportedIds = journey.claimedSkillIds.filter(
    (id) => !verifiedSkillIds.includes(id) && journey.dispositions[id] !== 'remove',
  )

  const l2Passed = Object.values(journey.projectResults).find((r) => r.status === 'passed')
  const l2Composite = l2Passed?.composite ?? null

  const displayOverall =
    journey.proIssued && persona.id === 'aarav'
      ? persona.overallTarget
      : score.overall != null
        ? Math.round(score.overall)
        : null

  const showCredential = journey.proIssued

  return (
    <div className="mx-auto max-w-[1100px] space-y-8 animate-fade-up">
      <div className="flex items-center gap-2 rounded-xl border border-accent/20 bg-accent-soft/50 px-4 py-3 text-[13px] font-medium text-accent">
        <Eye className="h-4 w-4 shrink-0" />
        Recruiter preview — what the HR dashboard would show for this candidate
      </div>

      <section className="overflow-hidden rounded-3xl border border-line bg-card shadow-card">
        <div className="flex flex-col gap-6 px-8 py-8 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="flex items-start gap-5">
            <Avatar
              initials={persona.avatarInitials}
              hue={persona.avatarHue}
              size="xl"
              name={persona.name}
            />
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-ink">
                {persona.name}
              </h1>
              <p className="mt-1 text-[15px] font-medium text-ink/80">
                {persona.trackTitle.replace(/^Verified /, '')}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {persona.location}
                </span>
                <span>{persona.experienceYears} years experience</span>
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {persona.education}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-canvas/80 px-6 py-5 text-center md:min-w-[160px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              Verification score
            </p>
            <p
              className={`mt-2 text-5xl font-semibold tabular-nums tracking-tight ${
                displayOverall != null && journey.proIssued
                  ? 'text-verified'
                  : 'text-ink'
              }`}
            >
              {displayOverall != null ? displayOverall : '—'}
              {displayOverall != null ? (
                <span className="ml-0.5 text-lg font-semibold opacity-70">%</span>
              ) : null}
            </p>
            {journey.proIssued ? (
              <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-verified-soft px-2 py-0.5 text-[11px] font-semibold text-verified">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            ) : (
              <p className="mt-2 text-[12px] text-muted">In progress</p>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-card p-6 shadow-card">
          <h2 className="text-sm font-semibold text-ink">Verified skills</h2>
          <p className="mt-1 text-[12px] text-muted">
            Independently verified — evaluated through our assessment process
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {verifiedSkillIds.length === 0 ? (
              <p className="text-[13px] text-muted">No L1 passes yet.</p>
            ) : (
              verifiedSkillIds.map((id) => (
                <SkillChip
                  key={id}
                  name={getSkill(id)?.name ?? id}
                  variant="verified"
                  core
                />
              ))
            )}
          </div>

          {verifiedSkillIds.length > 0 ? (
            <ul className="mt-6 space-y-4">
              {verifiedSkillIds.map((id) => {
                const exam = journey.examResults[id]
                const bars = evidenceTriple(exam?.score, l2Composite)
                return (
                  <li
                    key={id}
                    className="rounded-xl border border-line bg-canvas/50 px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-ink">
                        {getSkill(id)?.name ?? id}
                      </p>
                      <p className="text-sm font-semibold tabular-nums text-verified">
                        {exam?.score ?? '—'}%
                      </p>
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      {(
                        [
                          ['Practical', bars.practical],
                          ['Knowledge', bars.knowledge],
                          ['Project', bars.project],
                        ] as const
                      ).map(([label, value]) => (
                        <div key={label}>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                            {label}
                          </p>
                          <p className="mt-0.5 text-[13px] font-semibold tabular-nums text-ink">
                            {value}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-card p-6 shadow-card">
            <h2 className="text-sm font-semibold text-ink">Self-reported skills</h2>
            <p className="mt-1 text-[12px] text-muted">
              Claimed but not independently verified through L1
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {selfReportedIds.length === 0 ? (
                <p className="text-[13px] text-muted">None on profile.</p>
              ) : (
                selfReportedIds.map((id) => (
                  <SkillChip
                    key={id}
                    name={getSkill(id)?.name ?? id}
                    variant="self-reported"
                  />
                ))
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-card p-6 shadow-card">
            <h2 className="text-sm font-semibold text-ink">Credentials</h2>
            {showCredential ? (
              <div className="mt-4 rounded-xl border border-line bg-canvas/70 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Verified credential
                    </p>
                    <p className="mt-1 text-base font-semibold text-ink">
                      {certificate.title}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-md bg-verified-soft px-2 py-1 text-[11px] font-semibold text-verified">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Authentic
                  </span>
                </div>
                <dl className="mt-4 space-y-2 text-[13px]">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Issued</dt>
                    <dd className="font-semibold text-ink">{certificate.issuedOn}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Verification ID</dt>
                    <dd className="font-mono text-[12px] font-semibold text-ink">
                      {certificate.credentialId}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <p className="mt-3 text-[13px] text-muted">
                Pro credential appears here after issuance.
              </p>
            )}
          </section>

          {score.overall != null || journey.proIssued ? (
            <ScoreBreakdown score={score} compact />
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to={journey.proIssued ? '/certificate' : '/'}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
        >
          {journey.proIssued ? (
            <>
              <ShieldCheck className="h-4 w-4" />
              Jump to certificate
            </>
          ) : (
            <>
              Back to cockpit
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas"
        >
          Switch back to cockpit
        </Link>
        {journey.proIssued ? (
          <Link
            to={`/certificate/share?id=${encodeURIComponent(certificate.credentialId)}`}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas"
          >
            Public verify
          </Link>
        ) : null}
      </div>
    </div>
  )
}
