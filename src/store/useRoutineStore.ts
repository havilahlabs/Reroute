import { create } from 'zustand';
import { Routine } from '../models';

interface RoutineStore {
  routines: Routine[];
  isLoading: boolean;
  loadRoutines: () => Promise<void>;
  addRoutine: (routine: Routine) => Promise<void>;
  updateRoutine: (id: string, updates: Partial<Routine>) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
}

async function persistRoutines(routines: Routine[]) {
  const { StorageService } = await import('../services/StorageService');
  await StorageService.save('routines', routines);
}

export const useRoutineStore = create<RoutineStore>((set, get) => ({
  routines: [],
  isLoading: false,

  loadRoutines: async () => {
    set({ isLoading: true });
    try {
      const { StorageService } = await import('../services/StorageService');
      const routines = await StorageService.read<Routine[]>('routines');
      set({ routines: routines ?? [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addRoutine: async (routine) => {
    const updated = [...get().routines, routine];
    set({ routines: updated });
    await persistRoutines(updated);
  },

  updateRoutine: async (id, updates) => {
    const updated = get().routines.map(r =>
      r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
    );
    set({ routines: updated });
    await persistRoutines(updated);
  },

  deleteRoutine: async (id) => {
    const updated = get().routines.filter(r => r.id !== id);
    set({ routines: updated });
    await persistRoutines(updated);
  },
}));
