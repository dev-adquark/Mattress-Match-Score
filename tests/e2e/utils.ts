import type { Page } from "@playwright/test";

export const STORAGE_KEY = "mms.sleepProfileInput";

export const heavyBackHotCoupleProfile = {
  sleepPositions: ["back"],
  weightBand: "230-280",
  // Intentionally mismatched vs. the firm, supportive mattresses this weight/position combo
  // needs, so the firmness-preference risk rule reliably fires for at least one top result.
  firmnessPreference: "soft",
  budgetBand: "1200-1800",
  temperaturePreference: "hot",
  motionSensitivity: "couple",
  isFullProfile: true,
};

export const sideSleeperProfile = {
  sleepPositions: ["side"],
  weightBand: "130-180",
  firmnessPreference: "medium-soft",
  budgetBand: "1200-1800",
  temperaturePreference: "neutral",
  motionSensitivity: "single",
  comfortFocus: ["pressure-points"],
  isFullProfile: true,
};

/** Seeds localStorage with a SleepProfile input before the page's own scripts run. */
export async function setSleepProfile(page: Page, profile: Record<string, unknown>) {
  await page.addInitScript(
    ({ key, value }) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    { key: STORAGE_KEY, value: profile }
  );
}
