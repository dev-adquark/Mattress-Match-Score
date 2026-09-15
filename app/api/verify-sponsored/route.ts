import { NextRequest, NextResponse } from "next/server";
import { findSponsoredPlacement, updateSponsoredPlacementVerification } from "@/lib/repositories/sponsored-repository";
import { isPlacementStale } from "@/lib/sponsored/placements";
import { verifySponsoredInputSchema } from "@/lib/validation/api";
import { apiError } from "@/lib/validation/api";

/**
 * Local, admin-less verification workflow: updates a sponsored placement's verification
 * status and last-verified timestamp. A production deployment would gate this behind
 * authenticated admin access; this route validates its input strictly in the meantime so it
 * cannot be used to fabricate an arbitrary verified state.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("VALIDATION_ERROR", "Request body must be valid JSON.");
  }

  const parsed = verifySponsoredInputSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "The verification update payload is invalid.", parsed.error.flatten());
  }

  const { placementId, verificationStatus, verifiedAt } = parsed.data;

  const existing = findSponsoredPlacement(placementId);
  if (!existing) {
    return apiError("VALIDATION_ERROR", `No sponsored placement found with id "${placementId}".`);
  }

  let resolvedVerifiedAt: string | null;
  if (verificationStatus === "verified") {
    resolvedVerifiedAt = verifiedAt ?? new Date().toISOString().slice(0, 10);
  } else if (verificationStatus === "expired") {
    resolvedVerifiedAt = verifiedAt ?? existing.lastVerifiedAt;
  } else {
    resolvedVerifiedAt = null;
  }

  const updated = updateSponsoredPlacementVerification(placementId, verificationStatus, resolvedVerifiedAt)!;

  return NextResponse.json({
    placement: updated,
    isStale: isPlacementStale(updated),
  });
}
