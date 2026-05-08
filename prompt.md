You are an expert founding product engineer, mobile architect, and UX designer.

Build the full product for a mobile app called “Reroute”.

Reroute is a gentle focus recovery app. It helps users start a focus session, catch themselves when they drift, and get back to the task without guilt.

This should be treated as a real commercial product, not a throwaway MVP.

Product positioning:
“Reroute helps you get back to your task when your attention slips.”

Tagline:
“Find your way back to focus.”

Core idea:
Most focus apps help users block distractions. Reroute helps users recover from distraction.

Primary promise:
“When you drift, Reroute helps you get back.”

Core philosophy:
- Focus recovery, not focus punishment
- Gentle, non-judgmental tone
- Minimal, calm interface
- No productivity-bro language
- No guilt-based streak pressure
- No noisy dashboards
- Privacy-first
- Local-first where possible
- Commercially ready for subscription monetization

Target users:
Primary:
- Students who get distracted while studying
- Remote workers who lose focus to social apps
- Writers, creators, and knowledge workers who need help re-entering tasks

Secondary:
- People trying to reduce social media use
- People who struggle with bedtime scrolling
- ADHD-adjacent users, without making medical claims

Do not position this as a medical app. Avoid diagnosis or treatment language.

Main product experience:
User starts a task → selects distractions → creates a Reroute Plan → begins session → drifts → app gently interrupts → user reroutes back, unlocks intentionally, or ends session → app learns patterns → app gives useful insights.

The product should feel calm, useful, and trustworthy.

Build target:
Create a production-grade React Native app using Expo where possible, with TypeScript.

Real app blocking requires native functionality:
- iOS: Screen Time APIs such as FamilyControls, ManagedSettings, and DeviceActivity
- Android: Usage Access, Accessibility Service, foreground service, and notification listener where appropriate

Structure the codebase so the product can support both:
1. Demo/simulator blocking mode
2. Real native app-blocking integrations later

Use a clean abstraction layer for blocking:

BlockingService
- startProtection()
- stopProtection()
- updateBlockedApps()
- requestPermissions()
- checkPermissionStatus()
- interceptAppOpen()
- triggerDriftInterruption()
- beginTemporaryUnlock()
- endTemporaryUnlock()

For this full product build, implement:
- Full product UI
- Full session system
- Full routines system
- Full local data persistence
- Full insights system
- Demo blocked-app simulation
- Subscription/paywall scaffolding
- Backend-ready architecture
- Native module placeholders with clear TODOs and interface contracts

If real native blocking can be implemented, do it behind the BlockingService abstraction. If not, create the exact native module interfaces and document the implementation requirements.

Tech stack:
- React Native
- Expo
- TypeScript
- React Navigation
- Zustand or Redux Toolkit for state management
- SQLite or WatermelonDB for local persistence
- React Hook Form or equivalent for forms
- RevenueCat-ready subscription abstraction
- Supabase or Firebase-ready backend abstraction, but keep the first version local-first
- Jest for unit tests
- Detox or Maestro-ready structure for E2E tests
- ESLint and Prettier
- Dark mode support

Suggested folder structure:

src/
  app/
  components/
  screens/
  navigation/
  services/
    BlockingService/
    SessionService/
    InsightService/
    RoutineService/
    SubscriptionService/
    StorageService/
    NotificationService/
    PermissionService/
  store/
  hooks/
  models/
  utils/
  theme/
  copy/
  tests/

Core data models:

User
- id
- onboardingComplete
- createdAt
- preferredSessionLength
- gentleReminderEnabled
- demoBlockingEnabled
- subscriptionStatus
- privacyConsentVersion

FocusSession
- id
- task
- durationMinutes
- startedAt
- endedAt
- selectedDistractions
- reroutePlan
- status: active | completed | abandoned | interrupted
- rerouteCount
- unlockCount
- driftCount
- completedFocusMinutes
- distractionReasons
- routineId optional
- createdAt
- updatedAt

ReroutePlan
- id
- text
- type: suggested | custom
- createdAt
- lastUsedAt

Distraction
- id
- appName
- appBundleId optional
- category
- platform
- isProtectedByDefault

DriftEvent
- id
- sessionId
- appName optional
- triggerType: manual | blocked_app | notification | timer | demo
- occurredAt
- userChoice: rerouted | unlocked | ended | ignored
- reason optional

