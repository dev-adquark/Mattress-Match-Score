"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraRig } from "./camera-rig";
import { MattressModel } from "./mattress/mattress-model";
import { ParticleField } from "./particles/particle-field";
import { PostFX } from "./postfx/effects";

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
        <color attach="background" args={["#050b16"]} />
        <fog attach="fog" args={["#050b16", 6, 16]} />
        <CameraRig routeContext={routeContext} />
        <ParticleField routeContext={routeContext} />
        <MattressModel routeContext={routeContext} />
      </Suspense>
      <PostFX />
    </Canvas>
  );
}
