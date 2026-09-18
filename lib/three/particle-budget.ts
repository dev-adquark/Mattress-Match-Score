import type { GPUTier } from './types';

export interface ParticleBudget {
  count: number;
}

export function getParticleCount(tier: GPUTier, isMobile: boolean): number {
  const budget: Record<GPUTier, { desktop: number; mobile: number }> = {
    0: { desktop: 0, mobile: 0 },
    1: { desktop: 1200, mobile: 500 },
    2: { desktop: 3000, mobile: 1200 },
    3: { desktop: 8000, mobile: 2500 },
  };

  const tierBudget = budget[tier];
  return isMobile ? tierBudget.mobile : tierBudget.desktop;
}
