import { Routine, RoutineMode, StrictnessLevel } from '../../models';
import { generateId } from '../../utils/generateId';
import { StorageService } from '../StorageService';
import { NotificationService } from '../NotificationService';

const PRESET_ROUTINES: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Study Mode',
    taskTemplate: 'Study notes',
    defaultDurationMinutes: 25,
    defaultDistractions: ['tiktok', 'instagram', 'youtube', 'reddit'],
    defaultReroutePlan: 'Read one paragraph',
    isEnabled: true,
    mode: 'study',
    strictness: 'balanced',
    notificationEnabled: true,
  },
  {
    name: 'Deep Work',
    taskTemplate: 'Focus work',
    defaultDurationMinutes: 45,
    defaultDistractions: ['tiktok', 'instagram', 'youtube', 'twitter', 'reddit'],
    defaultReroutePlan: 'Open the document',
    isEnabled: true,
    mode: 'work',
    strictness: 'strong',
    notificationEnabled: false,
  },
  {
    name: 'Writing',
    taskTemplate: 'Write',
    defaultDurationMinutes: 30,
    defaultDistractions: ['tiktok', 'instagram', 'twitter', 'reddit'],
    defaultReroutePlan: 'Write one sentence',
    isEnabled: true,
    mode: 'writing',
    strictness: 'balanced',
    notificationEnabled: false,
  },
  {
    name: 'Reading',
    taskTemplate: 'Read',
    defaultDurationMinutes: 20,
    defaultDistractions: ['tiktok', 'instagram', 'youtube'],
    defaultReroutePlan: 'Read one paragraph',
    isEnabled: true,
    mode: 'custom',
    strictness: 'gentle',
    notificationEnabled: false,
  },
  {
    name: 'Bedtime',
    taskTemplate: 'No scrolling',
    defaultDurationMinutes: 60,
    defaultDistractions: ['tiktok', 'instagram', 'youtube', 'twitter', 'reddit'],
    defaultReroutePlan: 'Put the phone down',
    isEnabled: true,
    mode: 'bedtime',
    strictness: 'strong',
    notificationEnabled: true,
  },
  {
    name: 'Morning Focus',
    taskTemplate: 'Morning intention',
    defaultDurationMinutes: 20,
    defaultDistractions: ['tiktok', 'instagram', 'twitter'],
    defaultReroutePlan: 'Take one breath and continue',
    isEnabled: true,
    mode: 'work',
    strictness: 'gentle',
    notificationEnabled: true,
  },
];

export const RoutineService = {
  async createRoutine(params: {
    name: string;
    taskTemplate: string;
    defaultDurationMinutes: number;
    defaultDistractions: string[];
    defaultReroutePlan: string;
    mode: RoutineMode;
    strictness: StrictnessLevel;
    notificationEnabled: boolean;
    schedule?: Routine['schedule'];
  }): Promise<Routine> {
    const now = new Date().toISOString();
    const routine: Routine = {
      id: generateId(),
      ...params,
      isEnabled: true,
      createdAt: now,
      updatedAt: now,
    };
    const routines = await getRoutines();
    routines.push(routine);
    await StorageService.save('routines', routines);
    if (routine.notificationEnabled && routine.schedule) {
      await NotificationService.scheduleRoutineReminder(routine);
    }
    return routine;
  },

  async updateRoutine(id: string, updates: Partial<Routine>): Promise<Routine | null> {
    const routines = await getRoutines();
    let updated: Routine | null = null;
    const newList = routines.map(r => {
      if (r.id === id) {
        updated = { ...r, ...updates, updatedAt: new Date().toISOString() };
        return updated;
      }
      return r;
    });
    await StorageService.save('routines', newList);
    return updated;
  },

  async deleteRoutine(id: string): Promise<void> {
    const routines = await getRoutines();
    await StorageService.save('routines', routines.filter(r => r.id !== id));
  },

  async getRoutines(): Promise<Routine[]> {
    return getRoutines();
  },

  async startRoutineSession(routine: Routine): Promise<{
    task: string;
    durationMinutes: number;
    selectedDistractions: string[];
    reroutePlan: string;
    routineId: string;
  }> {
    return {
      task: routine.taskTemplate,
      durationMinutes: routine.defaultDurationMinutes,
      selectedDistractions: routine.defaultDistractions,
      reroutePlan: routine.defaultReroutePlan,
      routineId: routine.id,
    };
  },

  async getScheduledRoutines(): Promise<Routine[]> {
    const routines = await getRoutines();
    return routines.filter(r => r.isEnabled && r.schedule);
  },

  async triggerRoutineReminder(routine: Routine): Promise<void> {
    await NotificationService.scheduleRoutineReminder(routine);
  },

  getPresetRoutines() {
    return PRESET_ROUTINES;
  },
};

async function getRoutines(): Promise<Routine[]> {
  return (await StorageService.read<Routine[]>('routines')) ?? [];
}
