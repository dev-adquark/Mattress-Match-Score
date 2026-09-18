'use client';

import { ContactShadows } from '@react-three/drei';

export function MattressLighting() {
  return (
    <>
      <directionalLight
        name="key"
        position={[4, 5, 3]}
        intensity={1.4}
        color="#dff4ff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        name="rim"
        position={[-6, 3, -3]}
        intensity={2.2}
        color="#22d3ee"
      />
      <pointLight
        name="glow-fill"
        position={[0, 1.6, 2.5]}
        intensity={6}
        distance={9}
        decay={2}
        color="#38bdf8"
      />
      <pointLight
        name="warm-accent"
        position={[-3.5, 2.4, -2.5]}
        intensity={3.5}
        distance={8}
        decay={2}
        color="#ffb870"
      />
      <hemisphereLight
        name="ambient"
        args={['#0e3a4a', '#020508', 0.6]}
      />
      <ContactShadows
        position={[0, -0.55, 0]}
        scale={12}
        blur={2.4}
        far={2}
        opacity={0.85}
        color="#000814"
      />
    </>
  );
}