UnlockEvent
- id
- sessionId
- appName
- reason
- startedAt
- endedAt
- durationSeconds

Routine
- id
- name
- taskTemplate
- defaultDurationMinutes
- defaultDistractions
- defaultReroutePlan
- schedule
- daysOfWeek
- startTime
- endTime
- isEnabled
- mode: study | work | bedtime | writing | custom

Insight
- id
- type
- message
- evidence
- createdAt
- priority
- actionLabel optional
- actionTarget optional

Subscription
- status: free | trial | pro | expired
- productId
- renewalDate optional
- entitlement

App screens:

1. Splash screen
Minimal branded loading screen.
App name: Reroute
Subtext: “Find your way back to focus.”

2. Onboarding flow

Screen 1:
“Start with one thing.”
Subtext:
“Choose what you want to protect your attention for.”

Screen 2:
“When you drift, Reroute helps you get back.”
Subtext:
“We gently remind you what you meant to do before you disappear into distractions.”

Screen 3:
“No guilt. No streak pressure.”
Subtext:
“You do not need perfect focus. You just need a way back.”

Screen 4:
“Your focus data is private.”
Subtext:
“Reroute stores your focus history locally by default. You control your data.”

Screen 5:
CTA:
“Start my first focus session”

3. Home screen

Show:
- Greeting
- Today’s Route card
- Primary CTA: “Start focus session”
- Secondary CTA: “Start from routine”
- Today summary:
  - Sessions today
  - Focus minutes
  - Times rerouted
  - Main distraction
- Suggested insight card
- Bottom navigation:
  - Home
  - Routines
  - Insights
  - Settings

Home should feel calm and not overloaded.

4. Today’s Route

Allow user to set one priority for the day:

“What is the one thing you want to protect today?”

Examples:
- Study for 30 minutes
- Write one page
- Finish proposal
- Sleep without scrolling
- Read one chapter

This should appear on Home and be suggested when starting sessions.

5. Start Session flow

Step 1:
“What are you trying to do?”
Input placeholder:
“Finish biology notes”

Suggested recent tasks:
- Continue previous task
- Today’s Route
- Routine templates

Step 2:
“How long do you want to protect this?”
Options:
10, 15, 20, 25, 45, 60 minutes
Also custom duration.

Step 3:
“What might distract you?”
Options:
- TikTok
- Instagram
- YouTube
- X
- Safari / Browser
- Messages
- Email
- Reddit
- Games
- Other

Step 4:
“If you drift, what’s your smallest way back?”
Suggested Reroute Plans:
- Read one paragraph
- Write one sentence
- Solve one question
- Open the document
- Put the phone down
- Take one breath and continue
- Custom

Step 5:
Protection Check

Checklist:
- Task selected
- Timer ready
- Distractions selected
- Reroute Plan ready
- Permissions ready
- App protection ready

If permission is missing:
“To protect this session, Reroute needs permission to detect selected distractions.”

CTA:
“Enable protection”

Secondary:
“Continue in demo mode”

Final CTA:
“Begin session”

6. Active Session screen

Minimal screen.

Show:
- Task name
- Countdown timer
- Reroute Plan
- Protected apps list
- Button: “I’m drifting”
- Button: “Take intentional break”
- Button: “End session”

The screen should have no unnecessary charts or clutter.

Optional gentle prompt after a period of time:
“Still with it?”

Options:
- Yes
- I drifted
- End session

7. Drift / Reroute screen

This is the most important screen.

Trigger when:
- User taps “I’m drifting”
- User attempts to open a protected app through native interception
- Demo blocked app is selected
- User returns from temporary unlock
- Session detects interruption

Copy:
“You were working on: [task]
Your way back: [reroute plan]
Want to reroute?”

Options:
- “Back to task”
- “Unlock for 3 minutes”
- “End session”

Tone:
No shame.
No punishment.
No failure language.

If user taps “Back to task”:
- Increment rerouteCount
- Record DriftEvent
- Return to Active Session screen
- Show gentle message:
“You came back. That matters.”

If user taps “Unlock for 3 minutes”:
Ask:
“Why do you need this?”

Options:
- Message someone
- Work-related
- Quick search
- Emergency
- I’m avoiding my task
- I needed a break
- Other

Then:
- Start temporary unlock
- Show unlock timer
- After timer ends, show:
“Ready to get back?”

