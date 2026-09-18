'use client';

import { Suspense, useEffect, useState } from 'react';
import { useNarrativeGpuTier } from '@/lib/three/narrative-store';
import { shouldRenderCharacter } from '@/lib/three/character-budget';
import { checkCharacterAssetAvailable } from '@/lib/three/character-asset';
import { CharacterErrorBoundary } from './character-error-boundary';
import { CharacterModel } from './character-model';

interface SleepingCharacterProps {
  routeContext: 'home' | 'quiz-results';
}

export function SleepingCharacter({ routeContext }: SleepingCharacterProps) {
  const { tier } = useNarrativeGpuTier();
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (!shouldRenderCharacter(tier)) return;

    let mounted = true;
    checkCharacterAssetAvailable().then((ok) => {
      if (mounted) setAvailable(ok);
    });

    return () => {
      mounted = false;
    };
  }, [tier]);

  if (!shouldRenderCharacter(tier) || !available) return null;

  return (
    <CharacterErrorBoundary>
      <Suspense fallback={null}>
        <CharacterModel routeContext={routeContext} />
      </Suspense>
    </CharacterErrorBoundary>
  );
}
