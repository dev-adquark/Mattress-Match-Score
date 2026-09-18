import { describe, it, expect } from 'vitest';
import { shouldRenderLayerCallouts } from '@/lib/three/callout-budget';

describe('shouldRenderLayerCallouts', () => {
  it('returns false for tier 0', () => {
    expect(shouldRenderLayerCallouts(0)).toBe(false);
  });

  it('returns true for tier 1 and above', () => {
    expect(shouldRenderLayerCallouts(1)).toBe(true);
    expect(shouldRenderLayerCallouts(2)).toBe(true);
    expect(shouldRenderLayerCallouts(3)).toBe(true);
  });
});
