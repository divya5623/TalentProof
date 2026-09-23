import type { HonestyRow, PersonaId } from '../types';

/**
 * Claim ↔ artifact rows for each persona's default claimed skill set.
 * Kabir includes spark as Conflict (teaching seed — disposition pending).
 */
export const honestyMapsByPersona: Record<PersonaId, HonestyRow[]> = {
  aarav: [
    { skillId: 'react', resume: true, github: true, state: 'aligned' },
    { skillId: 'javascript', resume: true, github: true, state: 'aligned' },
    { skillId: 'typescript', resume: true, github: true, state: 'aligned' },
    { skillId: 'nextjs', resume: true, github: true, state: 'aligned' },
    { skillId: 'figma', resume: true, github: false, state: 'aligned' },
    { skillId: 'graphql', resume: true, github: false, state: 'weak' },
  ],
  priya: [
    { skillId: 'nodejs', resume: true, github: true, state: 'aligned' },
    { skillId: 'rest-apis', resume: true, github: true, state: 'aligned' },
    { skillId: 'postgresql', resume: true, github: true, state: 'aligned' },
    { skillId: 'system-design', resume: true, github: false, state: 'aligned' },
    { skillId: 'redis', resume: true, github: true, state: 'aligned' },
    { skillId: 'docker', resume: true, github: true, state: 'aligned' },
  ],
  kabir: [
    { skillId: 'python', resume: true, github: true, state: 'aligned' },
    { skillId: 'sql', resume: true, github: true, state: 'aligned' },
    { skillId: 'machine-learning', resume: true, github: true, state: 'aligned' },
    { skillId: 'data-wrangling', resume: true, github: true, state: 'aligned' },
    { skillId: 'pytorch', resume: true, github: false, state: 'weak' },
    { skillId: 'tableau', resume: true, github: true, state: 'aligned' },
    {
      skillId: 'spark',
      resume: true,
      github: false,
      state: 'conflict',
    },
  ],
  ananya: [
    { skillId: 'react-native', resume: true, github: true, state: 'aligned' },
    { skillId: 'flutter', resume: true, github: true, state: 'aligned' },
    { skillId: 'mobile-ui', resume: true, github: true, state: 'aligned' },
    { skillId: 'app-state', resume: true, github: true, state: 'aligned' },
    { skillId: 'firebase', resume: true, github: true, state: 'aligned' },
    { skillId: 'app-store', resume: true, github: true, state: 'aligned' },
  ],
};

export function getHonestyMap(personaId: PersonaId): HonestyRow[] {
  return honestyMapsByPersona[personaId];
}
