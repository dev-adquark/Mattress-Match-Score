'use client';

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useNarrativeGpuTier } from '@/lib/three/narrative-store';
import { shouldEnablePostprocessing } from '@/lib/three/postprocessing-budget';

export function PostFX() {
  const { tier } = useNarrativeGpuTier();
  const { enableBloom, enableVignette } = shouldEnablePostprocessing(tier);

  if (!enableBloom && !enableVignette) return null;

  return (
    <EffectComposer multisampling={0}>
      {enableBloom && (
        <Bloom intensity={0.6} luminanceThreshold={0.4} luminanceSmoothing={0.2} mipmapBlur />
      )}
      {enableVignette && <Vignette eskil={false} offset={0.3} darkness={0.6} />}
    </EffectComposer>
  );
}
