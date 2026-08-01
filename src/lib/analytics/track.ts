export interface TrackEvent {
  name: string;
  properties?: Record<string, unknown>;
}

/**
 * Decoupled analytics dispatcher.
 * Stub for Release 0 — adapters (GA4, PostHog, Vercel) will be connected in Block 13.
 * In dev: logs to console. In production: no-op until adapters are registered.
 */
export function track(event: TrackEvent): void {
  if (import.meta.env.DEV) {
    console.debug('[analytics:track]', event.name, event.properties ?? {});
  }
  // TODO Block 13: dispatch to registered adapters
}
