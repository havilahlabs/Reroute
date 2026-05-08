import { StorageService } from '../services/StorageService';

const mockStorage: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn((key: string, value: string) => {
    mockStorage[key] = value;
    return Promise.resolve();
  }),
  getItem: jest.fn((key: string) => Promise.resolve(mockStorage[key] ?? null)),
  removeItem: jest.fn((key: string) => {
    delete mockStorage[key];
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => Promise.resolve(Object.keys(mockStorage))),
  multiGet: jest.fn((keys: string[]) =>
    Promise.resolve(keys.map(k => [k, mockStorage[k] ?? null]))
  ),
  multiRemove: jest.fn((keys: string[]) => {
    keys.forEach(k => delete mockStorage[k]);
    return Promise.resolve();
  }),
}));

describe('StorageService', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    jest.clearAllMocks();
  });

  it('saves and reads a value', async () => {
    await StorageService.save('testKey', { foo: 'bar' });
    const result = await StorageService.read<{ foo: string }>('testKey');
    expect(result?.foo).toBe('bar');
  });

  it('returns null for missing key', async () => {
    const result = await StorageService.read('missingKey');
    expect(result).toBeNull();
  });

  it('updates a value', async () => {
    await StorageService.save('testKey', { a: 1, b: 2 });
    const updated = await StorageService.update<{ a: number; b: number }>('testKey', { b: 99 });
    expect(updated?.b).toBe(99);
    expect(updated?.a).toBe(1);
  });

  it('deletes a value', async () => {
    await StorageService.save('testKey', 'hello');
    await StorageService.delete('testKey');
    const result = await StorageService.read('testKey');
    expect(result).toBeNull();
  });

  it('exports data', async () => {
    await StorageService.save('user', { id: '123' });
    await StorageService.save('sessions', []);
    const exported = await StorageService.exportData();
    expect(exported['user']).toBeDefined();
    expect(exported['sessions']).toBeDefined();
  });

  it('deleteAllData removes all reroute keys', async () => {
    await StorageService.save('user', { id: '1' });
    await StorageService.save('sessions', []);
    await StorageService.deleteAllData();
    const user = await StorageService.read('user');
    expect(user).toBeNull();
  });

  it('migrate sets schema version if missing', async () => {
    await StorageService.migrate();
    const version = await StorageService.read<number>('schemaVersion');
    expect(version).toBe(1);
  });
});
