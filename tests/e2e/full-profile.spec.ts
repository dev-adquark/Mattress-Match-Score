import { test, expect, type Page } from "@playwright/test";

async function selectChoice(page: Page, legend: string, optionLabel: string) {
  const group = page.getByRole("group", { name: legend });
  await group.getByText(optionLabel, { exact: true }).click();
}

test.describe("Full Sleep Profile", () => {
  test("steps through all four steps and reaches results", async ({ page }) => {
    await page.goto("/match/full");
    await expect(page.getByText("Step 1 of 4")).toBeVisible();

    // Step 1: position & body
    await selectChoice(page, "Which positions do you sleep in?", "Back");
    await selectChoice(page, "What's your weight range?", "230–280 lbs");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 2: firmness & type
    await expect(page.getByText("Step 2 of 4")).toBeVisible();
    await selectChoice(page, "What firmness do you usually prefer?", "Medium");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 3: temperature & motion
    await expect(page.getByText("Step 3 of 4")).toBeVisible();
    await selectChoice(page, "How do you sleep, temperature-wise?", "I sleep hot");
    await selectChoice(page, "Who's sleeping in the bed?", "Couple / shared bed");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 4: budget & review
    await expect(page.getByText("Step 4 of 4")).toBeVisible();
    await selectChoice(page, "What's your budget?", "$1,200 – $1,800");
    await expect(page.getByText("Review your profile")).toBeVisible();

    await page.getByRole("button", { name: "Find My Matches" }).click();

    await expect(page).toHaveURL(/\/results$/);
    await expect(page.getByTestId("recommendation-card").first()).toBeVisible({ timeout: 15000 });
  });

  test("back button returns to the previous step", async ({ page }) => {
    await page.goto("/match/full");
    await selectChoice(page, "Which positions do you sleep in?", "Side");
    await selectChoice(page, "What's your weight range?", "130–180 lbs");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Step 2 of 4")).toBeVisible();

    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByText("Step 1 of 4")).toBeVisible();
  });
});
