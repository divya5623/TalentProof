import type { Shortlist } from '../types';

export const initialShortlists: Shortlist[] = [
  {
    id: 'sl-frontend-engineers',
    name: 'Frontend Engineers',
    candidateIds: ['priya-nair', 'rohan-mehta', 'emily-chen'],
    description: 'Verified React / TypeScript talent for product squads.',
    createdOn: '2026-09-01',
  },
  {
    id: 'sl-ml-pipeline',
    name: 'ML Pipeline',
    candidateIds: ['meera-joshi', 'dev-kapoor', 'neha-gupta'],
    description: 'High-signal AI/ML and data science candidates.',
    createdOn: '2026-08-22',
  },
  {
    id: 'sl-platform',
    name: 'Platform Backend',
    candidateIds: ['vikram-singh', 'lucas-meyer', 'sara-khan'],
    description: 'Systems and API engineers with verified depth.',
    createdOn: '2026-08-10',
  },
];
