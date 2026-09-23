import { useMemo, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
  Shield,
  Target,
  XCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { MetricCard } from '../components/MetricCard'
import { Modal } from '../components/Modal'
import { useActivePersona, useJourney } from '../context/AppContext'
import { getExam } from '../data/exams'
import { getSkill } from '../data/skillsCatalog'
import type { ExamStatus, JourneyProgress } from '../types'

type LobbyStatus = Exclude<ExamStatus, 'incomplete'> | 'available'

interface ExamCardModel {
  skillId: string
  name: string
  core: boolean
  durationMin: number
  passScore: number
  status: LobbyStatus
  score?: number
  attemptedAt?: string
}

function resolveStatus(
  skillId: string,
  claimed: Set<string>,
  examResults: JourneyProgress['examResults'],
): LobbyStatus {
  if (!claimed.has(skillId)) return 'locked'
  const result = examResults[skillId]
  if (!result) return 'available'
  if (result.status === 'passed') return 'passed'
  if (result.status === 'failed') return 'failed'
  return 'available'
}

const statusStyles: Record<
  LobbyStatus,
  { label: string; chip: string; icon: typeof Lock }
> = {
  locked: {
    label: 'Locked',
    chip: 'bg-canvas text-muted border-line',
    icon: Lock,
  },
  available: {
    label: 'Available',
    chip: 'bg-accent-soft text-accent border-accent/20',
    icon: Target,
  },
  passed: {
    label: 'Passed',
    chip: 'bg-verified-soft/70 text-verified border-verified/20',
    icon: CheckCircle2,
  },
  failed: {
    label: 'Failed',
    chip: 'bg-red-50 text-danger border-danger/20',
    icon: XCircle,
  },
}

export function ExamsLobby() {
  const persona = useActivePersona()
  const journey = useJourney()
  const [resultSkillId, setResultSkillId] = useState<string | null>(null)

  const claimed = useMemo(
    () => new Set(journey.claimedSkillIds),
    [journey.claimedSkillIds],
  )

  const cards: ExamCardModel[] = useMemo(() => {
    const coreIds = persona.coreSkillIds
    const additionalClaimed = journey.claimedSkillIds.filter(
      (id) => !coreIds.includes(id) && getExam(id),
    )
    const ordered = [...coreIds, ...additionalClaimed]
    return ordered.map((skillId) => {
      const exam = getExam(skillId)
      const skill = getSkill(skillId)
      const status = resolveStatus(skillId, claimed, journey.examResults)
      const result = journey.examResults[skillId]
      return {
        skillId,
        name: skill?.name ?? skillId,
        core: persona.coreSkillIds.includes(skillId),
        durationMin: exam?.durationMin ?? 25,
        passScore: exam?.passScore ?? 70,
        status,
        score: result?.score,
        attemptedAt: result?.attemptedAt,
      }
    })
  }, [persona, journey.claimedSkillIds, journey.examResults, claimed])

  const passedCore = persona.coreSkillIds.filter(
    (id) => journey.examResults[id]?.status === 'passed',
  ).length
  const availableCount = cards.filter((c) => c.status === 'available').length
  const failedCount = cards.filter((c) => c.status === 'failed').length

  const resultCard = cards.find((c) => c.skillId === resultSkillId) ?? null

  return (
    <div className="mx-auto max-w-[1040px] space-y-8 animate-fade-up">
      <header className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          L1 Exams
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Skill exam lobby
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          Timed knowledge checks for claimed skills. Pass mark is{' '}
          <span className="font-semibold text-ink">70%</span>. One core pass unlocks
          Projects; all core passes are required for Pro.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Core L1 passed"
          value={`${passedCore}/${persona.coreSkillIds.length}`}
          hint="Required set for Pro"
          tone={passedCore === persona.coreSkillIds.length ? 'verified' : 'default'}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <MetricCard
          label="Available now"
          value={String(availableCount)}
          hint="Ready to start or retake"
          tone="accent"
          icon={<Target className="h-4 w-4" />}
        />
        <MetricCard
          label="Failed / retake"
          value={String(failedCount)}
          hint="Available immediately"
          tone={failedCount > 0 ? 'warning' : 'muted'}
          icon={<XCircle className="h-4 w-4" />}
        />
      </div>

      <div className="flex gap-3 rounded-2xl border border-accent/15 bg-accent-soft/40 px-5 py-4">
        <Shield className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <div>
          <p className="text-sm font-semibold text-ink">Integrity theater</p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            Exam rooms show a mock camera strip and focus warnings. This prototype
            never captures media or enforces proctoring — demos stay safe and
            local.
          </p>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => {
          const meta = statusStyles[card.status]
          const StatusIcon = meta.icon
          const locked = card.status === 'locked'
          const passed = card.status === 'passed'
          const failed = card.status === 'failed'
          const canStart = card.status === 'available' || failed

          return (
            <article
              key={card.skillId}
              className={`flex flex-col rounded-2xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift ${
                failed
                  ? 'border-danger/35 hover:border-danger/50'
                  : passed
                    ? 'border-verified/25 hover:border-verified/40'
                    : 'border-line hover:border-accent/15'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold tracking-tight text-ink">
                      {card.name}
                    </h2>
                    {card.core ? (
                      <span className="rounded-md bg-canvas px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                        Core
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[13px] text-muted">
                    Pass mark {card.passScore}% · demo timer ≈ 60s for{' '}
                    {card.durationMin} min
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${meta.chip}`}
                >
                  <StatusIcon className="h-3.5 w-3.5" />
                  {meta.label}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-[12px] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {card.durationMin} min blueprint
                </span>
                {typeof card.score === 'number' ? (
                  <span
                    className={`inline-flex items-center gap-1.5 font-semibold tabular-nums ${
                      passed ? 'text-verified' : failed ? 'text-danger' : 'text-ink'
                    }`}
                  >
                    Score {card.score}%
                  </span>
                ) : null}
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
                {canStart ? (
                  <Link
                    to={`/exams/${card.skillId}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
                  >
                    {failed ? 'Retake exam' : 'Start exam'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}
                {failed ? (
                  <p className="w-full text-[12px] text-danger">
                    Below 70% pass mark — retake available immediately (no cooldown).
                  </p>
                ) : null}
                {passed ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setResultSkillId(card.skillId)}
                      className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-canvas"
                    >
                      View result
                    </button>
                    <Link
                      to={`/exams/${card.skillId}`}
                      className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-muted transition hover:bg-canvas hover:text-ink"
                    >
                      Review room
                    </Link>
                  </>
                ) : null}
                {locked ? (
                  <p className="text-[13px] text-muted">
                    Claim this skill on Claims to unlock the exam.
                  </p>
                ) : null}
              </div>
            </article>
          )
        })}
      </section>

      {passedCore >= 1 ? (
        <div className="rounded-2xl border border-verified/20 bg-verified-soft/40 px-5 py-4">
          <p className="text-sm font-semibold text-verified">Projects unlocked</p>
          <p className="mt-1 text-[13px] text-muted">
            You have ≥1 core L1 pass. Continue to L2 project audits when ready —
            Pro still needs every core exam.
          </p>
          <Link
            to="/projects"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            Open projects lobby
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : null}

      <Modal
        open={Boolean(resultCard)}
        onClose={() => setResultSkillId(null)}
        title={resultCard ? `${resultCard.name} · L1 result` : 'Result'}
      >
        {resultCard ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-line bg-canvas px-4 py-5 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                Score
              </p>
              <p
                className={`mt-2 text-5xl font-semibold tabular-nums tracking-tight ${
                  resultCard.status === 'passed' ? 'text-verified' : 'text-danger'
                }`}
              >
                {resultCard.score ?? '—'}%
              </p>
              <p className="mt-2 text-sm text-muted">
                Pass mark {resultCard.passScore}% ·{' '}
                {resultCard.status === 'passed' ? 'L1 badge earned' : 'Below threshold'}
              </p>
            </div>
            {resultCard.attemptedAt ? (
              <p className="text-[12px] text-muted">
                Attempted{' '}
                {new Date(resultCard.attemptedAt).toLocaleString('en-IN', {
                  timeZone: 'Asia/Calcutta',
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}{' '}
                IST
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => setResultSkillId(null)}
              className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5b3ce0]"
            >
              Close
            </button>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