Options:
- Back to task
- Extend once
- End session

Limit repeated extensions unless Pro unlock rules allow customization.

8. Temporary Unlock screen

Show:
- App unlocked
- Reason
- Countdown
- Button: “Back to task now”
- Button: “End session”

At the end:
“You wanted to protect: [task].”

CTA:
“Reroute back”

9. End Session screen

Show:
- Focus time completed
- Times rerouted
- Unlocks
- Drift events
- Main distraction reason

Ask:
“What pulled you away most?”

Options:
- Bored
- Tired
- Anxious
- Task unclear
- Notification
- Habit
- Needed a break
- Other

Then generate one gentle insight:
Examples:
- “You rerouted once. That matters.”
- “Your task may have been too broad. Try a smaller first step next time.”
- “You focused better with a short session. Try 20 minutes again.”
- “You drifted, but you got back.”
- “Most of your unlocks were for messages. Consider allowing Messages but protecting social apps.”

CTA:
- “Start another session”
- “View insights”
- “Done”

10. Routines screen

Users can create recurring focus modes.

Preset routines:
- Study Mode
- Deep Work
- Writing
- Reading
- Bedtime
- Morning Focus
- Custom

Routine fields:
- Name
- Default task
- Duration
- Protected apps
- Reroute Plan
- Schedule
- Days
- Start/end time
- Strictness level:
  - Gentle: intentional unlocks allowed
  - Balanced: reason required, timed unlocks
  - Strong: limited unlocks
- Notification reminder toggle

Free users:
- One routine

Pro users:
- Unlimited routines
- Advanced unlock rules
- Weekly recovery report
- Schedule automation
- Calendar integration placeholder
- Real protection rules when native blocking is enabled

11. Routine detail screen

Show routine settings and history:
- Last used
- Completion rate
- Common distractions
- Suggested improvement

12. Insights screen

Keep this useful, not overwhelming.

Show:
- Total focus sessions
- Total focus minutes
- Total reroutes
- Most common distraction
- Best session length
- Best time of day
- Most common drift reason
- Suggested next experiment

Important:
The core metric is not only focus time.
The unique metric is:
“Times rerouted”

Insight examples:
- “You rerouted 8 times this week.”
- “You complete more sessions when they are under 25 minutes.”
- “Task unclear is your most common drift reason.”
- “You often drift after 17 minutes. Try a 15-minute first session.”
- “You focus better before opening social apps in the morning.”
- “You often unlock Messages but rarely Instagram intentionally. Consider different rules for each.”

13. Weekly Recovery Report

Pro feature.

Show:
- Sessions completed
- Times rerouted
- Biggest distraction
- Most successful session length
- Best routine
- Main pattern
- One suggested experiment

Example:
“This week, your strongest sessions were 20–25 minutes. You drifted most often when the task was unclear. Next week, try writing a smaller Reroute Plan before each study session.”

14. Paywall / Pro screen

Do not be aggressive.

Headline:
“Make Reroute personal.”

Subtext:
“Unlock routines, smart insights, advanced unlock rules, and weekly recovery reports.”

Free includes:
- Basic focus sessions
- One routine
- Basic insights
- Demo protection

Pro includes:
- Unlimited routines
- Smart schedules
- Advanced unlock rules
- Weekly recovery report
- Deeper pattern insights
- Calendar integration when available
- Real app protection when supported by platform permissions

Suggested pricing placeholders:
- Monthly: £3.99
- Annual: £29.99
- Lifetime: £59.99

Include:
- Restore purchases
- Terms
- Privacy policy

Use a SubscriptionService abstraction so RevenueCat can be connected later.

15. Settings screen

Include:

Account:
- Sign in placeholder
- Subscription status
- Restore purchases

Focus:
- Gentle reminders toggle
- Demo blocked app simulation toggle
- Default session length
- Default Reroute Plan
- Strictness preference

Privacy:
- Local-first mode
- Export data
- Delete all data
- Privacy note:
“Your focus data is stored locally on this device unless you choose to sync.”

Permissions:
- Blocking permission status
- Notification permission status
- Usage access status where relevant

Developer/demo:
- Simulate blocked app
- Seed demo data
- Reset onboarding

16. Privacy screen

Explain clearly:
- What data is stored
- Why it is used
- What is local
- What would sync if account sync is enabled later
- No ads
- No selling behavioural data
- Delete data option

