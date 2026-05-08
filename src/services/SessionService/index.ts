import { FocusSession, DriftEvent, UnlockEvent, TriggerType, UserChoice } from '../../models';
import { StorageService } from '../StorageService';
import { generateId } from '../../utils/generateId';

export const SessionService = {
  async startSession(params: {
    task: string;
    durationMinutes: number;
    selectedDistractions: string[];
    reroutePlan: string;
    routineId?: string;
  }): Promise<FocusSession> {
    const now = new Date().toISOString();
    const session: FocusSession = {
      id: generateId(),
      task: params.task,
      durationMinutes: params.durationMinutes,
      startedAt: now,
      selectedDistractions: params.selectedDistractions,
      reroutePlan: params.reroutePlan,
      status: 'active',
      rerouteCount: 0,
      unlockCount: 0,
      driftCount: 0,
      completedFocusMinutes: 0,
      distractionReasons: [],
      routineId: params.routineId,
      createdAt: now,
      updatedAt: now,
    };
    await StorageService.save('activeSession', session);
    return session;
  },

  async endSession(session: FocusSession, distractionReason?: string): Promise<FocusSession> {
    const now = new Date().toISOString();
    const completed = calculateCompletedMinutes(session);
    const ended: FocusSession = {
      ...session,
      status: 'completed',
      endedAt: now,
      completedFocusMinutes: completed,
      distractionReasons: distractionReason
        ? [...session.distractionReasons, distractionReason]
        : session.distractionReasons,
      updatedAt: now,
    };
    await StorageService.delete('activeSession');
    await persistSession(ended);
    return ended;
  },

  async abandonSession(session: FocusSession): Promise<FocusSession> {
    const now = new Date().toISOString();
    const abandoned: FocusSession = {
      ...session,
      status: 'abandoned',
      endedAt: now,
      completedFocusMinutes: calculateCompletedMinutes(session),
      updatedAt: now,
    };
    await StorageService.delete('activeSession');
    await persistSession(abandoned);
    return abandoned;
  },

  async recordDrift(
    session: FocusSession,
    triggerType: TriggerType,
    appName?: string
  ): Promise<{ session: FocusSession; event: DriftEvent }> {
    const event: DriftEvent = {
      id: generateId(),
      sessionId: session.id,
      triggerType,
      occurredAt: new Date().toISOString(),
      userChoice: 'ignored',
      appName,
    };
    const updated = { ...session, driftCount: session.driftCount + 1, updatedAt: new Date().toISOString() };
    await StorageService.save('activeSession', updated);
    await persistDriftEvent(session.id, event);
    return { session: updated, event };
  },

  async recordReroute(
    session: FocusSession,
    eventId: string
  ): Promise<{ session: FocusSession; event: DriftEvent }> {
    const updated = {
      ...session,
      rerouteCount: session.rerouteCount + 1,
      updatedAt: new Date().toISOString(),
    };
    await StorageService.save('activeSession', updated);
    const event = await updateDriftEventChoice(session.id, eventId, 'rerouted');
    return { session: updated, event };
  },

  async recordUnlock(
    session: FocusSession,
    reason: string,
    appName: string,
    driftEventId: string
  ): Promise<{ session: FocusSession; unlockEvent: UnlockEvent; driftEvent: DriftEvent }> {
    const now = new Date().toISOString();
    const unlockEvent: UnlockEvent = {
      id: generateId(),
      sessionId: session.id,
      appName,
      reason,
      startedAt: now,
    };
    const updated = {
      ...session,
      unlockCount: session.unlockCount + 1,
      updatedAt: now,
    };
    await StorageService.save('activeSession', updated);
    await persistUnlockEvent(session.id, unlockEvent);
    const driftEvent = await updateDriftEventChoice(session.id, driftEventId, 'unlocked');
    return { session: updated, unlockEvent, driftEvent };
  },

  async getActiveSession(): Promise<FocusSession | null> {
    return StorageService.read<FocusSession>('activeSession');
  },

  async resumeSession(): Promise<FocusSession | null> {
    const session = await StorageService.read<FocusSession>('activeSession');
    if (session && session.status === 'active') return session;
    return null;
  },

  calculateCompletedMinutes,
};

function calculateCompletedMinutes(session: FocusSession): number {
  if (!session.startedAt) return 0;
  const elapsed = Math.floor(
    (Date.now() - new Date(session.startedAt).getTime()) / 60000
  );
  return Math.min(elapsed, session.durationMinutes);
}

async function persistSession(session: FocusSession) {
  const sessions = (await StorageService.read<FocusSession[]>('sessions')) ?? [];
  const updated = [session, ...sessions.filter(s => s.id !== session.id)].slice(0, 200);
  await StorageService.save('sessions', updated);
}

async function persistDriftEvent(sessionId: string, event: DriftEvent) {
  const key = `driftEvents_${sessionId}`;
  const events = (await StorageService.read<DriftEvent[]>(key)) ?? [];
  await StorageService.save(key, [...events, event]);
}

async function updateDriftEventChoice(
  sessionId: string,
  eventId: string,
  choice: UserChoice
): Promise<DriftEvent> {
  const key = `driftEvents_${sessionId}`;
  const events = (await StorageService.read<DriftEvent[]>(key)) ?? [];
  let found: DriftEvent | undefined;
  const updated = events.map(e => {
    if (e.id === eventId) {
      found = { ...e, userChoice: choice };
      return found;
    }
    return e;
  });
  await StorageService.save(key, updated);
  return found ?? events[events.length - 1];
}

async function persistUnlockEvent(sessionId: string, event: UnlockEvent) {
  const key = `unlockEvents_${sessionId}`;
  const events = (await StorageService.read<UnlockEvent[]>(key)) ?? [];
  await StorageService.save(key, [...events, event]);
}
