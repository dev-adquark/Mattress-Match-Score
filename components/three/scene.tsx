"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraRig } from "./camera-rig";
import { MattressModel } from "./mattress/mattress-model";
import { ParticleField } from "./particles/particle-field";

export function Scene({ routeContext }: { routeContext: "home" | "quiz-results" }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        toneMapping: 0,
      }}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#fafaf8"]} />
        <CameraRig routeContext={routeContext} />
        <ParticleField routeContext={routeContext} />
        <MattressModel />
        {/* Phase D: postprocessing will be added here */}
      </Suspense>
    </Canvas>
  );
}
