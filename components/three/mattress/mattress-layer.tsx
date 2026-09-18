'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, type Mesh, MeshPhysicalMaterial } from 'three';
import { RoundedBox } from '@react-three/drei';
import type { MattressLayer } from '@/lib/three/types';

const layerConfig: Record<MattressLayer, { y: number; height: number; roughness: number; baseColor: string }> = {
  cover: { y: 1.85, height: 0.15, roughness: 0.5, baseColor: '#e8e4e0' },
  comfort: { y: 1.55, height: 0.6, roughness: 0.4, baseColor: '#d4ccc5' },
  transition: { y: 0.95, height: 0.4, roughness: 0.35, baseColor: '#bfb5ad' },
  core: { y: 0.2, height: 1.1, roughness: 0.6, baseColor: '#a89892' },
};

interface MattressLayerProps {
  layer: MattressLayer;
  highlighted: boolean;
  firmnessBias: number;
}

export function MattressLayerComponent({ layer, highlighted, firmnessBias }: MattressLayerProps) {
  const config = layerConfig[layer];
  const meshRef = useRef<Mesh>(null);

  const baseScale = useMemo(() => [1.8, 1, 1.8], []);

  useFrame((_, delta) => {
    if (!meshRef.current || !(meshRef.current.material instanceof MeshPhysicalMaterial)) return;
    const material = meshRef.current.material;

    // Highlight: damp emissive intensity
    const targetEmissive = highlighted ? 0.3 : 0;
    const currentEmissive = (material.emissive?.getHex() || 0) > 0 ? 0.3 : 0;
    const nextEmissive = MathUtils.damp(currentEmissive, targetEmissive, 3, delta);
    if (nextEmissive > 0.01 || currentEmissive > 0.01) {
      material.emissiveIntensity = nextEmissive;
      material.emissive?.setHex(highlighted ? 0x0f766e : 0x000000);
    }
  });

  // Firmness affects comfort layer shape
  const yAdjustment = layer === 'comfort' ? firmnessBias * 0.1 : 0;
  const yScale =
    layer === 'comfort' ? 1 + MathUtils.clamp(-firmnessBias * 0.15, -0.2, 0) : 1;

  return (
    <RoundedBox
      ref={meshRef}
      args={[baseScale[0], config.height * yScale, baseScale[2]]}
      radius={0.1}
      position={[0, config.y + yAdjustment, 0]}
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
  );
}
