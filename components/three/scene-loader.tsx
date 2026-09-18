"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { narrativeStore } from "@/lib/three/narrative-store";
import { prefersReducedMotion } from "@/lib/client/reduced-motion";
import { isWebGLAvailable } from "@/lib/client/webgl-support";
import { getGpuTierOnce } from "@/lib/client/gpu-tier";

const DynamicScene = dynamic(() => import("./scene").then((m) => ({ default: m.Scene })), {
  ssr: false,
});

export function SceneLoader() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    queueMicrotask(async () => {
      // Check reduced-motion first (no async cost)
      if (prefersReducedMotion()) {
        setShouldRender(false);
        return;
      }

      // Check WebGL availability
      if (!isWebGLAvailable()) {
        setShouldRender(false);
        return;
      }

      // Get GPU tier (async, but memoized)
      const { tier, isMobile } = await getGpuTierOnce();

      // Set GPU tier in store
      narrativeStore.getState().setGpuTier(tier, isMobile);

      // Don't render canvas on tier 0 (blocklisted)
      if (tier === 0) {
        setShouldRender(false);
        return;
      }

      setShouldRender(true);
    });
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
      <DynamicScene />
    </div>
  );
}
