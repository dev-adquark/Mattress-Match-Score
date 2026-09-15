/**
 * Core type contracts for Mattress Match Score.
 * These are the single source of truth for the SleepProfile -> scoring engine -> API -> UI pipeline.
 * Do not fork or duplicate these shapes elsewhere.
 */

// ---------- Sleep profile enums ----------

export type SleepPosition = "side" | "back" | "stomach" | "combination";

export type WeightBand =
  | "under-130"
  | "130-180"
  | "180-230"
  | "230-280"
  | "over-280";

export type HeightBand = "under-5-4" | "5-4-to-5-9" | "5-9-to-6-2" | "over-6-2";

export type BmiRange = "under-18-5" | "18-5-to-25" | "25-to-30" | "over-30";

export type FirmnessPreference =
  | "soft"
  | "medium-soft"
  | "medium"
  | "medium-firm"
  | "firm";

export type BudgetBand =
  | "under-800"
  | "800-1200"
  | "1200-1800"
  | "1800-2500"
  | "over-2500";

export type MattressType = "foam" | "hybrid" | "innerspring";

export type TemperaturePreference = "hot" | "neutral" | "cold";

export type MotionSensitivity = "single" | "couple" | "high-sensitivity";

export type ComfortFocus =
  | "pressure-points"
  | "back-alignment"
  | "hip-relief"
  | "shoulder-relief"
  | "general-comfort";

export type SurfaceFeel = "soft" | "medium" | "firm";

/** Structured, versionable representation of a shopper's sleep needs. */
export interface SleepProfile {
  id: string;
  sleepPositions: SleepPosition[];
  weightBand: WeightBand;
  heightBand?: HeightBand;
  bmiRange?: BmiRange;
  firmnessPreference: FirmnessPreference;
  budgetBand: BudgetBand;
  mattressTypes?: MattressType[];
  temperaturePreference: TemperaturePreference;
  motionSensitivity: MotionSensitivity;
  comfortFocus?: ComfortFocus[];
  surfaceFeel?: SurfaceFeel;
  isFullProfile: boolean;
  createdAt: string;
}

// ---------- Mattress catalog ----------

export interface RetailPartner {
  partnerId: string;
  retailerName: string;
  baseUrl: string;
  campaignSlug: string;
}

export interface SupportProfile {
  supportRating: number; // 0-100
  zonedSupport: boolean;
  firmSupportCore: boolean;
}

export interface HeatProfile {
  airflowRating: number; // 0-100, higher = cooler
  coolingFeatures: string[];
  retainsHeat: boolean;
}

export interface MotionProfile {
  motionIsolationRating: number; // 0-100
  bounceLevel: "low" | "medium" | "high";
}

export interface EdgeSupportProfile {
  edgeRating: number; // 0-100
  reinforcedPerimeter: boolean;
}

export interface DurabilityProfile {
  expectedLifespanYears: number;
  sagRiskRating: number; // 0-100, higher = greater sag risk
}

export interface Mattress {
  id: string;
  brand: string;
  model: string;
  slug: string;
  types: MattressType[];
  heightInches: number;
  materials: string[];
  trialNights: number;
  warrantyYears: number;
  firmnessScale: number; // 1 (soft) - 10 (firm)
  firmnessLabel: FirmnessPreference;
  basePrice: number;
  budgetBand: BudgetBand;
  support: SupportProfile;
  heat: HeatProfile;
  motion: MotionProfile;
  edgeSupport: EdgeSupportProfile;
  responsivenessRating: number; // 0-100
  durability: DurabilityProfile;
  /** Construction-derived baseline sub-scores computed at ingestion time, before any profile-specific rule deltas. */
  baselineScores: SubScores;
  idealFor: string[];
  description: string;
  retailPartners: RetailPartner[];
  dataStatus: "seeded" | "verified" | "sourced";
  lastUpdatedAt: string;
}

// ---------- Scoring ----------

