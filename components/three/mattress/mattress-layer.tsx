'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, type Group, type Mesh, MeshPhysicalMaterial } from 'three';
import { RoundedBox } from '@react-three/drei';
import type { LucideIcon } from 'lucide-react';
import type { MattressLayer } from '@/lib/three/types';
import { computeLayerSeparation, getLayerOffsetY } from '@/lib/three/layer-expansion';
import { LAYER_HIGHLIGHT_HEX } from '@/lib/three/layer-highlight-colors';
import { MATTRESS_LAYER_LAYOUT } from '@/lib/three/mattress-layout';
import { useNarrativeProgress } from '@/lib/three/narrative-store';
import { LayerCallout } from './layer-callout';

const layerConfig: Record<
  MattressLayer,
  { roughness: number; baseColor: string; radius: number; clearcoat: number; baseGlow: number }
> = {
  cover: { roughness: 0.75, baseColor: '#f2ede2', radius: 0.12, clearcoat: 0.04, baseGlow: 0 },
  comfort: { roughness: 0.35, baseColor: '#2dd9c8', radius: 0.13, clearcoat: 0.2, baseGlow: 0.22 },
  transition: { roughness: 0.5, baseColor: '#1f3a56', radius: 0.12, clearcoat: 0.1, baseGlow: 0 },
  core: { roughness: 0.7, baseColor: '#565f6b', radius: 0.15, clearcoat: 0.05, baseGlow: 0 },
};

interface MattressLayerProps {
  layer: MattressLayer;
  highlighted: boolean;
  firmnessBias: number;
  routeContext: 'home' | 'quiz-results';
  calloutsEnabled?: boolean;
  calloutLabel?: string;
  calloutSubtitle?: string;
  calloutIcon?: LucideIcon;
  calloutSide?: 'left' | 'right';
}

export function MattressLayerComponent({
  layer,
  highlighted,
  firmnessBias,
  routeContext,
  calloutsEnabled,
  calloutLabel,
  calloutSubtitle,
  calloutIcon,
  calloutSide,
}: MattressLayerProps) {
  const config = layerConfig[layer];
  const layoutConfig = MATTRESS_LAYER_LAYOUT[layer];
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const progress = useNarrativeProgress();

  const baseScale = useMemo(() => [2.2, 1, 1.6], []);

  const separationOffsetRef = useRef(0);
  const emissiveIntensityRef = useRef(0);

  useFrame((_, delta) => {
    const separation = computeLayerSeparation(routeContext, progress);
    const targetY = getLayerOffsetY(layer, separation);
    separationOffsetRef.current = MathUtils.damp(separationOffsetRef.current, targetY, 3, delta);
    if (groupRef.current) groupRef.current.position.y = separationOffsetRef.current;

    if (meshRef.current?.material instanceof MeshPhysicalMaterial) {
      const material = meshRef.current.material;
      const target = config.baseGlow + (highlighted ? 0.3 : 0);
      emissiveIntensityRef.current = MathUtils.damp(emissiveIntensityRef.current, target, 3, delta);
      material.emissiveIntensity = emissiveIntensityRef.current;
      material.emissive.setHex(LAYER_HIGHLIGHT_HEX[layer]);
    }
  });

  // Firmness affects comfort layer shape
  const yAdjustment = layer === 'comfort' ? firmnessBias * 0.1 : 0;
  const yScale =
    layer === 'comfort' ? 1 + MathUtils.clamp(-firmnessBias * 0.15, -0.2, 0) : 1;

  const calloutAnchorY = layoutConfig.y + (layoutConfig.height * yScale) / 2 + 0.15;

  return (
    <group ref={groupRef}>
      <RoundedBox
        ref={meshRef}
        args={[baseScale[0], layoutConfig.height * yScale, baseScale[2]]}
        radius={config.radius}
        smoothness={8}
        position={[0, layoutConfig.y + yAdjustment, 0]}
        scale={[1, 1, 1]}
      >
        <meshPhysicalMaterial
          color={config.baseColor}
          metalness={0}
          roughness={config.roughness}
          ior={1.4}
          clearcoat={config.clearcoat}
          clearcoatRoughness={0.4}
        />
      </RoundedBox>
      {calloutsEnabled && calloutLabel && (
        <LayerCallout
          layer={layer}
          label={calloutLabel}
          subtitle={calloutSubtitle}
          icon={calloutIcon}
          routeContext={routeContext}
          localAnchorY={calloutAnchorY}
          side={calloutSide ?? 'right'}
        />
      )}
    </group>
  );
}
