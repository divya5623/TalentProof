import type { JourneyProgress, JourneyStep, Persona } from '../types';

export const STEP_ORDER: JourneyStep[] = [
  'onboarding',
  'claims',
  'evidence',
  'reconcile',
  'exams',
  'projects',
  'certificate',
  'share',
];

export const STEP_PATHS: Record<JourneyStep, string> = {
  onboarding: '/onboarding',
  claims: '/claims',
  evidence: '/evidence/resume',
  reconcile: '/reconcile',
  exams: '/exams',
  projects: '/projects',
  certificate: '/certificate',
  share: '/certificate/share',
};

export function pathToStep(path: string): JourneyStep | null {
  if (path.startsWith('/certificate/share')) return 'share';
  if (path.startsWith('/onboarding')) return 'onboarding';
  if (path.startsWith('/claims')) return 'claims';
  if (path.startsWith('/evidence')) return 'evidence';
  if (path.startsWith('/reconcile')) return 'reconcile';
  if (path.startsWith('/exams')) return 'exams';
  if (path.startsWith('/projects')) return 'projects';
  if (path.startsWith('/certificate')) return 'certificate';
  return null;
}

function passedCoreCount(progress: JourneyProgress, persona: Persona): number {
  return persona.coreSkillIds.filter((id) => progress.examResults[id]?.status === 'passed')
    .length;
}

function allCoreL1Passed(progress: JourneyProgress, persona: Persona): boolean {
  return persona.coreSkillIds.every((id) => progress.examResults[id]?.status === 'passed');
}

function hasInTrackL2Pass(progress: JourneyProgress): boolean {
  return Object.values(progress.projectResults).some((r) => r.status === 'passed');
}

function bothEvidence(progress: JourneyProgress): boolean {
  return progress.resumeAttached && progress.githubConnected;
}

/** Unlock predicates — strict prototype rules (spec §5 / plan Task 3). */
export function isStepUnlocked(
  step: JourneyStep,
  progress: JourneyProgress,
  persona: Persona,
): boolean {
  switch (step) {
    case 'onboarding':
      return true;
    case 'claims':
      return progress.onboardingComplete;
    case 'evidence':
      return progress.claimedSkillIds.length >= 1;
    case 'reconcile':
      return progress.resumeAttached || progress.githubConnected;
    case 'exams':
      return progress.reconcileReviewed && bothEvidence(progress);
    case 'projects':
      return passedCoreCount(progress, persona) >= 1;
    case 'certificate':
      return allCoreL1Passed(progress, persona) && hasInTrackL2Pass(progress);
    case 'share':
      return progress.proIssued || progress.shareEnabled;
    default:
      return false;
  }
}

export function lockReason(
  step: JourneyStep,
  progress: JourneyProgress,
  persona: Persona,
): string {
  if (isStepUnlocked(step, progress, persona)) return '';
  switch (step) {
    case 'claims':
      return 'Complete onboarding first';
    case 'evidence':
      return 'Claim at least one skill first';
    case 'reconcile':
      return 'Attach resume or connect GitHub first';
    case 'exams':
      if (!bothEvidence(progress)) return 'Attach resume and connect GitHub before L1';
      return 'Complete Honesty Map first';
    case 'projects':
      return 'Pass at least one core L1 exam first';
    case 'certificate':
      return 'Complete all core L1 exams and one L2 project first';
    case 'share':
      return 'Issue Pro certificate first';
    default:
      return 'Complete prior steps to unlock';
  }
}

/** First spine step that still needs work (demo Continue CTA). */
export function firstIncompleteStep(
  progress: JourneyProgress,
  persona: Persona,
): JourneyStep {
  if (!progress.onboardingComplete) return 'onboarding';
  if (progress.claimedSkillIds.length === 0) return 'claims';
  if (!bothEvidence(progress)) return 'evidence';
  if (!progress.reconcileReviewed) return 'reconcile';
  if (!allCoreL1Passed(progress, persona)) return 'exams';
  if (!hasInTrackL2Pass(progress)) return 'projects';
  if (!progress.proIssued) return 'certificate';
  return 'share';
}

/**
 * Guard deep links: always-ok for /, /profile, /settings, and public share chrome.
 * Locked journey steps redirect to the first incomplete prerequisite.
 */
export function guardNavigate(
  path: string,
  progress: JourneyProgress,
  persona: Persona,
): { ok: true } | { ok: false; redirectTo: string; reason: string } {
  if (path.startsWith('/certificate/share')) {
    return { ok: true };
  }
  if (
    path === '/' ||
    path === '' ||
    path.startsWith('/profile') ||
    path.startsWith('/settings')
  ) {
    return { ok: true };
  }

  const step = pathToStep(path);
  if (!step) return { ok: true };

  if (isStepUnlocked(step, progress, persona)) {
    return { ok: true };
  }

  const reason = lockReason(step, progress, persona);
  const redirectStep = firstIncompleteStep(progress, persona);
  const redirectTo =
    redirectStep === step || !isStepUnlocked(redirectStep, progress, persona)
      ? '/'
      : STEP_PATHS[redirectStep];

  return { ok: false, redirectTo, reason: reason || 'Complete prior steps to unlock' };
}
