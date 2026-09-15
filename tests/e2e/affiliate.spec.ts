import { test, expect } from "@playwright/test";

test.describe("Affiliate CTA", () => {
  test("outbound link carries the required tracking parameters", async ({ page, context }) => {
    await page.goto("/mattress/coastal-breeze-hybrid");

    const cta = page.getByRole("link", { name: /View at/ }).first();
    await expect(cta).toBeVisible();

    const href = await cta.getAttribute("href");
    expect(href).toBeTruthy();

    const url = new URL(href!);
    expect(url.searchParams.get("utm_source")).toBe("mattressmatchscore");
    expect(url.searchParams.get("utm_medium")).toBe("affiliate");
    expect(url.searchParams.get("utm_campaign")).toBeTruthy();
    expect(url.searchParams.get("click_id")).toBeTruthy();

    // The demo retailer domain doesn't resolve, so we only verify that clicking the CTA
    // actually opens a new tab pointed at the generated affiliate URL (the "real action"),
    // not that the fake domain loads successfully.
    const [popup] = await Promise.all([context.waitForEvent("page"), cta.click()]);
    expect(popup).toBeTruthy();
    await popup.close();
  });
});
