export type AnalyticsEvent =
  | { name: 'profile_completed'; payload?: Record<string, unknown> }
  | { name: 'deck_swiped'; payload: { fighterId: string; direction: 'like' | 'pass' } }
  | { name: 'match_created'; payload: { fighterId: string } };

export function trackEvent(event: AnalyticsEvent) {
  // TODO: replace with real PostHog/Mixpanel integration.
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[analytics]', event.name, event.payload ?? {});
  }
}
