import type { GPUTier } from './types';

export interface PostprocessingBudget {
  enableBloom: boolean;
  enableVignette: boolean;
}

export function shouldEnablePostprocessing(tier: GPUTier): PostprocessingBudget {
  const enabled = tier >= 2;
  return {
    enableBloom: enabled,
    enableVignette: enabled,
  };
}
