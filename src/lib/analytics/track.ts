declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      target: string | Date,
      params?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

export interface TrackEvent {
  name: string;
  properties?: Record<string, unknown>;
}

/**
 * Interforma Analytics Dispatcher v1.0
 *
 * Components never call GA4 directly — they call track().
 * Signature supports both object form and positional form:
 *   track({ name: 'hero_cta', properties: { placement: 'hero' } })
 *   track('hero_cta', { placement: 'hero' })
 */
export function track(event: TrackEvent): void;
export function track(name: string, properties?: Record<string, unknown>): void;
export function track(
  eventOrName: TrackEvent | string,
  properties?: Record<string, unknown>
): void {
  const name = typeof eventOrName === 'string' ? eventOrName : eventOrName.name;
  const props =
    typeof eventOrName === 'string' ? (properties ?? {}) : (eventOrName.properties ?? {});

  if (import.meta.env.DEV) {
    console.groupCollapsed(`[analytics] ${name}`);
    if (Object.keys(props).length) console.table(props);
    console.groupEnd();
  }

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, props);
  }
}
