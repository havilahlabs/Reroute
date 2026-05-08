import { SessionService } from '../services/SessionService';

// Mock StorageService
jest.mock('../services/StorageService', () => ({
  StorageService: {
    save: jest.fn().mockResolvedValue(undefined),
    read: jest.fn().mockResolvedValue(null),
    delete: jest.fn().mockResolvedValue(undefined),
  },
}));

const MOCK_PARAMS = {
  task: 'Finish biology notes',
  durationMinutes: 25,
  selectedDistractions: ['tiktok', 'instagram'],
  reroutePlan: 'Read one paragraph',
};

describe('SessionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('startSession', () => {
    it('creates a session with correct fields', async () => {
      const session = await SessionService.startSession(MOCK_PARAMS);
      expect(session.task).toBe(MOCK_PARAMS.task);
      expect(session.durationMinutes).toBe(25);
      expect(session.status).toBe('active');
      expect(session.rerouteCount).toBe(0);
      expect(session.unlockCount).toBe(0);
      expect(session.driftCount).toBe(0);
      expect(session.id).toBeTruthy();
    });

    it('stores the session as activeSession', async () => {
      const { StorageService } = require('../services/StorageService');
      await SessionService.startSession(MOCK_PARAMS);
      expect(StorageService.save).toHaveBeenCalledWith('activeSession', expect.objectContaining({ task: MOCK_PARAMS.task }));
    });
  });

  describe('endSession', () => {
    it('marks session as completed', async () => {
      const { StorageService } = require('../services/StorageService');
      StorageService.read.mockResolvedValueOnce([]);
      const session = await SessionService.startSession(MOCK_PARAMS);
      const ended = await SessionService.endSession(session);
      expect(ended.status).toBe('completed');
      expect(ended.endedAt).toBeTruthy();
    });

    it('deletes activeSession from storage', async () => {
      const { StorageService } = require('../services/StorageService');
      StorageService.read.mockResolvedValue([]);
      const session = await SessionService.startSession(MOCK_PARAMS);
      await SessionService.endSession(session);
      expect(StorageService.delete).toHaveBeenCalledWith('activeSession');
    });

    it('records distraction reason if provided', async () => {
      const { StorageService } = require('../services/StorageService');
      StorageService.read.mockResolvedValue([]);
      const session = await SessionService.startSession(MOCK_PARAMS);
      const ended = await SessionService.endSession(session, 'Task unclear');
      expect(ended.distractionReasons).toContain('Task unclear');
    });
  });

  describe('recordDrift', () => {
    it('increments driftCount', async () => {
      const session = await SessionService.startSession(MOCK_PARAMS);
      const { session: updated } = await SessionService.recordDrift(session, 'manual');
      expect(updated.driftCount).toBe(1);
    });

    it('creates a drift event with correct trigger type', async () => {
      const session = await SessionService.startSession(MOCK_PARAMS);
      const { event } = await SessionService.recordDrift(session, 'demo', 'TikTok');
      expect(event.triggerType).toBe('demo');
      expect(event.appName).toBe('TikTok');
    });
  });

  describe('recordReroute', () => {
    it('increments rerouteCount', async () => {
      const session = await SessionService.startSession(MOCK_PARAMS);
      const { session: withDrift, event } = await SessionService.recordDrift(session, 'manual');
      const { StorageService } = require('../services/StorageService');
      StorageService.read.mockResolvedValue([{ id: event.id, userChoice: 'ignored', sessionId: session.id, triggerType: 'manual', occurredAt: new Date().toISOString() }]);
      const { session: rerouted } = await SessionService.recordReroute(withDrift, event.id);
      expect(rerouted.rerouteCount).toBe(1);
    });
  });

  describe('recordUnlock', () => {
    it('increments unlockCount', async () => {
      const session = await SessionService.startSession(MOCK_PARAMS);
      const { session: withDrift, event } = await SessionService.recordDrift(session, 'demo', 'TikTok');
      const { StorageService } = require('../services/StorageService');
      StorageService.read.mockResolvedValue([{ id: event.id, userChoice: 'ignored', sessionId: session.id, triggerType: 'demo', occurredAt: new Date().toISOString() }]);
      const { session: unlocked } = await SessionService.recordUnlock(withDrift, 'Quick search', 'TikTok', event.id);
      expect(unlocked.unlockCount).toBe(1);
    });
  });

  describe('abandonSession', () => {
    it('marks session as abandoned', async () => {
      const { StorageService } = require('../services/StorageService');
      StorageService.read.mockResolvedValue([]);
      const session = await SessionService.startSession(MOCK_PARAMS);
      const abandoned = await SessionService.abandonSession(session);
      expect(abandoned.status).toBe('abandoned');
    });
  });

  describe('calculateCompletedMinutes', () => {
    it('returns 0 for very fresh session', () => {
      const session = {
        startedAt: new Date().toISOString(),
        durationMinutes: 25,
      } as any;
      const minutes = SessionService.calculateCompletedMinutes(session);
      expect(minutes).toBe(0);
    });

    it('caps at durationMinutes', () => {
      const old = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const session = { startedAt: old, durationMinutes: 25 } as any;
      expect(SessionService.calculateCompletedMinutes(session)).toBe(25);
    });
  });
});
