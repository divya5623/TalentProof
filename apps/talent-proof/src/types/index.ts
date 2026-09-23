export type Role = 'student' | 'recruiter' | 'guest'

export type SupportLevel = 'fully' | 'partial' | 'manual' | 'not_yet'

export type ProjectStatus =
  | 'draft'
  | 'submitted'
  | 'analyzing'
  | 'analyzed'
  | 'execution_ready'
  | 'manual_review'
  | 'assessment_ready'
  | 'assessment_in_progress'
  | 'assessment_complete'
  | 'verified'

export type BadgeLevel = 'observed' | 'explained' | 'verified'

export interface Persona {
  id: string
  role: Role
  name: string
  email: string
  title: string
  school?: string
  company?: string
  avatarInitials: string
  bio: string
  skills: string[]
  location: string
}

export interface TechEntry {
  id: string
  name: string
  category: string
  level: SupportLevel
  notes: string
}

export interface MockFile {
  path: string
  language: string
  lines: number
  summary: string
  functions?: string[]
}

export interface ObservedEvidence {
  structure: { label: string; value: string }[]
  languages: { name: string; pct: number; files: number }[]
  frameworks: string[]
  qualitySignals: { label: string; status: 'pass' | 'warn' | 'info'; detail: string }[]
}

export interface AiInterpretation {
  summary: string
  strengths: string[]
  concerns: string[]
  aiDetectSignal: {
    score: number
    label: string
    disclaimer: string
  }
}

export interface UncertaintyItem {
  area: string
  reason: string
  mitigation: string
}

export interface ExecutionFixture {
  projectId: string
  labeledAs: 'Trusted sample execution'
  stackSupported: boolean
  commands: { cmd: string; status: 'ok' | 'fail' | 'skip'; output: string; durationMs: number }[]
  tests: { name: string; status: 'passed' | 'failed' | 'skipped'; durationMs: number }[]
  summary: { passed: number; failed: number; skipped: number; durationMs: number }
  notes: string
}

export interface AssessmentQuestion {
  id: string
  type: 'mcq' | 'written' | 'debug'
  prompt: string
  references: { file: string; symbol?: string }[]
  options?: string[]
  correctIndex?: number
  sampleAnswerHint?: string
  points: number
}

export interface IntegrityEvent {
  id: string
  at: string
  type: string
  detail: string
  severity: 'info' | 'warn'
}

export interface BadgeRule {
  id: string
  name: string
  level: BadgeLevel
  criteria: string[]
  earned: boolean
  earnedAt?: string
}

export interface ContactRequest {
  id: string
  recruiterId: string
  studentId: string
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  skillFocus: string
}

export interface Project {
  id: string
  studentId: string
  title: string
  category: string
  stack: string[]
  contribution: string
  teammates: string[]
  setupNotes: string
  sourceType: 'zip' | 'github' | 'url'
  sourceLabel: string
  status: ProjectStatus
  submittedAt: string
  files: MockFile[]
  observed: ObservedEvidence
  ai: AiInterpretation
  uncertainty: UncertaintyItem[]
  questions: AssessmentQuestion[]
  badges: BadgeRule[]
  shareId: string
  skillTags: string[]
  supportLevel: SupportLevel
}
