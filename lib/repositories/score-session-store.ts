import type { ScoreTrace } from "@/contracts/mattress-match";

interface ScoreSession {
  modelVersion: string;
  trace: ScoreTrace;
  createdAt: number;
}

/**
 * In-memory session store mapping a generated SleepProfile id to the trace of its top
 * recommendation, so /api/score-trace can look up "why" after the fact without a database.
 * Bounded so a long-running dev/demo server doesn't grow unbounded.
 */
const MAX_ENTRIES = 500;
const store = new Map<string, ScoreSession>();

export function saveScoreSession(profileId: string, modelVersion: string, trace: ScoreTrace): void {
  if (store.size >= MAX_ENTRIES) {
    const oldestKey = store.keys().next().value;
    if (oldestKey !== undefined) store.delete(oldestKey);
  }
  store.set(profileId, { modelVersion, trace, createdAt: Date.now() });
}

export function getScoreSession(profileId: string): ScoreSession | undefined {
  return store.get(profileId);
}
