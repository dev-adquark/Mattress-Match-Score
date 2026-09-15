import { test, expect, type Page } from "@playwright/test";

async function selectChoice(page: Page, legend: string, optionLabel: string) {
  const group = page.getByRole("group", { name: legend });
  await group.getByText(optionLabel, { exact: true }).click();
}

test.describe("Quick Match", () => {
  test("fills a valid profile and reaches results", async ({ page }) => {
    await page.goto("/match");

    await selectChoice(page, "How do you mostly sleep?", "Side");
    await selectChoice(page, "What's your weight range?", "130–180 lbs");
    await selectChoice(page, "What firmness do you usually prefer?", "Medium");
    await selectChoice(page, "What's your budget?", "$1,200 – $1,800");
    await selectChoice(page, "How do you sleep, temperature-wise?", "I'm temperature neutral");
    await selectChoice(page, "Who's sleeping in the bed?", "Single sleeper");

    await page.getByRole("button", { name: "Find My Matches" }).click();

    await expect(page).toHaveURL(/\/results$/);
    await expect(page.getByRole("heading", { name: "Your Matches" })).toBeVisible();
    await expect(page.getByTestId("recommendation-card").first()).toBeVisible({ timeout: 15000 });
  });

  test("shows validation errors when submitting an empty form", async ({ page }) => {
    await page.goto("/match");
    await page.getByRole("button", { name: "Find My Matches" }).click();
    await expect(page.getByRole("alert").first()).toBeVisible();
    await expect(page).toHaveURL(/\/match$/);
  });
});
