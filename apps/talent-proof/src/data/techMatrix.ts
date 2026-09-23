import type { TechEntry } from '../types'

export const techMatrix: TechEntry[] = [
  { id: 'py', name: 'Python 3.11+', category: 'Language', level: 'fully', notes: 'Trusted sample execution + pytest fixtures available' },
  { id: 'pytest', name: 'pytest', category: 'Testing', level: 'fully', notes: 'Mapped to sample project runners' },
  { id: 'flask', name: 'Flask', category: 'Framework', level: 'fully', notes: 'Structure + dependency graph observed' },
  { id: 'sqlalchemy', name: 'SQLAlchemy', category: 'Data', level: 'partial', notes: 'Schema inspect; runtime DB sandboxed in fixtures only' },
  { id: 'ts', name: 'TypeScript', category: 'Language', level: 'fully', notes: 'tsc + Vite sample runners' },
  { id: 'react', name: 'React 18/19', category: 'Framework', level: 'fully', notes: 'Component tree + Vitest sample path' },
  { id: 'vite', name: 'Vite', category: 'Tooling', level: 'fully', notes: 'Build/test fixtures for demo stacks' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'Styling', level: 'partial', notes: 'Config observed; visual regression not in MVP' },
  { id: 'node', name: 'Node.js 20', category: 'Runtime', level: 'fully', notes: 'npm/pnpm install theater on samples' },
  { id: 'express', name: 'Express', category: 'Framework', level: 'partial', notes: 'Route map observed; live server not on main host' },
  { id: 'django', name: 'Django', category: 'Framework', level: 'manual', notes: 'Requires reviewer-led setup notes' },
  { id: 'go', name: 'Go', category: 'Language', level: 'manual', notes: 'Manual review path until sample runners land' },
  { id: 'rust', name: 'Rust', category: 'Language', level: 'not_yet', notes: 'Planned — not available in hackathon MVP' },
  { id: 'java', name: 'Java / Spring', category: 'Language', level: 'not_yet', notes: 'Planned post-MVP' },
  { id: 'kotlin', name: 'Kotlin', category: 'Language', level: 'not_yet', notes: 'Not yet supported' },
  { id: 'swift', name: 'Swift / iOS', category: 'Mobile', level: 'not_yet', notes: 'Not yet supported' },
  { id: 'docker', name: 'Docker Compose', category: 'Infra', level: 'manual', notes: 'No real Docker on main server — reviewer path only' },
  { id: 'k8s', name: 'Kubernetes', category: 'Infra', level: 'not_yet', notes: 'Out of scope for MVP' },
  { id: 'postgres', name: 'PostgreSQL', category: 'Data', level: 'partial', notes: 'Fixture DB only; no production credentials' },
  { id: 'mongo', name: 'MongoDB', category: 'Data', level: 'manual', notes: 'Manual review for connection & seed scripts' },
]
