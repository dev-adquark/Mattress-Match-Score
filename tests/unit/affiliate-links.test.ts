import { describe, expect, it } from "vitest";
import { buildAffiliateLink, buildAffiliateLinksForMattress } from "@/lib/affiliate/links";
import { getMattressById } from "@/lib/repositories/mattress-repository";

describe("affiliate links", () => {
  const mattress = getMattressById("coastal-breeze-hybrid")!;

  it("includes all required UTM parameters and a click id", () => {
    const partnerId = mattress.retailPartners[0].partnerId;
    const link = buildAffiliateLink(mattress, partnerId, "test-click-id");
    const url = new URL(link.url);
    expect(url.searchParams.get("utm_source")).toBe("mattressmatchscore");
    expect(url.searchParams.get("utm_medium")).toBe("affiliate");
    expect(url.searchParams.get("utm_campaign")).toContain(mattress.slug);
    expect(url.searchParams.get("click_id")).toBe("test-click-id");
  });

  it("throws for an unknown partner id rather than fabricating a link", () => {
    expect(() => buildAffiliateLink(mattress, "not-a-real-partner", "x")).toThrow();
  });

  it("builds a link for every configured retail partner", () => {
    const links = buildAffiliateLinksForMattress(mattress);
    expect(links).toHaveLength(mattress.retailPartners.length);
    for (const link of links) {
      expect(link.url.startsWith("https://")).toBe(true);
    }
  });

  it("generates a distinct click id per call", () => {
    const [first] = buildAffiliateLinksForMattress(mattress);
    const [second] = buildAffiliateLinksForMattress(mattress);
    const firstClickId = new URL(first.url).searchParams.get("click_id");
    const secondClickId = new URL(second.url).searchParams.get("click_id");
    expect(firstClickId).not.toBe(secondClickId);
  });
});
