export type AnalyticsEventName =
  | "profile_started"
  | "profile_completed"
  | "results_viewed"
  | "mattress_selected"
  | "comparison_opened"
  | "affiliate_click"
  | "sponsored_click"
  | "satisfaction_response";

export interface AnalyticsEventPayload {
  [key: string]: string | number | boolean | undefined;
}

interface AnalyticsDataLayerWindow extends Window {
  dataLayer?: Record<string, unknown>[];
}

/**
 * Thin analytics abstraction. Works with zero configuration (events simply aren't sent
 * anywhere) so the app never breaks or throws when NEXT_PUBLIC_ANALYTICS_ID is unset; once an
 * analytics ID is configured, events push onto window.dataLayer for a tag manager to pick up.
 *
 * Sponsored events (sponsored_click) and algorithmic events (affiliate_click without
 * placementType "sponsored") are tracked as separate event names/payload fields on purpose so
 * downstream reporting never blends sponsored and algorithmic performance together.
 */
export function trackEvent(name: AnalyticsEventName, payload: AnalyticsEventPayload = {}): void {
  if (typeof window === "undefined") return;

  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;

  if (process.env.NODE_ENV !== "production") {
    console.debug(`[analytics] ${name}`, payload);
  }

  if (!analyticsId) return;

  const w = window as AnalyticsDataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: name, analyticsId, ...payload });
}
