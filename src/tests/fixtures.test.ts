import {
  studentUserFixture,
  heavySocialMediaSessions,
  bedtimeScrollingSession,
  taskUnclearSessions,
  studyRoutineFixture,
} from './fixtures';
import { InsightService } from '../services/InsightService';

describe('User fixtures integration', () => {
  describe('student user scenario', () => {
    it('student user generates rerouted insight after 1 reroute', () => {
      const session = {
        ...studentUserFixture,
        id: 'session-001',
        task: 'Finish biology notes',
        durationMinutes: 25,
        startedAt: new Date().toISOString(),
        selectedDistractions: ['tiktok', 'instagram'],
        reroutePlan: 'Read one paragraph',
        status: 'completed' as const,
        rerouteCount: 1,
        unlockCount: 0,
        driftCount: 1,
        completedFocusMinutes: 25,
        distractionReasons: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const insight = InsightService.generatePostSessionInsight(session);
      expect(insight.type).toBe('rerouted');
      expect(insight.message).toContain('1 time');
    });
  });

  describe('heavy social media user', () => {
    it('detects tiktok/instagram as repeated distraction', () => {
      const repeated = InsightService.detectRepeatedDistractions(heavySocialMediaSessions);
      expect(['tiktok', 'instagram', 'twitter']).toContain(repeated);
    });

    it('generates too_many_unlocks insight for bedtime session', () => {
      const insight = InsightService.generatePostSessionInsight(bedtimeScrollingSession);
      expect(insight.type).toBe('too_many_unlocks');
    });
  });

  describe('task unclear user', () => {
    it('detects task unclear as common drift reason', () => {
      const common = InsightService.detectCommonDriftReason(taskUnclearSessions);
      expect(common).toBe('Task unclear');
    });

    it('suggests clarity experiment for task unclear user', () => {
      const suggestion = InsightService.suggestNextExperiment(taskUnclearSessions);
      expect(suggestion.toLowerCase()).toContain('task');
    });
  });

  describe('study routine fixture', () => {
    it('has valid routine structure', () => {
      expect(studyRoutineFixture.name).toBe('Study Mode');
      expect(studyRoutineFixture.defaultDurationMinutes).toBe(25);
      expect(studyRoutineFixture.isEnabled).toBe(true);
    });
  });
});
