import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { computeScoreComponents } from '../data/scores';
import { getHonestyMap } from '../data/honestyMaps';
import {
  completeJourneyTargets,
  getPersona,
  seedJourneyByPersona,
} from '../data/personas';
import { guardNavigate } from '../lib/journey';
import type {
  AppState,
  AppUiState,
  HonestyState,
  JourneyProgress,
  Persona,
  PersonaId,
  ReconcileDisposition,
  ScoreComponents,
} from '../types';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

type Action =
  | { type: 'SWITCH_PERSONA'; id: PersonaId }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'SET_CLAIMS'; skillIds: string[] }
  | { type: 'ATTACH_RESUME' }
  | { type: 'CONNECT_GITHUB'; includedRepoIds: string[] }
  | {
      type: 'SET_DISPOSITION';
      skillId: string;
      disposition: ReconcileDisposition;
      note?: string;
    }
  | { type: 'MARK_RECONCILE_REVIEWED' }
  | { type: 'SUBMIT_EXAM'; skillId: string; score: number }
  | { type: 'SUBMIT_PROJECT'; repoId: string; composite: number; authorship: number }
  | { type: 'ISSUE_PRO' }
  | { type: 'RESET_PERSONA' }
  | { type: 'RESET_ALL' }
  | { type: 'APPLY_COMPLETE_JOURNEY' }
  | { type: 'SET_UI'; patch: Partial<AppUiState> }
  | { type: 'TOAST'; message: string; toastType?: ToastType }
  | { type: 'DISMISS_TOAST'; id: string };

interface State extends AppState {
  toasts: ToastItem[];
}

function cloneJourney(j: JourneyProgress): JourneyProgress {
  return structuredClone(j);
}

function cloneSeeds(): Record<PersonaId, JourneyProgress> {
  return structuredClone(seedJourneyByPersona);
}

function initialState(): State {
  return {
    activePersonaId: 'aarav',
    journeyByPersona: cloneSeeds(),
    ui: {
      toast: null,
      examSession: null,
      projectAuditSession: null,
      resumeParsePhase: 'idle',
      githubConnectPhase: 'idle',
    },
    toasts: [],
  };
}

function patchActive(
  state: State,
  updater: (j: JourneyProgress) => JourneyProgress,
): State {
  const id = state.activePersonaId;
  const next = updater(cloneJourney(state.journeyByPersona[id]));
  return {
    ...state,
    journeyByPersona: { ...state.journeyByPersona, [id]: next },
  };
}

function pushToast(
  state: State,
  message: string,
  toastType: ToastType = 'info',
): State {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const item: ToastItem = { id, message, type: toastType };
  return {
    ...state,
    ui: { ...state.ui, toast: { id, message, toastType } },
    toasts: [...state.toasts, item],
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SWITCH_PERSONA':
      return { ...state, activePersonaId: action.id };

    case 'COMPLETE_ONBOARDING':
      return patchActive(state, (j) => ({ ...j, onboardingComplete: true }));

    case 'SET_CLAIMS':
      return patchActive(state, (j) => ({
        ...j,
        claimedSkillIds: [...action.skillIds],
      }));

    case 'ATTACH_RESUME':
      return patchActive(state, (j) => ({ ...j, resumeAttached: true }));

    case 'CONNECT_GITHUB':
      return patchActive(state, (j) => ({
        ...j,
        githubConnected: true,
        includedRepoIds: [...action.includedRepoIds],
      }));

    case 'SET_DISPOSITION':
      return patchActive(state, (j) => {
        const dispositions = {
          ...j.dispositions,
          [action.skillId]: action.disposition,
        };
        const evidenceNotes = { ...j.evidenceNotes };
        if (action.note !== undefined) {
          evidenceNotes[action.skillId] = action.note;
        }
        return { ...j, dispositions, evidenceNotes };
      });

    case 'MARK_RECONCILE_REVIEWED':
      return patchActive(state, (j) => ({ ...j, reconcileReviewed: true }));

    case 'SUBMIT_EXAM': {
      const status: 'passed' | 'failed' =
        action.score >= 70 ? 'passed' : 'failed';
      return patchActive(state, (j) => ({
        ...j,
        examResults: {
          ...j.examResults,
          [action.skillId]: {
            score: action.score,
            status,
            attemptedAt: new Date().toISOString(),
          },
        },
      }));
    }

    case 'SUBMIT_PROJECT': {
      const status: 'passed' | 'failed' =
        action.composite >= 70 && action.authorship >= 40 ? 'passed' : 'failed';
      return patchActive(state, (j) => ({
        ...j,
        projectResults: {
          ...j.projectResults,
          [action.repoId]: {
            composite: action.composite,
            authorship: action.authorship,
            status,
          },
        },
      }));
    }

    case 'ISSUE_PRO':
      return patchActive(state, (j) => ({
        ...j,
        proIssued: true,
        shareEnabled: true,
      }));

    case 'RESET_PERSONA': {
      const id = state.activePersonaId;
      return {
        ...state,
        journeyByPersona: {
          ...state.journeyByPersona,
          [id]: cloneJourney(seedJourneyByPersona[id]),
        },
      };
    }

    case 'RESET_ALL':
      return {
        ...state,
        journeyByPersona: cloneSeeds(),
        ui: {
          ...state.ui,
          examSession: null,
          projectAuditSession: null,
          resumeParsePhase: 'idle',
          githubConnectPhase: 'idle',
        },
      };

    case 'APPLY_COMPLETE_JOURNEY': {
      const id = state.activePersonaId;
      return {
        ...state,
        journeyByPersona: {
          ...state.journeyByPersona,
          [id]: cloneJourney(completeJourneyTargets[id]),
        },
      };
    }

    case 'SET_UI':
      return { ...state, ui: { ...state.ui, ...action.patch } };

    case 'TOAST':
      return pushToast(state, action.message, action.toastType ?? 'info');

    case 'DISMISS_TOAST': {
      const toasts = state.toasts.filter((t) => t.id !== action.id);
      const uiToast =
        state.ui.toast?.id === action.id ? null : state.ui.toast;
      return { ...state, toasts, ui: { ...state.ui, toast: uiToast } };
    }

    default:
      return state;
  }
}

