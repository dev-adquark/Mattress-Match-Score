import seedPlacements from "@/data/sponsored-placements.json";
import type { SponsoredPlacement, VerificationStatus } from "@/contracts/mattress-match";

/**
 * Mutable store simulating a database table for the lifetime of this server process. This is
 * the "local/admin-less workflow" required for sponsored verification today; a future iteration
 * swaps this file's internals for a real database-backed repository without changing any caller
 * (API routes, UI) that depends on it.
 *
 * This is anchored on `globalThis` rather than a plain module-level variable: Next.js can compile
 * a route handler and a Server Component into separate bundles that each get their own copy of
 * an ES module, which would otherwise silently split this into two disconnected stores (writes
 * from the verify API would never be visible to the admin page's render). `globalThis` is the one
 * thing guaranteed to be shared by the whole Node process no matter how many times this module is
 * instantiated.
 */
const globalStore = globalThis as typeof globalThis & { __sponsoredPlacementsStore?: SponsoredPlacement[] };

function getStore(): SponsoredPlacement[] {
  if (!globalStore.__sponsoredPlacementsStore) {
    globalStore.__sponsoredPlacementsStore = JSON.parse(JSON.stringify(seedPlacements)) as SponsoredPlacement[];
  }
  return globalStore.__sponsoredPlacementsStore;
}

export function listSponsoredPlacements(): SponsoredPlacement[] {
  return getStore();
}

export function findSponsoredPlacement(id: string): SponsoredPlacement | undefined {
  return getStore().find((p) => p.id === id);
}

export function updateSponsoredPlacementVerification(
  id: string,
  status: VerificationStatus,
  verifiedAt: string | null
): SponsoredPlacement | undefined {
  const placement = getStore().find((p) => p.id === id);
  if (!placement) return undefined;
  placement.verificationStatus = status;
  placement.lastVerifiedAt = verifiedAt;
  return placement;
}

export function resetSponsoredPlacementsForTests(): void {
  globalStore.__sponsoredPlacementsStore = JSON.parse(JSON.stringify(seedPlacements)) as SponsoredPlacement[];
}
