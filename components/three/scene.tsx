"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraRig } from "./camera-rig";

export function Scene({ routeContext }: { routeContext: "home" | "quiz-results" }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
      }}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <CameraRig routeContext={routeContext} />
        {/* Phase B/C: particle field and mattress model will be added here */}
      </Suspense>
    </Canvas>
  );
}
