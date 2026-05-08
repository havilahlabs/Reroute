import { Platform } from 'react-native';
import { BlockingService, PermissionStatus } from '../BlockingService';
import { NotificationService } from '../NotificationService';

export interface PermissionState {
  blocking: PermissionStatus;
  notifications: boolean;
  usageAccess: boolean;
}

export const PermissionService = {
  async getPermissionState(): Promise<PermissionState> {
    const [blockingResult, notifications] = await Promise.all([
      BlockingService.checkPermissionStatus(),
      NotificationService.checkPermission(),
    ]);

    return {
      blocking: blockingResult.status,
      notifications,
      usageAccess: Platform.OS === 'android'
        ? await checkAndroidUsageAccess()
        : false,
    };
  },

  async requestBlockingPermission(): Promise<PermissionStatus> {
    const result = await BlockingService.requestPermissions();
    return result.status;
  },

  async requestNotificationPermission(): Promise<boolean> {
    return NotificationService.requestPermission();
  },

  isBlockingAvailable(): boolean {
    // TODO (Phase 2): Return true when native module is linked
    return false;
  },

  isRunningInDemoMode(): boolean {
    return true;
  },

  getPermissionExplanation(): string {
    if (Platform.OS === 'ios') {
      return 'To protect selected apps, Reroute needs Screen Time permissions. You choose what to protect.';
    }
    return 'To detect and interrupt distracting apps, Reroute may need Usage Access or Accessibility permissions. Reroute only uses this to help protect your sessions.';
  },

  getPermissionCTA(): string {
    if (Platform.OS === 'ios') return 'Enable Screen Time access';
    return 'Enable usage access';
  },
};

async function checkAndroidUsageAccess(): Promise<boolean> {
  // TODO (Phase 2): Use native module to check UsageStats permission
  // NativeModules.ReroutePermissions.hasUsageStatsPermission()
  return false;
}
