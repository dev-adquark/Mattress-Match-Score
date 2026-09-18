import { describe, it, expect } from 'vitest';
import { mapSleepPositionsToPreviewPosition } from '@/lib/three/scene-preview-mapping';

describe('mapSleepPositionsToPreviewPosition', () => {
  it('returns null for empty array', () => {
    expect(mapSleepPositionsToPreviewPosition([])).toBe(null);
  });

  it('returns the only position when single option selected', () => {
    expect(mapSleepPositionsToPreviewPosition(['side'])).toBe('side');
    expect(mapSleepPositionsToPreviewPosition(['back'])).toBe('back');
    expect(mapSleepPositionsToPreviewPosition(['stomach'])).toBe('stomach');
    expect(mapSleepPositionsToPreviewPosition(['combination'])).toBe('combination');
  });

  it('returns highest-priority position when multiple selected', () => {
    expect(mapSleepPositionsToPreviewPosition(['back', 'side'])).toBe('side');
    expect(mapSleepPositionsToPreviewPosition(['stomach', 'back', 'side'])).toBe('side');
    expect(mapSleepPositionsToPreviewPosition(['combination', 'back'])).toBe('back');
    expect(mapSleepPositionsToPreviewPosition(['combination', 'stomach'])).toBe('stomach');
  });

  it('ignores invalid positions', () => {
    expect(mapSleepPositionsToPreviewPosition(['invalid'])).toBe(null);
    expect(mapSleepPositionsToPreviewPosition(['invalid', 'side'])).toBe('side');
  });

  it('respects priority order: side > back > stomach > combination', () => {
    const all = ['side', 'back', 'stomach', 'combination'];
    expect(mapSleepPositionsToPreviewPosition(all)).toBe('side');
    expect(mapSleepPositionsToPreviewPosition(['back', 'stomach', 'combination'])).toBe('back');
    expect(mapSleepPositionsToPreviewPosition(['stomach', 'combination'])).toBe('stomach');
  });
});
