import { test, expect } from "@playwright/test";

test.describe("Mattress detail page", () => {
  test("shows specs, score demo, highlights, risks, and trust links for a known slug", async ({ page }) => {
    await page.goto("/mattress/coastal-breeze-hybrid");

    await expect(page.getByRole("heading", { name: "Coastal Breeze Hybrid" })).toBeVisible();
    await expect(page.getByText("Specs")).toBeVisible();
    await expect(page.getByText("Materials")).toBeVisible();
    await expect(page.getByText("Your match score")).toBeVisible();
    await expect(page.getByText("Review highlights")).toBeVisible();
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: "How Match Score works" })).toHaveAttribute("href", "/methodology");
    await expect(main.getByRole("link", { name: "Sponsored placement policy" })).toHaveAttribute(
      "href",
      "/sponsored-policy"
    );
    await expect(main.getByRole("link", { name: "Affiliate disclosure", exact: true })).toHaveAttribute(
      "href",
      "/affiliate-disclosure"
    );
    await expect(main.getByRole("link", { name: /View at/ }).first()).toBeVisible();
  });

  test("returns a 404 for an unknown slug", async ({ page }) => {
    const response = await page.goto("/mattress/not-a-real-mattress");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("Page not found")).toBeVisible();
  });
});
