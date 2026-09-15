import type { ReviewHighlight, ReviewTag, ScoredReviewHighlight, SleepProfile } from "@/contracts/mattress-match";

/**
 * Maps a shopper's sleep profile onto the review tags that matter most to them.
 * Reused by the recommendation engine, mattress detail pages, and comparison pages so
 * review prioritization stays consistent everywhere it appears.
 */
export function computeReviewTagWeights(profile: SleepProfile): Partial<Record<ReviewTag, number>> {
  const weights: Partial<Record<ReviewTag, number>> = {};
  const bump = (tag: ReviewTag, amount: number) => {
    weights[tag] = (weights[tag] ?? 0) + amount;
  };

  if (profile.temperaturePreference === "hot") {
    bump("sleepsCool", 60);
    bump("sleepsHot", 55);
  }
  if (profile.temperaturePreference === "cold") {
    bump("sleepsHot", 20);
  }

  const pressureFocused =
    profile.sleepPositions.includes("side") ||
    (profile.comfortFocus ?? []).some((c) => ["pressure-points", "hip-relief", "shoulder-relief"].includes(c));
  if (pressureFocused) {
    bump("greatPressureRelief", 55);
    bump("tooFirm", 45);
    bump("tooSoft", 30);
  }

  const coupleFocused = profile.motionSensitivity === "couple" || profile.motionSensitivity === "high-sensitivity";
  if (coupleFocused) {
    bump("motionIsolationGood", 55);
    bump("motionIsolationPoor", 50);
    bump("greatEdgeSupport", 45);
    bump("weakEdgeSupport", 40);
    bump("responsiveBounce", 15);
  }

  const backFocused =
    profile.sleepPositions.includes("back") ||
    profile.sleepPositions.includes("stomach") ||
    (profile.comfortFocus ?? []).includes("back-alignment");
  if (backFocused) {
    bump("goodBackSupport", 55);
    bump("tooFirm", 20);
  }

  return weights;
}

const BASELINE_RELEVANCE = 10;

export function scoreReviewHighlightsForProfile(
  highlights: ReviewHighlight[],
  profile: SleepProfile,
  limit = 4
): ScoredReviewHighlight[] {
  const weights = computeReviewTagWeights(profile);
  return highlights
    .map((h) => ({
      ...h,
      relevanceScore: (weights[h.tag] ?? BASELINE_RELEVANCE) + (h.helpfulVotes ?? 0) * 0.2,
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
}
