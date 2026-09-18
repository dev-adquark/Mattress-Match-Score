'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CatmullRomCurve3, MathUtils, Vector3 } from 'three';
import { useNarrativeProgress, useNarrativeActiveBeat } from '@/lib/three/narrative-store';
import { homeKeyframes, quizResultsKeyframes } from './camera-keyframes';

const DAMP_LAMBDA = 4;

export function CameraRig({ routeContext }: { routeContext: 'home' | 'quiz-results' }) {
  const { camera } = useThree();
  const progress = useNarrativeProgress();
  const activeBeat = useNarrativeActiveBeat();

  const keyframes = routeContext === 'home' ? homeKeyframes : quizResultsKeyframes;
  const posCurve = useMemo(
    () => new CatmullRomCurve3(keyframes.map((k) => k.position.clone())),
    [keyframes]
  );
  const lookCurve = useMemo(
    () => new CatmullRomCurve3(keyframes.map((k) => k.lookAt.clone())),
    [keyframes]
  );

  const dampedLookAt = useRef(new Vector3().copy(keyframes[0].lookAt));
  const targetPos = useRef(new Vector3());
  const targetLook = useRef(new Vector3());

  useFrame((_, delta) => {
    const t =
      routeContext === 'home' ? MathUtils.clamp(progress, 0, 1) : activeBeat === 5 ? 1 : 0;

    posCurve.getPointAt(t, targetPos.current);
    lookCurve.getPointAt(t, targetLook.current);

    camera.position.x = MathUtils.damp(camera.position.x, targetPos.current.x, DAMP_LAMBDA, delta);
    camera.position.y = MathUtils.damp(camera.position.y, targetPos.current.y, DAMP_LAMBDA, delta);
    camera.position.z = MathUtils.damp(camera.position.z, targetPos.current.z, DAMP_LAMBDA, delta);

    dampedLookAt.current.x = MathUtils.damp(
      dampedLookAt.current.x,
      targetLook.current.x,
      DAMP_LAMBDA,
      delta
    );
    dampedLookAt.current.y = MathUtils.damp(
      dampedLookAt.current.y,
      targetLook.current.y,
      DAMP_LAMBDA,
      delta
    );
    dampedLookAt.current.z = MathUtils.damp(
      dampedLookAt.current.z,
      targetLook.current.z,
      DAMP_LAMBDA,
      delta
    );
    camera.lookAt(dampedLookAt.current);
  });

  return null;
}
