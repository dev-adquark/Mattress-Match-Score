import { describe, expect, it } from "vitest";
import { CURRENT_MODEL_VERSION, scoreEngine } from "@/lib/scoring/engine";
import { getMattressById } from "@/lib/repositories/mattress-repository";
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

describe("scoreEngine", () => {
  it("is deterministic for identical inputs", () => {
    const profile = makeProfile({});
    const mattress = getMattressById("coastal-breeze-hybrid")!;
    const a = scoreEngine(CURRENT_MODEL_VERSION, profile, mattress);
    const b = scoreEngine(CURRENT_MODEL_VERSION, profile, mattress);
    expect(a).toEqual(b);
  });

  it("keeps every sub-score and overall score within 0-100", () => {
    const profile = makeProfile({ weightBand: "over-280", sleepPositions: ["back"] });
    const mattress = getMattressById("cloudlayer-memory-foam")!;
    const result = scoreEngine(CURRENT_MODEL_VERSION, profile, mattress);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    for (const value of Object.values(result.subScores)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
  });

  it("rejects an unsupported model version", () => {
    const profile = makeProfile({});
    const mattress = getMattressById("coastal-breeze-hybrid")!;
    expect(() => scoreEngine("v99.9", profile, mattress)).toThrow();
  });

  it("rewards firmer, well-supported mattresses for heavier back sleepers", () => {
    const profile = makeProfile({ sleepPositions: ["back"], weightBand: "230-280" });
    const firm = scoreEngine(CURRENT_MODEL_VERSION, profile, getMattressById("ironback-firm-support")!);
    const soft = scoreEngine(CURRENT_MODEL_VERSION, profile, getMattressById("cloudlayer-memory-foam")!);
    expect(firm.subScores.supportAlignment).toBeGreaterThan(soft.subScores.supportAlignment);
  });

  it("rewards high-airflow mattresses for hot sleepers on the cooling sub-score", () => {
    const profile = makeProfile({ temperaturePreference: "hot" });
    const cool = scoreEngine(CURRENT_MODEL_VERSION, profile, getMattressById("nighthush-cooling-hybrid")!);
    const warm = scoreEngine(CURRENT_MODEL_VERSION, profile, getMattressById("cloudlayer-memory-foam")!);
    expect(cool.subScores.coolingAirflow).toBeGreaterThan(warm.subScores.coolingAirflow);
  });

  it("rewards strong motion isolation and edge support for couples", () => {
    const profile = makeProfile({ motionSensitivity: "couple" });
    const goodForCouples = scoreEngine(CURRENT_MODEL_VERSION, profile, getMattressById("grandestate-luxury-hybrid")!);
    const poorForCouples = scoreEngine(CURRENT_MODEL_VERSION, profile, getMattressById("plushcloud-pillow-top")!);
    expect(goodForCouples.subScores.motionIsolation).toBeGreaterThan(poorForCouples.subScores.motionIsolation);
    expect(goodForCouples.subScores.edgeSupport).toBeGreaterThan(poorForCouples.subScores.edgeSupport);
  });

  it("penalizes durability for heavier sleepers on high sag-risk mattresses", () => {
    const heavy = makeProfile({ weightBand: "over-280" });
    const light = makeProfile({ weightBand: "under-130" });
    const mattress = getMattressById("valuerest-foam-basic")!;
    const heavyResult = scoreEngine(CURRENT_MODEL_VERSION, heavy, mattress);
    const lightResult = scoreEngine(CURRENT_MODEL_VERSION, light, mattress);
    expect(heavyResult.subScores.durability).toBeLessThan(lightResult.subScores.durability);
  });

  it("always returns the current model version and a populated trace for a matching rule", () => {
    const profile = makeProfile({ temperaturePreference: "hot" });
    const mattress = getMattressById("cloudlayer-memory-foam")!;
    const result = scoreEngine(CURRENT_MODEL_VERSION, profile, mattress);
    expect(result.modelVersion).toBe(CURRENT_MODEL_VERSION);
    expect(result.trace.categoryRulesUsed.length).toBeGreaterThan(0);
  });
});

describe("risk flags", () => {
  const heavyBackHotCouple = makeProfile({
    sleepPositions: ["back"],
    weightBand: "230-280",
    temperaturePreference: "hot",
    motionSensitivity: "couple",
  });
  const mattress = getMattressById("cloudlayer-memory-foam")!;
  const result = scoreEngine(CURRENT_MODEL_VERSION, heavyBackHotCouple, mattress);

  it("flags a support mismatch", () => {
    expect(result.riskFlags.some((r) => r.category === "support")).toBe(true);
  });

  it("flags heat retention likelihood", () => {
    expect(result.riskFlags.some((r) => r.category === "heat")).toBe(true);
  });

  it("flags edge support concerns", () => {
    expect(result.riskFlags.some((r) => r.category === "edge")).toBe(true);
  });

  it("flags sag/durability risk", () => {
    expect(result.riskFlags.some((r) => r.category === "durability")).toBe(true);
  });

  it("never fabricates a risk flag without a matching rule id present in the ruleset trace", () => {
    for (const flag of result.riskFlags) {
      expect(result.trace.riskRulesUsed.some((r) => r.ruleId === flag.ruleId)).toBe(true);
    }
  });

  it("produces no risk flags for a comfortably matched profile", () => {
    const easyProfile = makeProfile({
      sleepPositions: ["side"],
      weightBand: "130-180",
      temperaturePreference: "neutral",
      motionSensitivity: "single",
    });
    const easyMattress = getMattressById("grandestate-luxury-hybrid")!;
    const easyResult = scoreEngine(CURRENT_MODEL_VERSION, easyProfile, easyMattress);
    expect(easyResult.riskFlags).toHaveLength(0);
  });
});
