import { create } from 'zustand';
import { Insight, WeeklyInsight } from '../models';

interface InsightStore {
  insights: Insight[];
  weeklyInsight: WeeklyInsight | null;
  todaysRoute: string | null;
  todaysRouteSetAt: string | null;
  loadInsights: () => Promise<void>;
  addInsight: (insight: Insight) => void;
  setTodaysRoute: (text: string) => Promise<void>;
  clearTodaysRoute: () => Promise<void>;
  loadTodaysRoute: () => Promise<void>;
  setWeeklyInsight: (insight: WeeklyInsight) => void;
}

export const useInsightStore = create<InsightStore>((set, get) => ({
  insights: [],
  weeklyInsight: null,
  todaysRoute: null,
  todaysRouteSetAt: null,

  loadInsights: async () => {
    const { StorageService } = await import('../services/StorageService');
    const insights = await StorageService.read<Insight[]>('insights');
    set({ insights: insights ?? [] });
  },

  addInsight: (insight) => {
    set(state => {
      const updated = [insight, ...state.insights].slice(0, 100);
      import('../services/StorageService').then(({ StorageService }) => {
        StorageService.save('insights', updated);
      });
      return { insights: updated };
    });
  },

  setTodaysRoute: async (text) => {
    const setAt = new Date().toISOString();
    const { StorageService } = await import('../services/StorageService');
    await StorageService.save('todaysRoute', { text, setAt });
    set({ todaysRoute: text, todaysRouteSetAt: setAt });
  },

  clearTodaysRoute: async () => {
    const { StorageService } = await import('../services/StorageService');
    await StorageService.delete('todaysRoute');
    set({ todaysRoute: null, todaysRouteSetAt: null });
  },

  loadTodaysRoute: async () => {
    const { StorageService } = await import('../services/StorageService');
    const route = await StorageService.read<{ text: string; setAt: string }>('todaysRoute');
    if (route) {
      const today = new Date().toDateString();
      const setDay = new Date(route.setAt).toDateString();
      if (today === setDay) {
        set({ todaysRoute: route.text, todaysRouteSetAt: route.setAt });
      } else {
        await StorageService.delete('todaysRoute');
      }
    }
  },

  setWeeklyInsight: (insight) => set({ weeklyInsight: insight }),
}));
