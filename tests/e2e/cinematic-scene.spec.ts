import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "no-preference" });

test.describe("Cinematic 3D scene", () => {
  test("canvas attaches on home page and renders without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForTimeout(500);

    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test("hero heading with sleep profile phrase remains visible and clickable", async ({ page }) => {
    await page.goto("/");

    const heading = page.locator("h1");
    await expect(heading).toContainText("sleep profile");

    const button = page.locator('a:has-text("Find My Match")').first();
    await expect(button).toBeVisible();
  });

  test("canvas persists across navigation from home to quiz", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);
    let canvasCount = await page.locator("canvas").count();
    expect(canvasCount).toBe(1);

    await page.goto("/match");
    await page.locator("h1").waitFor({ state: "visible", timeout: 5000 });
    await page.waitForTimeout(300);
    canvasCount = await page.locator("canvas").count();
    expect(canvasCount).toBe(1);
  });

  test("canvas has data-testid for stable selection", async ({ page }) => {
    await page.goto("/");

    const testIdCanvas = page.locator("[data-testid='cinematic-canvas']");
    await expect(testIdCanvas).toBeVisible();
  });
});
