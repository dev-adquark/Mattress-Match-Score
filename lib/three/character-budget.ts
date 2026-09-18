import type { GPUTier } from './types';

export function shouldRenderCharacter(tier: GPUTier): boolean {
  return tier >= 1;
}
