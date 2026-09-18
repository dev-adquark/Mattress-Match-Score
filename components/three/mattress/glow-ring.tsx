'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, ShaderMaterial } from 'three';

const glowVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    vec2 centered = vUv - 0.5;
    float dist = length(centered) * 2.0;

    float ringOuter = smoothstep(0.78, 0.82, dist) - smoothstep(0.9, 0.98, dist);
    float ringInner = smoothstep(0.52, 0.56, dist) - smoothstep(0.6, 0.66, dist);
    float haze = (1.0 - smoothstep(0.0, 0.95, dist)) * 0.12;

    float pulse = 0.75 + 0.25 * sin(uTime * 1.4);
    float alpha = (ringOuter * 0.9 + ringInner * 0.55 + haze) * pulse;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

export function GlowRing({ radius = 1.7, y = -0.08 }: { radius?: number; y?: number }) {
  const shaderRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new Color('#22d3ee') },
    }),
    []
  );

  useFrame((_, delta) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[radius, radius, 1]}>
      <circleGeometry args={[1, 64]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={glowVertexShader}
        fragmentShader={glowFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={2}
      />
    </mesh>
  );
}
