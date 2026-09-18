'use client';

import { Layers, ShieldCheck, Snowflake, WavesLadder } from 'lucide-react';
import { useNarrativePreview } from '@/lib/three/narrative-store';
import { MattressLayerComponent } from './mattress-layer';
import { MattressLighting } from './mattress-lighting';
import { CoolingShimmerOverlay } from './cooling-shimmer-overlay';
import { GlowRing } from './glow-ring';
import { SleepingCharacter } from '../character/sleeping-character';
import { useNarrativeGpuTier } from '@/lib/three/narrative-store';
import { shouldRenderLayerCallouts } from '@/lib/three/callout-budget';

interface MattressModelProps {
  routeContext: 'home' | 'quiz-results';
}

const LAYER_CALLOUT_CONTENT = {
  cover: { label: 'Cooling Cover', subtitle: 'Stay cool all night', icon: Snowflake },
  comfort: { label: 'Comfort Layer', subtitle: 'Perfect balance', icon: WavesLadder },
  transition: { label: 'Transition Layer', subtitle: 'Better support', icon: Layers },
  core: { label: 'Core Support', subtitle: 'Long lasting comfort', icon: ShieldCheck },
} as const;

export function MattressModel({ routeContext }: MattressModelProps) {
  const { firmnessBias, highlightLayer, coolingShimmer } = useNarrativePreview();
  const { tier, isMobile } = useNarrativeGpuTier();

  const calloutsEnabled = routeContext === 'home' && shouldRenderLayerCallouts(tier) && !isMobile;

  return (
    <group position={[0, 0, 0]}>
      <MattressLayerComponent
        layer="core"
        highlighted={highlightLayer === 'core'}
        firmnessBias={firmnessBias}
        routeContext={routeContext}
        calloutsEnabled={calloutsEnabled}
        calloutLabel={LAYER_CALLOUT_CONTENT.core.label}
        calloutSubtitle={LAYER_CALLOUT_CONTENT.core.subtitle}
        calloutIcon={LAYER_CALLOUT_CONTENT.core.icon}
        calloutSide="left"
      />
      <MattressLayerComponent
        layer="transition"
        highlighted={highlightLayer === 'transition'}
        firmnessBias={firmnessBias}
        routeContext={routeContext}
        calloutsEnabled={calloutsEnabled}
        calloutLabel={LAYER_CALLOUT_CONTENT.transition.label}
        calloutSubtitle={LAYER_CALLOUT_CONTENT.transition.subtitle}
        calloutIcon={LAYER_CALLOUT_CONTENT.transition.icon}
        calloutSide="right"
      />
      <MattressLayerComponent
        layer="comfort"
        highlighted={highlightLayer === 'comfort'}
        firmnessBias={firmnessBias}
        routeContext={routeContext}
        calloutsEnabled={calloutsEnabled}
        calloutLabel={LAYER_CALLOUT_CONTENT.comfort.label}
        calloutSubtitle={LAYER_CALLOUT_CONTENT.comfort.subtitle}
        calloutIcon={LAYER_CALLOUT_CONTENT.comfort.icon}
        calloutSide="left"
      />
      <MattressLayerComponent
        layer="cover"
        highlighted={highlightLayer === 'cover'}
        firmnessBias={firmnessBias}
        routeContext={routeContext}
        calloutsEnabled={calloutsEnabled}
        calloutLabel={LAYER_CALLOUT_CONTENT.cover.label}
        calloutSubtitle={LAYER_CALLOUT_CONTENT.cover.subtitle}
        calloutIcon={LAYER_CALLOUT_CONTENT.cover.icon}
        calloutSide="right"
      />

      <SleepingCharacter routeContext={routeContext} />
      <CoolingShimmerOverlay enabled={coolingShimmer} />
      {routeContext === 'home' && <GlowRing />}
      <MattressLighting />
    </group>
  );
}
