import type { GithubRepo, PersonaId, ResumeParseResult } from '../types';

export const resumeByPersona: Record<PersonaId, ResumeParseResult> = {
  aarav: {
    fileName: 'Aarav_Sharma_Resume.pdf',
    skills: [
      {
        skillId: 'react',
        confidence: 0.96,
        snippet: 'Built ShopKart storefront in React 18 with hooks, Suspense, and shared component library.',
      },
      {
        skillId: 'javascript',
        confidence: 0.94,
        snippet: 'Shipped ES2022 modules, async pipelines, and Jest unit suites across frontend packages.',
      },
      {
        skillId: 'typescript',
        confidence: 0.93,
        snippet: 'Migrated design-system props to strict TypeScript; zero-any policy on PR checks.',
      },
      {
        skillId: 'nextjs',
        confidence: 0.91,
        snippet: 'Owned Next.js App Router pages, ISR product catalog, and edge middleware auth.',
      },
      {
        skillId: 'figma',
        confidence: 0.55,
        snippet: 'Collaborated with design on Figma handoff for checkout redesign (self-reported).',
      },
      {
        skillId: 'graphql',
        confidence: 0.42,
        snippet: 'Mentions GraphQL once under “Familiar”; no production ownership listed.',
      },
    ],
  },
  priya: {
    fileName: 'Priya_Nair_Resume.pdf',
    skills: [
      {
        skillId: 'nodejs',
        confidence: 0.95,
        snippet: 'Led Node.js 20 services for order ingestion; p99 latency <120ms under peak.',
      },
      {
        skillId: 'rest-apis',
        confidence: 0.94,
        snippet: 'Designed versioned REST contracts with OpenAPI; idempotent payment callbacks.',
      },
      {
        skillId: 'postgresql',
        confidence: 0.92,
        snippet: 'Modeled order/inventory schemas; wrote migration playbooks and index audits.',
      },
      {
        skillId: 'system-design',
        confidence: 0.88,
        snippet: 'Authored HLD for multi-region order API with outbox pattern and CQRS read models.',
      },
      {
        skillId: 'redis',
        confidence: 0.86,
        snippet: 'Caching layer + rate limits via Redis Cluster for hotspot SKUs.',
      },
      {
        skillId: 'docker',
        confidence: 0.84,
        snippet: 'Containerized services; CI publishes multi-arch images to private registry.',
      },
    ],
  },
  kabir: {
    fileName: 'Kabir_Mehta_Resume.pdf',
    skills: [
      {
        skillId: 'python',
        confidence: 0.95,
        snippet: 'Python pipelines for churn features; pandas/polars batch jobs on Airflow.',
      },
      {
        skillId: 'sql',
        confidence: 0.93,
        snippet: 'Warehouse SQL for cohort retention; window functions and incremental models.',
      },
      {
        skillId: 'machine-learning',
        confidence: 0.9,
        snippet: 'Trained gradient boosting churn classifier; monitored PSI drift weekly.',
      },
      {
        skillId: 'data-wrangling',
        confidence: 0.91,
        snippet: 'Cleaned messy CRM exports; built reusable feature transformers.',
      },
      {
        skillId: 'pytorch',
        confidence: 0.72,
        snippet: 'Prototype sequence model in PyTorch for next-best-action (lab project).',
      },
      {
        skillId: 'tableau',
        confidence: 0.78,
        snippet: 'Published Tableau dashboards for churn drivers to GTM stakeholders.',
      },
      {
        skillId: 'spark',
        confidence: 0.18,
        snippet: 'Lists Apache Spark under skills; no project bullets or ownership evidence.',
      },
    ],
  },
  ananya: {
    fileName: 'Ananya_Iyer_Resume.pdf',
    skills: [
      {
        skillId: 'react-native',
        confidence: 0.94,
        snippet: 'Shipped Pulse Fitness RN app to iOS/Android; shared navigation + offline sync.',
      },
      {
        skillId: 'flutter',
        confidence: 0.88,
        snippet: 'Built Flutter recipes client with Riverpod and custom animations.',
      },
      {
        skillId: 'mobile-ui',
        confidence: 0.92,
        snippet: 'Designed adaptive layouts, dark mode tokens, and accessible touch targets.',
      },
      {
        skillId: 'app-state',
        confidence: 0.9,
        snippet: 'Owned Redux Toolkit + MMKV persistence for workout session state.',
      },
      {
        skillId: 'firebase',
        confidence: 0.85,
        snippet: 'Auth, Remote Config, and Crashlytics wired for Pulse Fitness releases.',
      },
      {
        skillId: 'app-store',
        confidence: 0.8,
        snippet: 'Managed TestFlight + Play internal tracks; wrote release checklists.',
      },
    ],
  },
};

