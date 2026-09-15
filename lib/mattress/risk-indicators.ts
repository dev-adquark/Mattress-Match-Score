import type { Mattress, RiskSeverity } from "@/contracts/mattress-match";

export interface GenericRiskIndicator {
  code: string;
  label: string;
  severity: RiskSeverity;
}

/**
 * Profile-independent risk indicators derived purely from a mattress's own construction
 * attributes, for use anywhere a specific SleepProfile isn't available (e.g. the mattress
 * detail page's default view, before a shopper runs the interactive score demo). Personalized
 * risk flags always come from the scoring engine's rule set instead of this function.
 */
export function buildGenericRiskIndicators(mattress: Mattress): GenericRiskIndicator[] {
  const indicators: GenericRiskIndicator[] = [];

  if (mattress.heat.retainsHeat) {
    indicators.push({ code: "GENERIC_RETAINS_HEAT", label: "This construction tends to retain heat", severity: "medium" });
  }
  if (mattress.edgeSupport.edgeRating < 50) {
    indicators.push({ code: "GENERIC_WEAK_EDGE", label: "Below-average edge support", severity: "medium" });
  }
  if (mattress.durability.sagRiskRating >= 55) {
    indicators.push({ code: "GENERIC_SAG_RISK", label: "Elevated long-term sag risk", severity: "high" });
  }
  if (mattress.support.supportRating < 55) {
    indicators.push({ code: "GENERIC_LOW_SUPPORT", label: "Lower baseline support rating", severity: "medium" });
  }
  return indicators;
}
