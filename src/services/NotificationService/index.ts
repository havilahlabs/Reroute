import * as Notifications from 'expo-notifications';
import { Routine } from '../../models';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const NotificationService = {
  async requestPermission(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async checkPermission(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  },

  async scheduleRoutineReminder(routine: Routine): Promise<string | null> {
    if (!routine.schedule || !routine.notificationEnabled) return null;

    await Notifications.cancelScheduledNotificationAsync(
      `routine_${routine.id}`
    ).catch(() => {});

    const [hour, minute] = routine.schedule.startTime.split(':').map(Number);

    const id = await Notifications.scheduleNotificationAsync({
      identifier: `routine_${routine.id}`,
      content: {
        title: 'Reroute',
        body: `Ready to start ${routine.name}?`,
        data: { routineId: routine.id },
      },
      trigger: {
        hour,
        minute,
        repeats: true,
        weekday: routine.schedule.daysOfWeek[0] ?? 1,
      } as Notifications.WeeklyTriggerInput,
    });
    return id;
  },

  async scheduleUnlockEndingReminder(
    task: string,
    reroutePlan: string,
    seconds: number
  ): Promise<string> {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Your unlock is ending.',
        body: `Want to get back? Small step: ${reroutePlan}`,
        data: { type: 'unlock_ending' },
      },
      trigger: { seconds, repeats: false } as Notifications.TimeIntervalTriggerInput,
    });
    return id;
  },

  async scheduleGentleReroute(task: string, seconds: number): Promise<string> {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reroute',
        body: `You planned to focus on: ${task}`,
        data: { type: 'gentle_reroute' },
      },
      trigger: { seconds, repeats: false } as Notifications.TimeIntervalTriggerInput,
    });
    return id;
  },

  async cancelSessionNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  async cancelNotification(id: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(id);
  },
};
