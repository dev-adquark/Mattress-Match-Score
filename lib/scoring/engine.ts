import type {
  BudgetBand,
  Mattress,
  MatchReason,
  MatchTier,
  RiskFlag,
  ScoreResult,
  SleepProfile,
  SubScores,
  TraceRuleApplication,
} from "@/contracts/mattress-match";
import { matchesRuleCondition } from "./conditions";
import { CategoryRule, RiskRule, getScoringRuleset, scoringRuleset } from "./rules";

export const CURRENT_MODEL_VERSION = scoringRuleset.modelVersion;

function clamp0to100(value: number): number {
  return Math.min(100, Math.max(0, value));
}

const CATEGORY_LABELS: Record<keyof SubScores, string> = {
  pressureRelief: "Pressure Relief",
  supportAlignment: "Support & Alignment",
  coolingAirflow: "Cooling & Airflow",
  motionIsolation: "Motion Isolation",
  edgeSupport: "Edge Support",
  responsiveness: "Responsiveness",
  durability: "Durability",
};

const BUDGET_ORDER: BudgetBand[] = ["under-800", "800-1200", "1200-1800", "1800-2500", "over-2500"];

function summarizeProfileForRule(rule: CategoryRule | RiskRule, profile: SleepProfile): string {
  const cond = rule.when.profile;
  if (!cond) return "Not profile-dependent";
  const parts: string[] = [];
  if (cond.sleepPositions) parts.push(`sleep position: ${profile.sleepPositions.join(", ")}`);
  if (cond.weightBands) parts.push(`weight band: ${profile.weightBand}`);
  if (cond.firmnessPreferences) parts.push(`firmness preference: ${profile.firmnessPreference}`);
  if (cond.temperaturePreferences) parts.push(`temperature preference: ${profile.temperaturePreference}`);
  if (cond.motionSensitivities) parts.push(`motion sensitivity: ${profile.motionSensitivity}`);
  if (cond.comfortFocus) parts.push(`comfort focus: ${(profile.comfortFocus ?? []).join(", ") || "none specified"}`);
  if (cond.mattressTypes) parts.push(`type preference: ${(profile.mattressTypes ?? []).join(", ") || "none specified"}`);
  if (cond.budgetBands) parts.push(`budget band: ${profile.budgetBand}`);
  if (cond.surfaceFeel) parts.push(`surface feel preference: ${profile.surfaceFeel ?? "unspecified"}`);
  return parts.join("; ") || "Not profile-dependent";
}

function summarizeMattressForRule(rule: CategoryRule | RiskRule, mattress: Mattress): string {
  const cond = rule.when.mattress;
  if (!cond) return "Not mattress-dependent";
  const parts: string[] = [];
  if (cond.types) parts.push(`type: ${mattress.types.join(", ")}`);
  if (cond.firmnessScaleMin !== undefined || cond.firmnessScaleMax !== undefined)
    parts.push(`firmness scale: ${mattress.firmnessScale}/10`);
  if (cond.airflowRatingMin !== undefined || cond.airflowRatingMax !== undefined)
    parts.push(`airflow rating: ${mattress.heat.airflowRating}/100`);
  if (cond.supportRatingMin !== undefined || cond.supportRatingMax !== undefined)
    parts.push(`support rating: ${mattress.support.supportRating}/100`);
  if (cond.edgeRatingMin !== undefined || cond.edgeRatingMax !== undefined)
    parts.push(`edge rating: ${mattress.edgeSupport.edgeRating}/100`);
  if (cond.motionIsolationRatingMin !== undefined || cond.motionIsolationRatingMax !== undefined)
    parts.push(`motion isolation rating: ${mattress.motion.motionIsolationRating}/100`);
  if (cond.sagRiskRatingMin !== undefined || cond.sagRiskRatingMax !== undefined)
    parts.push(`sag risk rating: ${mattress.durability.sagRiskRating}/100`);
  if (cond.responsivenessRatingMin !== undefined || cond.responsivenessRatingMax !== undefined)
    parts.push(`responsiveness rating: ${mattress.responsivenessRating}/100`);
  if (cond.retainsHeat !== undefined) parts.push(`retains heat: ${mattress.heat.retainsHeat ? "yes" : "no"}`);
  if (cond.reinforcedPerimeter !== undefined)
    parts.push(`reinforced perimeter: ${mattress.edgeSupport.reinforcedPerimeter ? "yes" : "no"}`);
  if (cond.zonedSupport !== undefined) parts.push(`zoned support: ${mattress.support.zonedSupport ? "yes" : "no"}`);
  if (cond.firmSupportCore !== undefined)
    parts.push(`firm support core: ${mattress.support.firmSupportCore ? "yes" : "no"}`);
  return parts.join("; ") || "Not mattress-dependent";
}

