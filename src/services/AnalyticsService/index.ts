/**
 * AnalyticsService — privacy-conscious product event tracking.
 *
 * Currently logs to console only.
 * To wire up an analytics provider (e.g. PostHog, Amplitude):
 *   1. Install the SDK
 *   2. Initialize in App.tsx with user consent check
 *   3. Replace console.log calls here with provider calls
 *
 * NEVER track:
 *   - Task text content (user's raw task descriptions)
 *   - Reroute plan text
 *   - Device identifiers beyond anonymous session ID
 *   - Location or contacts
 */

type AnalyticsEvent =
  | 'onboarding_completed'
  | 'session_started'
  | 'drift_recorded'
  | 'rerouted_to_task'
  | 'unlock_started'
  | 'session_completed'
  | 'routine_created'
  | 'insight_viewed'
  | 'paywall_viewed'
  | 'subscription_started';

export const AnalyticsService = {
  async track(event: AnalyticsEvent, properties?: Record<string, unknown>): Promise<void> {
    // TODO: Replace with analytics provider call after user consent
    if (__DEV__) {
      console.log(`[Analytics] ${event}`, properties ?? {});
    }
    // Example PostHog integration:
    // if (userConsentedToAnalytics) {
    //   posthog.capture(event, { ...properties, $set_once: { anonymous: true } });
    // }
  },

  async identify(_anonymousId: string): Promise<void> {
    // TODO: Set anonymous user ID — never use real name or email without explicit consent
  },

  async reset(): Promise<void> {
    // TODO: Clear analytics identity on data reset
  },
};
