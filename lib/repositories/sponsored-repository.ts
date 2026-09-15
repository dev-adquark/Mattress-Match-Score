import seedPlacements from "@/data/sponsored-placements.json";
import type { SponsoredPlacement, VerificationStatus } from "@/contracts/mattress-match";

/**
 * Module-level mutable store simulating a database table for the lifetime of this server
 * process. This is the "local/admin-less workflow" required for sponsored verification today;
 * a future iteration swaps this file's internals for a real database-backed repository without
 * changing any caller (API routes, UI) that depends on it.
 */
let store: SponsoredPlacement[] = JSON.parse(JSON.stringify(seedPlacements)) as SponsoredPlacement[];

export function listSponsoredPlacements(): SponsoredPlacement[] {
  return store;
}

export function findSponsoredPlacement(id: string): SponsoredPlacement | undefined {
  return store.find((p) => p.id === id);
}

export function updateSponsoredPlacementVerification(
  id: string,
  status: VerificationStatus,
  verifiedAt: string | null
): SponsoredPlacement | undefined {
  const placement = store.find((p) => p.id === id);
  if (!placement) return undefined;
  placement.verificationStatus = status;
  placement.lastVerifiedAt = verifiedAt;
  return placement;
}

export function resetSponsoredPlacementsForTests(): void {
  store = JSON.parse(JSON.stringify(seedPlacements)) as SponsoredPlacement[];
}
