import type { PersonaId } from '../types';
import { getCertificate } from './certificates';
import { getHonestyMap } from './honestyMaps';
import { getExam } from './exams';
import { getPrimaryL2Repo, getRepos, getResume } from './evidence';
import {
  completeJourneyTargets,
  getPersona,
  personas,
  seedJourneyByPersona,
} from './personas';
import { getProjectsForPersona } from './projects';
import { coreSkillsByTrack, skillsByTrack } from './skillsCatalog';

export * from './personas';
export * from './skillsCatalog';
export * from './evidence';
export * from './honestyMaps';
export * from './exams';
export * from './projects';
export * from './certificates';
export * from './scores';

/** Aggregate related mock data for a persona (Context / pages consume this). */
export function getPersonaPackage(id: PersonaId) {
  const persona = getPersona(id);
  return {
    persona,
    seedJourney: seedJourneyByPersona[id],
    completeJourney: completeJourneyTargets[id],
    skills: skillsByTrack(persona.trackId),
    coreSkills: coreSkillsByTrack(persona.trackId),
    resume: getResume(id),
    repos: getRepos(id),
    primaryL2: getPrimaryL2Repo(id),
    honestyMap: getHonestyMap(id),
    exams: persona.coreSkillIds.map((skillId) => getExam(skillId)!),
    projects: getProjectsForPersona(id),
    certificate: getCertificate(id),
  };
}

export function listPersonaPackages() {
  return personas.map((p) => getPersonaPackage(p.id));
}