export const reposByPersona: Record<PersonaId, GithubRepo[]> = {
  aarav: [
    {
      id: 'shopkart-ecommerce',
      name: 'shopkart-ecommerce',
      languages: [
        { name: 'TypeScript', pct: 62 },
        { name: 'JavaScript', pct: 18 },
        { name: 'CSS', pct: 12 },
        { name: 'Other', pct: 8 },
      ],
      authorshipPct: 78,
      primaryL2: true,
      description: 'Next.js commerce storefront with cart, checkout, and ISR catalog.',
    },
    {
      id: 'design-system-kit',
      name: 'design-system-kit',
      languages: [
        { name: 'TypeScript', pct: 80 },
        { name: 'CSS', pct: 15 },
        { name: 'Other', pct: 5 },
      ],
      authorshipPct: 64,
      primaryL2: false,
      description: 'Shared React component library with Storybook docs.',
    },
    {
      id: 'portfolio-next',
      name: 'portfolio-next',
      languages: [
        { name: 'TypeScript', pct: 70 },
        { name: 'MDX', pct: 20 },
        { name: 'CSS', pct: 10 },
      ],
      authorshipPct: 95,
      primaryL2: false,
      description: 'Personal site built with Next.js App Router.',
    },
    {
      id: 'hooks-playground',
      name: 'hooks-playground',
      languages: [
        { name: 'JavaScript', pct: 88 },
        { name: 'HTML', pct: 12 },
      ],
      authorshipPct: 100,
      primaryL2: false,
      description: 'Small experiments with custom React hooks.',
    },
    {
      id: 'vendor-analytics-fork',
      name: 'vendor-analytics-fork',
      languages: [
        { name: 'TypeScript', pct: 70 },
        { name: 'JavaScript', pct: 20 },
        { name: 'CSS', pct: 10 },
      ],
      authorshipPct: 22,
      primaryL2: false,
      description: 'Forked analytics dashboard — mostly upstream commits (low ownership teaching state).',
    },
  ],
  priya: [
    {
      id: 'orders-api',
      name: 'orders-api',
      languages: [
        { name: 'TypeScript', pct: 72 },
        { name: 'SQL', pct: 15 },
        { name: 'Shell', pct: 8 },
        { name: 'Other', pct: 5 },
      ],
      authorshipPct: 82,
      primaryL2: true,
      description: 'Node/Express order service with outbox, Postgres, and Redis cache.',
    },
    {
      id: 'inventory-service',
      name: 'inventory-service',
      languages: [
        { name: 'TypeScript', pct: 68 },
        { name: 'SQL', pct: 22 },
        { name: 'Other', pct: 10 },
      ],
      authorshipPct: 61,
      primaryL2: false,
      description: 'Stock reservation API with optimistic locking.',
    },
    {
      id: 'ops-scripts',
      name: 'ops-scripts',
      languages: [
        { name: 'Shell', pct: 55 },
        { name: 'Python', pct: 30 },
        { name: 'Dockerfile', pct: 15 },
      ],
      authorshipPct: 90,
      primaryL2: false,
      description: 'Docker compose stacks and migration runners.',
    },
    {
      id: 'openapi-toolkit',
      name: 'openapi-toolkit',
      languages: [
        { name: 'TypeScript', pct: 85 },
        { name: 'YAML', pct: 15 },
      ],
      authorshipPct: 55,
      primaryL2: false,
      description: 'Shared OpenAPI lint + codegen helpers.',
    },
  ],
  kabir: [
    {
      id: 'churn-model',
      name: 'churn-model',
      languages: [
        { name: 'Python', pct: 78 },
        { name: 'Jupyter', pct: 14 },
        { name: 'SQL', pct: 6 },
        { name: 'Other', pct: 2 },
      ],
      authorshipPct: 71,
      primaryL2: true,
      description: 'Churn classifier + feature pipeline notebooks and batch jobs.',
    },
    {
      id: 'feature-store-lab',
      name: 'feature-store-lab',
      languages: [
        { name: 'Python', pct: 70 },
        { name: 'SQL', pct: 25 },
        { name: 'Other', pct: 5 },
      ],
      authorshipPct: 58,
      primaryL2: false,
      description: 'Offline feature definitions and point-in-time joins.',
    },
    {
      id: 'viz-gallery',
      name: 'viz-gallery',
      languages: [
        { name: 'Python', pct: 40 },
        { name: 'JavaScript', pct: 35 },
        { name: 'HTML', pct: 25 },
      ],
      authorshipPct: 88,
      primaryL2: false,
      description: 'Tableau + Plotly prototypes for churn storytelling.',
    },
    {
      id: 'sql-katas',
      name: 'sql-katas',
      languages: [
        { name: 'SQL', pct: 92 },
        { name: 'Markdown', pct: 8 },
      ],
      authorshipPct: 100,
      primaryL2: false,
      description: 'Warehouse SQL practice queries and explain plans.',
    },
  ],
  ananya: [
    {
      id: 'pulse-fitness-app',
      name: 'pulse-fitness-app',
      languages: [
        { name: 'TypeScript', pct: 74 },
        { name: 'JavaScript', pct: 12 },
        { name: 'Kotlin', pct: 7 },
        { name: 'Other', pct: 7 },
      ],
      authorshipPct: 75,
      primaryL2: true,
      description: 'React Native fitness app with workouts, offline sync, Firebase.',
    },
    {
      id: 'flutter-recipes',
      name: 'flutter-recipes',
      languages: [
        { name: 'Dart', pct: 90 },
        { name: 'Other', pct: 10 },
      ],
      authorshipPct: 82,
      primaryL2: false,
      description: 'Flutter recipe browser with Riverpod state.',
    },
    {
      id: 'rn-ui-kit',
      name: 'rn-ui-kit',
      languages: [
        { name: 'TypeScript', pct: 88 },
        { name: 'CSS', pct: 12 },
      ],
      authorshipPct: 67,
      primaryL2: false,
      description: 'Shared RN UI primitives and theme tokens.',
    },
    {
      id: 'release-playbooks',
      name: 'release-playbooks',
      languages: [
        { name: 'Markdown', pct: 60 },
        { name: 'Shell', pct: 40 },
      ],
      authorshipPct: 95,
      primaryL2: false,
      description: 'App Store / Play release checklists and Fastlane hooks.',
    },
  ],
};

export function getPrimaryL2Repo(personaId: PersonaId): GithubRepo | undefined {
  return reposByPersona[personaId].find((r) => r.primaryL2);
}

export function getRepos(personaId: PersonaId): GithubRepo[] {
  return reposByPersona[personaId];
}

export function getResume(personaId: PersonaId): ResumeParseResult {
  return resumeByPersona[personaId];
}
