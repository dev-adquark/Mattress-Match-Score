import { test, expect, type Page } from "@playwright/test";
import { heavyBackHotCoupleProfile, setSleepProfile } from "./utils";

async function selectChoice(page: Page, legend: string, optionLabel: string) {
  const group = page.getByRole("group", { name: legend });
  await group.getByText(optionLabel, { exact: true }).click();
}

test.describe("Reduced motion fallback", () => {
  test("explicit reducedMotion emulation disables canvas", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.goto("/");
    await page.waitForTimeout(300);

    const canvasCount = await page.locator("canvas").count();
    expect(canvasCount).toBe(0);

    const heading = page.locator("h1");
    await expect(heading).toContainText("sleep profile");
  });

  test("full quick-match to results flow completes without canvas", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });

    await setSleepProfile(page, heavyBackHotCoupleProfile);
    await page.goto("/results");

    const canvasCount = await page.locator("canvas").count();
    expect(canvasCount).toBe(0);

    const results = page.getByRole("heading", { level: 1 });
    await expect(results).toContainText("Your Matches");
  });
});
