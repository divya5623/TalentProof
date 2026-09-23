import {
  Award,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Lock,
  PartyPopper,
  Share2,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CertificateCanvas } from '../components/CertificateCanvas'
import { Modal } from '../components/Modal'
import { ScoreBreakdown } from '../components/ScoreBreakdown'
import { useApp, useActivePersona, useJourney, useScore } from '../context/AppContext'
import { getCertificate } from '../data/certificates'
import { getPrimaryL2Repo } from '../data/evidence'
import { getSkill } from '../data/skillsCatalog'
import { isStepUnlocked } from '../lib/journey'

type GateItem = { id: string; label: string; done: boolean; to: string }

function evidenceBars(l1: number | null, l2: number | null, alignment: number) {
  const knowledge = l1 ?? 0
  const project = l2 ?? 0
  const practical =
    l1 != null && l2 != null
      ? Math.round(l1 * 0.45 + l2 * 0.4 + alignment * 0.15)
      : Math.round(alignment)
  return { practical, knowledge, project }
}

export function CertificateStudio() {
  const persona = useActivePersona()
  const journey = useJourney()
  const score = useScore()
  const { dispatch, toast } = useApp()
  const certificate = getCertificate(persona.id)
  const primaryL2 = getPrimaryL2Repo(persona.id)

  const eligible = isStepUnlocked('certificate', journey, persona)
  const issued = journey.proIssued

  const [celebrateOpen, setCelebrateOpen] = useState(false)
  const issuedAnimKey = `vc-cert-anim-${persona.id}`
  const animStarted = useRef(false)

  const gates: GateItem[] = useMemo(() => {
    const coreDone = persona.coreSkillIds.every(
      (id) => journey.examResults[id]?.status === 'passed',
    )
    const l2Done = Object.values(journey.projectResults).some((r) => r.status === 'passed')
    const honestyDone = journey.reconcileReviewed
    return [
      {
        id: 'honesty',
        label: 'Honesty Map reviewed (conflicts dispositioned)',
        done: honestyDone,
        to: '/reconcile',
      },
      {
        id: 'l1',
        label: `All ${persona.coreSkillIds.length} core L1 exams passed (≥70%)`,
        done: coreDone,
        to: '/exams',
      },
      {
        id: 'l2',
        label: '≥1 in-track L2 project passed',
        done: l2Done,
        to: '/projects',
      },
    ]
  }, [persona, journey])

  // Issue once when newly eligible; celebrate once per persona session.
  useEffect(() => {
    if (!eligible || animStarted.current) return
    animStarted.current = true

    if (!journey.proIssued) {
      dispatch({ type: 'ISSUE_PRO' })
      setCelebrateOpen(true)
      toast('Pro certificate issued', 'success')
      try {
        sessionStorage.setItem(issuedAnimKey, '1')
      } catch {
        /* ignore */
      }
      return
    }

    try {
      if (!sessionStorage.getItem(issuedAnimKey)) {
        sessionStorage.setItem(issuedAnimKey, '1')
        setCelebrateOpen(true)
      }
    } catch {
      /* ignore */
    }
  }, [eligible, journey.proIssued, dispatch, toast, issuedAnimKey])

  const displayOverall =
    persona.id === 'aarav' && (issued || eligible)
      ? persona.overallTarget
      : score.overall != null
        ? Math.round(score.overall)
        : persona.overallTarget

  const passedL2 = Object.entries(journey.projectResults).find(
    ([, r]) => r.status === 'passed',
  )
  const l2Label = passedL2
    ? `${passedL2[0]} · ${passedL2[1].composite}%`
    : primaryL2
      ? `${primaryL2.name} (pending)`
      : undefined

  const bars = evidenceBars(score.l1, score.l2, score.alignment)
  const publicPath = `/certificate/share?id=${encodeURIComponent(certificate.credentialId)}`

  const copyLink = async () => {
    const url = `${window.location.origin}${publicPath}`
    try {
      await navigator.clipboard.writeText(url)
      toast('Public verify link copied', 'success')
    } catch {
      toast(`Link: ${publicPath}`, 'info')
    }
  }

  if (!eligible) {
    return (
      <div className="mx-auto max-w-[720px] space-y-6 animate-fade-up">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            Pro certificate
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            Not eligible yet
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            Clear every Pro gate below. Don&apos;t trust the claim — verify the skill
            first.
          </p>
        </header>

        <div className="rounded-2xl border border-line bg-card p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-canvas text-muted">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Missing gates</p>
              <p className="text-[13px] text-muted">
                All core L1 + ≥1 L2 + Honesty Map required
              </p>
            </div>
          </div>
          <ul className="mt-5 space-y-3">
            {gates.map((g) => (
              <li
                key={g.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas/60 px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {g.done ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-verified" />
                  ) : (
                    <Lock className="h-5 w-5 shrink-0 text-muted" />
                  )}
                  <span
                    className={`text-[13px] font-medium ${
                      g.done ? 'text-ink' : 'text-muted'
                    }`}
                  >
                    {g.label}
                  </span>
                </div>
                {!g.done ? (
                  <Link
                    to={g.to}
                    className="shrink-0 text-[12px] font-semibold text-accent hover:underline"
                  >
                    Go
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-8 animate-fade-up">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            Certificate studio
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            {issued ? 'Your Pro credential' : 'Issuing Pro credential…'}
          </h1>
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted">
            {certificate.credentialId} · {certificate.title} · issued{' '}
            {certificate.issuedOn}
            {persona.id === 'aarav' ? ' · locked HR match (94)' : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => toast('PDF download is mock-only in this prototype', 'info')}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas"
          >
            <Copy className="h-4 w-4" />
            Copy public link
          </button>
          <Link
            to={publicPath}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
          >
            <ExternalLink className="h-4 w-4" />
            Open public verify
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <CertificateCanvas
          persona={persona}
          certificate={certificate}
          overall={displayOverall}
          celebrate={celebrateOpen}
          l1BadgeIds={certificate.skillBadgeIds}
          l2Label={l2Label}
        />

        <div className="space-y-6">
          <ScoreBreakdown score={score} compact />

          <section className="rounded-2xl border border-line bg-card p-6 shadow-card">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-semibold text-ink">Evidence pack preview</h3>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-muted">
              Independently verified — evaluated through our assessment process
            </p>
            <ul className="mt-4 space-y-3">
              {(
                [
                  ['Practical Assessment', bars.practical],
                  ['Technical Knowledge', bars.knowledge],
                  ['Project Evaluation', bars.project],
                ] as const
              ).map(([label, value]) => (
                <li key={label}>
                  <div className="mb-1.5 flex justify-between text-[13px]">
                    <span className="font-medium text-ink">{label}</span>
                    <span className="font-semibold tabular-nums text-ink">{value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-verified transition-all duration-700"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {certificate.skillBadgeIds.map((id) => (
                <span
                  key={id}
                  className="rounded-md border border-line bg-canvas px-2 py-0.5 text-[11px] font-medium text-ink"
                >
                  {getSkill(id)?.name ?? id}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-dashed border-line bg-canvas/50 p-5">
            <div className="flex items-start gap-3">
              <Share2 className="mt-0.5 h-4 w-4 text-muted" />
              <div>
                <p className="text-sm font-semibold text-ink">Public share</p>
                <p className="mt-1 font-mono text-[12px] text-muted">{publicPath}</p>
                <p className="mt-2 text-[12px] text-muted">
                  Chrome-light verify page — no persona switcher, Authentic badge only.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Modal
        open={celebrateOpen}
        onClose={() => setCelebrateOpen(false)}
        title="Pro certificate issued"
        hideClose
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-verified-soft text-verified">
            <PartyPopper className="h-7 w-7" />
          </div>
          <div>
            <p className="text-lg font-semibold text-ink">{certificate.title}</p>
            <p className="mt-2 font-mono text-sm font-semibold tracking-wide text-ink">
              {certificate.credentialId}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              Overall {displayOverall}% · issued {certificate.issuedOn}. Share the public
              verify link with recruiters.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCelebrateOpen(false)}
            className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5b3ce0]"
          >
            View certificate
          </button>
        </div>
      </Modal>
    </div>
  )
}
