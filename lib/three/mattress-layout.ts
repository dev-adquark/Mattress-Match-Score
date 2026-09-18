import type { MattressLayer } from './types';

export const MATTRESS_LAYER_LAYOUT: Record<MattressLayer, { y: number; height: number }> = {
  cover: { y: 1.45, height: 0.28 },
  comfort: { y: 1.12, height: 0.38 },
  transition: { y: 0.79, height: 0.28 },
  core: { y: 0.325, height: 0.65 },
};
