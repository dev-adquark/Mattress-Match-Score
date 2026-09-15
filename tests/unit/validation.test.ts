import { describe, expect, it } from "vitest";
import { sleepProfileInputSchema } from "@/lib/validation/sleep-profile";
import { verifySponsoredInputSchema } from "@/lib/validation/api";

describe("sleepProfileInputSchema", () => {
  const validInput = {
    sleepPositions: ["side"],
    weightBand: "130-180",
    firmnessPreference: "medium",
    budgetBand: "1200-1800",
    temperaturePreference: "neutral",
    motionSensitivity: "single",
  };

  it("accepts a minimal valid profile", () => {
    const result = sleepProfileInputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects an empty sleepPositions array", () => {
    const result = sleepProfileInputSchema.safeParse({ ...validInput, sleepPositions: [] });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid enum value", () => {
    const result = sleepProfileInputSchema.safeParse({ ...validInput, temperaturePreference: "lukewarm" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing required field", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { weightBand: _omit, ...rest } = validInput;
    const result = sleepProfileInputSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects a malformed payload entirely", () => {
    const result = sleepProfileInputSchema.safeParse("not an object");
    expect(result.success).toBe(false);
  });
});

describe("verifySponsoredInputSchema", () => {
  it("accepts a valid verification update", () => {
    const result = verifySponsoredInputSchema.safeParse({
      placementId: "sponsored-global-001",
      verificationStatus: "verified",
      verifiedAt: "2026-09-10",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a null verifiedAt", () => {
    const result = verifySponsoredInputSchema.safeParse({
      placementId: "sponsored-global-001",
      verificationStatus: "pending",
      verifiedAt: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid verificationStatus", () => {
    const result = verifySponsoredInputSchema.safeParse({
      placementId: "sponsored-global-001",
      verificationStatus: "totally-legit",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing placementId", () => {
    const result = verifySponsoredInputSchema.safeParse({
      verificationStatus: "verified",
    });
    expect(result.success).toBe(false);
  });
});
