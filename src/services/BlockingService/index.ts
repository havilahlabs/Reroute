/**
 * BlockingService — abstraction layer for app protection.
 *
 * In demo mode, blocking is simulated locally.
 * Real native blocking is behind platform-specific native modules (see TODOs below).
 *
 * iOS native implementation (TODO — Phase 2):
 *   - FamilyControls: request authorization via AuthorizationCenter
 *   - ManagedSettings: apply ApplicationToken shield via ManagedSettingsStore
 *   - DeviceActivity: monitor session windows via DeviceActivityCenter
 *   - DeviceActivityMonitor extension: handle app open events at OS level
 *   - Temporary unlock: modify ShieldConfiguration to allow app temporarily
 *   - Requires entitlement: com.apple.developer.family-controls
 *   - Must add FamilyControls framework to native iOS target
 *
 * Android native implementation (TODO — Phase 2):
 *   - UsageStatsManager: query foreground app every ~500ms via polling
 *   - AccessibilityService: receive HOME_SCREEN and window state change events
 *   - Foreground Service: keep session alive in background with persistent notification
 *   - Overlay: show interruption screen using SYSTEM_ALERT_WINDOW permission
 *   - Battery optimization: request IGNORE_BATTERY_OPTIMIZATIONS permission
 *   - Respect Play Store policy: use for parental control / focus use case only
 *
 * Interface contract for native modules:
 *   NativeBlocking.startProtection(sessionId: string, bundleIds: string[]): Promise<void>
 *   NativeBlocking.stopProtection(): Promise<void>
 *   NativeBlocking.updateProtectedApps(bundleIds: string[]): Promise<void>
 *   NativeBlocking.requestPermissions(): Promise<PermissionResult>
 *   NativeBlocking.checkPermissionStatus(): Promise<PermissionStatus>
 *   NativeBlocking.beginTemporaryUnlock(appId: string, durationSeconds: number): Promise<void>
 *   NativeBlocking.endTemporaryUnlock(): Promise<void>
 */

export type PermissionStatus = 'granted' | 'denied' | 'not_determined' | 'demo';
export type BlockingMode = 'demo' | 'native' | 'none';

export interface PermissionResult {
  status: PermissionStatus;
  mode: BlockingMode;
}

let demoInterceptCallback: ((appName: string) => void) | null = null;

export const BlockingService = {
  async requestPermissions(): Promise<PermissionResult> {
    // TODO (Phase 2): Call native module to request FamilyControls (iOS) or
    // UsageAccess + Accessibility (Android) permissions.
    // For now, return demo mode.
    console.log('[BlockingService] requestPermissions called — demo mode');
    return { status: 'demo', mode: 'demo' };
  },

  async checkPermissionStatus(): Promise<PermissionResult> {
    // TODO (Phase 2): Query native module for current permission state.
    return { status: 'demo', mode: 'demo' };
  },

  async startProtection(sessionId: string, bundleIds: string[]): Promise<void> {
    // TODO (Phase 2): Call NativeBlocking.startProtection(sessionId, bundleIds)
    console.log('[BlockingService] startProtection (demo)', { sessionId, bundleIds });
  },

  async stopProtection(): Promise<void> {
    // TODO (Phase 2): Call NativeBlocking.stopProtection()
    console.log('[BlockingService] stopProtection (demo)');
    demoInterceptCallback = null;
  },

  async updateProtectedApps(bundleIds: string[]): Promise<void> {
    // TODO (Phase 2): Call NativeBlocking.updateProtectedApps(bundleIds)
    console.log('[BlockingService] updateProtectedApps (demo)', bundleIds);
  },

  simulateBlockedApp(appName: string): void {
    if (demoInterceptCallback) {
      demoInterceptCallback(appName);
    }
  },

  onDemoIntercept(callback: (appName: string) => void): () => void {
    demoInterceptCallback = callback;
    return () => {
      demoInterceptCallback = null;
    };
  },

  async beginTemporaryUnlock(appId: string, durationSeconds: number): Promise<void> {
    // TODO (Phase 2): Call NativeBlocking.beginTemporaryUnlock(appId, durationSeconds)
    // This temporarily removes the shield for the given app.
    console.log('[BlockingService] beginTemporaryUnlock (demo)', { appId, durationSeconds });
  },

  async endTemporaryUnlock(): Promise<void> {
    // TODO (Phase 2): Call NativeBlocking.endTemporaryUnlock()
    // Re-apply shield after temporary unlock period.
    console.log('[BlockingService] endTemporaryUnlock (demo)');
  },

  async interceptAppOpen(appId: string): Promise<void> {
    // TODO (Phase 2): Called by native layer when a shielded app is opened.
    // In iOS, this happens via DeviceActivityMonitor extension.
    // In Android, via AccessibilityService or UsageStats polling.
    console.log('[BlockingService] interceptAppOpen (demo)', appId);
    if (demoInterceptCallback) {
      demoInterceptCallback(appId);
    }
  },

  triggerDriftInterruption(appName: string): void {
    if (demoInterceptCallback) {
      demoInterceptCallback(appName);
    }
  },
};