interface AppContextValue extends State {
  dispatch: React.Dispatch<Action>;
  persona: Persona;
  journey: JourneyProgress;
  score: ScoreComponents;
  switchPersona: (id: PersonaId) => void;
  toast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function deriveScore(persona: Persona, journey: JourneyProgress): ScoreComponents {
  const claimed = new Set(journey.claimedSkillIds);
  const honestyStates: HonestyState[] = getHonestyMap(persona.id)
    .filter((row) => claimed.has(row.skillId))
    .filter((row) => journey.dispositions[row.skillId] !== 'remove')
    .map((row) => row.state);

  const l1Scores = persona.coreSkillIds
    .map((id) => journey.examResults[id])
    .filter((r): r is NonNullable<typeof r> => Boolean(r))
    .map((r) => r.score);

  const l2Scores = Object.values(journey.projectResults)
    .filter((r) => r.status === 'passed' || r.status === 'failed')
    .map((r) => r.composite);

  return computeScoreComponents({
    l1Scores,
    l2Scores,
    honestyStates,
    integrity: persona.integritySeed,
  });
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const navigate = useNavigate();
  const location = useLocation();

  const persona = getPersona(state.activePersonaId);
  const journey = state.journeyByPersona[state.activePersonaId];
  const score = useMemo(
    () => deriveScore(persona, journey),
    [persona, journey],
  );

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    dispatch({ type: 'TOAST', message, toastType: type });
  }, []);

  const dismissToast = useCallback((id: string) => {
    dispatch({ type: 'DISMISS_TOAST', id });
  }, []);

  const switchPersona = useCallback(
    (id: PersonaId) => {
      if (id === state.activePersonaId) return;
      dispatch({ type: 'SWITCH_PERSONA', id });
      const nextPersona = getPersona(id);
      const nextJourney = state.journeyByPersona[id];
      const guard = guardNavigate(location.pathname, nextJourney, nextPersona);
      if (!guard.ok) {
        navigate(guard.redirectTo, { replace: true });
        dispatch({
          type: 'TOAST',
          message: `Switched to ${nextPersona.name}. ${guard.reason}`,
          toastType: 'info',
        });
      } else {
        dispatch({
          type: 'TOAST',
          message: `Switched to ${nextPersona.name}`,
          toastType: 'success',
        });
      }
    },
    [state.activePersonaId, state.journeyByPersona, location.pathname, navigate],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      dispatch,
      persona,
      journey,
      score,
      switchPersona,
      toast,
      dismissToast,
    }),
    [state, persona, journey, score, switchPersona, toast, dismissToast],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function useActivePersona() {
  return useApp().persona;
}

export function useJourney() {
  return useApp().journey;
}

export function useScore() {
  return useApp().score;
}

export type { Action };
