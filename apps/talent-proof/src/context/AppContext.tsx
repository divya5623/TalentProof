import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { personas } from '../data/personas'
import { projects as seedProjects } from '../data/projects'
import { initialContactRequests } from '../data/contacts'
import type {
  ContactRequest,
  IntegrityEvent,
  Persona,
  Project,
  ProjectStatus,
  Role,
} from '../types'

interface AssessmentSession {
  projectId: string
  startedAt: string
  endsAt: string
  answers: Record<string, string | number>
  consent: boolean
  submitted: boolean
  integrity: IntegrityEvent[]
  currentIndex: number
}

interface AppState {
  role: Role
  activePersonaId: string
  projects: Project[]
  contacts: ContactRequest[]
  assessment: AssessmentSession | null
  setRole: (role: Role) => void
  switchPersona: (id: string) => void
  activePersona: Persona
  updateProjectStatus: (id: string, status: ProjectStatus) => void
  addProject: (p: Project) => void
  setAssessment: (s: AssessmentSession | null) => void
  patchAssessment: (patch: Partial<AssessmentSession>) => void
  addIntegrity: (e: Omit<IntegrityEvent, 'id'>) => void
  respondContact: (id: string, status: 'accepted' | 'rejected') => void
  requestContact: (req: Omit<ContactRequest, 'id' | 'createdAt' | 'status'>) => void
}

const AppContext = createContext<AppState | null>(null)

const defaultStudent = personas.find((p) => p.id === 'stu-priya')!

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('guest')
  const [activePersonaId, setActivePersonaId] = useState(defaultStudent.id)
  const [projects, setProjects] = useState<Project[]>(seedProjects)
  const [contacts, setContacts] = useState<ContactRequest[]>(initialContactRequests)
  const [assessment, setAssessment] = useState<AssessmentSession | null>(null)

  const activePersona = useMemo(
    () => personas.find((p) => p.id === activePersonaId) ?? defaultStudent,
    [activePersonaId],
  )

  const switchPersona = useCallback((id: string) => {
    const p = personas.find((x) => x.id === id)
    if (!p) return
    setActivePersonaId(id)
    setRole(p.role === 'recruiter' ? 'recruiter' : 'student')
  }, [])

  const updateProjectStatus = useCallback((id: string, status: ProjectStatus) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
  }, [])

  const addProject = useCallback((p: Project) => {
    setProjects((prev) => [p, ...prev])
  }, [])

  const patchAssessment = useCallback((patch: Partial<AssessmentSession>) => {
    setAssessment((prev) => (prev ? { ...prev, ...patch } : prev))
  }, [])

  const addIntegrity = useCallback((e: Omit<IntegrityEvent, 'id'>) => {
    setAssessment((prev) => {
      if (!prev) return prev
      const ev: IntegrityEvent = { ...e, id: `ie-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }
      return { ...prev, integrity: [...prev.integrity, ev] }
    })
  }, [])

  const respondContact = useCallback((id: string, status: 'accepted' | 'rejected') => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
  }, [])

  const requestContact = useCallback(
    (req: Omit<ContactRequest, 'id' | 'createdAt' | 'status'>) => {
      const row: ContactRequest = {
        ...req,
        id: `cr-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      setContacts((prev) => [row, ...prev])
    },
    [],
  )

  const value: AppState = {
    role,
    activePersonaId,
    projects,
    contacts,
    assessment,
    setRole,
    switchPersona,
    activePersona,
    updateProjectStatus,
    addProject,
    setAssessment,
    patchAssessment,
    addIntegrity,
    respondContact,
    requestContact,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp outside provider')
  return ctx
}
