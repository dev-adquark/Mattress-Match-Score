'use client';

import { useNarrativePreview } from '@/lib/three/narrative-store';
import { MattressLayerComponent } from './mattress-layer';
import { MattressLighting } from './mattress-lighting';
import { CoolingShimmerOverlay } from './cooling-shimmer-overlay';
import { SleepingCharacter } from '../character/sleeping-character';
import { useNarrativeGpuTier } from '@/lib/three/narrative-store';
import { shouldRenderLayerCallouts } from '@/lib/three/callout-budget';

interface MattressModelProps {
  routeContext: 'home' | 'quiz-results';
}

export function MattressModel({ routeContext }: MattressModelProps) {
  const { firmnessBias, highlightLayer, coolingShimmer } = useNarrativePreview();
  const { tier } = useNarrativeGpuTier();

  const calloutsEnabled = routeContext === 'home' && shouldRenderLayerCallouts(tier);

  const LAYER_DISPLAY_LABEL: Record<string, string> = {
    cover: 'Cooling Cover',
    comfort: 'Comfort Layer',
    transition: 'Transition Layer',
    core: 'Core Support',
  };

  return (
    <group position={[0, 0, 0]}>
      <MattressLayerComponent
        layer="core"
        highlighted={highlightLayer === 'core'}
        firmnessBias={firmnessBias}
        routeContext={routeContext}
        calloutsEnabled={calloutsEnabled}
        calloutLabel={LAYER_DISPLAY_LABEL.core}
      />
      <MattressLayerComponent
        layer="transition"
        highlighted={highlightLayer === 'transition'}
        firmnessBias={firmnessBias}
        routeContext={routeContext}
        calloutsEnabled={calloutsEnabled}
        calloutLabel={LAYER_DISPLAY_LABEL.transition}
      />
      <MattressLayerComponent
        layer="comfort"
        highlighted={highlightLayer === 'comfort'}
        firmnessBias={firmnessBias}
        routeContext={routeContext}
        calloutsEnabled={calloutsEnabled}
        calloutLabel={LAYER_DISPLAY_LABEL.comfort}
      />
      <MattressLayerComponent
        layer="cover"
        highlighted={highlightLayer === 'cover'}
        firmnessBias={firmnessBias}
        routeContext={routeContext}
        calloutsEnabled={calloutsEnabled}
        calloutLabel={LAYER_DISPLAY_LABEL.cover}
      />

      <SleepingCharacter routeContext={routeContext} />
      <CoolingShimmerOverlay enabled={coolingShimmer} />
      <MattressLighting />
    </group>
  );
}
