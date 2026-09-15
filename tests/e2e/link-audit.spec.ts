import { test, expect, type Page } from "@playwright/test";

const SEED_ROUTES = [
  "/",
  "/match",
  "/match/full",
  "/compare",
  "/guides",
  "/faq",
  "/methodology",
  "/sponsored-policy",
  "/affiliate-disclosure",
  "/privacy",
  "/terms",
  "/mattress/coastal-breeze-hybrid",
  "/compare/cooling-hybrid-for-couples",
  "/compare/best-for-side-sleepers-under-1000",
  "/compare/motion-isolation-for-couples",
  "/guides/pressure-relief-for-side-sleepers",
  "/guides/back-support-for-heavy-back-sleepers",
  "/guides/hot-sleeper-cooling-comparison",
  "/faq/firmness-tradeoffs",
];

async function collectInternalLinks(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll("a[href]"));
    return anchors
      .map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? "")
      .filter((href) => href.startsWith("/") && !href.startsWith("//"))
      .map((href) => href.split("#")[0])
      .filter((href) => href.length > 0);
  });
}

test("every internal link discovered from seed routes resolves without a 404 or 500", async ({ page, request }) => {
  const discovered = new Set<string>();

  for (const route of SEED_ROUTES) {
    await page.goto(route);
    for (const link of await collectInternalLinks(page)) {
      discovered.add(link);
    }
  }

  const broken: string[] = [];
  for (const link of discovered) {
    const response = await request.get(link);
    if (!response.ok()) {
      broken.push(`${link} -> ${response.status()}`);
    }
  }

  expect(broken, `Broken internal links found:\n${broken.join("\n")}`).toEqual([]);
});
