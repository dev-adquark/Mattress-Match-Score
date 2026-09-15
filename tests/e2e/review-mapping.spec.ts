import { test, expect } from "@playwright/test";
import { setSleepProfile } from "./utils";

test.describe("Profile-aware review mapping", () => {
  test("a hot sleeper sees heat-related review tags prioritized", async ({ page }) => {
    await setSleepProfile(page, {
      sleepPositions: ["back"],
      weightBand: "180-230",
      firmnessPreference: "medium-firm",
      budgetBand: "1800-2500",
      temperaturePreference: "hot",
      motionSensitivity: "single",
      isFullProfile: true,
    });
    await page.goto("/results");

    const card = page.locator('[data-mattress-id="nighthush-cooling-hybrid"]');
    await expect(card).toBeVisible({ timeout: 15000 });
    const firstTag = card.getByTestId("review-highlight-tag").first();
    await expect(firstTag).toHaveText(/Sleeps (hot|cool)/);
  });

  test("a couple sees motion/edge review tags prioritized", async ({ page }) => {
    await setSleepProfile(page, {
      sleepPositions: ["side", "back"],
      weightBand: "180-230",
      firmnessPreference: "medium",
      budgetBand: "1800-2500",
      temperaturePreference: "neutral",
      motionSensitivity: "couple",
      isFullProfile: true,
    });
    await page.goto("/results");

    const card = page.locator('[data-mattress-id="grandestate-luxury-hybrid"]');
    await expect(card).toBeVisible({ timeout: 15000 });
    const firstTag = card.getByTestId("review-highlight-tag").first();
    await expect(firstTag).toHaveText(/(Motion isolation|edge support)/i);
  });
});
