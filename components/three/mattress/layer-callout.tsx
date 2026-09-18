'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { MathUtils } from 'three';
import type { MattressLayer } from '@/lib/three/types';
import { computeLayerSeparation } from '@/lib/three/layer-expansion';
import { LAYER_HIGHLIGHT_CSS } from '@/lib/three/layer-highlight-colors';
import { useNarrativeProgress } from '@/lib/three/narrative-store';

interface LayerCalloutProps {
  layer: MattressLayer;
  label: string;
  routeContext: 'home' | 'quiz-results';
  localAnchorY: number;
}

export function LayerCallout({ layer, label, routeContext, localAnchorY }: LayerCalloutProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const opacityRef = useRef(0);
  const progress = useNarrativeProgress();

  useFrame((_, delta) => {
    const separation = computeLayerSeparation(routeContext, progress);
    const targetOpacity = MathUtils.clamp(separation, 0, 1);
    opacityRef.current = MathUtils.damp(opacityRef.current, targetOpacity, 3, delta);

    if (divRef.current) {
      divRef.current.style.opacity = opacityRef.current.toString();
    }
  });

  return (
    <Html
      position={[0, localAnchorY, 0]}
      center
      pointerEvents="auto"
      occlude={false}
      style={{ opacity: 0, transition: 'opacity 0.15s linear' }}
    >
      <div
        ref={divRef}
        className="pointer-events-auto select-none whitespace-nowrap"
        style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 10px',
          borderRadius: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: LAYER_HIGHLIGHT_CSS[layer],
            flexShrink: 0,
          }}
        />
        <span>{label}</span>
      </div>
    </Html>
  );
}
