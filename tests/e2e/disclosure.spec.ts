import { test, expect } from "@playwright/test";

test.describe("Disclosure pages", () => {
  test("sponsored policy has non-empty, substantive content", async ({ page }) => {
    await page.goto("/sponsored-policy");
    await expect(page.getByRole("heading", { name: "Sponsored Policy" })).toBeVisible();
    const text = await page.locator("main").innerText();
    expect(text.length).toBeGreaterThan(400);
    expect(text).toContain("Verified");
  });

  test("affiliate disclosure has non-empty, substantive content", async ({ page }) => {
    await page.goto("/affiliate-disclosure");
    await expect(page.getByRole("heading", { name: "Affiliate Disclosure" })).toBeVisible();
    const text = await page.locator("main").innerText();
    expect(text.length).toBeGreaterThan(300);
    expect(text).toContain("commission");
  });
});
