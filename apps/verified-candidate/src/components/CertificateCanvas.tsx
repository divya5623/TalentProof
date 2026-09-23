import { BadgeCheck, QrCode } from 'lucide-react'
import type { CertificatePayload, Persona } from '../types'
import { getSkill } from '../data/skillsCatalog'

interface Props {
  persona: Persona
  certificate: CertificatePayload
  overall: number
  /** Emphasize first-issue flash */
  celebrate?: boolean
  l1BadgeIds?: string[]
  l2Label?: string
}

function formatIssued(iso: string): string {
  const d = new Date(iso.includes('T') ? iso : `${iso}T12:00:00`)
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Pro certificate visual — name, track title, overall, credential ID, issue date,
 * L1/L2 skill badges, QR placeholder.
 */
export function CertificateCanvas({
  persona,
  certificate,
  overall,
  celebrate = false,
  l1BadgeIds,
  l2Label,
}: Props) {
  const badges = (l1BadgeIds ?? certificate.skillBadgeIds)
    .map((id) => getSkill(id)?.name ?? id)
    .filter(Boolean)

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-line bg-white shadow-lift ${
        celebrate ? 'ring-2 ring-verified/40' : ''
      }`}
    >
      <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-accent-soft/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-verified-soft/50 blur-3xl" />

      <div className="relative border-b border-line bg-gradient-to-br from-white via-white to-accent-soft/30 px-8 py-8 md:px-10 md:py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              VERIFIED · Pro certificate
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              {persona.name}
            </h2>
            <p className="mt-2 text-base font-medium text-ink/80">
              {certificate.title}
            </p>
            <p className="mt-1 text-[13px] text-muted">
              {persona.location} · {persona.experienceYears} yrs experience
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-verified px-2.5 py-1 text-[11px] font-semibold text-white">
              <BadgeCheck className="h-3.5 w-3.5" />
              Authentic
            </span>
            <p className="text-4xl font-semibold tabular-nums tracking-tight text-verified md:text-5xl">
              {Math.round(overall)}
              <span className="ml-0.5 text-lg font-semibold text-verified/70">%</span>
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Overall score
            </p>
          </div>
        </div>
      </div>

      <div className="relative grid gap-8 px-8 py-8 md:grid-cols-[1fr_auto] md:px-10 md:py-9">
        <div className="space-y-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-canvas/70 px-4 py-3">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Credential ID
              </dt>
              <dd className="mt-1 font-mono text-sm font-semibold tracking-wide text-ink">
                {certificate.credentialId}
              </dd>
            </div>
            <div className="rounded-xl border border-line bg-canvas/70 px-4 py-3">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                Issued
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink">
                {formatIssued(certificate.issuedOn)}
              </dd>
            </div>
          </dl>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              L1 verified skills
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {badges.map((name) => (
                <span
                  key={name}
                  className="rounded-md border border-verified/15 bg-verified-soft/50 px-2.5 py-1 text-[11px] font-medium text-verified"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          {l2Label ? (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                L2 project verification
              </p>
              <p className="mt-2 inline-flex rounded-md border border-accent/20 bg-accent-soft/60 px-2.5 py-1 text-[12px] font-semibold text-accent">
                {l2Label}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-canvas/50 px-6 py-5">
          <div className="flex h-28 w-28 items-center justify-center rounded-xl border border-line bg-white text-muted shadow-sm">
            <QrCode className="h-16 w-16" strokeWidth={1.25} aria-hidden />
          </div>
          <p className="text-center text-[11px] text-muted">
            QR placeholder
            <br />
            <span className="font-mono text-[10px]">{certificate.publicSlug}</span>
          </p>
        </div>
      </div>

      <div className="border-t border-line px-8 py-4 md:px-10">
        <p className="text-[12px] leading-relaxed text-muted">
          Don&apos;t trust the claim. Verify the skill. Independently verified through
          the VERIFIED assessment process.
        </p>
      </div>
    </div>
  )
}
