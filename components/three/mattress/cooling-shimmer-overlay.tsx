'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, ShaderMaterial } from 'three';

const shimmerVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const shimmerFragmentShader = `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    float wave = sin(vUv.x * 6.0 - uTime * 2.0) * 0.5 + 0.5;
    float fresnel = 1.0 - abs(dot(normalize(vec3(0, 1, 0)), normalize(vec3(0, 1, 0.5))));
    fresnel = pow(fresnel, 2.0);

    vec3 color = mix(vec3(0.7, 0.95, 1.0), vec3(0.5, 0.9, 1.0), wave);
    float alpha = fresnel * wave * uOpacity;

    gl_FragColor = vec4(color, alpha);
  }
`;

export function CoolingShimmerOverlay({ enabled }: { enabled: boolean }) {
  const shaderRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: enabled ? 0.4 : 0 },
    }),
    [enabled]
  );

  useFrame((_, delta) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value += delta;
      shaderRef.current.uniforms.uOpacity.value = MathUtils.damp(
        shaderRef.current.uniforms.uOpacity.value,
        enabled ? 0.4 : 0,
        3,
        delta
      );
    }
  });

  return (
    <mesh position={[0, 0.5, 0]} scale={[1.8, 0.05, 1.8]}>
      <boxGeometry args={[1, 1, 1]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={shimmerVertexShader}
        fragmentShader={shimmerFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
