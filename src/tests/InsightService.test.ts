import { InsightService } from '../services/InsightService';
import { FocusSession } from '../models';

function makeSession(overrides: Partial<FocusSession> = {}): FocusSession {
  return {
    id: 'test-session',
    task: 'Test task',
    durationMinutes: 25,
    startedAt: new Date().toISOString(),
    selectedDistractions: ['tiktok'],
    reroutePlan: 'Read one paragraph',
    status: 'completed',
    rerouteCount: 0,
    unlockCount: 0,
    driftCount: 0,
    completedFocusMinutes: 25,
    distractionReasons: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('InsightService', () => {
  describe('generatePostSessionInsight', () => {
    it('returns rerouted insight when rerouteCount > 0', () => {
      const session = makeSession({ rerouteCount: 2 });
      const insight = InsightService.generatePostSessionInsight(session);
      expect(insight.type).toBe('rerouted');
      expect(insight.message).toContain('2 times');
    });

    it('returns too_many_unlocks when unlockCount > 2', () => {
      const session = makeSession({ unlockCount: 3 });
      const insight = InsightService.generatePostSessionInsight(session);
      expect(insight.type).toBe('too_many_unlocks');
    });

    it('returns task_unclear when distractionReasons contains Task unclear', () => {
      const session = makeSession({ distractionReasons: ['Task unclear'] });
      const insight = InsightService.generatePostSessionInsight(session);
      expect(insight.type).toBe('task_unclear');
    });

    it('returns short_session_good for short completed sessions', () => {
      const session = makeSession({ completedFocusMinutes: 10, durationMinutes: 10 });
      const insight = InsightService.generatePostSessionInsight(session);
      expect(insight.type).toBe('short_session_good');
    });

    it('returns general insight for clean session', () => {
      const session = makeSession({ rerouteCount: 0, driftCount: 0 });
      const insight = InsightService.generatePostSessionInsight(session);
      expect(insight.type).toBe('general');
    });

    it('returns insight with id and createdAt', () => {
      const session = makeSession();
      const insight = InsightService.generatePostSessionInsight(session);
      expect(insight.id).toBeTruthy();
      expect(insight.createdAt).toBeTruthy();
    });
  });

  describe('detectRepeatedDistractions', () => {
    it('returns null when no distraction appears 3+ times', () => {
      const sessions = [
        makeSession({ selectedDistractions: ['tiktok'] }),
        makeSession({ selectedDistractions: ['instagram'] }),
      ];
      expect(InsightService.detectRepeatedDistractions(sessions)).toBeNull();
    });

    it('returns distraction that appears 3+ times', () => {
      const sessions = Array(4).fill(makeSession({ selectedDistractions: ['tiktok'] }));
      expect(InsightService.detectRepeatedDistractions(sessions)).toBe('tiktok');
    });
  });

  describe('detectBestSessionLength', () => {
    it('returns null with fewer than 3 completed sessions', () => {
      const sessions = [makeSession(), makeSession()];
      expect(InsightService.detectBestSessionLength(sessions)).toBeNull();
    });

    it('returns most common completed duration', () => {
      const sessions = [
        makeSession({ durationMinutes: 20 }),
        makeSession({ durationMinutes: 20 }),
        makeSession({ durationMinutes: 25 }),
      ];
      expect(InsightService.detectBestSessionLength(sessions)).toBe(20);
    });
  });

  describe('detectCommonDriftReason', () => {
    it('returns null when no drift reasons', () => {
      const sessions = [makeSession()];
      expect(InsightService.detectCommonDriftReason(sessions)).toBeNull();
    });

    it('returns most common drift reason', () => {
      const sessions = [
        makeSession({ distractionReasons: ['Bored', 'Tired'] }),
        makeSession({ distractionReasons: ['Bored'] }),
      ];
      expect(InsightService.detectCommonDriftReason(sessions)).toBe('Bored');
    });
  });

  describe('suggestNextExperiment', () => {
    it('returns a non-empty string', () => {
      const result = InsightService.suggestNextExperiment([]);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('suggests task clarity when task unclear is common drift', () => {
      const sessions = [
        makeSession({ distractionReasons: ['Task unclear'] }),
        makeSession({ distractionReasons: ['Task unclear'] }),
      ];
      const suggestion = InsightService.suggestNextExperiment(sessions);
      expect(suggestion.toLowerCase()).toContain('task');
    });
  });

  describe('generateWeeklyInsights', () => {
    it('returns a WeeklyInsight with required fields', () => {
      const sessions = [makeSession(), makeSession()];
      const insight = InsightService.generateWeeklyInsights(sessions);
      expect(insight.weekStart).toBeTruthy();
      expect(insight.weekEnd).toBeTruthy();
      expect(typeof insight.sessionsCompleted).toBe('number');
      expect(typeof insight.timesRerouted).toBe('number');
    });
  });
});
