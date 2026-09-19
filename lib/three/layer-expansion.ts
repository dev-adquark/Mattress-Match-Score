import { MathUtils } from 'three';
import type { MattressLayer } from './types';

const HOME_REST_SEPARATION = 0;

export function computeLayerSeparation(routeContext: 'home' | 'quiz-results', progress: number): number {
  if (routeContext !== 'home') return 0;

  const p = MathUtils.clamp(progress, 0, 1);

  if (p < 0.33) return HOME_REST_SEPARATION;
  if (p < 0.5) return MathUtils.lerp(HOME_REST_SEPARATION, 1, MathUtils.smoothstep(p, 0.33, 0.5));
  if (p < 0.67) return 1;
  return MathUtils.lerp(1, HOME_REST_SEPARATION, MathUtils.smoothstep(p, 0.67, 1.0));
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

// Only the cover layer is visible at rest, standing in for "one assembled
// mattress". The remaining layers reveal one at a time, top to bottom
// (comfort, then transition, then core), each fully finishing its own
// grow-and-separate motion before the next one starts, within the same
// 0.33-0.67 scroll window that used to open every layer at once. They
// close again in the reverse order (core first, then transition, then
// comfort) as progress continues past 0.67, so the mattress reassembles
// the same way it came apart.
const STAGGER_LAYERS: MattressLayer[] = ['comfort', 'transition', 'core'];
const STAGGER_OPEN_START = 0.33;
const STAGGER_OPEN_END = 0.6; // opening finishes before the 0.6-0.67 hold
const STAGGER_HOLD_END = 0.67;
const STAGGER_CLOSE_END = 1.0;

function stageWindow(index: number, count: number, start: number, end: number): [number, number] {
  const span = (end - start) / count;
  return [start + span * index, start + span * (index + 1)];
}

/**
 * Returns this layer's own 0-1 reveal fraction: 0 means fully hidden
 * (collapsed flat, at its resting/closed position), 1 means fully grown and
 * separated into the open stacked view. The cover layer is always 1 (it's
 * the one layer visible from the start). Layers other than the cover only
 * stagger like this on the home route's cinematic scroll; elsewhere they're
 * always fully assembled and visible.
 */
export function getLayerRevealProgress(
  layer: MattressLayer,
  routeContext: 'home' | 'quiz-results',
  progress: number
): number {
  if (layer === 'cover') return 1;
  if (routeContext !== 'home') return 1;

  const p = MathUtils.clamp(progress, 0, 1);
  const index = STAGGER_LAYERS.indexOf(layer);

  const [openStart, openEnd] = stageWindow(index, STAGGER_LAYERS.length, STAGGER_OPEN_START, STAGGER_OPEN_END);
  if (p < openStart) return 0;
  if (p < openEnd) return MathUtils.smoothstep(p, openStart, openEnd);
  if (p < STAGGER_HOLD_END) return 1;

  const reverseIndex = STAGGER_LAYERS.length - 1 - index;
  const [closeStart, closeEnd] = stageWindow(reverseIndex, STAGGER_LAYERS.length, STAGGER_HOLD_END, STAGGER_CLOSE_END);
  if (p < closeStart) return 1;
  if (p < closeEnd) return 1 - MathUtils.smoothstep(p, closeStart, closeEnd);
  return 0;
}