17. Permission onboarding

Create platform-specific permission flows.

iOS copy:
“To protect selected apps, Reroute needs Screen Time permissions. You choose what to protect.”

Android copy:
“To detect and interrupt distracting apps, Reroute may need Usage Access or Accessibility permissions. Reroute only uses this to help protect your sessions.”

Make permission state visible and understandable.

18. Demo Blocking screen

For development and demos, create a panel where user can simulate opening:
- TikTok
- Instagram
- YouTube
- Messages
- Safari
- Reddit

When selected during an active session, trigger the Drift / Reroute screen.

Native blocking requirements:

Create detailed implementation plan in code comments and README.

iOS:
- Use FamilyControls for app selection
- Use ManagedSettings to shield selected apps
- Use DeviceActivity to monitor schedule/session windows
- Use DeviceActivityMonitor extension where necessary
- Handle temporary unlock by modifying shield settings
- Respect Apple limitations and App Store review requirements
- Provide fallback if permissions are denied

Android:
- Use UsageStatsManager for app foreground detection where possible
- Use AccessibilityService for stronger app-open detection if necessary
- Use foreground service during active sessions
- Use overlays or interruption activity where allowed
- Handle battery optimization issues
- Create permission education screens
- Respect Play Store policy restrictions

Important:
Do not fake real native blocking in production code. If native blocking is not implemented, clearly label it as demo mode.

Notification system:

Implement local notifications:
- Routine reminders
- Session complete
- Unlock timer ending
- Gentle reroute reminder

Notification copy:
- “Ready to protect your route?”
- “Your unlock is ending. Want to get back?”
- “You planned to focus on [task].”
- “Small step: [reroute plan].”

Avoid:
- “You are failing”
- “Stop wasting time”
- “You lost your streak”

Copy system:

Create a central copy file for all product text.

Approved tone:
- Gentle
- Clear
- Human
- Calm
- Encouraging
- Non-judgmental

Approved phrases:
- “You drifted. That happens.”
- “Want to reroute?”
- “Your next step is small.”
- “No need to restart perfectly.”
- “You came back.”
- “That counts.”
- “Try making the task smaller.”

Banned phrases:
- “You failed”
- “Streak lost”
- “You wasted time”
- “Be disciplined”
- “Stop being lazy”
- “You have no self-control”

Visual design:

Create a polished, launch-quality UI.

Style:
- Calm
- Minimal
- Soft
- Modern
- Trustworthy

Requirements:
- Large readable typography
- Rounded cards and buttons
- Soft neutral background
- Accessible contrast
- Support light and dark mode
- No clutter
- No childish gamification
- No overbearing analytics
- Smooth transitions
- Haptics where appropriate
- Clear empty states

Reusable components:
- PrimaryButton
- SecondaryButton
- TextButton
- Card
- TimerDisplay
- OptionChip
- InsightCard
- ProgressSummary
- SessionSummary
- RoutineCard
- PermissionStatusCard
- PaywallFeatureRow
- EmptyState
- GentleToast
- AppIconBadge
- ReroutePlanCard
- DriftReasonSelector
- UnlockTimer
- TodayRouteCard

Core services:

SessionService:
- startSession()
- endSession()
- abandonSession()
- recordDrift()
- recordReroute()
- recordUnlock()
- getActiveSession()
- resumeSession()
- calculateCompletedMinutes()

InsightService:
- generatePostSessionInsight()
- generateWeeklyInsights()
- detectRepeatedDistractions()
- detectBestSessionLength()
- detectCommonDriftReason()
- suggestNextExperiment()

RoutineService:
- createRoutine()
- updateRoutine()
- deleteRoutine()
- startRoutineSession()
- getScheduledRoutines()
- triggerRoutineReminder()

BlockingService:
- requestPermissions()
- checkPermissionStatus()
- startProtection()
- stopProtection()
- updateProtectedApps()
- simulateBlockedApp()
- beginTemporaryUnlock()
- endTemporaryUnlock()

SubscriptionService:
- getSubscriptionStatus()
- purchaseMonthly()
- purchaseAnnual()
- purchaseLifetime()
- restorePurchases()
- checkEntitlement()

StorageService:
- save()
- read()
- update()
- delete()
- migrate()
- exportData()
- deleteAllData()

NotificationService:
- requestPermission()
- scheduleRoutineReminder()
- scheduleUnlockEndingReminder()
- cancelSessionNotifications()

