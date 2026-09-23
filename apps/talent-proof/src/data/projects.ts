import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'proj-expense',
    studentId: 'stu-priya',
    title: 'LedgerLite — Personal Expense Tracker',
    category: 'Backend / CLI + API',
    stack: ['Python', 'Flask', 'SQLAlchemy', 'pytest'],
    contribution: 'Sole author — designed schema, API, CLI, and test suite',
    teammates: [],
    setupNotes: 'python -m venv .venv && pip install -r requirements.txt && pytest',
    sourceType: 'github',
    sourceLabel: 'github.com/priya-sharma/ledgerlite (demo connect)',
    status: 'verified',
    submittedAt: '2026-09-18T10:30:00+05:30',
    skillTags: ['Python', 'Flask', 'pytest', 'SQL', 'API design'],
    supportLevel: 'fully',
    shareId: 'share-ledgerlite-priya',
    files: [
      { path: 'app/__init__.py', language: 'Python', lines: 42, summary: 'Flask app factory', functions: ['create_app'] },
      { path: 'app/models.py', language: 'Python', lines: 88, summary: 'Expense & Category ORM models', functions: ['Expense.to_dict', 'Category.validate_name'] },
      { path: 'app/routes/expenses.py', language: 'Python', lines: 156, summary: 'CRUD endpoints for expenses', functions: ['list_expenses', 'create_expense', 'summarize_by_category'] },
      { path: 'app/services/analytics.py', language: 'Python', lines: 74, summary: 'Monthly rollups & anomaly flags', functions: ['monthly_totals', 'flag_outliers'] },
      { path: 'cli.py', language: 'Python', lines: 110, summary: 'Click-style CLI entry', functions: ['cmd_add', 'cmd_report'] },
      { path: 'tests/test_expenses.py', language: 'Python', lines: 132, summary: 'API + service tests', functions: ['test_create_expense', 'test_summarize_by_category', 'test_flag_outliers'] },
      { path: 'tests/test_analytics.py', language: 'Python', lines: 64, summary: 'Analytics edge cases', functions: ['test_monthly_totals_empty', 'test_outlier_threshold'] },
      { path: 'requirements.txt', language: 'Text', lines: 8, summary: 'Pinned deps' },
      { path: 'README.md', language: 'Markdown', lines: 96, summary: 'Setup & API docs' },
    ],
    observed: {
      structure: [
        { label: 'Layout', value: 'app/ + tests/ + cli entry' },
        { label: 'Entry points', value: 'create_app(), cli.py' },
        { label: 'Test discovery', value: 'pytest under tests/' },
        { label: 'Deps declared', value: 'requirements.txt (8 pins)' },
        { label: 'Docs', value: 'README with setup & endpoints' },
      ],
      languages: [
        { name: 'Python', pct: 94, files: 7 },
        { name: 'Markdown', pct: 4, files: 1 },
        { name: 'Text', pct: 2, files: 1 },
      ],
      frameworks: ['Flask', 'SQLAlchemy', 'pytest'],
      qualitySignals: [
        { label: 'Tests present', status: 'pass', detail: '196 lines across 2 test modules' },
        { label: 'Typed models', status: 'info', detail: 'ORM models; limited type hints in routes' },
        { label: 'Secrets in repo', status: 'pass', detail: 'No .env or credential files observed' },
        { label: 'Dependency pins', status: 'pass', detail: 'requirements.txt present' },
        { label: 'Large binary assets', status: 'pass', detail: 'None observed' },
      ],
    },
    ai: {
      summary:
        'Project appears to be a small Flask expense tracker with clear separation of routes, models, and analytics services. Test coverage focuses on create/list and outlier detection.',
      strengths: [
        'Clear module boundaries (routes / services / models)',
        'Meaningful pytest cases referencing summarize_by_category and flag_outliers',
        'CLI + API dual interface suggests intentional UX for local use',
      ],
      concerns: [
        'Auth layer not observed — endpoints may be open in sample',
        'Limited type annotations outside models',
      ],
      aiDetectSignal: {
        score: 0.22,
        label: 'Low AI-likeness signal',
        disclaimer:
          'AI-detect is a heuristic signal only — never definitive proof of authorship or AI use. Treat as one input among many.',
      },
    },
    uncertainty: [
      {
        area: 'Runtime behavior of summarize_by_category',
        reason: 'Observed function signature & tests; live DB not executed on main server',
        mitigation: 'Trusted sample execution fixture available for this stack',
      },
      {
        area: 'Contribution exclusivity',
        reason: 'Single-author claim; no git history imported in demo',
        mitigation: 'Assessment questions target specific functions in submitted files',
      },
    ],
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        prompt:
          'In app/services/analytics.py, what does flag_outliers() primarily compare each expense amount against?',
        references: [{ file: 'app/services/analytics.py', symbol: 'flag_outliers' }],
        options: [
          'A fixed global ceiling of ₹10,000',
          'The mean + k·stddev of the same category for the month',
          'The previous transaction only',
          'Random sampling threshold',
        ],
        correctIndex: 1,
        points: 10,
      },
      {
        id: 'q2',
        type: 'mcq',
        prompt:
          'Looking at create_expense in app/routes/expenses.py, which validation runs before persistence?',
        references: [{ file: 'app/routes/expenses.py', symbol: 'create_expense' }],
        options: [
          'Category must exist and amount > 0',
          'User OAuth token refresh',
          'S3 upload of receipt image',
          'Currency FX conversion',
        ],
        correctIndex: 0,
        points: 10,
      },
      {
        id: 'q3',
        type: 'written',
        prompt:
          'Explain how monthly_totals() in app/services/analytics.py groups expenses, and what it returns when the month has no rows. Reference the empty-case behavior covered in tests/test_analytics.py.',
        references: [
          { file: 'app/services/analytics.py', symbol: 'monthly_totals' },
          { file: 'tests/test_analytics.py', symbol: 'test_monthly_totals_empty' },
        ],
        sampleAnswerHint: 'Groups by YYYY-MM; returns empty dict / zero totals for missing month',
        points: 20,
      },
      {
        id: 'q4',
        type: 'debug',
        prompt:
          'tests/test_expenses.py::test_summarize_by_category fails intermittently when two categories share a display name differing only by case. Using Category.validate_name in app/models.py, describe the bug and a minimal fix.',
        references: [
          { file: 'app/models.py', symbol: 'Category.validate_name' },
          { file: 'tests/test_expenses.py', symbol: 'test_summarize_by_category' },
        ],
        sampleAnswerHint: 'Normalize case before uniqueness check',
        points: 25,
      },
      {
        id: 'q5',
        type: 'written',
        prompt:
          'Walk through Expense.to_dict() in app/models.py — which fields are serialized, and why might created_at be ISO-formatted?',
        references: [{ file: 'app/models.py', symbol: 'Expense.to_dict' }],
        points: 15,
      },
    ],
    badges: [
      {
        id: 'b-obs',
        name: 'Structure Observed',
        level: 'observed',
        criteria: ['Repo structure scanned', 'Languages & frameworks detected', 'Quality signals collected'],
        earned: true,
        earnedAt: '2026-09-18T11:00:00+05:30',
      },
      {
        id: 'b-exp',
        name: 'Explained Under Assessment',
        level: 'explained',
        criteria: ['Timed assessment completed', 'Score ≥ 70% on project-specific questions', 'Integrity log reviewed'],
        earned: true,
        earnedAt: '2026-09-19T16:45:00+05:30',
      },
      {
        id: 'b-ver',
        name: 'Skill Verified — Python/Flask',
        level: 'verified',
        criteria: [
          'Trusted sample execution passed (labeled fixture)',
          'Explained badge earned',
          'No critical integrity warnings unresolved',
        ],
        earned: true,
        earnedAt: '2026-09-19T16:50:00+05:30',
      },
    ],
  },
  {
    id: 'proj-pulse',
    studentId: 'stu-alex',
    title: 'PulseBoard — Team Standup Dashboard',
    category: 'Frontend / SPA',
    stack: ['TypeScript', 'React', 'Vite', 'Tailwind', 'Vitest'],
    contribution: 'Lead frontend — components, state, tests; teammate handled mock API stubs',
    teammates: ['Sam Rivera (mock API)'],
    setupNotes: 'npm i && npm run test && npm run build',
    sourceType: 'zip',
    sourceLabel: 'pulseboard-v2.zip (upload theater)',
    status: 'assessment_ready',
    submittedAt: '2026-09-20T14:10:00+05:30',
    skillTags: ['React', 'TypeScript', 'Vite', 'Accessibility', 'Vitest'],
    supportLevel: 'fully',
    shareId: 'share-pulseboard-alex',
    files: [
      { path: 'src/App.tsx', language: 'TypeScript', lines: 68, summary: 'Router shell', functions: ['App'] },
      { path: 'src/components/StandupCard.tsx', language: 'TypeScript', lines: 112, summary: 'Card UI for standup entries', functions: ['StandupCard', 'statusColor'] },
      { path: 'src/hooks/useStandups.ts', language: 'TypeScript', lines: 94, summary: 'Fetch + optimistic update', functions: ['useStandups', 'optimisticToggle'] },
      { path: 'src/lib/filters.ts', language: 'TypeScript', lines: 48, summary: 'Team/date filters', functions: ['filterByTeam', 'filterByDateRange'] },
      { path: 'src/lib/a11y.ts', language: 'TypeScript', lines: 36, summary: 'Focus trap helpers', functions: ['trapFocus', 'announce'] },
      { path: 'src/components/StandupCard.test.tsx', language: 'TypeScript', lines: 78, summary: 'Component tests', functions: ['renders blocker badge', 'keyboard activates toggle'] },
      { path: 'vite.config.ts', language: 'TypeScript', lines: 18, summary: 'Vite + Vitest config' },
      { path: 'package.json', language: 'JSON', lines: 32, summary: 'Scripts & deps' },
    ],
    observed: {
      structure: [
        { label: 'Layout', value: 'src/components + hooks + lib' },
        { label: 'Build tool', value: 'Vite' },
        { label: 'Tests', value: 'Vitest + Testing Library' },
        { label: 'Styling', value: 'Tailwind utility classes' },
      ],
      languages: [
        { name: 'TypeScript / TSX', pct: 91, files: 6 },
        { name: 'JSON', pct: 5, files: 1 },
        { name: 'Config', pct: 4, files: 1 },
      ],
      frameworks: ['React', 'Vite', 'Vitest', 'Tailwind CSS'],
      qualitySignals: [
        { label: 'Component tests', status: 'pass', detail: 'StandupCard.test.tsx present' },
        { label: 'a11y helpers', status: 'pass', detail: 'trapFocus / announce observed' },
        { label: 'Secrets in repo', status: 'pass', detail: 'None observed' },
        { label: 'Bundle size check', status: 'info', detail: 'Not measured in demo analysis' },
      ],
    },
    ai: {
      summary:
        'React TypeScript dashboard with hooks for standup data, filter utilities, and accessibility helpers. Tests focus on StandupCard interactions.',
      strengths: [
        'Explicit a11y utilities (trapFocus, announce)',
        'Optimistic UI pattern in useStandups',
        'Test covers keyboard activation',
      ],
      concerns: [
        'Teammate contribution on mock API — boundary should stay clear in assessment',
        'No E2E suite observed',
      ],
      aiDetectSignal: {
        score: 0.31,
        label: 'Moderate-low AI-likeness signal',
        disclaimer:
          'AI-detect is a heuristic signal only — never definitive. Pair with project-specific assessment.',
      },
    },
    uncertainty: [
      {
        area: 'Optimistic update race conditions',
        reason: 'Hook logic observed statically; concurrent toggles not executed live',
        mitigation: 'Trusted sample Vitest fixture for this stack',
      },
    ],
    questions: [
      {
        id: 'pq1',
        type: 'mcq',
        prompt:
          'In src/hooks/useStandups.ts, what does optimisticToggle do before the network response returns?',
        references: [{ file: 'src/hooks/useStandups.ts', symbol: 'optimisticToggle' }],
        options: [
          'Deletes the standup locally',
          'Flips completed state in local cache, then reconciles on response',
          'Blocks the UI with a full-page spinner',
          'Writes directly to localStorage only',
        ],
        correctIndex: 1,
        points: 10,
      },
      {
        id: 'pq2',
        type: 'mcq',
        prompt: 'statusColor in StandupCard.tsx maps which status to the amber token?',
        references: [{ file: 'src/components/StandupCard.tsx', symbol: 'statusColor' }],
        options: ['done', 'blocked', 'in_progress', 'archived'],
        correctIndex: 2,
        points: 10,
      },
      {
        id: 'pq3',
        type: 'written',
        prompt:
          'Describe how filterByDateRange in src/lib/filters.ts treats an open-ended end date. Cite the function behavior.',
        references: [{ file: 'src/lib/filters.ts', symbol: 'filterByDateRange' }],
        points: 20,
      },
      {
        id: 'pq4',
        type: 'debug',
        prompt:
          'StandupCard.test.tsx “keyboard activates toggle” fails when focus starts on a nested link. Using trapFocus in src/lib/a11y.ts, explain the failure mode and fix.',
        references: [
          { file: 'src/lib/a11y.ts', symbol: 'trapFocus' },
          { file: 'src/components/StandupCard.test.tsx', symbol: 'keyboard activates toggle' },
        ],
        points: 25,
      },
      {
        id: 'pq5',
        type: 'written',
        prompt:
          'What does announce() in src/lib/a11y.ts do for screen readers, and when should StandupCard call it after a status change?',
        references: [{ file: 'src/lib/a11y.ts', symbol: 'announce' }],
        points: 15,
      },
    ],
    badges: [
      {
        id: 'pb-obs',
        name: 'Structure Observed',
        level: 'observed',
        criteria: ['Repo structure scanned', 'Languages & frameworks detected'],
        earned: true,
        earnedAt: '2026-09-20T14:40:00+05:30',
      },
      {
        id: 'pb-exp',
        name: 'Explained Under Assessment',
        level: 'explained',
        criteria: ['Timed assessment completed', 'Score ≥ 70%', 'Integrity log reviewed'],
        earned: false,
      },
      {
        id: 'pb-ver',
        name: 'Skill Verified — React/TS',
        level: 'verified',
        criteria: ['Trusted sample execution passed', 'Explained badge earned'],
        earned: false,
      },
    ],
  },
]

export const getProject = (id: string) => projects.find((p) => p.id === id)
export const getProjectByShare = (shareId: string) => projects.find((p) => p.shareId === shareId)
export const projectsForStudent = (studentId: string) => projects.filter((p) => p.studentId === studentId)
