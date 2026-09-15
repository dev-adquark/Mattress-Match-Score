import { test, expect } from "@playwright/test";

const TOPICS = [
  "cooling-hybrid-for-couples",
  "best-for-side-sleepers-under-1000",
  "motion-isolation-for-couples",
];

test.describe("Comparison topic pages", () => {
  for (const topic of TOPICS) {
    test(`${topic} loads with recommendations and comparison tools`, async ({ page }) => {
      await page.goto(`/compare/${topic}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const cards = page.getByTestId("recommendation-card");
      await expect(cards.first()).toBeVisible();
      expect(await cards.count()).toBeGreaterThanOrEqual(2);
      await expect(page.locator("main").getByRole("link", { name: /methodology/i })).toBeVisible();
      await expect(page.getByText("Side-by-side comparison")).toBeVisible();
    });
  }

  test("compare index links to all three topics", async ({ page }) => {
    await page.goto("/compare");
    for (const topic of TOPICS) {
      await expect(page.locator("main").locator(`a[href="/compare/${topic}"]`)).toBeVisible();
    }
  });
});
