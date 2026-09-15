import { NextRequest, NextResponse } from "next/server";
import { getMattressById } from "@/lib/repositories/mattress-repository";
import { getReviewHighlightsForMattress } from "@/lib/repositories/review-repository";
import { buildAffiliateLinksForMattress } from "@/lib/affiliate/links";
import { listSponsoredPlacements } from "@/lib/repositories/sponsored-repository";
import { isPlacementStale } from "@/lib/sponsored/placements";
import { apiError } from "@/lib/validation/api";
import { buildGenericRiskIndicators } from "@/lib/mattress/risk-indicators";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  if (!id || typeof id !== "string") {
    return apiError("VALIDATION_ERROR", "A mattress id is required.");
  }

  const mattress = getMattressById(id);
  if (!mattress) {
    return apiError("MATTRESS_NOT_FOUND", `No mattress found with id "${id}".`);
  }

  const reviewHighlights = getReviewHighlightsForMattress(mattress.id);
  const affiliateLinks = buildAffiliateLinksForMattress(mattress);
  const sponsoredPlacements = listSponsoredPlacements()
    .filter((p) => p.mattressId === mattress.id)
    .map((p) => ({ ...p, isStale: isPlacementStale(p) }));

  return NextResponse.json({
    mattress,
    reviewHighlights,
    riskIndicators: buildGenericRiskIndicators(mattress),
    affiliateLinks,
    sponsoredPlacements,
  });
}
