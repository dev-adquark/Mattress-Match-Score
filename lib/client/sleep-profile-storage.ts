import type { SleepProfileInput } from "@/lib/validation/sleep-profile";

const STORAGE_KEY = "mms.sleepProfileInput";

/**
 * Persists the in-progress / most recent SleepProfile input in localStorage so a shopper's
 * answers survive navigation between /match, /match/full, and /results, and so /results keeps
 * working across a direct URL load or a page refresh (it re-requests /api/score with the
 * stored input rather than caching a stale score client-side).
 */
export function saveSleepProfileInput(input: Partial<SleepProfileInput>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
  } catch {
    // Storage may be unavailable (private browsing, quota); the app must keep working without it.
  }
}

export function loadSleepProfileInput(): Partial<SleepProfileInput> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<SleepProfileInput>) : null;
  } catch {
    return null;
  }
}

export function clearSleepProfileInput(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
