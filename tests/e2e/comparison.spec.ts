import { test, expect } from "@playwright/test";
import { heavyBackHotCoupleProfile, setSleepProfile } from "./utils";

test.describe("Comparison", () => {
  test("select three mattresses, view side-by-side, then remove one", async ({ page }) => {
    await setSleepProfile(page, heavyBackHotCoupleProfile);
    await page.goto("/results");

    const cards = page.getByTestId("recommendation-card");
    await expect(cards.first()).toBeVisible({ timeout: 15000 });

    for (let i = 0; i < 3; i++) {
      await cards.nth(i).getByLabel("Add to comparison").click();
    }

    await expect(page.getByText(/Comparing 3 of 3/)).toBeVisible();

    const table = page.getByTestId("comparison-table");
    await expect(table).toBeVisible();
    await expect(table.locator("thead th").filter({ hasText: /./ })).toHaveCount(4); // row-label + 3 mattresses

    await table.getByRole("button", { name: /Remove/ }).first().click();

    await expect(page.getByText(/Comparing 2 of 3/)).toBeVisible();
    await expect(table.locator("thead th").filter({ hasText: /./ })).toHaveCount(3);
  });

  test("clear button removes all selections", async ({ page }) => {
    await setSleepProfile(page, heavyBackHotCoupleProfile);
    await page.goto("/results");

    const cards = page.getByTestId("recommendation-card");
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    await cards.first().getByLabel("Add to comparison").click();
    await expect(page.getByRole("button", { name: "Clear" })).toBeVisible();

    await page.getByRole("button", { name: "Clear" }).click();
    await expect(page.getByRole("button", { name: "Clear" })).toHaveCount(0);
  });
});
