import type { MatchTier } from "@/contracts/mattress-match";
import { TIER_LABELS, TIER_TEXT_CLASS } from "@/lib/scoring/tier-display";

export function ScoreDisplay({ score, tier, size = "lg" }: { score: number; tier: MatchTier; size?: "lg" | "md" }) {
  return (
    <div>
      <p className={size === "lg" ? "text-5xl font-bold" : "text-3xl font-bold"} data-testid="overall-score">
        <span className={TIER_TEXT_CLASS[tier]}>{score}</span>
      </p>
      <p className={`font-semibold ${TIER_TEXT_CLASS[tier]} ${size === "lg" ? "text-sm" : "text-xs"}`}>
        {TIER_LABELS[tier]}
      </p>
    </div>
  );
}