function tierFromScore(score: number, thresholds: ReturnType<typeof getScoringRuleset>["matchTierThresholds"]): MatchTier {
  if (score >= thresholds.excellent) return "excellent";
  if (score >= thresholds.great) return "great";
  if (score >= thresholds.good) return "good";
  if (score >= thresholds.fair) return "fair";
  return "weak";
}

function buildBudgetReason(profile: SleepProfile, mattress: Mattress): MatchReason {
  const profileIdx = BUDGET_ORDER.indexOf(profile.budgetBand);
  const mattressIdx = BUDGET_ORDER.indexOf(mattress.budgetBand);
  if (mattressIdx <= profileIdx) {
    return {
      code: "BUDGET_WITHIN_RANGE",
      label: "Budget",
      detail: "This mattress's price falls within or below your stated budget range.",
    };
  }
  return {
    code: "BUDGET_ABOVE_RANGE",
    label: "Budget",
    detail: "This mattress is priced above your stated budget range, but is included because of its overall fit.",
  };
}

function buildMatchReasons(
  categoryRulesUsed: TraceRuleApplication[],
  profile: SleepProfile,
  mattress: Mattress
): MatchReason[] {
  const positive = categoryRulesUsed
    .filter((r) => r.scoreImpact > 0)
    .sort((a, b) => b.scoreImpact - a.scoreImpact)
    .slice(0, 4);
  const reasons: MatchReason[] = positive.map((r) => ({
    code: r.ruleId,
    label: CATEGORY_LABELS[r.category as keyof SubScores] ?? r.category,
    detail: r.description,
  }));
  reasons.push(buildBudgetReason(profile, mattress));
  return reasons;
}

/**
 * Deterministic, versioned scoring engine.
 * v0.1: baseline sub-scores come from the normalized catalog (computed at ingestion time from
 * mattress construction attributes); this engine layers profile-conditioned rule deltas on top,
 * producing a fully auditable trace of every rule that fired.
 */
export function scoreEngine(version: string, profile: SleepProfile, mattress: Mattress): ScoreResult {
  const ruleset = getScoringRuleset(version);

  const subScores: SubScores = { ...mattress.baselineScores };
  const categoryRulesUsed: TraceRuleApplication[] = [];

  for (const rule of ruleset.categoryRules) {
    if (matchesRuleCondition(profile, mattress, rule.when)) {
      subScores[rule.category] = clamp0to100(subScores[rule.category] + rule.scoreImpact);
      categoryRulesUsed.push({
        ruleId: rule.id,
        category: rule.category,
        description: rule.description,
        scoreImpact: rule.scoreImpact,
        profileInput: summarizeProfileForRule(rule, profile),
        mattressAttribute: summarizeMattressForRule(rule, mattress),
      });
    }
  }

  const riskFlags: RiskFlag[] = [];
  const riskRulesUsed: TraceRuleApplication[] = [];

  for (const rule of ruleset.riskRules) {
    if (matchesRuleCondition(profile, mattress, rule.when)) {
      riskFlags.push({
        code: rule.id,
        label: rule.label,
        severity: rule.severity,
        category: rule.category,
        rationale: rule.rationale,
        mitigation: rule.mitigation,
        ruleId: rule.id,
      });
      riskRulesUsed.push({
        ruleId: rule.id,
        category: rule.category,
        description: rule.label,
        scoreImpact: 0,
        profileInput: summarizeProfileForRule(rule, profile),
        mattressAttribute: summarizeMattressForRule(rule, mattress),
      });
    }
  }

  const w = ruleset.weights;
  const overallScoreRaw =
    subScores.pressureRelief * w.pressureRelief +
    subScores.supportAlignment * w.supportAlignment +
    subScores.coolingAirflow * w.coolingAirflow +
    subScores.motionIsolation * w.motionIsolation +
    subScores.edgeSupport * w.edgeSupport +
    subScores.responsiveness * w.responsiveness +
    subScores.durability * w.durability;

  const overallScore = Math.round(clamp0to100(overallScoreRaw));
  const matchTier = tierFromScore(overallScore, ruleset.matchTierThresholds);
  const matchReasons = buildMatchReasons(categoryRulesUsed, profile, mattress);

  return {
    modelVersion: ruleset.modelVersion,
    overallScore,
    matchTier,
    subScores,
    riskFlags,
    trace: { categoryRulesUsed, riskRulesUsed },
    matchReasons,
  };
}
