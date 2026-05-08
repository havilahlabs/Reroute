import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@reroute:';

export const StorageService = {
  async initialize(): Promise<void> {
    // AsyncStorage is ready to use immediately.
    // Future: run migrations here.
  },

  async save<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
  },

  async read<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async update<T extends object>(key: string, updates: Partial<T>): Promise<T | null> {
    const existing = await StorageService.read<T>(key);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    await StorageService.save(key, updated);
    return updated;
  },

  async delete(key: string): Promise<void> {
    await AsyncStorage.removeItem(PREFIX + key);
  },

  async exportData(): Promise<Record<string, unknown>> {
    const keys = await AsyncStorage.getAllKeys();
    const rerouteKeys = keys.filter(k => k.startsWith(PREFIX));
    const pairs = await AsyncStorage.multiGet(rerouteKeys);
    const result: Record<string, unknown> = {};
    for (const [key, value] of pairs) {
      const cleanKey = key.replace(PREFIX, '');
      try {
        result[cleanKey] = value ? JSON.parse(value) : null;
      } catch {
        result[cleanKey] = value;
      }
    }
    return result;
  },

  async deleteAllData(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const rerouteKeys = keys.filter(k => k.startsWith(PREFIX));
    await AsyncStorage.multiRemove(rerouteKeys);
  },

  async migrate(): Promise<void> {
    // Placeholder for future schema migrations.
    // Check stored schema version and apply incremental migrations.
    const currentVersion = await StorageService.read<number>('schemaVersion');
    if (!currentVersion) {
      await StorageService.save('schemaVersion', 1);
    }
  },
};
