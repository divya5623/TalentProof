import type { TeamMember, SavedSearch } from '../types';

export const teamMembers: TeamMember[] = [
  {
    id: 'tm-rahul',
    name: 'Rahul Mehta',
    role: 'Talent Acquisition Lead',
    email: 'rahul.mehta@verified.example',
    initials: 'RM',
  },
  {
    id: 'tm-aisha',
    name: 'Aisha Fernandes',
    role: 'Technical Recruiter',
    email: 'aisha.fernandes@verified.example',
    initials: 'AF',
  },
  {
    id: 'tm-kevin',
    name: 'Kevin Ortiz',
    role: 'Sourcing Specialist',
    email: 'kevin.ortiz@verified.example',
    initials: 'KO',
  },
];

export const initialSavedSearches: SavedSearch[] = [
  {
    id: 'ss-react-dev',
    name: 'React Developers 2y+',
    query: 'React Developer',
    filters: {
      roles: ['Frontend Developer'],
      skills: ['React', 'JavaScript', 'TypeScript'],
      minExperience: 2,
      locations: [],
      minVerification: 80,
      skillLevels: [],
      education: [],
      availability: [],
    },
    createdOn: '2026-09-15',
  },
  {
    id: 'ss-ml',
    name: 'ML Engineers India',
    query: 'Machine Learning',
    filters: {
      roles: ['AI/ML Engineer'],
      skills: ['Python', 'Machine Learning'],
      minExperience: 2,
      locations: ['Bengaluru, India'],
      minVerification: 85,
      skillLevels: [],
      education: [],
      availability: [],
    },
    createdOn: '2026-09-08',
  },
];
