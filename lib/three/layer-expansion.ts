import { MathUtils } from 'three';
import type { MattressLayer } from './types';

export function computeLayerSeparation(routeContext: 'home' | 'quiz-results', progress: number): number {
  if (routeContext !== 'home') return 0;

  const p = MathUtils.clamp(progress, 0, 1);

  if (p < 0.33) return 0;
  if (p < 0.5) return MathUtils.smoothstep(p, 0.33, 0.5);
  if (p < 0.67) return 1;
  return 1 - MathUtils.smoothstep(p, 0.67, 1.0);
}

const MAX_SEPARATION_GAP = 0.35;

const LAYER_DIRECTION: Record<MattressLayer, number> = {
  cover: 1.5,
  comfort: 0.6,
  transition: -0.6,
  core: -1.5,
};

export function getLayerOffsetY(layer: MattressLayer, separation: number): number {
  return LAYER_DIRECTION[layer] * separation * MAX_SEPARATION_GAP;
}
