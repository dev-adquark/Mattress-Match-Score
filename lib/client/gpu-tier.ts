import { getGPUTier } from 'detect-gpu';

export type GPUTier = 0 | 1 | 2 | 3;

interface GPUTierResult {
  tier: GPUTier;
  isMobile: boolean;
}

let memoized: GPUTierResult | null = null;

export async function getGpuTierOnce(): Promise<GPUTierResult> {
  if (memoized) return memoized;

  try {
    const result = await getGPUTier();
    const tier: GPUTier = Math.min(Math.max(0, result.tier || 1), 3) as GPUTier;
    const isMobile = result.isMobile ?? false;
    memoized = { tier, isMobile };
    return memoized;
  } catch {
    memoized = { tier: 0, isMobile: false };
    return memoized;
  }
}
