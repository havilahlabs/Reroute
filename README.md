# Reroute

**Find your way back to focus.**

Reroute is a calm, non-judgmental focus recovery app. It helps users start a focus session, catch themselves when they drift, and get back to the task — without guilt.

> "When you drift, Reroute helps you get back."

---

## Core Philosophy

- **Focus recovery, not focus punishment** — We help users return, not feel bad for leaving
- **No guilt, no streaks, no shame** — Every reroute is a win
- **Minimal, calm interface** — Nothing that distracts from the point
- **Privacy-first, local-first** — Data stays on device by default
- **Commercially honest** — Subscription-funded, no ads, no selling data

---

## Product Overview

1. User starts a task → selects distractions → creates a Reroute Plan → begins session
2. If they drift → app gently interrupts → user reroutes back, unlocks intentionally, or ends session
3. App records patterns → surfaces useful, non-judgmental insights

**The unique metric is not just focus time. It's "times rerouted" — each return counts.**

---

## How to Run Locally

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app (iOS or Android) or a simulator

### Setup

```bash
git clone https://github.com/godwaino/reroute.git
cd reroute
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `i` for iOS simulator / `a` for Android emulator.

### Running Tests

```bash
npm test           # watch mode
npm run test:ci    # CI mode, no watch
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
npm run lint:fix
```

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native + Expo |
| Language | TypeScript |
| Navigation | React Navigation v6 (native stack + bottom tabs) |
| State management | Zustand |
| Local storage | AsyncStorage (SQLite/WatermelonDB ready) |
| Notifications | expo-notifications |
| Haptics | expo-haptics |
| Icons | @expo/vector-icons (Ionicons) |
| Testing | Jest + jest-expo |
| Linting | ESLint + Prettier |
| Subscriptions | SubscriptionService abstraction (RevenueCat-ready) |
| Analytics | AnalyticsService abstraction (PostHog/Amplitude-ready) |
| Dark mode | useColorScheme + dual theme system |

---

## Folder Structure

```
src/
├── app/                    # App-level config
├── components/             # Reusable UI components (18+)
│   ├── PrimaryButton.tsx
│   ├── SecondaryButton.tsx
│   ├── TextButton.tsx
│   ├── Card.tsx
│   ├── TimerDisplay.tsx
│   ├── OptionChip.tsx
│   ├── InsightCard.tsx
│   ├── ProgressSummary.tsx
│   ├── SessionSummary.tsx
│   ├── RoutineCard.tsx
│   ├── PermissionStatusCard.tsx
│   ├── PaywallFeatureRow.tsx
│   ├── EmptyState.tsx
│   ├── GentleToast.tsx
│   ├── AppIconBadge.tsx
│   ├── ReroutePlanCard.tsx
│   ├── DriftReasonSelector.tsx
│   ├── UnlockTimer.tsx
│   └── TodayRouteCard.tsx
├── screens/                # All app screens
│   ├── onboarding/
│   │   └── OnboardingScreen.tsx      # Multi-step onboarding
│   ├── HomeScreen.tsx
│   ├── TodaysRouteScreen.tsx
│   ├── StartSessionScreen.tsx        # 5-step session creation flow
│   ├── ActiveSessionScreen.tsx
│   ├── DriftRerouteScreen.tsx        # Core recovery screen
│   ├── TemporaryUnlockScreen.tsx
│   ├── EndSessionScreen.tsx
│   ├── RoutinesScreen.tsx
│   ├── RoutineDetailScreen.tsx
│   ├── InsightsScreen.tsx
│   ├── WeeklyReportScreen.tsx        # Pro feature
│   ├── PaywallScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── PrivacyScreen.tsx
│   ├── PermissionOnboardingScreen.tsx
│   └── DemoBlockingScreen.tsx
├── navigation/
│   ├── index.tsx                     # RootNavigator
│   ├── OnboardingNavigator.tsx
│   └── MainNavigator.tsx             # Tab + Stack navigator
├── services/
│   ├── BlockingService/              # App protection abstraction
│   ├── SessionService/               # Session CRUD + events
│   ├── InsightService/               # Pattern detection + insight generation
│   ├── RoutineService/               # Routine management
│   ├── SubscriptionService/          # Paywall / entitlement abstraction
│   ├── StorageService/               # Local persistence (AsyncStorage)
│   ├── NotificationService/          # Local notifications
│   ├── PermissionService/            # Permission state management
│   └── AnalyticsService/             # Privacy-first event tracking
├── store/
│   ├── useUserStore.ts
│   ├── useSessionStore.ts
│   ├── useRoutineStore.ts
│   └── useInsightStore.ts
├── hooks/
│   ├── useTheme.ts
│   ├── useSessionTimer.ts
│   ├── useHaptics.ts
│   └── useSubscription.ts
├── models/
│   └── index.ts                      # All data models + types
├── theme/
│   └── index.ts                      # Light + dark themes, typography, spacing
├── copy/
│   └── index.ts                      # All product copy in one place
├── utils/
│   ├── generateId.ts
│   ├── formatTime.ts
│   └── __mocks__/uuid.ts
└── tests/
    ├── SessionService.test.ts
    ├── InsightService.test.ts
    ├── RoutineService.test.ts
    ├── StorageService.test.ts
    ├── SubscriptionService.test.ts
    ├── fixtures.ts                   # Test user/session fixtures
    └── fixtures.test.ts
