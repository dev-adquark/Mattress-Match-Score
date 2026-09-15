import type { Mattress, PlacementMetadata, RecommendationResult, SleepProfile } from "@/contracts/mattress-match";
import { buildAffiliateLinksForMattress } from "@/lib/affiliate/links";
import { getReviewHighlightsForMattress } from "@/lib/repositories/review-repository";
import { scoreReviewHighlightsForProfile } from "@/lib/reviews/relevance";
import { scoreEngine, CURRENT_MODEL_VERSION } from "@/lib/scoring/engine";
import { getSponsoredPlacementsForScope, isPlacementStale } from "@/lib/sponsored/placements";

export interface BuildRecommendationsOptions {
  topic?: string;
}

/**
 * Combines the scoring engine, review-tag relevance mapping, affiliate link generation, and
 * sponsored placement resolution into the final RecommendationResult list consumed by the API
 * and every UI surface (results, comparison, mattress detail, comparison topics).
 *
 * Sponsored placement is resolved independently of algorithmic score: sponsorship never changes
 * a mattress's overallScore or its algorithmicRank, it only determines whether the card is
 * surfaced through the sponsored slot instead of (or in addition to informing) the algorithmic list.
 */
export function buildRecommendations(
  profile: SleepProfile,
  candidates: Mattress[],
  options: BuildRecommendationsOptions = {}
): RecommendationResult[] {
  const scored = candidates.map((mattress) => ({
    mattress,
    score: scoreEngine(CURRENT_MODEL_VERSION, profile, mattress),
  }));

  const byScoreDesc = [...scored].sort((a, b) => b.score.overallScore - a.score.overallScore);
  const algorithmicRankByMattressId = new Map(byScoreDesc.map((entry, index) => [entry.mattress.id, index + 1]));

  const applicablePlacements = getSponsoredPlacementsForScope(options.topic).filter((placement) =>
    candidates.some((c) => c.id === placement.mattressId)
  );
  const sponsoredMattressIds = new Set(applicablePlacements.map((p) => p.mattressId));

  function toResult(entry: (typeof scored)[number], placementOverride?: (typeof applicablePlacements)[number]): RecommendationResult {
    const { mattress, score } = entry;
    const algorithmicRank = algorithmicRankByMattressId.get(mattress.id) ?? scored.length;
    const reviewHighlights = scoreReviewHighlightsForProfile(getReviewHighlightsForMattress(mattress.id), profile);
    const affiliateLinks = buildAffiliateLinksForMattress(mattress);

    const placement: PlacementMetadata = placementOverride
      ? {
          type: "sponsored",
          algorithmicRank,
          algorithmicScore: score.overallScore,
          sponsored: {
            placementId: placementOverride.id,
            placementSlot: placementOverride.placementSlot,
            disclosureText: placementOverride.disclosureText,
            verificationStatus: placementOverride.verificationStatus,
            lastVerifiedAt: placementOverride.lastVerifiedAt,
            isStale: isPlacementStale(placementOverride),
          },
        }
      : {
          type: "algorithmic",
          algorithmicRank,
          algorithmicScore: score.overallScore,
        };

    return { mattress, score, reviewHighlights, affiliateLinks, placement };
  }

  const sponsoredResults = applicablePlacements
    .map((placement) => {
      const entry = scored.find((s) => s.mattress.id === placement.mattressId);
      return entry ? toResult(entry, placement) : undefined;
    })
    .filter((r): r is RecommendationResult => Boolean(r));

  const algorithmicResults = byScoreDesc
    .filter((entry) => !sponsoredMattressIds.has(entry.mattress.id))
    .map((entry) => toResult(entry));

  return [...sponsoredResults, ...algorithmicResults];
}
