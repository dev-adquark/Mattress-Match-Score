"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

export function Scene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
      }}
      frameloop="demand"
    >
      <Suspense fallback={null}>
        {/* Placeholder: scene content will be added in next phase */}
        <mesh position={[0, 0, 0]} />
      </Suspense>
    </Canvas>
  );
}
