import { Badge } from '../ui/Badge'
import type { ProjectStatus, SupportLevel } from '../../types'

const statusMap: Record<ProjectStatus, { label: string; tone: 'teal' | 'green' | 'amber' | 'blue' | 'ink' | 'red' }> = {
  draft: { label: 'Draft', tone: 'ink' },
  submitted: { label: 'Submitted', tone: 'blue' },
  analyzing: { label: 'Analyzing', tone: 'amber' },
  analyzed: { label: 'Analyzed', tone: 'teal' },
  execution_ready: { label: 'Execution ready', tone: 'teal' },
  manual_review: { label: 'Manual review', tone: 'amber' },
  assessment_ready: { label: 'Assessment ready', tone: 'blue' },
  assessment_in_progress: { label: 'In assessment', tone: 'amber' },
  assessment_complete: { label: 'Assessment complete', tone: 'teal' },
  verified: { label: 'Verified', tone: 'green' },
}

const supportMap: Record<SupportLevel, { label: string; tone: 'green' | 'blue' | 'amber' | 'ink' }> = {
  fully: { label: 'Fully supported', tone: 'green' },
  partial: { label: 'Partial', tone: 'blue' },
  manual: { label: 'Manual review', tone: 'amber' },
  not_yet: { label: 'Not yet', tone: 'ink' },
}

export function ProjectStatusPill({ status }: { status: ProjectStatus }) {
  const s = statusMap[status]
  return <Badge tone={s.tone}>{s.label}</Badge>
}

export function SupportPill({ level }: { level: SupportLevel }) {
  const s = supportMap[level]
  return <Badge tone={s.tone}>{s.label}</Badge>
}
