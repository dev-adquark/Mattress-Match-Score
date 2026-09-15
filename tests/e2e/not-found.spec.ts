import { test, expect } from "@playwright/test";

test.describe("404 handling", () => {
  test("an unknown route shows a proper 404 with working links back", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("Page not found")).toBeVisible();
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    await expect(main.getByRole("link", { name: "Find My Match" })).toHaveAttribute("href", "/match");
  });

  test("an unknown comparison topic 404s", async ({ page }) => {
    const response = await page.goto("/compare/not-a-real-topic");
    expect(response?.status()).toBe(404);
  });
});
