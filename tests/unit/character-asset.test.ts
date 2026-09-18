import { describe, it, expect } from 'vitest';
import { getClipNameForSleepPosition } from '@/lib/three/character-asset';

describe('getClipNameForSleepPosition', () => {
  it('returns idle for null position', () => {
    expect(getClipNameForSleepPosition(null)).toBe('SleepIdle');
  });

  it('returns idle for combination position', () => {
    expect(getClipNameForSleepPosition('combination')).toBe('SleepIdle');
  });

  it('returns side clip for side position', () => {
    expect(getClipNameForSleepPosition('side')).toBe('SleepSide');
  });

  it('returns back clip for back position', () => {
    expect(getClipNameForSleepPosition('back')).toBe('SleepBack');
  });

  it('returns stomach clip for stomach position', () => {
    expect(getClipNameForSleepPosition('stomach')).toBe('SleepStomach');
  });
});
