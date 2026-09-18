'use client';

import { useNarrativePreview } from '@/lib/three/narrative-store';
import { MattressLayerComponent } from './mattress-layer';
import { MattressLighting } from './mattress-lighting';
import { CoolingShimmerOverlay } from './cooling-shimmer-overlay';

interface MattressModelProps {
  routeContext: 'home' | 'quiz-results';
}

export function MattressModel({ routeContext }: MattressModelProps) {
  const { firmnessBias, highlightLayer, coolingShimmer } = useNarrativePreview();

  return (
    <group position={[0, 0, 0]}>
      <MattressLayerComponent layer="core" highlighted={highlightLayer === 'core'} firmnessBias={firmnessBias} routeContext={routeContext} />
      <MattressLayerComponent
        layer="transition"
        highlighted={highlightLayer === 'transition'}
        firmnessBias={firmnessBias}
        routeContext={routeContext}
      />
      <MattressLayerComponent
        layer="comfort"
        highlighted={highlightLayer === 'comfort'}
        firmnessBias={firmnessBias}
        routeContext={routeContext}
      />
      <MattressLayerComponent layer="cover" highlighted={highlightLayer === 'cover'} firmnessBias={firmnessBias} routeContext={routeContext} />

      <CoolingShimmerOverlay enabled={coolingShimmer} />
      <MattressLighting />
    </group>
  );
}
