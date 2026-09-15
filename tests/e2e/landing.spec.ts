import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("shows the hero and navigates to Find My Match", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("sleep profile");
    await page.getByRole("link", { name: "Find My Match" }).first().click();
    await expect(page).toHaveURL(/\/match$/);
    await expect(page.getByRole("heading", { name: "Find My Match" })).toBeVisible();
  });

  test("links to methodology and featured comparisons", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "How scoring works" })).toHaveAttribute("href", "/methodology");
    await expect(
      page.locator("main").getByRole("link", { name: /Cooling Hybrid Mattresses for Couples/ })
    ).toBeVisible();
  });
});
