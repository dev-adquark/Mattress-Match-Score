import { test, expect } from "@playwright/test";

const FAQ_SLUGS = [
  "firmness-tradeoffs",
  "trial-periods",
  "durability-timelines",
  "motion-isolation-expectations",
  "cooling",
  "side-sleeping",
  "back-support",
  "edge-support",
  "pressure-relief",
];

test.describe("FAQ pages", () => {
  test("FAQ index links to every FAQ route", async ({ page }) => {
    await page.goto("/faq");
    for (const slug of FAQ_SLUGS) {
      await expect(page.locator(`a[href="/faq/${slug}"]`)).toBeVisible();
    }
  });

  for (const slug of FAQ_SLUGS) {
    test(`/faq/${slug} loads with content`, async ({ page }) => {
      const response = await page.goto(`/faq/${slug}`);
      expect(response?.ok()).toBe(true);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }
});
