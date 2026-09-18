import { describe, it, expect } from 'vitest';
import { computeLayerSeparation, getLayerOffsetY } from '@/lib/three/layer-expansion';

describe('computeLayerSeparation', () => {
  it('returns 0 for quiz-results route at any progress', () => {
    expect(computeLayerSeparation('quiz-results', 0)).toBe(0);
    expect(computeLayerSeparation('quiz-results', 0.5)).toBe(0);
    expect(computeLayerSeparation('quiz-results', 1)).toBe(0);
  });

  it('holds at the resting separation before progress 0.33 on home route', () => {
    expect(computeLayerSeparation('home', 0)).toBeCloseTo(0.4, 5);
    expect(computeLayerSeparation('home', 0.1)).toBeCloseTo(0.4, 5);
    expect(computeLayerSeparation('home', 0.33)).toBeCloseTo(0.4, 2);
  });

  it('smoothsteps from the resting separation to 1 between 0.33 and 0.5 on home route', () => {
    const sep33 = computeLayerSeparation('home', 0.33);
    const sep40 = computeLayerSeparation('home', 0.4);
    const sep50 = computeLayerSeparation('home', 0.5);

    expect(sep33).toBeCloseTo(0.4, 1);
    expect(sep40).toBeGreaterThan(0.4);
    expect(sep40).toBeLessThan(1);
    expect(sep50).toBeCloseTo(1, 1);
  });

  it('holds at 1 between 0.5 and 0.67 on home route', () => {
    expect(computeLayerSeparation('home', 0.5)).toBeCloseTo(1, 1);
    expect(computeLayerSeparation('home', 0.58)).toBeCloseTo(1, 1);
    expect(computeLayerSeparation('home', 0.67)).toBeCloseTo(1, 1);
  });

  it('smoothsteps from 1 back to the resting separation between 0.67 and 1.0 on home route', () => {
    const sep67 = computeLayerSeparation('home', 0.67);
    const sep80 = computeLayerSeparation('home', 0.8);
    const sep100 = computeLayerSeparation('home', 1.0);

    expect(sep67).toBeCloseTo(1, 1);
    expect(sep80).toBeGreaterThan(0.4);
    expect(sep80).toBeLessThan(1);
    expect(sep100).toBeCloseTo(0.4, 1);
  });

  it('clamps progress outside [0, 1]', () => {
    expect(computeLayerSeparation('home', -0.5)).toBeCloseTo(0.4, 5);
    expect(computeLayerSeparation('home', 1.5)).toBeCloseTo(0.4, 1);
  });
});

describe('getLayerOffsetY', () => {
  it('returns 0 when separation is 0', () => {
    expect(getLayerOffsetY('cover', 0)).toBeCloseTo(0);
    expect(getLayerOffsetY('comfort', 0)).toBeCloseTo(0);
    expect(getLayerOffsetY('transition', 0)).toBeCloseTo(0);
    expect(getLayerOffsetY('core', 0)).toBeCloseTo(0);
  });

  it('returns positive offset for cover layer when separation > 0', () => {
    expect(getLayerOffsetY('cover', 1)).toBeGreaterThan(0);
  });

  it('returns positive offset for comfort layer when separation > 0', () => {
    expect(getLayerOffsetY('comfort', 1)).toBeGreaterThan(0);
  });

  it('returns negative offset for transition layer when separation > 0', () => {
    expect(getLayerOffsetY('transition', 1)).toBeLessThan(0);
  });

  it('returns negative offset for core layer when separation > 0', () => {
    expect(getLayerOffsetY('core', 1)).toBeLessThan(0);
  });

  it('scales linearly with separation', () => {
    const coverAt05 = getLayerOffsetY('cover', 0.5);
    const coverAt10 = getLayerOffsetY('cover', 1.0);
    expect(coverAt10).toBeCloseTo(coverAt05 * 2, 5);
  });
});
