'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, type Group, type Mesh, MeshPhysicalMaterial } from 'three';
import { RoundedBox } from '@react-three/drei';
import type { MattressLayer } from '@/lib/three/types';
import { computeLayerSeparation, getLayerOffsetY } from '@/lib/three/layer-expansion';
import { LAYER_HIGHLIGHT_HEX } from '@/lib/three/layer-highlight-colors';
import { MATTRESS_LAYER_LAYOUT } from '@/lib/three/mattress-layout';
import { useNarrativeProgress } from '@/lib/three/narrative-store';

const layerConfig: Record<MattressLayer, { roughness: number; baseColor: string }> = {
  cover: { roughness: 0.5, baseColor: '#e8e4e0' },
  comfort: { roughness: 0.4, baseColor: '#d4ccc5' },
  transition: { roughness: 0.35, baseColor: '#bfb5ad' },
  core: { roughness: 0.6, baseColor: '#a89892' },
};

interface MattressLayerProps {
  layer: MattressLayer;
  highlighted: boolean;
  firmnessBias: number;
  routeContext: 'home' | 'quiz-results';
}

export function MattressLayerComponent({ layer, highlighted, firmnessBias, routeContext }: MattressLayerProps) {
  const config = layerConfig[layer];
  const layoutConfig = MATTRESS_LAYER_LAYOUT[layer];
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const progress = useNarrativeProgress();

  const baseScale = useMemo(() => [1.8, 1, 1.8], []);

  const separationOffsetRef = useRef(0);
  const emissiveIntensityRef = useRef(0);

  useFrame((_, delta) => {
    const separation = computeLayerSeparation(routeContext, progress);
    const targetY = getLayerOffsetY(layer, separation);
    separationOffsetRef.current = MathUtils.damp(separationOffsetRef.current, targetY, 3, delta);
    if (groupRef.current) groupRef.current.position.y = separationOffsetRef.current;

    if (meshRef.current?.material instanceof MeshPhysicalMaterial) {
      const material = meshRef.current.material;
      const target = highlighted ? 0.3 : 0;
      emissiveIntensityRef.current = MathUtils.damp(emissiveIntensityRef.current, target, 3, delta);
      material.emissiveIntensity = emissiveIntensityRef.current;
      material.emissive.setHex(LAYER_HIGHLIGHT_HEX[layer]);
    }
  });

  // Firmness affects comfort layer shape
  const yAdjustment = layer === 'comfort' ? firmnessBias * 0.1 : 0;
  const yScale =
    layer === 'comfort' ? 1 + MathUtils.clamp(-firmnessBias * 0.15, -0.2, 0) : 1;

  return (
    <group ref={groupRef}>
      <RoundedBox
        ref={meshRef}
        args={[baseScale[0], layoutConfig.height * yScale, baseScale[2]]}
        radius={0.1}
        position={[0, layoutConfig.y + yAdjustment, 0]}
        scale={[1, 1, 1]}
      >
        <meshPhysicalMaterial
          color={config.baseColor}
          metalness={0.1}
          roughness={config.roughness}
          ior={1.5}
          clearcoat={0.1}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>
    </group>
  );
}
