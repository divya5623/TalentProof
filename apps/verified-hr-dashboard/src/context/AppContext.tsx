import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { initialShortlists } from '../data/shortlists';
import { initialSavedSearches } from '../data/team';
import type { SavedSearch, Shortlist, TalentFilters, ToastItem } from '../types';

interface State {
  compareIds: string[];
  shortlists: Shortlist[];
  savedSearches: SavedSearch[];
  toasts: ToastItem[];
}

type Action =
  | { type: 'TOGGLE_COMPARE'; id: string }
  | { type: 'CLEAR_COMPARE' }
  | { type: 'SET_COMPARE'; ids: string[] }
  | { type: 'ADD_TO_SHORTLIST'; shortlistId: string; candidateId: string }
  | { type: 'REMOVE_FROM_SHORTLIST'; shortlistId: string; candidateId: string }
  | { type: 'CREATE_SHORTLIST'; name: string; candidateId?: string }
  | { type: 'SAVE_SEARCH'; name: string; query: string; filters: TalentFilters }
  | { type: 'DELETE_SAVED_SEARCH'; id: string }
  | { type: 'TOAST'; message: string; toastType?: ToastItem['type'] }
  | { type: 'DISMISS_TOAST'; id: string };

const MAX_COMPARE = 4;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TOGGLE_COMPARE': {
      const exists = state.compareIds.includes(action.id);
      if (exists) {
        return { ...state, compareIds: state.compareIds.filter((id) => id !== action.id) };
      }
      if (state.compareIds.length >= MAX_COMPARE) {
        return {
          ...state,
          toasts: [
            ...state.toasts,
            {
              id: crypto.randomUUID(),
              message: 'You can compare up to 4 candidates',
              type: 'info',
            },
          ],
        };
      }
      return { ...state, compareIds: [...state.compareIds, action.id] };
    }
    case 'CLEAR_COMPARE':
      return { ...state, compareIds: [] };
    case 'SET_COMPARE':
      return { ...state, compareIds: action.ids.slice(0, MAX_COMPARE) };
    case 'ADD_TO_SHORTLIST': {
      const target = state.shortlists.find((s) => s.id === action.shortlistId);
      const shortlists = state.shortlists.map((s) => {
        if (s.id !== action.shortlistId) return s;
        if (s.candidateIds.includes(action.candidateId)) return s;
        return { ...s, candidateIds: [...s.candidateIds, action.candidateId] };
      });
      const already = target?.candidateIds.includes(action.candidateId);
      return {
        ...state,
        shortlists,
        toasts: [
          ...state.toasts,
          {
            id: crypto.randomUUID(),
            message: already
              ? `Already on “${target?.name ?? 'shortlist'}”`
              : `Added to “${target?.name ?? 'shortlist'}”`,
            type: already ? 'info' : 'success',
          },
        ],
      };
    }
    case 'REMOVE_FROM_SHORTLIST': {
      const shortlists = state.shortlists.map((s) =>
        s.id === action.shortlistId
          ? { ...s, candidateIds: s.candidateIds.filter((id) => id !== action.candidateId) }
          : s,
      );
      return {
        ...state,
        shortlists,
        toasts: [
          ...state.toasts,
          { id: crypto.randomUUID(), message: 'Removed from shortlist', type: 'info' },
        ],
      };
    }
    case 'CREATE_SHORTLIST': {
      const id = `sl-${Date.now()}`;
      const shortlist: Shortlist = {
        id,
        name: action.name,
        candidateIds: action.candidateId ? [action.candidateId] : [],
        createdOn: new Date().toISOString().slice(0, 10),
      };
      return {
        ...state,
        shortlists: [shortlist, ...state.shortlists],
        toasts: [
          ...state.toasts,
          { id: crypto.randomUUID(), message: `Created “${action.name}”`, type: 'success' },
        ],
      };
    }
    case 'SAVE_SEARCH': {
      const saved: SavedSearch = {
        id: `ss-${Date.now()}`,
        name: action.name,
        query: action.query,
        filters: action.filters,
        createdOn: new Date().toISOString().slice(0, 10),
      };
      return {
        ...state,
        savedSearches: [saved, ...state.savedSearches],
        toasts: [
          ...state.toasts,
          { id: crypto.randomUUID(), message: 'Search saved', type: 'success' },
        ],
      };
    }
    case 'DELETE_SAVED_SEARCH':
      return {
        ...state,
        savedSearches: state.savedSearches.filter((s) => s.id !== action.id),
      };
    case 'TOAST':
      return {
        ...state,
        toasts: [
          ...state.toasts,
          {
            id: crypto.randomUUID(),
            message: action.message,
            type: action.toastType ?? 'success',
          },
        ],
      };
    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

interface AppContextValue extends State {
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  setCompare: (ids: string[]) => void;
  addToShortlist: (shortlistId: string, candidateId: string) => void;
  removeFromShortlist: (shortlistId: string, candidateId: string) => void;
  createShortlist: (name: string, candidateId?: string) => void;
  saveSearch: (name: string, query: string, filters: TalentFilters) => void;
  deleteSavedSearch: (id: string) => void;
  toast: (message: string, type?: ToastItem['type']) => void;
  dismissToast: (id: string) => void;
  isComparing: (id: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    compareIds: [],
    shortlists: initialShortlists,
    savedSearches: initialSavedSearches,
    toasts: [],
  });

  const toggleCompare = useCallback((id: string) => dispatch({ type: 'TOGGLE_COMPARE', id }), []);
  const clearCompare = useCallback(() => dispatch({ type: 'CLEAR_COMPARE' }), []);
  const setCompare = useCallback((ids: string[]) => dispatch({ type: 'SET_COMPARE', ids }), []);
  const addToShortlist = useCallback(
    (shortlistId: string, candidateId: string) =>
      dispatch({ type: 'ADD_TO_SHORTLIST', shortlistId, candidateId }),
    [],
  );
  const removeFromShortlist = useCallback(
    (shortlistId: string, candidateId: string) =>
      dispatch({ type: 'REMOVE_FROM_SHORTLIST', shortlistId, candidateId }),
    [],
  );
  const createShortlist = useCallback(
    (name: string, candidateId?: string) =>
      dispatch({ type: 'CREATE_SHORTLIST', name, candidateId }),
    [],
  );
  const saveSearch = useCallback(
    (name: string, query: string, filters: TalentFilters) =>
      dispatch({ type: 'SAVE_SEARCH', name, query, filters }),
    [],
  );
  const deleteSavedSearch = useCallback(
    (id: string) => dispatch({ type: 'DELETE_SAVED_SEARCH', id }),
    [],
  );
  const toast = useCallback(
    (message: string, toastType?: ToastItem['type']) =>
      dispatch({ type: 'TOAST', message, toastType }),
    [],
  );
  const dismissToast = useCallback(
    (id: string) => dispatch({ type: 'DISMISS_TOAST', id }),
    [],
  );
  const isComparing = useCallback(
    (id: string) => state.compareIds.includes(id),
    [state.compareIds],
  );

  const value = useMemo(
    () => ({
      ...state,
      toggleCompare,
      clearCompare,
      setCompare,
      addToShortlist,
      removeFromShortlist,
      createShortlist,
      saveSearch,
      deleteSavedSearch,
      toast,
      dismissToast,
      isComparing,
    }),
    [
      state,
      toggleCompare,
      clearCompare,
      setCompare,
      addToShortlist,
      removeFromShortlist,
      createShortlist,
      saveSearch,
      deleteSavedSearch,
      toast,
      dismissToast,
      isComparing,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
