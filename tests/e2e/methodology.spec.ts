import { test, expect } from "@playwright/test";

test.describe("Methodology page", () => {
  test("shows the model version and explains scoring", async ({ page }) => {
    await page.goto("/methodology");
    await expect(page.getByText(/Current model version: v\d/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "How scoring works" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Risk flags" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sponsorship vs. algorithmic ranking" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Limitations" })).toBeVisible();
  });
});
