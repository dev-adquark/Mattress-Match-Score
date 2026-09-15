import { test, expect } from "@playwright/test";

const validProfile = {
  sleepPositions: ["side"],
  weightBand: "130-180",
  firmnessPreference: "medium",
  budgetBand: "1200-1800",
  temperaturePreference: "neutral",
  motionSensitivity: "single",
};

test.describe("API: /api/score", () => {
  test("returns ranked recommendations for a valid profile", async ({ request }) => {
    const response = await request.post("/api/score", { data: validProfile });
    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(body.modelVersion).toMatch(/^v\d/);
    expect(Array.isArray(body.recommendations)).toBe(true);
    expect(body.recommendations.length).toBeGreaterThanOrEqual(3);
    expect(body.recommendations[0].score).toHaveProperty("overallScore");
    expect(body.recommendations[0]).toHaveProperty("placement");
  });

  test("rejects an invalid profile with a structured error", async ({ request }) => {
    const response = await request.post("/api/score", { data: { sleepPositions: [] } });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  test("rejects a malformed JSON body", async ({ request }) => {
    const response = await request.post("/api/score", {
      headers: { "Content-Type": "application/json" },
      data: "not json {{{",
    });
    expect(response.status()).toBe(400);
  });
});

test.describe("API: /api/mattresses/:id", () => {
  test("returns full mattress detail for a known id", async ({ request }) => {
    const response = await request.get("/api/mattresses/coastal-breeze-hybrid");
    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(body.mattress.slug).toBe("coastal-breeze-hybrid");
    expect(Array.isArray(body.reviewHighlights)).toBe(true);
    expect(Array.isArray(body.affiliateLinks)).toBe(true);
  });

  test("returns 404 for an unknown id", async ({ request }) => {
    const response = await request.get("/api/mattresses/does-not-exist");
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.error.code).toBe("MATTRESS_NOT_FOUND");
  });
});

test.describe("API: /api/score-trace", () => {
  test("returns a populated trace for a profile generated via /api/score", async ({ request }) => {
    const scoreResponse = await request.post("/api/score", { data: validProfile });
    const profileId = scoreResponse.headers()["x-profile-id"];
    expect(profileId).toBeTruthy();

    const traceResponse = await request.get(`/api/score-trace?profileId=${profileId}`);
    expect(traceResponse.ok()).toBe(true);
    const body = await traceResponse.json();
    expect(body.modelVersion).toMatch(/^v\d/);
    expect(Array.isArray(body.trace.categoryRulesUsed)).toBe(true);
    expect(Array.isArray(body.trace.riskRulesUsed)).toBe(true);
  });

  test("returns an error for an unknown profileId", async ({ request }) => {
    const response = await request.get("/api/score-trace?profileId=does-not-exist");
    expect(response.status()).toBe(400);
  });

  test("returns a validation error when profileId is missing", async ({ request }) => {
    const response = await request.get("/api/score-trace");
    expect(response.status()).toBe(400);
  });
});

test.describe("API: /api/verify-sponsored", () => {
  test("updates verification status and timestamp", async ({ request }) => {
    // Uses the cooling-hybrid-for-couples placement, which no other spec file asserts a
    // specific verification status for, to avoid cross-test state coupling on the shared
    // in-memory sponsored-placement store.
    const response = await request.post("/api/verify-sponsored", {
      data: {
        placementId: "sponsored-cooling-hybrid-for-couples-001",
        verificationStatus: "verified",
        verifiedAt: "2026-09-10",
      },
    });
    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(body.placement.verificationStatus).toBe("verified");
    expect(body.placement.lastVerifiedAt).toBe("2026-09-10");
  });

  test("rejects an invalid verification status", async ({ request }) => {
    const response = await request.post("/api/verify-sponsored", {
      data: { placementId: "sponsored-global-001", verificationStatus: "not-a-status" },
    });
    expect(response.status()).toBe(400);
  });

  test("rejects an unknown placement id", async ({ request }) => {
    const response = await request.post("/api/verify-sponsored", {
      data: { placementId: "does-not-exist", verificationStatus: "verified" },
    });
    expect(response.status()).toBe(400);
  });
});
