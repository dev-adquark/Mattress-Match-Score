'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { MathUtils } from 'three';
import type { LucideIcon } from 'lucide-react';
import type { MattressLayer } from '@/lib/three/types';
import { computeLayerSeparation } from '@/lib/three/layer-expansion';
import { LAYER_HIGHLIGHT_CSS } from '@/lib/three/layer-highlight-colors';
import { useNarrativeProgress } from '@/lib/three/narrative-store';

interface LayerCalloutProps {
  layer: MattressLayer;
  label: string;
  subtitle?: string;
  icon?: LucideIcon;
  routeContext: 'home' | 'quiz-results';
  localAnchorY: number;
  side: 'left' | 'right';
}

const CALLOUT_X_OFFSET = 0.85;
const LEADER_LINE_WIDTH = 64;

export function LayerCallout({ layer, label, subtitle, icon: Icon, routeContext, localAnchorY, side }: LayerCalloutProps) {
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

  const isLeft = side === 'left';
  const accent = LAYER_HIGHLIGHT_CSS[layer];

  return (
    <Html
      position={[isLeft ? -CALLOUT_X_OFFSET : CALLOUT_X_OFFSET, localAnchorY, 0]}
      pointerEvents="auto"
      occlude={false}
      style={{
        transform: `translate(${isLeft ? '-100%' : '0'}, -50%)`,
      }}
    >
      <div
        ref={divRef}
        className="pointer-events-auto select-none whitespace-nowrap"
        style={{
          display: 'flex',
          flexDirection: isLeft ? 'row-reverse' : 'row',
          alignItems: 'center',
          opacity: 0,
          transition: 'opacity 0.15s linear',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: `${LEADER_LINE_WIDTH}px`,
            height: '1px',
            background: `linear-gradient(${isLeft ? 'to left' : 'to right'}, ${accent}, transparent)`,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '50%',
              [isLeft ? 'right' : 'left']: '-3px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: accent,
              boxShadow: `0 0 8px ${accent}`,
              transform: 'translateY(-50%)',
            }}
          />
        </div>
        <div
          style={{
            fontSize: '12px',
            color: '#e6fbff',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 14px',
            borderRadius: '999px',
            backgroundColor: 'rgba(6, 20, 33, 0.78)',
            border: `1px solid ${accent}66`,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 0 16px ${accent}33`,
          }}
        >
          {Icon && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                flexShrink: 0,
                border: `1px solid ${accent}88`,
                color: accent,
              }}
            >
              <Icon size={13} strokeWidth={2.25} />
            </span>
          )}
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
            <span style={{ fontWeight: 600 }}>{label}</span>
            {subtitle && (
              <span style={{ fontSize: '10.5px', fontWeight: 400, color: '#9fb8c4' }}>{subtitle}</span>
            )}
          </span>
        </div>
      </div>
    </Html>
  );
}
