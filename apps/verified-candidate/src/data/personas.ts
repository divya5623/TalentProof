import type { JourneyProgress, Persona, PersonaId } from '../types';

export const personas: Persona[] = [
  {
    id: 'aarav',
    name: 'Aarav Sharma',
    trackId: 'frontend',
    trackTitle: 'Verified Frontend Engineer',
    location: 'Bengaluru, India',
    experienceYears: 2,
    education: 'B.Tech Computer Science, NIT Trichy',
    avatarInitials: 'AS',
    avatarHue: 262,
    githubHandle: 'aaravsharma-dev',
    credentialId: 'VRF-92831',
    publicSlug: 'aarav-sharma-frontend',
    integritySeed: 96,
    overallTarget: 94,
    coreSkillIds: ['react', 'javascript', 'typescript', 'nextjs'],
    additionalSkillIds: ['figma', 'graphql'],
  },
  {
    id: 'priya',
    name: 'Priya Nair',
    trackId: 'backend',
    trackTitle: 'Verified Backend Engineer',
    location: 'Hyderabad, India',
    experienceYears: 3,
    education: 'B.E. Information Technology, BITS Pilani',
    avatarInitials: 'PN',
    avatarHue: 198,
    githubHandle: 'priyanair-api',
    credentialId: 'VRF-10442',
    publicSlug: 'priya-nair-backend',
    integritySeed: 92,
    overallTarget: 91,
    coreSkillIds: ['nodejs', 'rest-apis', 'postgresql', 'system-design'],
    additionalSkillIds: ['redis', 'docker'],
  },
  {
    id: 'kabir',
    name: 'Kabir Mehta',
    trackId: 'data-ml',
    trackTitle: 'Verified Data/ML Engineer',
    location: 'Pune, India',
    experienceYears: 2,
    education: 'M.Sc. Data Science, IIIT Hyderabad',
    avatarInitials: 'KM',
    avatarHue: 32,
    githubHandle: 'kabirmehta-ml',
    credentialId: 'VRF-22107',
    publicSlug: 'kabir-mehta-data-ml',
    integritySeed: 90,
    overallTarget: 89,
    coreSkillIds: ['python', 'sql', 'machine-learning', 'data-wrangling'],
    additionalSkillIds: ['pytorch', 'tableau'],
  },
  {
    id: 'ananya',
    name: 'Ananya Iyer',
    trackId: 'mobile',
    trackTitle: 'Verified Mobile Engineer',
    location: 'Chennai, India',
    experienceYears: 2,
    education: 'B.Tech CSE, College of Engineering Guindy',
    avatarInitials: 'AI',
    avatarHue: 340,
    githubHandle: 'ananyaiyer-apps',
    credentialId: 'VRF-33518',
    publicSlug: 'ananya-iyer-mobile',
    integritySeed: 91,
    overallTarget: 90,
    coreSkillIds: ['react-native', 'flutter', 'mobile-ui', 'app-state'],
    additionalSkillIds: ['firebase', 'app-store'],
  },
];

export const personasById: Record<PersonaId, Persona> = Object.fromEntries(
  personas.map((p) => [p.id, p]),
) as Record<PersonaId, Persona>;

function emptyJourney(): JourneyProgress {
  return {
    onboardingComplete: false,
    claimedSkillIds: [],
    resumeAttached: false,
    githubConnected: false,
    includedRepoIds: [],
    reconcileReviewed: false,
    dispositions: {},
    evidenceNotes: {},
    examResults: {},
    projectResults: {},
    proIssued: false,
    shareEnabled: false,
  };
}

/**
 * Demo-friendly seeds:
 * - Aarav (express-ready): evidence + reconcile done; no L1/L2 yet so 90s path shows exam → project → Pro.
 *   Includes low-ownership fork in included repos for GitHub warning when revisiting evidence.
 * - Priya: exams unlocked with one failed core L1 (nodejs 58) — retake teaching state.
 * - Kabir: evidence done; Conflict on spark still pending disposition (blocked teaching state).
 * - Ananya: fresh after onboarding only (claims empty) — empty cockpit.
 */
export const seedJourneyByPersona: Record<PersonaId, JourneyProgress> = {
  aarav: {
    ...emptyJourney(),
    onboardingComplete: true,
    claimedSkillIds: ['react', 'javascript', 'typescript', 'nextjs', 'figma', 'graphql'],
    resumeAttached: true,
    githubConnected: true,
    includedRepoIds: ['shopkart-ecommerce', 'design-system-kit', 'portfolio-next', 'vendor-analytics-fork'],
    reconcileReviewed: true,
    dispositions: {
      graphql: 'keep',
    },
    evidenceNotes: {
      graphql: 'Used Apollo briefly on a side project; keeping as weak claim.',
    },
  },
  priya: {
    ...emptyJourney(),
    onboardingComplete: true,
    claimedSkillIds: ['nodejs', 'rest-apis', 'postgresql', 'system-design', 'redis', 'docker'],
    resumeAttached: true,
    githubConnected: true,
    includedRepoIds: ['orders-api', 'inventory-service', 'ops-scripts'],
    reconcileReviewed: true,
    dispositions: {},
    examResults: {
      nodejs: { score: 58, status: 'failed', attemptedAt: '2026-09-12T10:00:00+05:30' },
    },
  },
  kabir: {
    ...emptyJourney(),
    onboardingComplete: true,
    claimedSkillIds: [
      'python',
      'sql',
      'machine-learning',
      'data-wrangling',
      'pytorch',
      'tableau',
      'spark',
    ],
    resumeAttached: true,
    githubConnected: true,
    includedRepoIds: ['churn-model', 'feature-store-lab', 'viz-gallery'],
    reconcileReviewed: false,
    dispositions: {},
    // spark is a Conflict — disposition pending until candidate resolves it
  },
  ananya: {
    ...emptyJourney(),
    onboardingComplete: true,
    claimedSkillIds: [],
    resumeAttached: false,
    githubConnected: false,
    includedRepoIds: [],
    reconcileReviewed: false,
  },
};

