import { create } from 'zustand';
import { User, DEFAULT_USER, SubscriptionStatus } from '../models';

interface UserStore {
  user: User | null;
  isLoading: boolean;
  loadUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  setOnboardingComplete: () => Promise<void>;
  setSubscriptionStatus: (status: SubscriptionStatus) => void;
}

let StorageService: typeof import('../services/StorageService').StorageService;

async function getStorage() {
  if (!StorageService) {
    const mod = await import('../services/StorageService');
    StorageService = mod.StorageService;
  }
  return StorageService;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoading: false,

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const storage = await getStorage();
      const user = await storage.read<User>('user');
      if (user) {
        set({ user });
      } else {
        const newUser: User = {
          ...DEFAULT_USER,
          id: require('../utils/generateId').generateId(),
          createdAt: new Date().toISOString(),
        };
        await storage.save('user', newUser);
        set({ user: newUser });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (updates: Partial<User>) => {
    const { user } = get();
    if (!user) return;
    const updated = { ...user, ...updates };
    set({ user: updated }); // Update state immediately so UI responds
    try {
      const storage = await getStorage();
      await storage.save('user', updated);
    } catch (e) {
      console.warn('updateUser: storage save failed', e);
    }
  },

  setOnboardingComplete: async () => {
    const { user } = get();
    // Update state immediately so RootNavigator switches without waiting for storage
    const updated = user
      ? { ...user, onboardingComplete: true }
      : { ...require('../models').DEFAULT_USER, onboardingComplete: true };
    set({ user: updated });
    // Persist in background
    try {
      const storage = await getStorage();
      await storage.save('user', updated);
    } catch (e) {
      console.warn('setOnboardingComplete: storage save failed', e);
    }
  },

  setSubscriptionStatus: (status: SubscriptionStatus) => {
    const { user } = get();
    if (!user) return;
    set({ user: { ...user, subscriptionStatus: status } });
  },
}));
