import { test, expect } from "@playwright/test";
import { setSleepProfile, sideSleeperProfile } from "./utils";

test.describe("Sponsored vs. algorithmic labeling", () => {
  test("sponsored card shows Sponsored + Verified date; algorithmic cards never show Sponsored", async ({ page }) => {
    await setSleepProfile(page, sideSleeperProfile);
    await page.goto("/results");

    const sponsoredCard = page.locator('[data-mattress-id="grandestate-luxury-hybrid"]');
    await expect(sponsoredCard).toBeVisible({ timeout: 15000 });
    const placementBadge = sponsoredCard.getByTestId("placement-sponsored");
    await expect(placementBadge).toBeVisible();
    await expect(placementBadge.getByText("Sponsored", { exact: true })).toBeVisible();
    await expect(placementBadge.getByText(/Verified/)).toBeVisible();
    await expect(placementBadge.getByText(/2026-08-20/)).toBeVisible();

    const algorithmicCards = page.getByTestId("placement-algorithmic");
    const count = await algorithmicCards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(algorithmicCards.nth(i)).not.toContainText("Sponsored");
    }
  });

  test("a topic comparison page shows its own sponsored placement with the correct verification status", async ({
    page,
  }) => {
    await page.goto("/compare/best-for-side-sleepers-under-1000");
    const sponsoredCard = page.locator('[data-mattress-id="cloudlayer-memory-foam"]');
    await expect(sponsoredCard).toBeVisible();
    const placementBadge = sponsoredCard.getByTestId("placement-sponsored");
    await expect(placementBadge.getByText("Sponsored", { exact: true })).toBeVisible();
    await expect(placementBadge.getByText("Verification pending")).toBeVisible();
  });
});
