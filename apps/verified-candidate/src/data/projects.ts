import type { PersonaId, ProjectDef } from '../types';

export const projects: ProjectDef[] = [
  {
    repoId: 'shopkart-ecommerce',
    personaId: 'aarav',
    stackMatchSkillIds: ['react', 'javascript', 'typescript', 'nextjs'],
    heatmap: [
      { file: 'app/layout.tsx', ownership: 92 },
      { file: 'app/products/[id]/page.tsx', ownership: 88 },
      { file: 'components/CartDrawer.tsx', ownership: 95 },
      { file: 'components/CheckoutForm.tsx', ownership: 84 },
      { file: 'lib/cart-store.ts', ownership: 90 },
      { file: 'lib/api/catalog.ts', ownership: 72 },
      { file: 'middleware.ts', ownership: 68 },
      { file: 'styles/tokens.css', ownership: 55 },
      { file: 'tests/cart.spec.ts', ownership: 80 },
      { file: 'package.json', ownership: 60 },
    ],
    architectureQs: [
      {
        id: 'sk-aq1',
        prompt: 'How is cart state shared across product and checkout routes without prop drilling?',
        rubricMax: 25,
        demoAnswerScore: 23,
      },
      {
        id: 'sk-aq2',
        prompt: 'Where do you enforce auth for checkout, and why middleware vs page-level checks?',
        rubricMax: 25,
        demoAnswerScore: 22,
      },
      {
        id: 'sk-aq3',
        prompt: 'How does ISR interact with price updates for the catalog?',
        rubricMax: 25,
        demoAnswerScore: 21,
      },
      {
        id: 'sk-aq4',
        prompt: 'Describe the boundary between Server Components and client interactivity in CartDrawer.',
        rubricMax: 25,
        demoAnswerScore: 22,
      },
    ],
  },
  {
    repoId: 'orders-api',
    personaId: 'priya',
    stackMatchSkillIds: ['nodejs', 'rest-apis', 'postgresql', 'redis', 'docker'],
    heatmap: [
      { file: 'src/server.ts', ownership: 88 },
      { file: 'src/routes/orders.ts', ownership: 94 },
      { file: 'src/services/order-service.ts', ownership: 91 },
      { file: 'src/db/migrations/004_orders.sql', ownership: 85 },
      { file: 'src/outbox/publisher.ts', ownership: 80 },
      { file: 'src/cache/redis.ts', ownership: 78 },
      { file: 'src/middleware/idempotency.ts', ownership: 86 },
      { file: 'src/openapi/orders.yaml', ownership: 70 },
      { file: 'Dockerfile', ownership: 65 },
      { file: 'tests/orders.e2e.ts', ownership: 74 },
    ],
    architectureQs: [
      {
        id: 'oa-aq1',
        prompt: 'Explain the transactional outbox flow when an order is created.',
        rubricMax: 25,
        demoAnswerScore: 24,
      },
      {
        id: 'oa-aq2',
        prompt: 'How do Idempotency-Key headers prevent double charges on retries?',
        rubricMax: 25,
        demoAnswerScore: 23,
      },
      {
        id: 'oa-aq3',
        prompt: 'What indexes support list-orders-by-customer under load?',
        rubricMax: 25,
        demoAnswerScore: 21,
      },
      {
        id: 'oa-aq4',
        prompt: 'When does Redis cache invalidate relative to inventory reservations?',
        rubricMax: 25,
        demoAnswerScore: 22,
      },
    ],
  },
  {
    repoId: 'churn-model',
    personaId: 'kabir',
    stackMatchSkillIds: ['python', 'sql', 'machine-learning', 'data-wrangling'],
    heatmap: [
      { file: 'notebooks/01_eda.ipynb', ownership: 82 },
      { file: 'notebooks/02_features.ipynb', ownership: 88 },
      { file: 'pipelines/train.py', ownership: 90 },
      { file: 'pipelines/score_batch.py', ownership: 76 },
      { file: 'features/point_in_time.sql', ownership: 84 },
      { file: 'models/gbm_config.yaml', ownership: 70 },
      { file: 'monitoring/psi.py', ownership: 68 },
      { file: 'tests/test_features.py', ownership: 72 },
      { file: 'Makefile', ownership: 55 },
      { file: 'README.md', ownership: 60 },
    ],
    architectureQs: [
      {
        id: 'cm-aq1',
        prompt: 'How do point-in-time joins prevent label leakage in feature generation?',
        rubricMax: 25,
        demoAnswerScore: 22,
      },
      {
        id: 'cm-aq2',
        prompt: 'What validation scheme do you use given temporal churn labels?',
        rubricMax: 25,
        demoAnswerScore: 21,
      },
      {
        id: 'cm-aq3',
        prompt: 'How is PSI monitored post-deploy, and what triggers retraining?',
        rubricMax: 25,
        demoAnswerScore: 20,
      },
      {
        id: 'cm-aq4',
        prompt: 'Describe train vs batch-score environment parity for preprocessing.',
        rubricMax: 25,
        demoAnswerScore: 19,
      },
    ],
  },
  {
    repoId: 'pulse-fitness-app',
    personaId: 'ananya',
    stackMatchSkillIds: ['react-native', 'mobile-ui', 'app-state', 'firebase'],
    heatmap: [
      { file: 'src/App.tsx', ownership: 85 },
      { file: 'src/navigation/RootNavigator.tsx', ownership: 88 },
      { file: 'src/screens/WorkoutSession.tsx', ownership: 92 },
      { file: 'src/state/workoutSlice.ts', ownership: 90 },
      { file: 'src/services/offlineSync.ts', ownership: 78 },
      { file: 'src/services/firebase.ts', ownership: 74 },
      { file: 'src/components/ExerciseCard.tsx', ownership: 80 },
      { file: 'src/theme/tokens.ts', ownership: 70 },
      { file: 'ios/Podfile', ownership: 45 },
      { file: 'android/app/build.gradle', ownership: 40 },
    ],
    architectureQs: [
      {
        id: 'pf-aq1',
        prompt: 'How does offline sync reconcile local workout edits with Firebase?',
        rubricMax: 25,
        demoAnswerScore: 22,
      },
      {
        id: 'pf-aq2',
        prompt: 'Where does session state live during an active workout, and why?',
        rubricMax: 25,
        demoAnswerScore: 23,
      },
      {
        id: 'pf-aq3',
        prompt: 'How do you keep touch targets and typography accessible under font scale?',
        rubricMax: 25,
        demoAnswerScore: 21,
      },
      {
        id: 'pf-aq4',
        prompt: 'Describe the navigation structure for auth vs main tabs.',
        rubricMax: 25,
        demoAnswerScore: 20,
      },
    ],
  },
];

export const projectsByRepoId: Record<string, ProjectDef> = Object.fromEntries(
  projects.map((p) => [p.repoId, p]),
);

export function getProject(repoId: string): ProjectDef | undefined {
  return projectsByRepoId[repoId];
}

export function getProjectsForPersona(personaId: PersonaId): ProjectDef[] {
  return projects.filter((p) => p.personaId === personaId);
}

/** Composite helper used by demo path: authorship weight 45% + architecture 55%. */
export function demoProjectComposite(
  authorshipPct: number,
  archScores: number[],
  archMaxTotal: number,
): number {
  const archPct = archMaxTotal === 0 ? 0 : (archScores.reduce((a, b) => a + b, 0) / archMaxTotal) * 100;
  return Math.round(authorshipPct * 0.45 + archPct * 0.55);
}
