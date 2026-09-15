import rulesData from "@/data/scoring-rules.json";
import type { RiskCategory, RiskSeverity, SubScores } from "@/contracts/mattress-match";
import type { RuleCondition } from "./conditions";

export interface CategoryRule {
  id: string;
  category: keyof SubScores;
  description: string;
  when: RuleCondition;
  scoreImpact: number;
}

export interface RiskRule {
  id: string;
  category: RiskCategory;
  label: string;
  severity: RiskSeverity;
  when: RuleCondition;
  rationale: string;
  mitigation: string;
}

export interface ScoringRuleset {
  modelVersion: string;
  weights: SubScores;
  matchTierThresholds: {
    excellent: number;
    great: number;
    good: number;
    fair: number;
  };
  categoryRules: CategoryRule[];
  riskRules: RiskRule[];
}

export const scoringRuleset = rulesData as ScoringRuleset;

export function getScoringRuleset(version: string): ScoringRuleset {
  if (version !== scoringRuleset.modelVersion) {
    throw new Error(`Unsupported scoring model version: ${version}`);
  }
  return scoringRuleset;
}
