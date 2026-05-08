import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppearanceMode = 'light' | 'dark' | 'auto';

interface ThemeStore {
  appearanceMode: AppearanceMode;
  setAppearanceMode: (mode: AppearanceMode) => Promise<void>;
  loadAppearanceMode: () => Promise<void>;
}

const STORAGE_KEY = '@reroute:appearanceMode';

export const useThemeStore = create<ThemeStore>((set) => ({
  appearanceMode: 'auto',

  setAppearanceMode: async (mode) => {
    set({ appearanceMode: mode });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, mode);
    } catch (e) {
      console.warn('Failed to save appearance mode', e);
    }
  },

  loadAppearanceMode: async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'auto') {
        set({ appearanceMode: saved });
      }
    } catch (e) {
      console.warn('Failed to load appearance mode', e);
    }
  },
}));
