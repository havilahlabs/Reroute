import { create } from 'zustand';
import { FocusSession, DriftEvent, UnlockEvent } from '../models';

interface SessionDraft {
  task: string;
  durationMinutes: number;
  selectedDistractions: string[];
  reroutePlan: string;
}

interface SessionStore {
  activeSession: FocusSession | null;
  sessionHistory: FocusSession[];
  driftEvents: DriftEvent[];
  unlockEvents: UnlockEvent[];
  draft: Partial<SessionDraft>;
  isUnlocked: boolean;
  unlockStartedAt: string | null;

  setDraft: (updates: Partial<SessionDraft>) => void;
  clearDraft: () => void;
  setActiveSession: (session: FocusSession | null) => void;
  updateActiveSession: (updates: Partial<FocusSession>) => void;
  addDriftEvent: (event: DriftEvent) => void;
  addUnlockEvent: (event: UnlockEvent) => void;
  endUnlockEvent: (eventId: string) => void;
  setIsUnlocked: (val: boolean, startedAt?: string) => void;
  loadSessionHistory: () => Promise<void>;
  addSessionToHistory: (session: FocusSession) => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  activeSession: null,
  sessionHistory: [],
  driftEvents: [],
  unlockEvents: [],
  draft: {},
  isUnlocked: false,
  unlockStartedAt: null,

  setDraft: (updates) =>
    set(state => ({ draft: { ...state.draft, ...updates } })),

  clearDraft: () => set({ draft: {} }),

  setActiveSession: (session) =>
    set({ activeSession: session, driftEvents: [], unlockEvents: [] }),

  updateActiveSession: (updates) =>
    set(state => ({
      activeSession: state.activeSession
        ? { ...state.activeSession, ...updates, updatedAt: new Date().toISOString() }
        : null,
    })),

  addDriftEvent: (event) =>
    set(state => ({ driftEvents: [...state.driftEvents, event] })),

  addUnlockEvent: (event) =>
    set(state => ({ unlockEvents: [...state.unlockEvents, event] })),

  endUnlockEvent: (eventId) =>
    set(state => ({
      unlockEvents: state.unlockEvents.map(e =>
        e.id === eventId
          ? {
              ...e,
              endedAt: new Date().toISOString(),
              durationSeconds: Math.floor(
                (Date.now() - new Date(e.startedAt).getTime()) / 1000
              ),
            }
          : e
      ),
    })),

  setIsUnlocked: (val, startedAt) =>
    set({ isUnlocked: val, unlockStartedAt: startedAt ?? null }),

  loadSessionHistory: async () => {
    try {
      const { StorageService } = await import('../services/StorageService');
      const sessions = await StorageService.read<FocusSession[]>('sessions');
      if (sessions) {
        set({ sessionHistory: sessions });
      }
    } catch (e) {
      console.warn('Failed to load session history', e);
    }
  },

  addSessionToHistory: (session) => {
    set(state => {
      const updated = [session, ...state.sessionHistory].slice(0, 200);
      import('../services/StorageService').then(({ StorageService }) => {
        StorageService.save('sessions', updated);
      });
      return { sessionHistory: updated };
    });
  },
}));
