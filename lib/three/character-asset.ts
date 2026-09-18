import type { SleepPosition } from './types';

export const CHARACTER_MODEL_URL = '/models/sleeper.glb';

export const CHARACTER_CLIP_NAMES = {
  idle: 'SleepIdle',
  side: 'SleepSide',
  back: 'SleepBack',
  stomach: 'SleepStomach',
} as const;

export function getClipNameForSleepPosition(position: SleepPosition | null): string {
  if (!position || position === 'combination') return CHARACTER_CLIP_NAMES.idle;
  return CHARACTER_CLIP_NAMES[position];
}

let availabilityCache: Promise<boolean> | null = null;

export function checkCharacterAssetAvailable(): Promise<boolean> {
  if (availabilityCache !== null) return availabilityCache;

  availabilityCache = fetch(CHARACTER_MODEL_URL, { method: 'HEAD' })
    .then((r) => r.ok)
    .catch(() => false);

  return availabilityCache;
}