Insight logic examples:

Implement deterministic rules first.

Rules:
- If rerouteCount > 0:
“You rerouted [n] times. That matters.”

- If unlockCount > 2:
“This session had several unlocks. Try a shorter session next time.”

- If most common reason is “Task unclear”:
“Try making the next action smaller before starting.”

- If completed duration is under 15 minutes but completed:
“Short sessions may be a good starting point.”

- If the same distraction appears in 3+ sessions:
“[distraction] has shown up often. Consider protecting it by default.”

- If sessions of 20–25 minutes have highest completion:
“Your best sessions are around 20–25 minutes.”

- If bedtime routine has repeated unlocks:
“Bedtime scrolling may need stronger protection.”

Testing requirements:

Write tests for:
- Starting a session
- Ending a session
- Recording drift
- Recording reroute
- Recording unlock
- Insight generation
- Routine creation
- Subscription gating
- Storage migration
- Permission state handling

Add test fixtures for:
- New user
- Student user
- Remote worker user
- Heavy social media distraction
- Bedtime scrolling user
- User with repeated task-unclear drift reason

Analytics:

Create an AnalyticsService abstraction, but do not wire invasive analytics by default.

Track only privacy-conscious product events:
- onboarding_completed
- session_started
- drift_recorded
- rerouted_to_task
- unlock_started
- session_completed
- routine_created
- insight_viewed
- paywall_viewed
- subscription_started

Do not track sensitive task text unless explicitly anonymized or user-consented.

Commercial readiness:

Prepare:
- Paywall screen
- Subscription entitlement logic
- Free vs Pro gating
- Restore purchase flow
- Privacy policy placeholder
- Terms placeholder
- App Store / Play Store compliance notes
- Native permission explanations

Free plan:
- Basic focus sessions
- One routine
- Basic insights
- Demo app protection
- Limited session history

Pro plan:
- Unlimited routines
- Advanced unlock rules
- Weekly recovery reports
- Smart schedules
- Deeper insights
- Calendar integration placeholder
- Real app protection where supported
- Longer history

Do not make the free plan useless. The free plan should create trust.

Security and privacy:
- Store data locally by default
- No ads
- No selling data
- No unnecessary account creation
- Allow delete all data
- Allow export data
- Keep task text private
- Use clear permission explanations
- Keep backend optional

README requirements:

Write a complete README with:
- Product overview
- Core philosophy
- How to run locally
- Tech stack
- Folder structure
- Implemented features
- Demo blocking explanation
- Native blocking implementation plan
- iOS requirements
- Android requirements
- Data model
- Subscription setup instructions
- Testing instructions
- Roadmap
- Known limitations

Roadmap:

Phase 1:
- Full local-first app
- Demo blocking
- Sessions
- Reroute Plans
- Routines
- Insights
- Paywall placeholder

Phase 2:
- Native iOS Screen Time integration
- Native Android app detection
- Real app shielding
- RevenueCat integration
- Cloud sync

Phase 3:
- Calendar integration
- Smarter recommendations
- Weekly reports
- Widgets
- Lock screen / home screen shortcuts
- Wearable nudges

Phase 4:
- Student group plans
- School/university partnerships
- Advanced behaviour insights

Acceptance criteria:

The app is complete when:
- A user can onboard
- Set Today’s Route
- Start a focus session
- Choose distractions
- Create a Reroute Plan
- Begin a session
- Simulate opening a blocked app
- See the Drift / Reroute screen
- Reroute back to task
- Unlock intentionally
- End a session
- Record distraction reason
- See a useful post-session insight
- Create a routine
- View insights
- See Pro upgrade screen
- Reset/export/delete local data
- Read a clear README explaining native blocking requirements

Most important user journey:

A student starts “Finish biology notes” for 25 minutes, selects TikTok and Instagram as distractions, chooses “Read one paragraph” as the Reroute Plan, taps “Begin session,” simulates opening TikTok, sees a gentle interruption, taps “Back to task,” finishes the session, and sees:

“You rerouted once. That matters.”

Do not overcomplicate the app.
Do not add social feeds.
Do not add leaderboards.
Do not add guilt streaks.
Do not add generic motivational quotes.
Do not make the app feel like homework.

The product should feel like a calm, intelligent companion that helps the user get back to what they meant to do.
