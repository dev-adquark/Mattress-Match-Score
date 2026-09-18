import type { GPUTier } from './types';

export function shouldRenderLayerCallouts(tier: GPUTier): boolean {
  return tier >= 1;
}
