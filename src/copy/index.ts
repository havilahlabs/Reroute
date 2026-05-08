export const copy = {
  app: {
    name: 'Reroute',
    tagline: 'Find your way back to focus.',
    description: 'Reroute helps you get back to your task when your attention slips.',
  },

  onboarding: {
    screen1: {
      headline: 'Start with one thing.',
      subtext: 'Choose what you want to protect your attention for.',
    },
    screen2: {
      headline: 'When you drift, Reroute helps you get back.',
      subtext: 'We gently remind you what you meant to do before you disappear into distractions.',
    },
    screen3: {
      headline: 'No guilt. No streak pressure.',
      subtext: 'You do not need perfect focus. You just need a way back.',
    },
    screen4: {
      headline: 'Your focus data is private.',
      subtext: 'Reroute stores your focus history locally by default. You control your data.',
    },
    screen5: {
      cta: 'Start my first focus session',
    },
    skip: 'Skip',
    next: 'Next',
    back: 'Back',
  },

  home: {
    greeting: {
      morning: 'Good morning.',
      afternoon: 'Good afternoon.',
      evening: 'Good evening.',
    },
    startSession: 'Start focus session',
    startFromRoutine: 'Start from routine',
    todaysSummary: "Today's focus",
    sessionCount: (n: number) => `${n} session${n !== 1 ? 's' : ''}`,
    focusMinutes: (n: number) => `${n} min focused`,
    timesRerouted: (n: number) => `${n} rerouted`,
    noSessionsYet: 'No sessions yet today.',
    startFirst: 'Start your first focus session.',
  },

  todaysRoute: {
    headline: 'What is the one thing you want to protect today?',
    placeholder: 'e.g. Study for 30 minutes',
    examples: [
      'Study for 30 minutes',
      'Write one page',
      'Finish proposal',
      'Sleep without scrolling',
      'Read one chapter',
    ],
    save: 'Set today\'s route',
    clear: 'Clear route',
  },

  startSession: {
    step1: {
      headline: 'What are you trying to do?',
      placeholder: 'Finish biology notes',
      continueTask: 'Continue previous task',
      todaysRoute: "Today's route",
      recentTasks: 'Recent tasks',
    },
    step2: {
      headline: 'How long do you want to protect this?',
      custom: 'Custom',
      durations: [10, 15, 20, 25, 45, 60],
      customPlaceholder: 'Enter minutes',
    },
    step3: {
      headline: 'What might distract you?',
      subtext: 'Select the apps you want to protect against.',
      apps: [
        { name: 'TikTok', id: 'tiktok', category: 'social' },
        { name: 'Instagram', id: 'instagram', category: 'social' },
        { name: 'YouTube', id: 'youtube', category: 'video' },
        { name: 'X', id: 'twitter', category: 'social' },
        { name: 'Safari', id: 'safari', category: 'browser' },
        { name: 'Messages', id: 'messages', category: 'messaging' },
        { name: 'Email', id: 'email', category: 'messaging' },
        { name: 'Reddit', id: 'reddit', category: 'social' },
        { name: 'Games', id: 'games', category: 'games' },
        { name: 'Other', id: 'other', category: 'other' },
      ],
    },
    step4: {
      headline: 'If you drift, what\'s your smallest way back?',
      subtext: 'A tiny first step makes rerouting easier.',
      suggestions: [
        'Read one paragraph',
        'Write one sentence',
        'Solve one question',
        'Open the document',
        'Put the phone down',
        'Take one breath and continue',
      ],
      custom: 'Write your own',
      customPlaceholder: 'Your reroute plan...',
    },
    step5: {
      headline: 'Ready to begin?',
      checklist: {
        task: 'Task selected',
        timer: 'Timer ready',
        distractions: 'Distractions selected',
        reroutePlan: 'Reroute Plan ready',
        permissions: 'Permissions ready',
        protection: 'App protection ready',
      },
      permissionNeeded:
        'To protect this session, Reroute needs permission to detect selected distractions.',
      enableProtection: 'Enable protection',
      demoMode: 'Continue in demo mode',
      begin: 'Begin session',
    },
    next: 'Continue',
    back: 'Back',
  },

  activeSession: {
    task: 'Working on:',
    reroutePlan: 'Your way back:',
    protectedApps: 'Protected:',
    iAmDrifting: "I'm drifting",
    intentionalBreak: 'Take intentional break',
    endSession: 'End session',
    gentlePrompt: 'Still with it?',
    gentleOptions: {
      yes: 'Yes, still focused',
      drifted: 'I drifted',
      end: 'End session',
    },
    demoBlock: 'Simulate blocked app',
  },

  drift: {
    headline: (task: string) => `You were working on: ${task}`,
    reroutePlanLabel: 'Your way back:',
    question: 'Want to reroute?',
    backToTask: 'Back to task',
    unlock: 'Unlock for 3 minutes',
    endSession: 'End session',
    afterReroute: 'You came back. That matters.',
    unlockReasonTitle: 'Why do you need this?',
    unlockReasons: [
      'Message someone',
      'Work-related',
      'Quick search',
      'Emergency',
      "I'm avoiding my task",
      'I needed a break',
      'Other',
    ],
  },

  temporaryUnlock: {
    headline: 'Unlocked temporarily',
    reason: 'Reason:',
    timeLeft: 'Time remaining:',
    backNow: 'Back to task now',
    endSession: 'End session',
    returning: (task: string) => `You wanted to protect: ${task}`,
    reroute: 'Reroute back',
    extendOnce: 'Extend once',
  },

  endSession: {
    headline: 'Session complete',
    focusTime: 'Focus time',
    timesRerouted: 'Times rerouted',
    unlocks: 'Unlocks',
    driftEvents: 'Drift events',
    mainDistraction: 'Main distraction',
    distractionQuestion: 'What pulled you away most?',
    distractionReasons: [
      'Bored',
      'Tired',
      'Anxious',
      'Task unclear',
      'Notification',
      'Habit',
      'Needed a break',
      'Other',
    ],
    cta: {
      another: 'Start another session',
      insights: 'View insights',
      done: 'Done',
    },
  },

  routines: {
    headline: 'Routines',
    subtext: 'Preset focus modes for recurring situations.',
    createNew: 'Create routine',
    presets: [
      { id: 'study', name: 'Study Mode', emoji: '📚' },
      { id: 'deepwork', name: 'Deep Work', emoji: '💼' },
      { id: 'writing', name: 'Writing', emoji: '✍️' },
      { id: 'reading', name: 'Reading', emoji: '📖' },
      { id: 'bedtime', name: 'Bedtime', emoji: '🌙' },
      { id: 'morning', name: 'Morning Focus', emoji: '☀️' },
      { id: 'custom', name: 'Custom', emoji: '⚡' },
    ],
    freeLimit: 'Free plan includes one routine.',
    upgradeCta: 'Upgrade to Pro for unlimited routines.',
    noRoutines: 'No routines yet.',
    createFirst: 'Create your first routine.',
    strictness: {
      gentle: 'Gentle',
      balanced: 'Balanced',
      strong: 'Strong',
      gentleDesc: 'Intentional unlocks allowed',
      balancedDesc: 'Reason required, timed unlocks',
      strongDesc: 'Limited unlocks',
    },
  },

  weeklyReport: {
    headline: 'Weekly Recovery Report',
    sessionsCompleted: 'Sessions completed',
    timesRerouted: 'Times rerouted',
    biggestDistraction: 'Biggest distraction',
    bestSessionLength: 'Most successful session length',
    bestRoutine: 'Best routine',
    mainPattern: 'Main pattern',
    experiment: 'One experiment to try',
    proOnly: 'Weekly reports are a Pro feature.',
    upgrade: 'Upgrade to unlock',
  },

  paywall: {
    headline: 'Make Reroute personal.',
    subtext: 'Unlock routines, smart insights, advanced unlock rules, and weekly recovery reports.',
    free: {
      title: 'Free',
      features: [
        'Basic focus sessions',
        'One routine',
        'Basic insights',
        'Demo protection',
      ],
    },
    pro: {
      title: 'Pro',
      features: [
        'Unlimited routines',
        'Smart schedules',
        'Advanced unlock rules',
        'Weekly recovery report',
        'Deeper pattern insights',
        'Calendar integration (coming soon)',
        'Real app protection',
        'Longer history',
      ],
    },
    pricing: {
      monthly: '£3.99 / month',
      annual: '£29.99 / year',
      annualSavings: 'Save 37%',
      lifetime: '£59.99 once',
    },
    cta: {
      monthly: 'Start monthly',
      annual: 'Start annual',
      lifetime: 'Get lifetime access',
    },
    restore: 'Restore purchases',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
  },

  settings: {
    headline: 'Settings',
    account: {
      title: 'Account',
      signIn: 'Sign in',
      subscriptionStatus: 'Subscription',
      restore: 'Restore purchases',
    },
    focus: {
      title: 'Focus',
      gentleReminders: 'Gentle reminders',
      demoMode: 'Demo blocking simulation',
      defaultSessionLength: 'Default session length',
      defaultReroutePlan: 'Default Reroute Plan',
      strictness: 'Strictness preference',
    },
    privacy: {
      title: 'Privacy',
      localFirst: 'Local-first mode',
      exportData: 'Export my data',
      deleteData: 'Delete all data',
      deleteConfirm: 'This will permanently delete all your focus data. This cannot be undone.',
      note: 'Your focus data is stored locally on this device unless you choose to sync.',
    },
    permissions: {
      title: 'Permissions',
      blocking: 'App blocking permission',
      notifications: 'Notifications',
      usageAccess: 'Usage access',
      granted: 'Granted',
      denied: 'Not granted',
      request: 'Enable',
    },
    developer: {
      title: 'Developer & Demo',
      simulateBlock: 'Simulate blocked app',
      seedData: 'Seed demo data',
      resetOnboarding: 'Reset onboarding',
    },
  },

  privacy: {
    headline: 'Privacy',
    sections: {
      stored: {
        title: 'What we store',
        content:
          'Focus sessions, drift events, reroute actions, routines, and app settings. Task text stays on your device.',
      },
      why: {
        title: 'Why we use it',
        content:
          'To help you understand your focus patterns and improve sessions over time. Never for advertising.',
      },
      local: {
        title: 'Local by default',
        content:
          'All data is stored locally on this device. Optional cloud sync may be added in a future version — you will always choose.',
      },
      sync: {
        title: 'If you enable sync',
        content:
          'Session summaries and routines would sync to your account. Task text would remain on-device unless you explicitly export it.',
      },
      ads: {
        title: 'No ads. No selling data.',
        content: 'Reroute is funded by subscriptions. We do not show ads or sell your data.',
      },
      delete: {
        title: 'Delete your data',
        content: 'You can delete all local data at any time from Settings → Privacy.',
      },
    },
  },

  permissions: {
    ios: {
      headline: 'Enable app protection',
      body: 'To protect selected apps, Reroute needs Screen Time permissions. You choose what to protect.',
      cta: 'Enable Screen Time access',
      skip: 'Use demo mode instead',
    },
    android: {
      headline: 'Enable app detection',
      body: 'To detect and interrupt distracting apps, Reroute may need Usage Access or Accessibility permissions. Reroute only uses this to help protect your sessions.',
      cta: 'Enable usage access',
      skip: 'Use demo mode instead',
    },
  },

  demo: {
    headline: 'Demo blocking',
    subtext: 'Simulate opening a distracting app to see how Reroute responds.',
    apps: ['TikTok', 'Instagram', 'YouTube', 'Messages', 'Safari', 'Reddit'],
    noSession: 'Start a session first to test blocking.',
    trigger: 'Simulate opening',
  },

  notifications: {
    routineReminder: (routineName: string) => `Ready to start ${routineName}?`,
    sessionComplete: 'Session complete. Great work.',
    unlockEnding: 'Your unlock is ending. Want to get back?',
    gentleReroute: (task: string) => `You planned to focus on: ${task}`,
    smallStep: (plan: string) => `Small step: ${plan}`,
  },

  insights: {
    headline: 'Insights',
    subtext: 'Your focus patterns, simply.',
    totalSessions: 'Total sessions',
    totalMinutes: 'Total focus minutes',
    totalReroutes: 'Total reroutes',
    mostCommonDistraction: 'Most common distraction',
    bestSessionLength: 'Best session length',
    bestTimeOfDay: 'Best time of day',
    mostCommonDriftReason: 'Most common drift reason',
    nextExperiment: 'Try next',
    noData: 'Complete a session to see insights.',
    examples: {
      rerouted: (n: number) => `You rerouted ${n} time${n !== 1 ? 's' : ''}. That matters.`,
      tooManyUnlocks: 'This session had several unlocks. Try a shorter session next time.',
      taskUnclear: 'Try making the next action smaller before starting.',
      shortGood: 'Short sessions may be a good starting point.',
      repeatedDistraction: (app: string) =>
        `${app} has shown up often. Consider protecting it by default.`,
      bestLength: 'Your best sessions are around 20–25 minutes.',
      bedtimeScrolling: 'Bedtime scrolling may need stronger protection.',
    },
  },

  general: {
    save: 'Save',
    cancel: 'Cancel',
    done: 'Done',
    ok: 'OK',
    back: 'Back',
    next: 'Next',
    skip: 'Skip',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    minutes: (n: number) => `${n} min`,
    minutesFull: (n: number) => `${n} minute${n !== 1 ? 's' : ''}`,
  },
} as const;

export type Copy = typeof copy;
