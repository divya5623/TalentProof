import type { CertificatePayload, PersonaId } from '../types';

export const certificatesByPersona: Record<PersonaId, CertificatePayload> = {
  aarav: {
    personaId: 'aarav',
    title: 'Verified Frontend Engineer',
    credentialId: 'VRF-92831',
    issuedOn: '2026-08-20',
    skillBadgeIds: ['react', 'javascript', 'typescript', 'nextjs'],
    publicSlug: 'aarav-sharma-frontend',
  },
  priya: {
    personaId: 'priya',
    title: 'Verified Backend Engineer',
    credentialId: 'VRF-10442',
    issuedOn: '2026-09-12',
    skillBadgeIds: ['nodejs', 'rest-apis', 'postgresql', 'system-design'],
    publicSlug: 'priya-nair-backend',
  },
  kabir: {
    personaId: 'kabir',
    title: 'Verified Data/ML Engineer',
    credentialId: 'VRF-22107',
    issuedOn: '2026-09-15',
    skillBadgeIds: ['python', 'sql', 'machine-learning', 'data-wrangling'],
    publicSlug: 'kabir-mehta-data-ml',
  },
  ananya: {
    personaId: 'ananya',
    title: 'Verified Mobile Engineer',
    credentialId: 'VRF-33518',
    issuedOn: '2026-09-18',
    skillBadgeIds: ['react-native', 'flutter', 'mobile-ui', 'app-state'],
    publicSlug: 'ananya-iyer-mobile',
  },
};

export function getCertificate(personaId: PersonaId): CertificatePayload {
  return certificatesByPersona[personaId];
}

export function findCertificateByCredentialId(
  credentialId: string,
): CertificatePayload | undefined {
  return Object.values(certificatesByPersona).find((c) => c.credentialId === credentialId);
}

export function findCertificateBySlug(slug: string): CertificatePayload | undefined {
  return Object.values(certificatesByPersona).find((c) => c.publicSlug === slug);
}
