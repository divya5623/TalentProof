export type PersonaId = 'aarav' | 'priya' | 'kabir' | 'ananya';
export type TrackId = 'frontend' | 'backend' | 'data-ml' | 'mobile';
export type HonestyState = 'aligned' | 'weak' | 'conflict' | 'missing';
export type ReconcileDisposition = 'keep' | 'remove' | 'note' | null;
export type ExamStatus = 'locked' | 'available' | 'passed' | 'failed' | 'incomplete';
export type JourneyStep =
  | 'onboarding'
  | 'claims'
  | 'evidence'
  | 'reconcile'
  | 'exams'
  | 'projects'
  | 'certificate'
  | 'share';

export interface JourneyProgress {
  onboardingComplete: boolean;
  claimedSkillIds: string[];
  resumeAttached: boolean;
  githubConnected: boolean;
  includedRepoIds: string[];
  reconcileReviewed: boolean;
  dispositions: Record<string, ReconcileDisposition>;
  evidenceNotes: Record<string, string>;
  examResults: Record<
    string,
    { score: number; status: 'passed' | 'failed' | 'incomplete'; attemptedAt: string }
  >;
  projectResults: Record<
    string,
    { composite: number; authorship: number; status: 'passed' | 'failed' | 'incomplete' }
  >;
  proIssued: boolean;
  shareEnabled: boolean;
}

export interface Persona {
  id: PersonaId;
  name: string;
  trackId: TrackId;
  trackTitle: string;
  location: string;
  experienceYears: number;
  education: string;
  avatarInitials: string;
  avatarHue: number;
  githubHandle: string;
  credentialId: string;
  publicSlug: string;
  integritySeed: number;
  overallTarget: number;
  coreSkillIds: string[];
  additionalSkillIds: string[];
}

export interface SkillDef {
  id: string;
  name: string;
  trackId: TrackId;
  core: boolean;
}

export interface ResumeParseResult {
  fileName: string;
  skills: { skillId: string; confidence: number; snippet: string }[];
}

export interface GithubRepo {
  id: string;
  name: string;
  languages: { name: string; pct: number }[];
  authorshipPct: number;
  primaryL2: boolean;
  description: string;
}

export interface HonestyRow {
  skillId: string;
  resume: boolean;
  github: boolean;
  state: HonestyState;
}

export interface ExamQuestion {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  kind: 'mcq' | 'practical';
}

export interface ExamBlueprint {
  skillId: string;
  durationMin: number;
  passScore: 70;
  questions: ExamQuestion[];
}

export interface ArchQuestion {
  id: string;
  prompt: string;
  rubricMax: number;
  demoAnswerScore: number;
}

export interface ProjectDef {
  repoId: string;
  personaId: PersonaId;
  heatmap: { file: string; ownership: number }[];
  architectureQs: ArchQuestion[];
  stackMatchSkillIds: string[];
}

export interface CertificatePayload {
  personaId: PersonaId;
  title: string;
  credentialId: string;
  issuedOn: string;
  skillBadgeIds: string[];
  publicSlug: string;
}

export interface ScoreComponents {
  l1: number | null;
  l2: number | null;
  alignment: number;
  integrity: number;
  overall: number | null;
  weights: { l1: 40; l2: 35; alignment: 15; integrity: 10 };
}

export interface AppUiState {
  toast?: { id: string; message: string; toastType: 'success' | 'info' | 'warning' | 'error' } | null;
  examSession?: { skillId: string; startedAt: string } | null;
  projectAuditSession?: { repoId: string } | null;
  resumeParsePhase?: 'idle' | 'uploading' | 'parsing' | 'extracted';
  githubConnectPhase?: 'idle' | 'connecting' | 'connected';
}

export interface AppState {
  activePersonaId: PersonaId;
  journeyByPersona: Record<PersonaId, JourneyProgress>;
  ui: AppUiState;
}