```

---

## Implemented Features

### Phase 1 (Complete)

- [x] Multi-step onboarding (5 screens)
- [x] Today's Route — set one daily priority
- [x] 5-step session creation flow (task → duration → distractions → reroute plan → confirm)
- [x] Active session screen with countdown timer and progress bar
- [x] Drift / Reroute screen — the core recovery experience
- [x] Temporary unlock (3 min, with reason, extend once)
- [x] End session screen with distraction reason + post-session insight
- [x] Routines (create, edit, delete, start)
- [x] Routine presets (Study, Work, Writing, Reading, Bedtime, Morning Focus)
- [x] Insights screen with pattern detection
- [x] Weekly Recovery Report (Pro)
- [x] Paywall / Pro screen
- [x] Settings (account, focus, privacy, permissions, developer)
- [x] Privacy screen
- [x] Permission onboarding (iOS + Android copy)
- [x] Demo blocking simulation panel
- [x] Dark mode support
- [x] Haptics throughout
- [x] Free vs Pro gating
- [x] Local-first data (AsyncStorage)
- [x] Export and delete all data
- [x] Gentle, non-judgmental tone throughout
- [x] All product copy in central file

---

## Demo Blocking

Reroute includes a demo blocking simulation mode so the full product experience can be tested without native permissions.

**How it works:**

1. Start a focus session with distractions selected
2. During the active session, tap **"Simulate blocked app"** or navigate to **Settings → Simulate blocked app**
3. Select an app from the list
4. The Drift / Reroute screen appears, exactly as it would with real native blocking
5. Tap **"Back to task"** to reroute, or **"Unlock for 3 minutes"** to simulate an intentional break

This demonstrates the complete user journey without requiring OS-level permissions.

---

## Native Blocking Implementation Plan

### iOS (Phase 2)

**Requirements:**
- Xcode + iOS 16+ device
- App Store entitlement: `com.apple.developer.family-controls`
- Frameworks: `FamilyControls`, `ManagedSettings`, `DeviceActivity`

**Implementation steps:**

1. **Request FamilyControls authorization**
   ```swift
   await AuthorizationCenter.shared.requestAuthorization(for: .individual)
   ```

2. **App selection** — Use `FamilyActivityPicker` to let user choose apps to shield

3. **Apply shield** — Store app tokens and apply via `ManagedSettingsStore`:
   ```swift
   store.shield.applications = selectedApps
   store.shield.applicationCategories = ShieldSettings.ActivityCategoryPolicy.specific(selectedCategories)
   ```

4. **Monitor sessions** — Use `DeviceActivityCenter` to define session windows:
   ```swift
   center.startMonitoring(schedule, during: DeviceActivitySchedule(...))
   ```

5. **DeviceActivityMonitor extension** — Handle app open events at OS level:
   ```swift
   override func eventDidReachThreshold(_ event: DeviceActivityEvent, activity: DeviceActivityName) {
     // Trigger drift interruption via shared UserDefaults/App Group
   }
   ```

6. **Temporary unlock** — Modify shield temporarily:
   ```swift
   store.shield.applications = nil // remove shield
   // Re-apply after N seconds
   ```

**App Store requirements:**
- Family Controls entitlement requires justification review
- Must explain use case clearly in App Privacy nutrition label
- No background network calls during blocking

---

### Android (Phase 2)

**Requirements:**
- `PACKAGE_USAGE_STATS` permission (requires manual grant in Settings)
- Optional: `BIND_ACCESSIBILITY_SERVICE` for stronger detection
- `FOREGROUND_SERVICE` for session background processing
- API level 21+

**Implementation steps:**

1. **Usage Stats detection** — Poll foreground app every 500ms:
   ```kotlin
   val usm = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
   val stats = usm.queryUsageStats(INTERVAL_DAILY, begin, end)
   val topApp = stats.maxByOrNull { it.lastTimeUsed }?.packageName
   ```

2. **Accessibility Service** (stronger alternative) — Receive window state change events:
   ```kotlin
   override fun onAccessibilityEvent(event: AccessibilityEvent) {
     if (event.eventType == TYPE_WINDOW_STATE_CHANGED) {
       // Check if blocked app opened
     }
   }
   ```

3. **Foreground Service** — Keep session alive:
   ```kotlin
   startForeground(NOTIF_ID, buildSessionNotification())
   ```

4. **Interruption overlay** — Show reroute screen on top:
   ```kotlin
   val params = WindowManager.LayoutParams(TYPE_APPLICATION_OVERLAY, ...)
   windowManager.addView(overlayView, params)
   ```

5. **Permission education** — Guide users through Settings:
   - Usage Access: `Settings.ACTION_USAGE_ACCESS_SETTINGS`
   - Accessibility: `Settings.ACTION_ACCESSIBILITY_SETTINGS`
   - Battery optimization: `Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS`

**Play Store requirements:**
- Prominent disclosure for Accessibility Service usage
- Must not collect or transmit data accessed via Accessibility
- Use case must qualify under permitted parental control / focus categories

---

## Data Models

| Model | Key Fields |
|---|---|
| User | id, onboardingComplete, preferredSessionLength, subscriptionStatus |
| FocusSession | task, durationMinutes, status, rerouteCount, unlockCount, driftCount |
| DriftEvent | sessionId, triggerType, userChoice, occurredAt |
| UnlockEvent | sessionId, reason, startedAt, endedAt, durationSeconds |
| Routine | name, taskTemplate, defaultDurationMinutes, mode, strictness, schedule |
| Insight | type, message, priority, evidence, actionLabel |
| Subscription | status, productId, renewalDate, entitlement |

---

## Subscription Setup (RevenueCat)

### Current state
Subscription is abstracted behind `SubscriptionService`. The current mock implementation allows full UI testing without a live RevenueCat account.

### To connect RevenueCat (Phase 2):

1. Install: `npm install react-native-purchases`
2. Configure in `App.tsx`:
   ```ts
   Purchases.configure({ apiKey: 'YOUR_REVENUECAT_API_KEY' });
   ```
3. Update `SubscriptionService` to replace mock calls:
   ```ts
   const packages = await Purchases.getOfferings();
   await Purchases.purchasePackage(packages.current?.monthly);
   ```
4. Map product IDs:
   - Monthly: `reroute_pro_monthly`
   - Annual: `reroute_pro_annual`
   - Lifetime: `reroute_pro_lifetime`
5. Check entitlement:
   ```ts
   const info = await Purchases.getCustomerInfo();
   const isPro = info.entitlements.active['pro'] !== undefined;
   ```

### Pricing placeholders
- Monthly: £3.99 / month
- Annual: £29.99 / year (37% saving)
- Lifetime: £59.99 one-time

---

## Testing Instructions

```bash
# Run all tests
npm run test:ci

