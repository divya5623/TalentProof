import type { Candidate, TalentFilters } from '../types';

const ROLE_ALIASES: Record<string, string[]> = {
  react: ['Frontend Developer', 'Full Stack Developer'],
  frontend: ['Frontend Developer'],
  backend: ['Backend Developer'],
  'full stack': ['Full Stack Developer'],
  fullstack: ['Full Stack Developer'],
  'ai/ml': ['AI/ML Engineer'],
  'machine learning': ['AI/ML Engineer', 'Data Scientist'],
  'data scien': ['Data Scientist'],
  'data analy': ['Data Analyst'],
  devops: ['DevOps Engineer'],
  cyber: ['Cybersecurity Analyst', 'Cybersecurity Engineer'],
  security: ['Cybersecurity Analyst', 'Cybersecurity Engineer'],
};

const SKILL_TOKENS = [
  'react',
  'javascript',
  'typescript',
  'next.js',
  'nextjs',
  'node.js',
  'nodejs',
  'python',
  'java',
  'sql',
  'aws',
  'kubernetes',
  'docker',
  'pytorch',
  'tensorflow',
  'css',
  'mongodb',
  'postgresql',
  'graphql',
  'machine learning',
  'nlp',
];

function normalize(s: string) {
  return s.toLowerCase().trim();
}

export function parseSearchQuery(query: string): {
  text: string;
  inferredRoles: string[];
  inferredSkills: string[];
} {
  const q = normalize(query);
  if (!q) return { text: '', inferredRoles: [], inferredSkills: [] };

  const inferredRoles = new Set<string>();
  const inferredSkills = new Set<string>();

  for (const [alias, roles] of Object.entries(ROLE_ALIASES)) {
    if (q.includes(alias)) roles.forEach((r) => inferredRoles.add(r));
  }

  for (const skill of SKILL_TOKENS) {
    if (q.includes(skill)) {
      const pretty =
        skill === 'nextjs'
          ? 'Next.js'
          : skill === 'nodejs'
            ? 'Node.js'
            : skill
                .split(' ')
                .map((w) => (w === 'js' ? 'JS' : w.charAt(0).toUpperCase() + w.slice(1)))
                .join(' ')
                .replace('Javascript', 'JavaScript')
                .replace('Typescript', 'TypeScript')
                .replace('Postgresql', 'PostgreSQL')
                .replace('Mongodb', 'MongoDB')
                .replace('Graphql', 'GraphQL')
                .replace('Nlp', 'NLP')
                .replace('Aws', 'AWS')
                .replace('Css', 'CSS')
                .replace('Sql', 'SQL')
                .replace('Machine Learning', 'Machine Learning');
      inferredSkills.add(
        skill === 'javascript'
          ? 'JavaScript'
          : skill === 'typescript'
            ? 'TypeScript'
            : skill === 'react'
              ? 'React'
              : skill === 'next.js' || skill === 'nextjs'
                ? 'Next.js'
                : skill === 'node.js' || skill === 'nodejs'
                  ? 'Node.js'
                  : skill === 'python'
                    ? 'Python'
                    : skill === 'machine learning'
                      ? 'Machine Learning'
                      : pretty,
      );
    }
  }

  if (q.includes('developer') || q.includes('engineer')) {
    // keep roles from aliases; if none, leave open
  }

  return {
    text: query.trim(),
    inferredRoles: [...inferredRoles],
    inferredSkills: [...inferredSkills],
  };
}

export function filterCandidates(
  all: Candidate[],
  query: string,
  filters: TalentFilters,
): Candidate[] {
  const parsed = parseSearchQuery(query);
  const roleSet = new Set([...(filters.roles || []), ...parsed.inferredRoles]);
  const skillSet = new Set(
    [...(filters.skills || []), ...parsed.inferredSkills].map((s) => s.toLowerCase()),
  );

  return all.filter((c) => {
    if (roleSet.size > 0 && ![...roleSet].some((r) => c.role === r || c.role.includes(r))) {
      // soft: also allow if query matches name/role textually
      const q = normalize(parsed.text);
      const textHit =
        !q ||
        normalize(c.name).includes(q) ||
        normalize(c.role).includes(q) ||
        c.verifiedSkills.some((s) => normalize(s.name).includes(q));
      if (!textHit && ![...roleSet].some((r) => normalize(c.role).includes(normalize(r)))) {
        return false;
      }
      if (![...roleSet].some((r) => c.role === r) && !textHit) return false;
      // Prefer role match when roles inferred
      if (![...roleSet].some((r) => c.role === r)) {
        // allow if they have inferred skills
        if (skillSet.size === 0) return false;
      }
    }

    if (skillSet.size > 0) {
      const names = c.verifiedSkills.map((s) => s.name.toLowerCase());
      const hit = [...skillSet].every((sk) => names.some((n) => n === sk || n.includes(sk)));
      // For search-inferred skills, require at least one if also roles; for explicit filters require all
      if (filters.skills.length > 0) {
        const explicit = filters.skills.map((s) => s.toLowerCase());
        if (!explicit.every((sk) => names.some((n) => n === sk || n.includes(sk)))) return false;
      } else if (parsed.inferredSkills.length > 0) {
        if (!parsed.inferredSkills.some((sk) => names.includes(sk.toLowerCase()))) return false;
      } else if (!hit) {
        return false;
      }
    }

    if (filters.minExperience != null && c.experienceYears < filters.minExperience) return false;
    if (filters.minVerification != null && c.verificationScore < filters.minVerification)
      return false;

    if (filters.locations.length > 0) {
      if (!filters.locations.some((l) => normalize(c.location).includes(normalize(l))))
        return false;
    }

    if (filters.skillLevels.length > 0) {
      if (!c.verifiedSkills.some((s) => filters.skillLevels.includes(s.level))) return false;
    }

    if (filters.education.length > 0) {
      if (!filters.education.some((e) => normalize(c.education).includes(normalize(e))))
        return false;
    }

    if (filters.availability.length > 0) {
      if (!filters.availability.includes(c.availability)) return false;
    }

    // Free-text name fallback when no structured inference
    if (
      parsed.text &&
      roleSet.size === 0 &&
      skillSet.size === 0 &&
      !normalize(c.name).includes(normalize(parsed.text)) &&
      !normalize(c.role).includes(normalize(parsed.text)) &&
      !c.verifiedSkills.some((s) => normalize(s.name).includes(normalize(parsed.text))) &&
      !normalize(c.location).includes(normalize(parsed.text))
    ) {
      return false;
    }

    return true;
  });
}

export function jobMatchExplanation(
  candidate: Candidate,
  required: string[],
  preferred: string[],
) {
  const verified = candidate.verifiedSkills.map((s) => s.name.toLowerCase());
  const matchedRequired = required.filter((s) =>
    verified.some((v) => v === s.toLowerCase() || v.includes(s.toLowerCase())),
  );
  const matchedPreferred = preferred.filter((s) =>
    verified.some((v) => v === s.toLowerCase() || v.includes(s.toLowerCase())),
  );
  const additional = candidate.verifiedSkills
    .map((s) => s.name)
    .filter(
      (n) =>
        !required.some((r) => r.toLowerCase() === n.toLowerCase()) &&
        !preferred.some((p) => p.toLowerCase() === n.toLowerCase()),
    );
  return { matchedRequired, matchedPreferred, additional };
}
