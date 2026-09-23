import type { Persona } from '../types'

export const personas: Persona[] = [
  {
    id: 'stu-priya',
    role: 'student',
    name: 'Priya Sharma',
    email: 'priya.sharma@university.edu',
    title: 'CS Undergrad · Year 3',
    school: 'National Institute of Technology',
    avatarInitials: 'PS',
    bio: 'Backend-leaning student building reliable Python services. Interested in fintech and data integrity.',
    skills: ['Python', 'Flask', 'SQL', 'pytest', 'Git'],
    location: 'Bengaluru, IN',
  },
  {
    id: 'stu-alex',
    role: 'student',
    name: 'Alex Chen',
    email: 'alex.chen@college.edu',
    title: 'Full-stack · Year 4',
    school: 'State University of Design & Tech',
    avatarInitials: 'AC',
    bio: 'Ships polished React interfaces with strong accessibility habits. Looking for product engineering roles.',
    skills: ['TypeScript', 'React', 'Vite', 'Tailwind', 'Testing Library'],
    location: 'Austin, TX',
  },
  {
    id: 'rec-jordan',
    role: 'recruiter',
    name: 'Jordan Lee',
    email: 'jordan.lee@meridianlabs.io',
    title: 'Technical Talent Partner',
    company: 'Meridian Labs',
    avatarInitials: 'JL',
    bio: 'Hiring early-career engineers who can prove what they built — not just list it.',
    skills: ['Campus hiring', 'Technical screening', 'Evidence review'],
    location: 'Remote · US',
  },
]

export const getPersona = (id: string) => personas.find((p) => p.id === id)!
