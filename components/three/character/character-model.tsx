'use client';

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { MathUtils, type Group, type PointLight } from 'three';
import { CHARACTER_MODEL_URL, CHARACTER_CLIP_NAMES, getClipNameForSleepPosition } from '@/lib/three/character-asset';
import { MATTRESS_LAYER_LAYOUT } from '@/lib/three/mattress-layout';
import { computeLayerSeparation, getLayerOffsetY } from '@/lib/three/layer-expansion';
import { LAYER_HIGHLIGHT_HEX } from '@/lib/three/layer-highlight-colors';
import { useNarrativeProgress, useNarrativePreview } from '@/lib/three/narrative-store';

interface CharacterModelProps {
  routeContext: 'home' | 'quiz-results';
}

export function CharacterModel({ routeContext }: CharacterModelProps) {
  const { scene } = useGLTF(CHARACTER_MODEL_URL);
  const { animations } = useGLTF(CHARACTER_MODEL_URL);
  const { actions } = useAnimations(animations, useRef(null));

  const groupRef = useRef<Group>(null);
  const glowLightRef = useRef<PointLight>(null);
  const previousActionName = useRef<string>(CHARACTER_CLIP_NAMES.idle);
  const glowIntensityRef = useRef(0);

  // The static mesh's rest pose is a standing figure (~1.9 units tall along Y).
  // CHARACTER_SCALE shrinks it to fit the mattress footprint once rotated flat;
  // CHARACTER_REST_HALF_HEIGHT is the model's half-thickness after rotating onto
  // its side, used so its lowest point rests exactly on the mattress surface.
  const CHARACTER_SCALE = 0.72;
  const CHARACTER_SINK = 0.22;
  const CHARACTER_REST_HALF_HEIGHT = 0.482 * CHARACTER_SCALE - CHARACTER_SINK;

  const restY =
    MATTRESS_LAYER_LAYOUT.cover.y + MATTRESS_LAYER_LAYOUT.cover.height / 2 + CHARACTER_REST_HALF_HEIGHT;
  const seatYRef = useRef(restY);

  const progress = useNarrativeProgress();
  const { sleepPosition, highlightLayer, coolingShimmer } = useNarrativePreview();

  const clipName = getClipNameForSleepPosition(sleepPosition);

  // Clip switching
  useEffect(() => {
    const targetName = actions[clipName] ? clipName : CHARACTER_CLIP_NAMES.idle;
    const nextAction = actions[targetName];

    if (!nextAction || previousActionName.current === targetName) return;

    const prevAction = actions[previousActionName.current];
    if (prevAction) prevAction.fadeOut(0.6);
    nextAction.reset().fadeIn(0.6).play();
    previousActionName.current = targetName;
  }, [clipName, actions]);

  // Seat tracking and glow animation
  useFrame((_, delta) => {
    const separation = computeLayerSeparation(routeContext, progress);
    const coverOffsetY = getLayerOffsetY('cover', separation);
    const targetSeatY = restY + coverOffsetY;

    seatYRef.current = MathUtils.damp(seatYRef.current, targetSeatY, 3, delta);
    if (groupRef.current) groupRef.current.position.y = seatYRef.current;

    // Glow light
    if (glowLightRef.current) {
      const glowHex = highlightLayer ? LAYER_HIGHLIGHT_HEX[highlightLayer] : coolingShimmer ? 0x38bdf8 : null;
      const targetIntensity = glowHex !== null ? 0.6 : 0;

      glowIntensityRef.current = MathUtils.damp(glowIntensityRef.current, targetIntensity, 3, delta);
      glowLightRef.current.intensity = glowIntensityRef.current;

      if (glowHex !== null) {
        glowLightRef.current.color.setHex(glowHex);
      }
    }
  });

  return (
    <group ref={groupRef} position={[0.15, 0, -0.05]}>
      <group rotation={[0, 0, Math.PI / 2]} scale={CHARACTER_SCALE}>
        <primitive object={scene} />
      </group>
      <pointLight ref={glowLightRef} position={[0, 0.4, 0.3]} distance={3} decay={2} />
    </group>
  );
}
