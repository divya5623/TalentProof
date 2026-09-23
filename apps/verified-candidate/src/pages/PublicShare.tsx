import { BadgeCheck, ShieldCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CertificateCanvas } from '../components/CertificateCanvas'
import { EmptyState } from '../components/EmptyState'
import { Modal } from '../components/Modal'
import { SkillChip } from '../components/SkillChip'
import { useApp } from '../context/AppContext'
import {
  findCertificateByCredentialId,
  getCertificate,
} from '../data/certificates'
import { getHonestyMap } from '../data/honestyMaps'
import { completeJourneyTargets, getPersona } from '../data/personas'
import { computeScoreComponents } from '../data/scores'
import { getSkill } from '../data/skillsCatalog'
import type { CertificatePayload, PersonaId } from '../types'

function derivePublishedOverall(personaId: PersonaId): number {
  const persona = getPersona(personaId)
  if (personaId === 'aarav') return persona.overallTarget

  const journey = completeJourneyTargets[personaId]
  const claimed = new Set(journey.claimedSkillIds)
  const honestyStates = getHonestyMap(personaId)
    .filter((row) => claimed.has(row.skillId))
    .filter((row) => journey.dispositions[row.skillId] !== 'remove')
    .map((row) => row.state)
  const l1Scores = persona.coreSkillIds
    .map((id) => journey.examResults[id]?.score)
    .filter((n): n is number => typeof n === 'number')
  const l2Scores = Object.values(journey.projectResults)
    .filter((r) => r.status === 'passed' || r.status === 'failed')
    .map((r) => r.composite)
  const score = computeScoreComponents({
    l1Scores,
    l2Scores,
    honestyStates,
    integrity: persona.integritySeed,
  })
  return score.overall != null ? Math.round(score.overall) : persona.overallTarget
}

function resolveCertificate(
  idParam: string | null,
  activePersonaId: PersonaId,
  activeProIssued: boolean,
):
  | { ok: true; certificate: CertificatePayload; source: 'query' | 'active' | 'fallback' }
  | { ok: false; reason: string } {
  if (idParam && idParam.trim()) {
    const found = findCertificateByCredentialId(idParam.trim())
    if (!found) {
      return {
        ok: false,
        reason: `No Authentic credential found for ID “${idParam.trim()}”. Check the verification ID and try again.`,
      }
    }
    return { ok: true, certificate: found, source: 'query' }
  }
  if (activeProIssued) {
    return {
      ok: true,
      certificate: getCertificate(activePersonaId),
      source: 'active',
    }
  }
  return {
    ok: true,
    certificate: getCertificate('aarav'),
    source: 'fallback',
  }
}

