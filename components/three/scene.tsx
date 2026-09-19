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
      // The scene is purely decorative (scroll-driven camera, no raycasting or
      // click interaction with any 3D object), and it sits in a fixed,
      // full-viewport wrapper behind the real page content. @react-three/fiber's
      // <Canvas> sets pointer-events: auto on its own root div by default,
      // which overrides the wrapper's pointer-events: none and silently
      // swallows clicks on any button/link the canvas visually overlaps.
      // Overriding it here restores click-through to the actual UI.
      style={{ pointerEvents: "none" }}
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
