import { test, expect } from "@playwright/test";
import { heavyBackHotCoupleProfile, setSleepProfile } from "./utils";

test.describe("Results page", () => {
  test("shows recommendations, scores, sub-scores, risk flags, model version, and why-match", async ({ page }) => {
    await setSleepProfile(page, heavyBackHotCoupleProfile);
    await page.goto("/results");

    const cards = page.getByTestId("recommendation-card");
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    expect(await cards.count()).toBeGreaterThanOrEqual(3);

    await expect(page.getByText(/^Model v/)).toBeVisible();
    await expect(page.getByTestId("overall-score").first()).toBeVisible();
    await expect(page.getByText("Pressure Relief").first()).toBeVisible();
    await expect(page.getByText("Why this match?").first()).toBeVisible();
    await expect(page.getByTestId("risk-flag").first()).toBeVisible();
  });

  test("shows an empty state when no profile has been submitted", async ({ page }) => {
    await page.goto("/results");
    await expect(page.getByText(/don.t have a sleep profile/)).toBeVisible();
    await expect(page.locator("main").getByRole("link", { name: "Find My Match" })).toBeVisible();
  });
});