export function PublicShare() {
  const [params] = useSearchParams()
  const { activePersonaId, journeyByPersona } = useApp()
  const idParam = params.get('id')
  const [verifyInput, setVerifyInput] = useState('')
  const [authenticOpen, setAuthenticOpen] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)

  const resolved = useMemo(
    () =>
      resolveCertificate(
        idParam,
        activePersonaId,
        journeyByPersona[activePersonaId]?.proIssued ?? false,
      ),
    [idParam, activePersonaId, journeyByPersona],
  )

  useEffect(() => {
    if (resolved.ok) {
      setVerifyInput(resolved.certificate.credentialId)
    } else if (idParam) {
      setVerifyInput(idParam)
    }
  }, [resolved, idParam])

  if (!resolved.ok) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="Credential not found"
        body={resolved.reason}
        ctaLabel="Try VRF-92831 (Aarav)"
        ctaTo="/certificate/share?id=VRF-92831"
        secondary={
          <Link
            to="/certificate/share"
            className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas"
          >
            Open demo fallback
          </Link>
        }
      />
    )
  }

  const { certificate, source } = resolved
  const owner = getPersona(certificate.personaId)
  const overall = derivePublishedOverall(certificate.personaId)
  const skillNames = certificate.skillBadgeIds
    .map((id) => getSkill(id)?.name ?? id)
    .filter(Boolean)

  const runVerify = () => {
    const typed = verifyInput.trim()
    if (!typed) {
      setVerifyError('Enter a verification ID')
      return
    }
    const match = findCertificateByCredentialId(typed)
    if (!match || match.credentialId !== certificate.credentialId) {
      setVerifyError(
        match
          ? 'That ID belongs to a different credential. Open its share link to verify.'
          : 'ID does not match an Authentic VERIFIED credential.',
      )
      return
    }
    setVerifyError(null)
    setAuthenticOpen(true)
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-verified px-2.5 py-1 text-[11px] font-semibold text-white">
          <BadgeCheck className="h-3.5 w-3.5" />
          Authentic
        </span>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          Public credential verify
        </h1>
        <p className="mt-2 text-[14px] text-muted">
          {owner.name} · {certificate.title}
          {source === 'fallback' ? (
            <span className="ml-1 text-[12px]">(demo published fallback)</span>
          ) : null}
        </p>
      </header>

      <CertificateCanvas
        persona={owner}
        certificate={certificate}
        overall={overall}
        l1BadgeIds={certificate.skillBadgeIds}
      />

      <section className="rounded-2xl border border-line bg-card p-6 shadow-card">
        <h2 className="text-sm font-semibold text-ink">Verification score</h2>
        <p className="mt-1 text-4xl font-semibold tabular-nums text-verified">
          {overall}
          <span className="ml-1 text-base font-semibold text-verified/70">%</span>
        </p>
        <p className="mt-3 text-[12px] text-muted">
          Independently verified — evaluated through our assessment process
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {skillNames.map((name) => (
            <SkillChip key={name} name={name} variant="verified" />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-card p-6 shadow-card">
        <h2 className="text-sm font-semibold text-ink">Verify credential ID</h2>
        <p className="mt-1 text-[13px] text-muted">
          Confirm this page matches the printed or shared verification ID.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={verifyInput}
            onChange={(e) => {
              setVerifyInput(e.target.value)
              setVerifyError(null)
            }}
            placeholder="VRF-xxxxx"
            className="flex-1 rounded-xl border border-line bg-white px-4 py-2.5 font-mono text-sm text-ink outline-none ring-accent focus:ring-2"
            aria-label="Verification ID"
          />
          <button
            type="button"
            onClick={runVerify}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
          >
            <ShieldCheck className="h-4 w-4" />
            Verify credential
          </button>
        </div>
        {verifyError ? (
          <p className="mt-2 text-[13px] font-medium text-danger">{verifyError}</p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-line bg-card p-6 shadow-card">
        <h2 className="text-sm font-semibold text-ink">Evidence summary</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          {(
            [
              ['Practical', 'L1 + L2 applied ability'],
              ['Knowledge', 'Timed L1 exam aggregate'],
              ['Project', 'L2 authorship + architecture'],
            ] as const
          ).map(([title, body]) => (
            <div
              key={title}
              className="rounded-xl border border-line bg-canvas/70 px-4 py-3"
            >
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                {title}
              </dt>
              <dd className="mt-1 text-[13px] font-medium text-ink">{body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="border-t border-line pt-6 text-center">
        <p className="text-[13px] font-medium text-ink">
          Don&apos;t trust the claim. Verify the skill.
        </p>
        <p className="mt-1 text-[12px] text-muted">
          VERIFIED Candidate · public verify · no edit controls
        </p>
      </footer>

      <Modal
        open={authenticOpen}
        onClose={() => setAuthenticOpen(false)}
        title="Credential Authentic"
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-verified text-white">
            <BadgeCheck className="h-7 w-7" />
          </div>
          <div>
            <p className="text-lg font-semibold text-ink">Authentic</p>
            <p className="mt-2 font-mono text-sm font-semibold tracking-wide">
              {certificate.credentialId}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              {owner.name}&apos;s {certificate.title} matches VERIFIED records. Issued{' '}
              {certificate.issuedOn} · overall {overall}%.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAuthenticOpen(false)}
            className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5b3ce0]"
          >
            Done
          </button>
        </div>
      </Modal>
    </div>
  )
}
