import { describe, it, expect } from 'vitest';
import { computeLayerSeparation, getLayerOffsetY, getLayerRevealProgress } from '@/lib/three/layer-expansion';

describe('computeLayerSeparation', () => {
  it('returns 0 for quiz-results route at any progress', () => {
    expect(computeLayerSeparation('quiz-results', 0)).toBe(0);
    expect(computeLayerSeparation('quiz-results', 0.5)).toBe(0);
    expect(computeLayerSeparation('quiz-results', 1)).toBe(0);
  });

  it('holds at the resting separation before progress 0.33 on home route', () => {
    expect(computeLayerSeparation('home', 0)).toBeCloseTo(0, 5);
    expect(computeLayerSeparation('home', 0.1)).toBeCloseTo(0, 5);
    expect(computeLayerSeparation('home', 0.33)).toBeCloseTo(0, 2);
  });

  it('smoothsteps from the resting separation to 1 between 0.33 and 0.5 on home route', () => {
    const sep33 = computeLayerSeparation('home', 0.33);
    const sep40 = computeLayerSeparation('home', 0.4);
    const sep50 = computeLayerSeparation('home', 0.5);

    expect(sep33).toBeCloseTo(0, 1);
    expect(sep40).toBeGreaterThan(0);
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
    expect(sep80).toBeGreaterThan(0);
    expect(sep80).toBeLessThan(1);
    expect(sep100).toBeCloseTo(0, 1);
  });

  it('clamps progress outside [0, 1]', () => {
    expect(computeLayerSeparation('home', -0.5)).toBeCloseTo(0, 5);
    expect(computeLayerSeparation('home', 1.5)).toBeCloseTo(0, 1);
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

describe('getLayerRevealProgress', () => {
  it('cover is always fully revealed, on any route or progress', () => {
    expect(getLayerRevealProgress('cover', 'home', 0)).toBe(1);
    expect(getLayerRevealProgress('cover', 'home', 0.5)).toBe(1);
    expect(getLayerRevealProgress('cover', 'home', 1)).toBe(1);
    expect(getLayerRevealProgress('cover', 'quiz-results', 0)).toBe(1);
  });

  it('non-cover layers are fully revealed on quiz-results at any progress', () => {
    expect(getLayerRevealProgress('comfort', 'quiz-results', 0)).toBe(1);
    expect(getLayerRevealProgress('transition', 'quiz-results', 0.5)).toBe(1);
    expect(getLayerRevealProgress('core', 'quiz-results', 1)).toBe(1);
  });

  it('non-cover layers start fully hidden at rest on the home route', () => {
    expect(getLayerRevealProgress('comfort', 'home', 0)).toBe(0);
    expect(getLayerRevealProgress('transition', 'home', 0)).toBe(0);
    expect(getLayerRevealProgress('core', 'home', 0)).toBe(0);
    expect(getLayerRevealProgress('comfort', 'home', 0.33)).toBeCloseTo(0, 2);
  });

  it('reveals comfort, transition, and core in sequence rather than together', () => {
    // At a point where comfort should be mid-reveal, transition and core
    // must not have started yet - they open one at a time, not at once.
    const midOpenProgress = 0.35;
    const comfort = getLayerRevealProgress('comfort', 'home', midOpenProgress);
    const transition = getLayerRevealProgress('transition', 'home', midOpenProgress);
    const core = getLayerRevealProgress('core', 'home', midOpenProgress);

    expect(comfort).toBeGreaterThan(0);
    expect(transition).toBe(0);
    expect(core).toBe(0);
  });

  it('each layer finishes revealing before the next one starts', () => {
    // Sampling the whole opening window, comfort should reach 1 before
    // transition leaves 0, and transition should reach 1 before core
    // leaves 0.
    const samples = Array.from({ length: 60 }, (_, i) => 0.33 + (i / 59) * (0.6 - 0.33));
    let comfortReachedOne = false;
    let transitionLeftZero = false;
    let transitionReachedOne = false;
    let coreLeftZero = false;

    for (const p of samples) {
      const comfort = getLayerRevealProgress('comfort', 'home', p);
      const transition = getLayerRevealProgress('transition', 'home', p);
      const core = getLayerRevealProgress('core', 'home', p);

      if (comfort >= 0.999) comfortReachedOne = true;
      if (transition > 0) transitionLeftZero = true;
      if (transition >= 0.999) transitionReachedOne = true;
      if (core > 0) coreLeftZero = true;

      if (transition > 0 && !comfortReachedOne) {
        throw new Error(`transition started (${transition}) before comfort finished at progress ${p}`);
      }
      if (core > 0 && !transitionReachedOne) {
        throw new Error(`core started (${core}) before transition finished at progress ${p}`);
      }
    }

    expect(comfortReachedOne).toBe(true);
    expect(transitionLeftZero).toBe(true);
    expect(coreLeftZero).toBe(true);
  });

  it('holds all non-cover layers fully open between 0.6 and 0.67', () => {
    expect(getLayerRevealProgress('comfort', 'home', 0.63)).toBeCloseTo(1, 2);
    expect(getLayerRevealProgress('transition', 'home', 0.63)).toBeCloseTo(1, 2);
    expect(getLayerRevealProgress('core', 'home', 0.63)).toBeCloseTo(1, 2);
  });

  it('closes in reverse order: core first, then transition, then comfort', () => {
    // Shortly after the hold ends, core should already be retreating while
    // comfort (closing last) is still fully open.
    const earlyClose = 0.7;
    const core = getLayerRevealProgress('core', 'home', earlyClose);
    const comfort = getLayerRevealProgress('comfort', 'home', earlyClose);

    expect(core).toBeLessThan(1);
    expect(comfort).toBeCloseTo(1, 2);
  });

  it('ends fully hidden again at progress 1', () => {
    expect(getLayerRevealProgress('comfort', 'home', 1)).toBeCloseTo(0, 2);
    expect(getLayerRevealProgress('transition', 'home', 1)).toBeCloseTo(0, 2);
    expect(getLayerRevealProgress('core', 'home', 1)).toBeCloseTo(0, 2);
  });
});
