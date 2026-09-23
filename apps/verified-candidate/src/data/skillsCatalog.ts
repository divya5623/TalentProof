import type { SkillDef, TrackId } from '../types';

export const skillsCatalog: SkillDef[] = [
  // Frontend core
  { id: 'react', name: 'React', trackId: 'frontend', core: true },
  { id: 'javascript', name: 'JavaScript', trackId: 'frontend', core: true },
  { id: 'typescript', name: 'TypeScript', trackId: 'frontend', core: true },
  { id: 'nextjs', name: 'Next.js', trackId: 'frontend', core: true },
  // Frontend additional
  { id: 'figma', name: 'Figma', trackId: 'frontend', core: false },
  { id: 'graphql', name: 'GraphQL', trackId: 'frontend', core: false },
  { id: 'css-tailwind', name: 'CSS / Tailwind', trackId: 'frontend', core: false },
  { id: 'testing-rtl', name: 'React Testing Library', trackId: 'frontend', core: false },

  // Backend core
  { id: 'nodejs', name: 'Node.js', trackId: 'backend', core: true },
  { id: 'rest-apis', name: 'REST APIs', trackId: 'backend', core: true },
  { id: 'postgresql', name: 'PostgreSQL', trackId: 'backend', core: true },
  { id: 'system-design', name: 'System Design', trackId: 'backend', core: true },
  // Backend additional
  { id: 'redis', name: 'Redis', trackId: 'backend', core: false },
  { id: 'docker', name: 'Docker', trackId: 'backend', core: false },
  { id: 'kafka', name: 'Kafka', trackId: 'backend', core: false },
  { id: 'nestjs', name: 'NestJS', trackId: 'backend', core: false },

  // Data/ML core
  { id: 'python', name: 'Python', trackId: 'data-ml', core: true },
  { id: 'sql', name: 'SQL', trackId: 'data-ml', core: true },
  { id: 'machine-learning', name: 'Machine Learning', trackId: 'data-ml', core: true },
  { id: 'data-wrangling', name: 'Data Wrangling', trackId: 'data-ml', core: true },
  // Data/ML additional
  { id: 'pytorch', name: 'PyTorch', trackId: 'data-ml', core: false },
  { id: 'tableau', name: 'Tableau', trackId: 'data-ml', core: false },
  { id: 'spark', name: 'Apache Spark', trackId: 'data-ml', core: false },
  { id: 'mlflow', name: 'MLflow', trackId: 'data-ml', core: false },

  // Mobile core
  { id: 'react-native', name: 'React Native', trackId: 'mobile', core: true },
  { id: 'flutter', name: 'Flutter', trackId: 'mobile', core: true },
  { id: 'mobile-ui', name: 'Mobile UI', trackId: 'mobile', core: true },
  { id: 'app-state', name: 'App State Management', trackId: 'mobile', core: true },
  // Mobile additional
  { id: 'firebase', name: 'Firebase', trackId: 'mobile', core: false },
  { id: 'app-store', name: 'App Store Release', trackId: 'mobile', core: false },
  { id: 'swift-ui', name: 'SwiftUI', trackId: 'mobile', core: false },
  { id: 'detox', name: 'Detox / E2E', trackId: 'mobile', core: false },
];

export function skillsByTrack(trackId: TrackId): SkillDef[] {
  return skillsCatalog.filter((s) => s.trackId === trackId);
}

export function coreSkillsByTrack(trackId: TrackId): SkillDef[] {
  return skillsByTrack(trackId).filter((s) => s.core);
}

export function getSkill(id: string): SkillDef | undefined {
  return skillsCatalog.find((s) => s.id === id);
}

export const skillNameById: Record<string, string> = Object.fromEntries(
  skillsCatalog.map((s) => [s.id, s.name]),
);
