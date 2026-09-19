import { z } from "zod";

// Every enum below gets an explicit `error` message. Zod's default enum
// message ("Invalid option: expected one of ...") is a technical, unfriendly
// string; without an override it leaks straight into the quick-match and
// full-profile form UI whenever a required field is left unselected.
const REQUIRED_SELECTION_MESSAGE = "Please make a selection.";

export const sleepPositionSchema = z.enum(["side", "back", "stomach", "combination"], {
  error: REQUIRED_SELECTION_MESSAGE,
});
export const weightBandSchema = z.enum(["under-130", "130-180", "180-230", "230-280", "over-280"], {
  error: REQUIRED_SELECTION_MESSAGE,
});
export const heightBandSchema = z.enum(["under-5-4", "5-4-to-5-9", "5-9-to-6-2", "over-6-2"], {
  error: REQUIRED_SELECTION_MESSAGE,
});
export const bmiRangeSchema = z.enum(["under-18-5", "18-5-to-25", "25-to-30", "over-30"], {
  error: REQUIRED_SELECTION_MESSAGE,
});
export const firmnessPreferenceSchema = z.enum(["soft", "medium-soft", "medium", "medium-firm", "firm"], {
  error: REQUIRED_SELECTION_MESSAGE,
});
export const budgetBandSchema = z.enum(["under-800", "800-1200", "1200-1800", "1800-2500", "over-2500"], {
  error: REQUIRED_SELECTION_MESSAGE,
});
export const mattressTypeSchema = z.enum(["foam", "hybrid", "innerspring"], {
  error: REQUIRED_SELECTION_MESSAGE,
});
export const temperaturePreferenceSchema = z.enum(["hot", "neutral", "cold"], {
  error: REQUIRED_SELECTION_MESSAGE,
});
export const motionSensitivitySchema = z.enum(["single", "couple", "high-sensitivity"], {
  error: REQUIRED_SELECTION_MESSAGE,
});
export const comfortFocusSchema = z.enum(
  ["pressure-points", "back-alignment", "hip-relief", "shoulder-relief", "general-comfort"],
  { error: REQUIRED_SELECTION_MESSAGE }
);
export const surfaceFeelSchema = z.enum(["soft", "medium", "firm"], { error: REQUIRED_SELECTION_MESSAGE });

/**
 * Shared with both the quick-match / full-profile forms (client-side validation) and the
 * /api/score route (server-side validation) so there is exactly one definition of what a
 * valid SleepProfile input looks like.
 */
export const sleepProfileInputSchema = z.object({
  sleepPositions: z.array(sleepPositionSchema).min(1, "Select at least one sleep position."),
  weightBand: weightBandSchema,
  heightBand: heightBandSchema.optional(),
  bmiRange: bmiRangeSchema.optional(),
  firmnessPreference: firmnessPreferenceSchema,
  budgetBand: budgetBandSchema,
  mattressTypes: z.array(mattressTypeSchema).optional(),
  temperaturePreference: temperaturePreferenceSchema,
  motionSensitivity: motionSensitivitySchema,
  comfortFocus: z.array(comfortFocusSchema).optional(),
  surfaceFeel: surfaceFeelSchema.optional(),
  isFullProfile: z.boolean().optional().default(false),
});

export type SleepProfileInput = z.infer<typeof sleepProfileInputSchema>;

export const quickMatchSchema = z.object({
  sleepPositions: z.array(sleepPositionSchema).min(1, "Select at least one sleep position."),
  weightBand: weightBandSchema,
  firmnessPreference: firmnessPreferenceSchema,
  budgetBand: budgetBandSchema,
  temperaturePreference: temperaturePreferenceSchema,
  motionSensitivity: motionSensitivitySchema,
});

export type QuickMatchInput = z.infer<typeof quickMatchSchema>;
