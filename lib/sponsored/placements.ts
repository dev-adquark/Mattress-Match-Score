import type { SponsoredPlacement } from "@/contracts/mattress-match";
import { appConfig } from "@/lib/config";
import { listSponsoredPlacements } from "@/lib/repositories/sponsored-repository";

/**
 * A placement is stale if it has never been verified, is in a non-verified state
 * (pending/expired), or was last verified longer ago than the configured freshness window.
 * Stale placements must never be silently presented to the user as currently verified.
 */
export function isPlacementStale(placement: SponsoredPlacement, now: Date = new Date()): boolean {
  if (placement.verificationStatus !== "verified") return true;
  if (!placement.lastVerifiedAt) return true;
  const ageInDays = (now.getTime() - new Date(placement.lastVerifiedAt).getTime()) / (1000 * 60 * 60 * 24);
  return ageInDays > appConfig.sponsored.staleAfterDays;
}

export function getGlobalSponsoredPlacements(): SponsoredPlacement[] {
  return listSponsoredPlacements().filter((p) => p.scope.type === "global");
}

export function getSponsoredPlacementsForTopic(topic: string): SponsoredPlacement[] {
  return listSponsoredPlacements().filter((p) => p.scope.type === "topic" && p.scope.topic === topic);
}

/** Sponsored placements applicable to a given request: global placements plus any topic-scoped ones. */
export function getSponsoredPlacementsForScope(topic?: string): SponsoredPlacement[] {
  const global = getGlobalSponsoredPlacements();
  const topical = topic ? getSponsoredPlacementsForTopic(topic) : [];
  return [...topical, ...global].sort((a, b) => a.placementSlot - b.placementSlot);
}
