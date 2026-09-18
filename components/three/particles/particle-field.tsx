'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, Float32BufferAttribute, ShaderMaterial, MathUtils, Points } from 'three';
import { useNarrativeGpuTier, useNarrativeProgress, useNarrativeActiveBeat } from '@/lib/three/narrative-store';
import { getParticleCount } from '@/lib/three/particle-budget';
import { createParticleAtlasTexture } from '@/lib/three/particle-atlas';
import { particleVertexShader, particleFragmentShader } from '@/lib/three/particle-shaders';
import { computeTargetPositions } from '@/lib/three/particle-targets';

export function ParticleField({ routeContext }: { routeContext: 'home' | 'quiz-results' }) {
  const { tier, isMobile } = useNarrativeGpuTier();
  const progress = useNarrativeProgress();
  const activeBeat = useNarrativeActiveBeat();

  const count = useMemo(() => getParticleCount(tier, isMobile), [tier, isMobile]);
  const geometry = useMemo(() => new BufferGeometry(), []);
  const pointsRef = useRef<Points>(null);

  const atlas = useMemo(() => createParticleAtlasTexture(), []);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3 + 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, [count]);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = 4 + Math.random() * 6;
    }
    return s;
  }, [count]);

  const atlasIndices = useMemo(() => {
    const indices = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      indices[i] = Math.floor(Math.random() * 4);
    }
    return indices;
  }, [count]);

  const alphas = useMemo(() => new Float32Array(count).fill(0.7), [count]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        uniforms: {
          map: { value: atlas },
        },
        transparent: true,
        depthWrite: false,
        blending: 2, // THREE.AdditiveBlending
      }),
    [atlas]
  );

  useFrame((_, delta) => {
    if (!pointsRef.current || !geometry.attributes.position) return;

    const t =
      routeContext === 'home' ? MathUtils.clamp(progress, 0, 1) : activeBeat === 5 ? 1 : 0;

    const targetPos = computeTargetPositions(routeContext, t, count);
    const posAttr = geometry.attributes.position as BufferGeometry['attributes']['position'];
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < count * 3; i++) {
      posArray[i] = MathUtils.lerp(posArray[i], targetPos[i], delta * 0.5);
    }
    posAttr.needsUpdate = true;
  });

  // Initialize geometry once
  useMemo(() => {
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('aSize', new Float32BufferAttribute(sizes, 1));
    geometry.setAttribute('aAtlasIndex', new Float32BufferAttribute(atlasIndices, 1));
    geometry.setAttribute('aAlpha', new Float32BufferAttribute(alphas, 1));
  }, [geometry, positions, sizes, atlasIndices, alphas]);

  if (count === 0) return null;

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
