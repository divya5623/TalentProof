export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Evidence {
  practicalAssessment: number;
  technicalKnowledge: number;
  projectEvaluation: number;
  verifiedOn: string;
  status: 'verified';
  summary?: string;
}

export interface VerifiedSkill {
  name: string;
  score: number;
  level: SkillLevel;
  evidence: Evidence;
  credentialId?: string;
}

export interface Credential {
  title: string;
  issuedOn: string;
  verificationId: string;
  status: 'Authentic';
  skills?: string[];
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  location: string;
  experienceYears: number;
  avatarInitials: string;
  avatarHue?: number;
  availability: 'Available' | 'Open to opportunities' | 'Passive';
  education: string;
  verificationScore: number;
  breakdown: {
    technicalKnowledge: number;
    practicalAbility: number;
    problemSolving: number;
    communication: number;
  };
  verifiedSkills: VerifiedSkill[];
  selfReportedSkills: string[];
  credentials: Credential[];
  summary?: string;
}

export interface Job {
  id: string;
  title: string;
  status: 'Active' | 'Draft' | 'Closed';
  department: string;
  location: string;
  requiredSkills: string[];
  preferredSkills: string[];
  description: string;
  stats: {
    matches: number;
    shortlisted: number;
    contacted: number;
  };
  createdOn: string;
}

export interface Shortlist {
  id: string;
  name: string;
  candidateIds: string[];
  description?: string;
  createdOn: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: TalentFilters;
  createdOn: string;
}

export interface TalentFilters {
  roles: string[];
  skills: string[];
  minExperience: number | null;
  locations: string[];
  minVerification: number | null;
  skillLevels: SkillLevel[];
  education: string[];
  availability: string[];
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  initials: string;
}

export const emptyFilters = (): TalentFilters => ({
  roles: [],
  skills: [],
  minExperience: null,
  locations: [],
  minVerification: null,
  skillLevels: [],
  education: [],
  availability: [],
});
