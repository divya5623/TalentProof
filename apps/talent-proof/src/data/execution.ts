import type { ExecutionFixture } from '../types'

export const executionFixtures: Record<string, ExecutionFixture> = {
  'proj-expense': {
    projectId: 'proj-expense',
    labeledAs: 'Trusted sample execution',
    stackSupported: true,
    commands: [
      {
        cmd: 'python -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt',
        status: 'ok',
        output: 'Successfully installed Flask-3.0.3 SQLAlchemy-2.0.32 pytest-8.3.2 …',
        durationMs: 4200,
      },
      {
        cmd: 'pytest -q',
        status: 'ok',
        output: '………… 12 passed in 0.84s',
        durationMs: 910,
      },
    ],
    tests: [
      { name: 'tests/test_expenses.py::test_create_expense', status: 'passed', durationMs: 42 },
      { name: 'tests/test_expenses.py::test_summarize_by_category', status: 'passed', durationMs: 55 },
      { name: 'tests/test_expenses.py::test_flag_outliers', status: 'passed', durationMs: 61 },
      { name: 'tests/test_analytics.py::test_monthly_totals_empty', status: 'passed', durationMs: 12 },
      { name: 'tests/test_analytics.py::test_outlier_threshold', status: 'passed', durationMs: 28 },
    ],
    summary: { passed: 12, failed: 0, skipped: 0, durationMs: 840 },
    notes:
      'Results replayed from a controlled sample project fixture. This is NOT a live Docker sandbox on the main server. Labeled for hackathon honesty.',
  },
  'proj-pulse': {
    projectId: 'proj-pulse',
    labeledAs: 'Trusted sample execution',
    stackSupported: true,
    commands: [
      {
        cmd: 'npm ci',
        status: 'ok',
        output: 'added 186 packages in 4s',
        durationMs: 4100,
      },
      {
        cmd: 'npm run test -- --run',
        status: 'ok',
        output: 'Test Files  1 passed (1)\nTests  6 passed (6)',
        durationMs: 1800,
      },
      {
        cmd: 'npm run build',
        status: 'ok',
        output: '✓ built in 1.12s',
        durationMs: 1200,
      },
    ],
    tests: [
      { name: 'StandupCard.tsx — renders blocker badge', status: 'passed', durationMs: 18 },
      { name: 'StandupCard.tsx — keyboard activates toggle', status: 'passed', durationMs: 24 },
      { name: 'filters.ts — filterByTeam', status: 'passed', durationMs: 4 },
      { name: 'filters.ts — filterByDateRange open end', status: 'passed', durationMs: 5 },
    ],
    summary: { passed: 6, failed: 0, skipped: 0, durationMs: 1600 },
    notes:
      'Trusted sample execution fixture for the React/Vite demo stack. Not a live untrusted sandbox.',
  },
}
