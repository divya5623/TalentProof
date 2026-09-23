export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  scenario: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface TestCase {
  id: string;
  name: string;
  type: 'normal' | 'boundary' | 'concurrency';
  inputDesc: string;
  expectedDesc: string;
}

export interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  bugExplanation: string;
  initialCode: string;
  solutionCode: string;
  testCases: TestCase[];
}

export interface Skill {
  id: string;
  title: string;
  category: string;
  difficulty: 'Intermediate' | 'Advanced';
  duration: string;
  badgeCode: string;
  syllabus: string[];
  quizQuestions: QuizQuestion[];
  codingChallenge: CodingChallenge;
}

export interface Badge {
  id: string;
  skillId: string;
  skillTitle: string;
  issuedAt: string;
  sha256Hash: string;
  proctorScore: number;
  technicalScore: number;
  overallScore: number;
  verifiedBy: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'violation';
  message: string;
}

export interface ProctorLog {
  faceDrops: number;
  faceLockConfirmed: boolean;
  tabSwitches: number;
  clipboardAnomalies: number;
  fullscreenExits: number;
  devtoolsAttempts: number;
  integrityScore: number;
  timelineEvents: TimelineEvent[];
}

export interface CurrentStudent {
  name: string;
  avatar: string;
  university: string;
  graduationYear: string;
  githubHandle: string;
  email: string;
  targetRole: string;
  earnedBadges: Badge[];
}
