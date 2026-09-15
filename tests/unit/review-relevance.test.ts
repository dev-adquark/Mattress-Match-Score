import { describe, expect, it } from "vitest";
import { scoreReviewHighlightsForProfile } from "@/lib/reviews/relevance";
import { getReviewHighlightsForMattress } from "@/lib/repositories/review-repository";
import type { SleepProfile } from "@/contracts/mattress-match";

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

describe("scoreReviewHighlightsForProfile", () => {
  it("prioritizes heat-related tags for a hot sleeper", () => {
    const highlights = getReviewHighlightsForMattress("nighthush-cooling-hybrid");
    const profile = makeProfile({ temperaturePreference: "hot" });
    const ranked = scoreReviewHighlightsForProfile(highlights, profile, highlights.length);
    const heatTags = ["sleepsHot", "sleepsCool"];
    const topTag = ranked[0].tag;
    expect(heatTags).toContain(topTag);
  });

  it("prioritizes motion/edge tags for a couple", () => {
    const highlights = getReviewHighlightsForMattress("grandestate-luxury-hybrid");
    const profile = makeProfile({ motionSensitivity: "couple" });
    const ranked = scoreReviewHighlightsForProfile(highlights, profile, highlights.length);
    const coupleTags = ["motionIsolationGood", "motionIsolationPoor", "greatEdgeSupport", "weakEdgeSupport"];
    expect(coupleTags).toContain(ranked[0].tag);
  });

  it("prioritizes pressure-relief tags for a side sleeper focused on pressure points", () => {
    const highlights = getReviewHighlightsForMattress("cloudlayer-memory-foam");
    const profile = makeProfile({ sleepPositions: ["side"], comfortFocus: ["pressure-points"] });
    const ranked = scoreReviewHighlightsForProfile(highlights, profile, highlights.length);
    const pressureTags = ["greatPressureRelief", "tooFirm", "tooSoft"];
    expect(pressureTags).toContain(ranked[0].tag);
  });

  it("respects the requested limit", () => {
    const highlights = getReviewHighlightsForMattress("grandestate-luxury-hybrid");
    const profile = makeProfile({});
    const ranked = scoreReviewHighlightsForProfile(highlights, profile, 2);
    expect(ranked.length).toBeLessThanOrEqual(2);
  });
});