/** Complete-journey reset target used by Settings "demo complete" presets. */
export const completeJourneyTargets: Record<PersonaId, JourneyProgress> = {
  aarav: {
    onboardingComplete: true,
    claimedSkillIds: ['react', 'javascript', 'typescript', 'nextjs', 'figma', 'graphql'],
    resumeAttached: true,
    githubConnected: true,
    includedRepoIds: ['shopkart-ecommerce', 'design-system-kit', 'portfolio-next', 'vendor-analytics-fork'],
    reconcileReviewed: true,
    dispositions: { graphql: 'keep' },
    evidenceNotes: {
      graphql: 'Used Apollo briefly on a side project; keeping as weak claim.',
    },
    examResults: {
      react: { score: 91, status: 'passed', attemptedAt: '2026-08-18T10:00:00+05:30' },
      javascript: { score: 95, status: 'passed', attemptedAt: '2026-08-18T11:00:00+05:30' },
      typescript: { score: 94, status: 'passed', attemptedAt: '2026-08-18T12:00:00+05:30' },
      nextjs: { score: 96, status: 'passed', attemptedAt: '2026-08-18T13:00:00+05:30' },
    },
    projectResults: {
      'shopkart-ecommerce': { composite: 94, authorship: 78, status: 'passed' },
    },
    proIssued: true,
    shareEnabled: true,
  },
  priya: {
    onboardingComplete: true,
    claimedSkillIds: ['nodejs', 'rest-apis', 'postgresql', 'system-design', 'redis', 'docker'],
    resumeAttached: true,
    githubConnected: true,
    includedRepoIds: ['orders-api', 'inventory-service', 'ops-scripts'],
    reconcileReviewed: true,
    dispositions: {},
    evidenceNotes: {},
    examResults: {
      nodejs: { score: 89, status: 'passed', attemptedAt: '2026-09-01T10:00:00+05:30' },
      'rest-apis': { score: 90, status: 'passed', attemptedAt: '2026-09-01T11:00:00+05:30' },
      postgresql: { score: 87, status: 'passed', attemptedAt: '2026-09-01T12:00:00+05:30' },
      'system-design': { score: 85, status: 'passed', attemptedAt: '2026-09-01T13:00:00+05:30' },
    },
    projectResults: {
      'orders-api': { composite: 90, authorship: 82, status: 'passed' },
    },
    proIssued: true,
    shareEnabled: true,
  },
  kabir: {
    onboardingComplete: true,
    claimedSkillIds: ['python', 'sql', 'machine-learning', 'data-wrangling', 'pytorch', 'tableau'],
    resumeAttached: true,
    githubConnected: true,
    includedRepoIds: ['churn-model', 'feature-store-lab', 'viz-gallery'],
    reconcileReviewed: true,
    dispositions: { spark: 'remove' },
    evidenceNotes: {},
    examResults: {
      python: { score: 88, status: 'passed', attemptedAt: '2026-09-05T10:00:00+05:30' },
      sql: { score: 86, status: 'passed', attemptedAt: '2026-09-05T11:00:00+05:30' },
      'machine-learning': { score: 84, status: 'passed', attemptedAt: '2026-09-05T12:00:00+05:30' },
      'data-wrangling': { score: 87, status: 'passed', attemptedAt: '2026-09-05T13:00:00+05:30' },
    },
    projectResults: {
      'churn-model': { composite: 82, authorship: 71, status: 'passed' },
    },
    proIssued: true,
    shareEnabled: true,
  },
  ananya: {
    onboardingComplete: true,
    claimedSkillIds: [
      'react-native',
      'flutter',
      'mobile-ui',
      'app-state',
      'firebase',
      'app-store',
    ],
    resumeAttached: true,
    githubConnected: true,
    includedRepoIds: ['pulse-fitness-app', 'flutter-recipes', 'rn-ui-kit'],
    reconcileReviewed: true,
    dispositions: {},
    evidenceNotes: {},
    examResults: {
      'react-native': { score: 88, status: 'passed', attemptedAt: '2026-09-10T10:00:00+05:30' },
      flutter: { score: 85, status: 'passed', attemptedAt: '2026-09-10T11:00:00+05:30' },
      'mobile-ui': { score: 90, status: 'passed', attemptedAt: '2026-09-10T12:00:00+05:30' },
      'app-state': { score: 87, status: 'passed', attemptedAt: '2026-09-10T13:00:00+05:30' },
    },
    projectResults: {
      'pulse-fitness-app': { composite: 86, authorship: 75, status: 'passed' },
    },
    proIssued: true,
    shareEnabled: true,
  },
};

export function getPersona(id: PersonaId): Persona {
  return personasById[id];
}
