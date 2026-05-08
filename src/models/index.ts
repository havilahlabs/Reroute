export type SessionStatus = 'active' | 'completed' | 'abandoned' | 'interrupted';
export type TriggerType = 'manual' | 'blocked_app' | 'notification' | 'timer' | 'demo';
export type UserChoice = 'rerouted' | 'unlocked' | 'ended' | 'ignored';
export type RoutineMode = 'study' | 'work' | 'bedtime' | 'writing' | 'custom';
export type StrictnessLevel = 'gentle' | 'balanced' | 'strong';
export type SubscriptionStatus = 'free' | 'trial' | 'pro' | 'expired';
export type InsightType =
  | 'rerouted'
  | 'too_many_unlocks'
  | 'task_unclear'
  | 'short_session_good'
  | 'repeated_distraction'
  | 'best_length'
  | 'bedtime_scrolling'
  | 'general';

export interface User {
  id: string;
  firstName?: string;
  onboardingComplete: boolean;
  createdAt: string;
  preferredSessionLength: number;
  gentleReminderEnabled: boolean;
  demoBlockingEnabled: boolean;
  subscriptionStatus: SubscriptionStatus;
  privacyConsentVersion: string;
}

export interface FocusSession {
  id: string;
  task: string;
  durationMinutes: number;
  startedAt: string;
  endedAt?: string;
  selectedDistractions: string[];
  reroutePlan: string;
  status: SessionStatus;
  rerouteCount: number;
  unlockCount: number;
  driftCount: number;
  completedFocusMinutes: number;
  distractionReasons: string[];
  routineId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReroutePlan {
  id: string;
  text: string;
  type: 'suggested' | 'custom';
  createdAt: string;
  lastUsedAt?: string;
}

export interface Distraction {
  id: string;
  appName: string;
  appBundleId?: string;
  category: string;
  platform: 'ios' | 'android' | 'both';
  isProtectedByDefault: boolean;
}

export interface DriftEvent {
  id: string;
  sessionId: string;
  appName?: string;
  triggerType: TriggerType;
  occurredAt: string;
  userChoice: UserChoice;
  reason?: string;
}

export interface UnlockEvent {
  id: string;
  sessionId: string;
  appName: string;
  reason: string;
  startedAt: string;
  endedAt?: string;
  durationSeconds?: number;
}

export interface RoutineSchedule {
  daysOfWeek: number[];
  startTime: string;
  endTime?: string;
}

export interface Routine {
  id: string;
  name: string;
  taskTemplate: string;
  defaultDurationMinutes: number;
  defaultDistractions: string[];
  defaultReroutePlan: string;
  schedule?: RoutineSchedule;
  isEnabled: boolean;
  mode: RoutineMode;
  strictness: StrictnessLevel;
  notificationEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Insight {
  id: string;
  type: InsightType;
  message: string;
  evidence?: string;
  createdAt: string;
  priority: number;
  actionLabel?: string;
  actionTarget?: string;
}

export interface Subscription {
  status: SubscriptionStatus;
  productId?: string;
  renewalDate?: string;
  entitlement: string[];
}

export interface TodaysRoute {
  text: string;
  setAt: string;
}

export interface WeeklyInsight {
  weekStart: string;
  weekEnd: string;
  sessionsCompleted: number;
  timesRerouted: number;
  biggestDistraction?: string;
  bestSessionLength?: number;
  bestRoutineId?: string;
  mainPattern?: string;
  suggestedExperiment?: string;
}

export const DEFAULT_USER: User = {
  id: '',
  onboardingComplete: false,
  createdAt: new Date().toISOString(),
  preferredSessionLength: 25,
  gentleReminderEnabled: true,
  demoBlockingEnabled: true,
  subscriptionStatus: 'free',
  privacyConsentVersion: '1.0',
};

export const DEFAULT_DISTRACTIONS: Distraction[] = [
  { id: 'tiktok', appName: 'TikTok', appBundleId: 'com.zhiliaoapp.musically', category: 'social', platform: 'both', isProtectedByDefault: true },
  { id: 'instagram', appName: 'Instagram', appBundleId: 'com.burbn.instagram', category: 'social', platform: 'both', isProtectedByDefault: true },
  { id: 'youtube', appName: 'YouTube', appBundleId: 'com.google.ios.youtube', category: 'video', platform: 'both', isProtectedByDefault: false },
  { id: 'twitter', appName: 'X', appBundleId: 'com.atebits.Tweetie2', category: 'social', platform: 'both', isProtectedByDefault: false },
  { id: 'safari', appName: 'Safari', appBundleId: 'com.apple.mobilesafari', category: 'browser', platform: 'ios', isProtectedByDefault: false },
  { id: 'messages', appName: 'Messages', appBundleId: 'com.apple.MobileSMS', category: 'messaging', platform: 'both', isProtectedByDefault: false },
  { id: 'email', appName: 'Email', appBundleId: 'com.apple.mobilemail', category: 'messaging', platform: 'both', isProtectedByDefault: false },
  { id: 'reddit', appName: 'Reddit', appBundleId: 'com.reddit.Reddit', category: 'social', platform: 'both', isProtectedByDefault: false },
  { id: 'games', appName: 'Games', category: 'games', platform: 'both', isProtectedByDefault: false },
  { id: 'other', appName: 'Other', category: 'other', platform: 'both', isProtectedByDefault: false },
];
