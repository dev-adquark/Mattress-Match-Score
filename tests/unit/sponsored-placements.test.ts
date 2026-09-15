import { beforeEach, describe, expect, it } from "vitest";
import { isPlacementStale, getSponsoredPlacementsForScope } from "@/lib/sponsored/placements";
import {
  listSponsoredPlacements,
  resetSponsoredPlacementsForTests,
  updateSponsoredPlacementVerification,
} from "@/lib/repositories/sponsored-repository";
import { buildRecommendations } from "@/lib/recommendations/build-recommendations";
import { getAllMattresses } from "@/lib/repositories/mattress-repository";
import type { SleepProfile } from "@/contracts/mattress-match";

beforeEach(() => {
  resetSponsoredPlacementsForTests();
});

function makeProfile(overrides: Partial<SleepProfile>): SleepProfile {
  return {
    id: "test-profile",
    sleepPositions: ["side"],
    weightBand: "130-180",
    firmnessPreference: "medium",
    budgetBand: "1200-1800",
    temperaturePreference: "neutral",
    motionSensitivity: "single",
    isFullProfile: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("sponsored placement staleness", () => {
  it("treats a pending placement as stale regardless of date", () => {
    const [placement] = listSponsoredPlacements().filter((p) => p.verificationStatus === "pending");
    expect(isPlacementStale(placement)).toBe(true);
  });

  it("treats an expired placement as stale", () => {
    const [placement] = listSponsoredPlacements().filter((p) => p.verificationStatus === "expired");
    expect(isPlacementStale(placement)).toBe(true);
  });

  it("treats a recently verified placement as fresh", () => {
    const [placement] = listSponsoredPlacements().filter((p) => p.verificationStatus === "verified");
    const recentDate = new Date(placement.lastVerifiedAt as string);
    expect(isPlacementStale(placement, new Date(recentDate.getTime() + 1000 * 60 * 60 * 24 * 5))).toBe(false);
  });

  it("treats a verified placement as stale once it ages past the freshness window", () => {
    const [placement] = listSponsoredPlacements().filter((p) => p.verificationStatus === "verified");
    const recentDate = new Date(placement.lastVerifiedAt as string);
    expect(isPlacementStale(placement, new Date(recentDate.getTime() + 1000 * 60 * 60 * 24 * 200))).toBe(true);
  });

  it("never reports a placement with no verification date as verified/fresh", () => {
    const [placement] = listSponsoredPlacements();
    const updated = updateSponsoredPlacementVerification(placement.id, "verified", null)!;
    expect(isPlacementStale(updated)).toBe(true);
  });
});

describe("verification workflow", () => {
  it("updates status and timestamp together", () => {
    const [placement] = listSponsoredPlacements();
    const updated = updateSponsoredPlacementVerification(placement.id, "verified", "2026-09-10")!;
    expect(updated.verificationStatus).toBe("verified");
    expect(updated.lastVerifiedAt).toBe("2026-09-10");
  });

  it("returns undefined for an unknown placement id rather than throwing or fabricating", () => {
    const updated = updateSponsoredPlacementVerification("does-not-exist", "verified", "2026-09-10");
    expect(updated).toBeUndefined();
  });
});

describe("placement separation from algorithmic ranking", () => {
  it("never lets sponsorship change a mattress's algorithmic score", () => {
    const profile = makeProfile({});
    const candidates = getAllMattresses();
    const results = buildRecommendations(profile, candidates, { topic: "cooling-hybrid-for-couples" });
    const sponsoredEntry = results.find((r) => r.placement.type === "sponsored");
    expect(sponsoredEntry).toBeDefined();
    expect(sponsoredEntry!.placement.algorithmicScore).toBe(sponsoredEntry!.score.overallScore);
  });

  it("never double-labels a mattress as both sponsored and algorithmic", () => {
    const profile = makeProfile({});
    const candidates = getAllMattresses();
    const results = buildRecommendations(profile, candidates, { topic: "cooling-hybrid-for-couples" });
    const ids = results.map((r) => r.mattress.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const r of results) {
      expect(["algorithmic", "sponsored"]).toContain(r.placement.type);
    }
  });

  it("only surfaces topic-scoped placements for their own topic", () => {
    const placements = getSponsoredPlacementsForScope("best-for-side-sleepers-under-1000");
    expect(placements.every((p) => p.scope.type === "global" || p.scope.topic === "best-for-side-sleepers-under-1000")).toBe(
      true
    );
  });
});