export interface SubScores {
  pressureRelief: number;
  supportAlignment: number;
  coolingAirflow: number;
  motionIsolation: number;
  edgeSupport: number;
  responsiveness: number;
  durability: number;
}

export type RiskSeverity = "low" | "medium" | "high";

export type RiskCategory = "support" | "heat" | "edge" | "durability";

export interface RiskFlag {
  code: string;
  label: string;
  severity: RiskSeverity;
  category: RiskCategory;
  rationale: string;
  mitigation: string;
  ruleId: string;
}

export interface TraceRuleApplication {
  ruleId: string;
  category: string;
  description: string;
  scoreImpact: number;
  profileInput: string;
  mattressAttribute: string;
}

export interface ScoreTrace {
  categoryRulesUsed: TraceRuleApplication[];
  riskRulesUsed: TraceRuleApplication[];
}

export interface MatchReason {
  code: string;
  label: string;
  detail: string;
}

export type MatchTier = "excellent" | "great" | "good" | "fair" | "weak";

export interface ScoreResult {
  modelVersion: string;
  overallScore: number;
  matchTier: MatchTier;
  subScores: SubScores;
  riskFlags: RiskFlag[];
  trace: ScoreTrace;
  matchReasons: MatchReason[];
}

// ---------- Review tags ----------

export type ReviewTag =
  | "sleepsHot"
  | "sleepsCool"
  | "greatEdgeSupport"
  | "weakEdgeSupport"
  | "tooFirm"
  | "tooSoft"
  | "offGassing"
  | "motionIsolationGood"
  | "motionIsolationPoor"
  | "sagsAfterTime"
  | "greatPressureRelief"
  | "goodBackSupport"
  | "easySetup"
  | "durableLongTerm"
  | "responsiveBounce";

export type DataConfidence = "verified" | "sourced" | "seeded" | "uncertain";

export interface ReviewHighlight {
  id: string;
  mattressId: string;
  tag: ReviewTag;
  snippet: string;
  source: string;
  confidence: DataConfidence;
  helpfulVotes?: number;
  submittedAt: string;
}

export interface ScoredReviewHighlight extends ReviewHighlight {
  relevanceScore: number;
}

// ---------- Sponsored placement ----------

export type VerificationStatus = "verified" | "pending" | "expired";

export interface SponsoredPlacement {
  id: string;
  mattressId: string;
  isSponsored: true;
  placementSlot: number;
  disclosureText: string;
  verificationStatus: VerificationStatus;
  lastVerifiedAt: string | null;
  scope: { type: "global" } | { type: "topic"; topic: string };
}

export interface PlacementMetadata {
  type: "algorithmic" | "sponsored";
  algorithmicRank: number;
  algorithmicScore: number;
  sponsored?: {
    placementId: string;
    placementSlot: number;
    disclosureText: string;
    verificationStatus: VerificationStatus;
    lastVerifiedAt: string | null;
    isStale: boolean;
  };
}

// ---------- Affiliate ----------

export interface AffiliateLink {
  retailerName: string;
  partnerId: string;
  url: string;
}

// ---------- Recommendation (top-level API/UI contract) ----------

export interface RecommendationResult {
  mattress: Mattress;
  score: ScoreResult;
  reviewHighlights: ScoredReviewHighlight[];
  affiliateLinks: AffiliateLink[];
  placement: PlacementMetadata;
}

export interface RecommendationResponse {
  profileId: string;
  modelVersion: string;
  generatedAt: string;
  recommendations: RecommendationResult[];
}

// ---------- Comparison topics ----------

export interface ComparisonTopic {
  slug: string;
  title: string;
  description: string;
  presetProfile: Omit<SleepProfile, "id" | "createdAt">;
  mattressIds: string[];
  sponsoredMattressIds?: string[];
  maxPrice?: number;
}

// ---------- API error contract ----------

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "MATTRESS_NOT_FOUND"
  | "INVALID_PROFILE"
  | "INVALID_TOPIC"
  | "INTERNAL_ERROR";

export interface ApiErrorResponse {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
}
