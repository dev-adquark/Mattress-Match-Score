'use client';

import { useNarrativePreview } from '@/lib/three/narrative-store';
import { MattressLayerComponent } from './mattress-layer';
import { MattressLighting } from './mattress-lighting';
import { CoolingShimmerOverlay } from './cooling-shimmer-overlay';

export function MattressModel() {
  const { firmnessBias, highlightLayer, coolingShimmer } = useNarrativePreview();

  return (
    <group position={[0, 0, 0]}>
      <MattressLayerComponent layer="core" highlighted={highlightLayer === 'core'} firmnessBias={firmnessBias} />
      <MattressLayerComponent
        layer="transition"
        highlighted={highlightLayer === 'transition'}
        firmnessBias={firmnessBias}
      />
      <MattressLayerComponent
        layer="comfort"
        highlighted={highlightLayer === 'comfort'}
        firmnessBias={firmnessBias}
      />
      <MattressLayerComponent layer="cover" highlighted={highlightLayer === 'cover'} firmnessBias={firmnessBias} />

      <CoolingShimmerOverlay enabled={coolingShimmer} />
      <MattressLighting />
    </group>
  );
}
