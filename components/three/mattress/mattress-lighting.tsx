'use client';

import { ContactShadows } from '@react-three/drei';

export function MattressLighting() {
  return (
    <>
      <directionalLight
        name="key"
        position={[4, 5, 3]}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        name="rim"
        position={[-6, 4, -2]}
        intensity={1.2}
        color="#a8d8ff"
      />
      <hemisphereLight
        name="ambient"
        args={['#fff9f0', '#4a4a4a', 0.8]}
      />
      <ContactShadows
        position={[0, -0.55, 0]}
        scale={12}
        blur={2}
        far={2}
        opacity={0.5}
      />
    </>
  );
}
