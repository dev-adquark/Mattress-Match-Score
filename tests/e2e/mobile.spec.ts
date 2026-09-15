import { test, expect, type Page } from "@playwright/test";
import { heavyBackHotCoupleProfile, setSleepProfile } from "./utils";

async function selectChoice(page: Page, legend: string, optionLabel: string) {
  const group = page.getByRole("group", { name: legend });
  await group.getByText(optionLabel, { exact: true }).click();
}

test.describe("Mobile journey", () => {
  test("landing, mobile nav, quick match, results, and comparison all work at mobile width", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Mobile nav toggle
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("navigation", { name: "Primary mobile" }).getByRole("link", { name: "Find My Match" }).click();
    await expect(page).toHaveURL(/\/match$/);

    await selectChoice(page, "How do you mostly sleep?", "Side");
    await selectChoice(page, "What's your weight range?", "130–180 lbs");
    await selectChoice(page, "What firmness do you usually prefer?", "Medium");
    await selectChoice(page, "What's your budget?", "$1,200 – $1,800");
    await selectChoice(page, "How do you sleep, temperature-wise?", "I'm temperature neutral");
    await selectChoice(page, "Who's sleeping in the bed?", "Single sleeper");
    await page.getByRole("button", { name: "Find My Matches" }).click();

    await expect(page).toHaveURL(/\/results$/);
    const cards = page.getByTestId("recommendation-card");
    await expect(cards.first()).toBeVisible({ timeout: 15000 });

    const box = await page.locator("body").boundingBox();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual((box?.width ?? 400) + 2);

    await cards.first().getByLabel("Add to comparison").click();
    await expect(page.getByText(/Comparing 1 of 3/)).toBeVisible();
    await expect(page.getByTestId("comparison-table")).toBeVisible();
  });

  test("results CTAs remain reachable at mobile width", async ({ page }) => {
    await setSleepProfile(page, heavyBackHotCoupleProfile);
    await page.goto("/results");
    const firstCta = page.getByRole("link", { name: /View at/ }).first();
    await expect(firstCta).toBeVisible({ timeout: 15000 });
    await firstCta.scrollIntoViewIfNeeded();
    await expect(firstCta).toBeInViewport({ ratio: 0 });
  });
});
