import type { MattressLayer } from './types';

export const MATTRESS_LAYER_LAYOUT: Record<MattressLayer, { y: number; height: number }> = {
  cover: { y: 1.85, height: 0.15 },
  comfort: { y: 1.55, height: 0.6 },
  transition: { y: 0.95, height: 0.4 },
  core: { y: 0.2, height: 1.1 },
};
