#!/usr/bin/env node
/**
 * Prints a deterministic scoring result for a demo sleep profile against a demo mattress,
 * using the real, production scoring engine (no separate/fake demo logic).
 *
 * Usage: node scripts/score-demo.js
 */
require("tsx/cjs");

const { scoreEngine, CURRENT_MODEL_VERSION } = require("../lib/scoring/engine.ts");
const { getMattressById } = require("../lib/repositories/mattress-repository.ts");

/** A heavier, hot-sleeping back sleeper sharing a bed matched against a soft, warm all-foam mattress. */
const demoProfile = {
  id: "demo-profile-001",
  sleepPositions: ["back"],
  weightBand: "230-280",
  heightBand: "5-9-to-6-2",
  firmnessPreference: "medium",
  budgetBand: "1200-1800",
  mattressTypes: ["foam"],
  temperaturePreference: "hot",
  motionSensitivity: "couple",
  comfortFocus: ["back-alignment"],
  surfaceFeel: "medium",
  isFullProfile: true,
  createdAt: "2026-09-15T00:00:00.000Z",
};

const demoMattressId = "cloudlayer-memory-foam";
const mattress = getMattressById(demoMattressId);

if (!mattress) {
  throw new Error(`Demo mattress "${demoMattressId}" not found in catalog`);
}

const result = scoreEngine(CURRENT_MODEL_VERSION, demoProfile, mattress);

if (result.riskFlags.length < 4) {
  throw new Error(
    `Demo scenario expected at least 4 risk flags, got ${result.riskFlags.length}. Check the scoring rules or demo inputs.`
  );
}

console.log(
  JSON.stringify(
    {
      modelVersion: result.modelVersion,
      profile: demoProfile,
      mattressId: mattress.id,
      overallScore: result.overallScore,
      matchTier: result.matchTier,
      subScores: result.subScores,
      riskFlags: result.riskFlags,
      matchReasons: result.matchReasons,
      trace: result.trace,
    },
    null,
    2
  )
);
