import type {
  BudgetBand,
  ComfortFocus,
  FirmnessPreference,
  Mattress,
  MattressType,
  MotionSensitivity,
  SleepPosition,
  SleepProfile,
  SurfaceFeel,
  TemperaturePreference,
  WeightBand,
} from "@/contracts/mattress-match";

export interface ProfileCondition {
  sleepPositions?: SleepPosition[];
  weightBands?: WeightBand[];
  firmnessPreferences?: FirmnessPreference[];
  temperaturePreferences?: TemperaturePreference[];
  motionSensitivities?: MotionSensitivity[];
  comfortFocus?: ComfortFocus[];
  mattressTypes?: MattressType[];
  budgetBands?: BudgetBand[];
  surfaceFeel?: SurfaceFeel[];
}

export interface MattressCondition {
  types?: MattressType[];
  firmnessScaleMin?: number;
  firmnessScaleMax?: number;
  airflowRatingMin?: number;
  airflowRatingMax?: number;
  supportRatingMin?: number;
  supportRatingMax?: number;
  edgeRatingMin?: number;
  edgeRatingMax?: number;
  motionIsolationRatingMin?: number;
  motionIsolationRatingMax?: number;
  sagRiskRatingMin?: number;
  sagRiskRatingMax?: number;
  responsivenessRatingMin?: number;
  responsivenessRatingMax?: number;
  retainsHeat?: boolean;
  reinforcedPerimeter?: boolean;
  zonedSupport?: boolean;
  firmSupportCore?: boolean;
}

export interface RuleCondition {
  profile?: ProfileCondition;
  mattress?: MattressCondition;
}

function overlaps<T>(a: T[] | undefined, b: T[]): boolean {
  if (!a || a.length === 0) return false;
  return a.some((item) => b.includes(item));
}

export function matchesProfileCondition(profile: SleepProfile, cond?: ProfileCondition): boolean {
  if (!cond) return true;
  if (cond.sleepPositions && !overlaps(profile.sleepPositions, cond.sleepPositions)) return false;
  if (cond.weightBands && !cond.weightBands.includes(profile.weightBand)) return false;
  if (cond.firmnessPreferences && !cond.firmnessPreferences.includes(profile.firmnessPreference)) return false;
  if (cond.temperaturePreferences && !cond.temperaturePreferences.includes(profile.temperaturePreference)) return false;
  if (cond.motionSensitivities && !cond.motionSensitivities.includes(profile.motionSensitivity)) return false;
  if (cond.comfortFocus && !overlaps(profile.comfortFocus, cond.comfortFocus)) return false;
  if (cond.mattressTypes && !overlaps(profile.mattressTypes, cond.mattressTypes)) return false;
  if (cond.budgetBands && !cond.budgetBands.includes(profile.budgetBand)) return false;
  if (cond.surfaceFeel && (!profile.surfaceFeel || !cond.surfaceFeel.includes(profile.surfaceFeel))) return false;
  return true;
}

export function matchesMattressCondition(mattress: Mattress, cond?: MattressCondition): boolean {
  if (!cond) return true;
  if (cond.types && !overlaps(mattress.types, cond.types)) return false;
  if (cond.firmnessScaleMin !== undefined && mattress.firmnessScale < cond.firmnessScaleMin) return false;
  if (cond.firmnessScaleMax !== undefined && mattress.firmnessScale > cond.firmnessScaleMax) return false;
  if (cond.airflowRatingMin !== undefined && mattress.heat.airflowRating < cond.airflowRatingMin) return false;
  if (cond.airflowRatingMax !== undefined && mattress.heat.airflowRating > cond.airflowRatingMax) return false;
  if (cond.supportRatingMin !== undefined && mattress.support.supportRating < cond.supportRatingMin) return false;
  if (cond.supportRatingMax !== undefined && mattress.support.supportRating > cond.supportRatingMax) return false;
  if (cond.edgeRatingMin !== undefined && mattress.edgeSupport.edgeRating < cond.edgeRatingMin) return false;
  if (cond.edgeRatingMax !== undefined && mattress.edgeSupport.edgeRating > cond.edgeRatingMax) return false;
  if (
    cond.motionIsolationRatingMin !== undefined &&
    mattress.motion.motionIsolationRating < cond.motionIsolationRatingMin
  )
    return false;
  if (
    cond.motionIsolationRatingMax !== undefined &&
    mattress.motion.motionIsolationRating > cond.motionIsolationRatingMax
  )
    return false;
  if (cond.sagRiskRatingMin !== undefined && mattress.durability.sagRiskRating < cond.sagRiskRatingMin) return false;
  if (cond.sagRiskRatingMax !== undefined && mattress.durability.sagRiskRating > cond.sagRiskRatingMax) return false;
  if (cond.responsivenessRatingMin !== undefined && mattress.responsivenessRating < cond.responsivenessRatingMin)
    return false;
  if (cond.responsivenessRatingMax !== undefined && mattress.responsivenessRating > cond.responsivenessRatingMax)
    return false;
  if (cond.retainsHeat !== undefined && mattress.heat.retainsHeat !== cond.retainsHeat) return false;
  if (cond.reinforcedPerimeter !== undefined && mattress.edgeSupport.reinforcedPerimeter !== cond.reinforcedPerimeter)
    return false;
  if (cond.zonedSupport !== undefined && mattress.support.zonedSupport !== cond.zonedSupport) return false;
  if (cond.firmSupportCore !== undefined && mattress.support.firmSupportCore !== cond.firmSupportCore) return false;
  return true;
}

export function matchesRuleCondition(profile: SleepProfile, mattress: Mattress, when: RuleCondition): boolean {
  return matchesProfileCondition(profile, when.profile) && matchesMattressCondition(mattress, when.mattress);
}
