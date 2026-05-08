import { RoutineService } from '../services/RoutineService';

jest.mock('../services/StorageService', () => ({
  StorageService: {
    save: jest.fn().mockResolvedValue(undefined),
    read: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock('../services/NotificationService', () => ({
  NotificationService: {
    scheduleRoutineReminder: jest.fn().mockResolvedValue('notif-id'),
  },
}));

const ROUTINE_PARAMS = {
  name: 'Study Mode',
  taskTemplate: 'Study notes',
  defaultDurationMinutes: 25,
  defaultDistractions: ['tiktok', 'instagram'],
  defaultReroutePlan: 'Read one paragraph',
  mode: 'study' as const,
  strictness: 'balanced' as const,
  notificationEnabled: false,
};

describe('RoutineService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('createRoutine', () => {
    it('creates routine with correct fields', async () => {
      const routine = await RoutineService.createRoutine(ROUTINE_PARAMS);
      expect(routine.name).toBe('Study Mode');
      expect(routine.id).toBeTruthy();
      expect(routine.isEnabled).toBe(true);
      expect(routine.mode).toBe('study');
      expect(routine.strictness).toBe('balanced');
    });

    it('persists routine to storage', async () => {
      const { StorageService } = require('../services/StorageService');
      await RoutineService.createRoutine(ROUTINE_PARAMS);
      expect(StorageService.save).toHaveBeenCalledWith('routines', expect.arrayContaining([
        expect.objectContaining({ name: 'Study Mode' }),
      ]));
    });
  });

  describe('getPresetRoutines', () => {
    it('returns preset routines array', () => {
      const presets = RoutineService.getPresetRoutines();
      expect(Array.isArray(presets)).toBe(true);
      expect(presets.length).toBeGreaterThan(0);
      expect(presets[0].name).toBeTruthy();
    });
  });

  describe('startRoutineSession', () => {
    it('returns session params from routine', async () => {
      const routine = await RoutineService.createRoutine(ROUTINE_PARAMS);
      const params = await RoutineService.startRoutineSession(routine);
      expect(params.task).toBe(routine.taskTemplate);
      expect(params.durationMinutes).toBe(routine.defaultDurationMinutes);
      expect(params.routineId).toBe(routine.id);
    });
  });

  describe('deleteRoutine', () => {
    it('removes routine from storage', async () => {
      const { StorageService } = require('../services/StorageService');
      const routine = await RoutineService.createRoutine(ROUTINE_PARAMS);
      StorageService.read.mockResolvedValue([routine]);
      await RoutineService.deleteRoutine(routine.id);
      expect(StorageService.save).toHaveBeenCalledWith('routines', []);
    });
  });

  describe('updateRoutine', () => {
    it('updates routine fields', async () => {
      const { StorageService } = require('../services/StorageService');
      const routine = await RoutineService.createRoutine(ROUTINE_PARAMS);
      StorageService.read.mockResolvedValue([routine]);
      const updated = await RoutineService.updateRoutine(routine.id, { name: 'Updated' });
      expect(updated?.name).toBe('Updated');
    });
  });
});
