'use client';

import { useEffect, useState } from 'react';
import type { MatchTier } from "@/contracts/mattress-match";
import { TIER_LABELS, TIER_TEXT_CLASS } from "@/lib/scoring/tier-display";
import { prefersReducedMotion } from "@/lib/client/reduced-motion";
import { getGsap } from "@/lib/client/gsap";

interface ScoreDisplayProps {
  score: number;
  tier: MatchTier;
  size?: "lg" | "md";
  cinematic?: boolean;
}

export function ScoreDisplay({ score, tier, size = "lg", cinematic = false }: ScoreDisplayProps) {
  const [display, setDisplay] = useState(score);

  useEffect(() => {
    if (!cinematic || prefersReducedMotion()) {
      setDisplay(score);
      return;
    }

    const gsap = getGsap();
    const obj = { value: 0 };
    gsap.to(obj, {
      value: score,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => setDisplay(Math.round(obj.value)),
    });
  }, [cinematic, score]);

  return (
    <div>
      <p className={size === "lg" ? "text-5xl font-bold" : "text-3xl font-bold"} data-testid="overall-score">
        <span className={TIER_TEXT_CLASS[tier]}>{display}</span>
      </p>
      <p className={`font-semibold ${TIER_TEXT_CLASS[tier]} ${size === "lg" ? "text-sm" : "text-xs"}`}>
        {TIER_LABELS[tier]}
      </p>
    </div>
  );
}
