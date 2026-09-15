import type { MatchTier } from "@/contracts/mattress-match";

export const TIER_LABELS: Record<MatchTier, string> = {
  excellent: "Excellent Match",
  great: "Great Match",
  good: "Good Match",
  fair: "Fair Match",
  weak: "Weak Match",
};

export const TIER_TEXT_CLASS: Record<MatchTier, string> = {
  excellent: "text-teal-700",
  great: "text-teal-700",
  good: "text-sky-700",
  fair: "text-amber-700",
  weak: "text-red-700",
};

export const TIER_BAR_CLASS: Record<MatchTier, string> = {
  excellent: "bg-teal-600",
  great: "bg-teal-600",
  good: "bg-sky-600",
  fair: "bg-amber-500",
  weak: "bg-red-500",
};