# Run specific test file
npx jest src/tests/SessionService.test.ts

# Watch mode
npm test
```

### Test coverage

| Service | Tests |
|---|---|
| SessionService | start, end, abandon, drift, reroute, unlock, calculateMinutes |
| InsightService | post-session insight, weekly insights, pattern detection, experiments |
| RoutineService | create, update, delete, start |
| StorageService | save, read, update, delete, export, deleteAll, migrate |
| SubscriptionService | getStatus, purchase (all tiers), restore, checkEntitlement, isPro |
| Fixtures | student user, social media user, bedtime user, task-unclear user |

### E2E testing (Maestro-ready)

The app structure supports Maestro or Detox E2E testing. Key test flows to implement:

1. **Complete user journey** — Onboard → set today's route → start session → simulate blocked app → reroute → end session → see insight
2. **Unlock flow** — Drift → select reason → unlock timer → return
3. **Routine flow** — Create routine → start from routine → complete session
4. **Paywall flow** — Hit free limit → see paywall → restore

---

## Roadmap

### Phase 1 (Current — Complete)
- Full local-first app
- Demo blocking simulation
- Sessions, Reroute Plans, Routines, Insights
- Paywall scaffold
- Privacy & permission screens

### Phase 2
- Native iOS Screen Time integration (FamilyControls + ManagedSettings)
- Native Android app detection (UsageStats / AccessibilityService)
- Real app shielding
- RevenueCat subscription integration
- Optional cloud sync (Supabase)

### Phase 3
- Calendar integration
- Smart session recommendations
- Weekly Recovery Reports with trend analysis
- Lock screen / home screen widgets
- Wearable nudges (Apple Watch / WearOS)

### Phase 4
- Student group plans
- School and university partnerships
- Advanced behavioral insights (opt-in, privacy-first)

---

## Known Limitations

1. **No real app blocking in Phase 1** — Demo mode only. Native blocking requires platform-specific implementation (see above).

2. **AsyncStorage limitations** — Current storage works well for the expected data volume. For heavy users (1000+ sessions), consider migrating to SQLite or WatermelonDB using the `StorageService.migrate()` hook.

3. **Notifications on Android** — Full notification support requires a foreground service for reliable delivery during sessions.

4. **RevenueCat not connected** — Subscription purchases in the current build use a mock that sets local status only. Connect RevenueCat for real purchases.

5. **No backend sync** — All data is local-first. Cloud sync will be added as an opt-in feature in Phase 2.

6. **Analytics not wired** — `AnalyticsService` logs to console only. Connect a privacy-friendly provider (e.g. PostHog) with user consent before production.

---

## Privacy

- No tracking by default
- Task text never leaves the device
- No ads
- No behavioural data sold
- Users can export or delete all data at any time
- Privacy screen explains clearly what is stored and why

---

## Contributing

This is a commercial product. Contributions by invitation only.

---

## License

Proprietary. All rights reserved.
