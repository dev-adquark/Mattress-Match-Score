#!/usr/bin/env node
/**
 * Ingestion pipeline: transforms data/raw/mattresses.json and data/raw/reviews.json
 * into the normalized catalog and review-tag datasets the application consumes.
 *
 * Usage: node scripts/ingest-mattresses.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const RAW_MATTRESSES_PATH = path.join(ROOT, "data/raw/mattresses.json");
const RAW_REVIEWS_PATH = path.join(ROOT, "data/raw/reviews.json");
const OUT_CATALOG_PATH = path.join(ROOT, "data/mattress-catalog.json");
const OUT_REVIEW_TAGS_PATH = path.join(ROOT, "data/review-tags.json");

// Must stay in sync with the ReviewTag union in contracts/mattress-match.ts
const VALID_REVIEW_TAGS = new Set([
  "sleepsHot",
  "sleepsCool",
  "greatEdgeSupport",
  "weakEdgeSupport",
  "tooFirm",
  "tooSoft",
  "offGassing",
  "motionIsolationGood",
  "motionIsolationPoor",
  "sagsAfterTime",
  "greatPressureRelief",
  "goodBackSupport",
  "easySetup",
  "durableLongTerm",
  "responsiveBounce",
]);

const VALID_CONFIDENCE = new Set(["verified", "sourced", "seeded", "uncertain"]);
const VALID_TYPES = new Set(["foam", "hybrid", "innerspring"]);

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function slugify(value) {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function firmnessScaleToLabel(scale) {
  if (scale <= 2) return "soft";
  if (scale <= 4) return "medium-soft";
  if (scale <= 6) return "medium";
  if (scale <= 8) return "medium-firm";
  return "firm";
}

function priceToBudgetBand(price) {
  if (price < 800) return "under-800";
  if (price < 1200) return "800-1200";
  if (price < 1800) return "1200-1800";
  if (price < 2500) return "1800-2500";
  return "over-2500";
}

function materialsInclude(materials, keyword) {
  return materials.some((m) => m.toLowerCase().includes(keyword));
}

function computeBaselineScores(raw) {
  const foamBonus = materialsInclude(raw.materials, "foam") ? 5 : 0;
  const latexBonus = materialsInclude(raw.materials, "latex") ? 4 : 0;
  const pillowTopBonus = materialsInclude(raw.materials, "pillow top") ? 6 : 0;

  const pressureRelief = clamp(
    Math.round(60 + (6 - raw.firmnessScale) * 6 + foamBonus + latexBonus + pillowTopBonus),
    0,
    100
  );

  const supportAlignment = clamp(
    Math.round(raw.supportRating + (raw.zonedSupport ? 5 : 0) + (raw.firmSupportCore ? 5 : 0)),
    0,
    100
  );

  const coolingAirflow = clamp(
    Math.round(
      raw.airflowRating -
        (raw.retainsHeat ? 12 : 0) +
        Math.min(raw.coolingFeatures.length, 4) * 3
    ),
    0,
    100
  );

  const motionIsolation = clamp(Math.round(raw.motionIsolationRating), 0, 100);

  const edgeSupport = clamp(
    Math.round(raw.edgeRating + (raw.reinforcedPerimeter ? 8 : 0)),
    0,
    100
  );

  const bounceAdjustment = { low: -5, medium: 0, high: 5 }[raw.bounceLevel] ?? 0;
  const responsiveness = clamp(Math.round(raw.responsivenessRating + bounceAdjustment), 0, 100);

  const durability = clamp(
    Math.round(100 - raw.sagRiskRating * 0.7 + (raw.expectedLifespanYears - 5) * 3),
    0,
    100
  );

  return {
    pressureRelief,
    supportAlignment,
    coolingAirflow,
    motionIsolation,
    edgeSupport,
    responsiveness,
    durability,
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Ingestion validation failed: ${message}`);
  }
}

function ingestMattresses() {
  const raw = JSON.parse(fs.readFileSync(RAW_MATTRESSES_PATH, "utf-8"));
  assert(Array.isArray(raw) && raw.length >= 10, "expected at least 10 raw mattress records");

  const seenSlugs = new Set();
  const catalog = raw.map((m) => {
    assert(typeof m.id === "string" && m.id.length > 0, `mattress missing id`);
    assert(Array.isArray(m.types) && m.types.every((t) => VALID_TYPES.has(t)), `${m.id}: invalid types`);
    assert(m.firmnessScale >= 1 && m.firmnessScale <= 10, `${m.id}: firmnessScale out of range`);
    assert(m.basePrice > 0, `${m.id}: basePrice must be positive`);

    const slug = slugify(`${m.brand}-${m.model}`);
    assert(!seenSlugs.has(slug), `duplicate slug generated: ${slug}`);
    seenSlugs.add(slug);

    return {
      id: m.id,
      brand: m.brand,
      model: m.model,
      slug,
      types: m.types,
      heightInches: m.heightInches,
      materials: m.materials,
      trialNights: m.trialNights,
      warrantyYears: m.warrantyYears,
      firmnessScale: m.firmnessScale,
      firmnessLabel: firmnessScaleToLabel(m.firmnessScale),
      basePrice: m.basePrice,
      budgetBand: priceToBudgetBand(m.basePrice),
      support: {
        supportRating: m.supportRating,
        zonedSupport: m.zonedSupport,
        firmSupportCore: m.firmSupportCore,
      },
      heat: {
        airflowRating: m.airflowRating,
        coolingFeatures: m.coolingFeatures,
        retainsHeat: m.retainsHeat,
      },
      motion: {
        motionIsolationRating: m.motionIsolationRating,
        bounceLevel: m.bounceLevel,
      },
      edgeSupport: {
        edgeRating: m.edgeRating,
        reinforcedPerimeter: m.reinforcedPerimeter,
      },
      responsivenessRating: m.responsivenessRating,
      durability: {
        expectedLifespanYears: m.expectedLifespanYears,
        sagRiskRating: m.sagRiskRating,
      },
      baselineScores: computeBaselineScores(m),
      idealFor: m.idealFor,
      description: m.description,
      retailPartners: m.retailPartners,
      dataStatus: m.dataStatus,
      lastUpdatedAt: "2026-09-01",
    };
  });

  fs.writeFileSync(OUT_CATALOG_PATH, JSON.stringify(catalog, null, 2) + "\n", "utf-8");
  return catalog;
}

function ingestReviews(catalog) {
  const raw = JSON.parse(fs.readFileSync(RAW_REVIEWS_PATH, "utf-8"));
  assert(Array.isArray(raw) && raw.length > 0, "expected at least one raw review record");

  const catalogIds = new Set(catalog.map((m) => m.id));
  const perMattressCounter = new Map();

  const tagged = raw.map((r) => {
    assert(catalogIds.has(r.mattressId), `review references unknown mattressId: ${r.mattressId}`);
    assert(VALID_REVIEW_TAGS.has(r.tag), `review uses unrecognized tag: ${r.tag}`);
    assert(VALID_CONFIDENCE.has(r.confidence), `review uses unrecognized confidence: ${r.confidence}`);

    const n = (perMattressCounter.get(r.mattressId) || 0) + 1;
    perMattressCounter.set(r.mattressId, n);

    return {
      id: `${r.mattressId}-review-${String(n).padStart(3, "0")}`,
      mattressId: r.mattressId,
      tag: r.tag,
      snippet: r.snippet,
      source: r.source,
      confidence: r.confidence,
      helpfulVotes: r.helpfulVotes ?? 0,
      submittedAt: r.submittedAt,
    };
  });

  const mattressesWithoutReviews = [...catalogIds].filter(
    (id) => !tagged.some((t) => t.mattressId === id)
  );
  assert(
    mattressesWithoutReviews.length === 0,
    `every catalog mattress must have at least one review highlight, missing: ${mattressesWithoutReviews.join(", ")}`
  );

  fs.writeFileSync(OUT_REVIEW_TAGS_PATH, JSON.stringify(tagged, null, 2) + "\n", "utf-8");
  return tagged;
}

function main() {
  const catalog = ingestMattresses();
  const reviews = ingestReviews(catalog);
  console.log(
    `Ingested ${catalog.length} mattresses -> ${path.relative(ROOT, OUT_CATALOG_PATH)}`
  );
  console.log(
    `Ingested ${reviews.length} review highlights -> ${path.relative(ROOT, OUT_REVIEW_TAGS_PATH)}`
  );
}

main();
