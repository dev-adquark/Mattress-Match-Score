import { randomUUID } from "crypto";
import type { AffiliateLink, Mattress } from "@/contracts/mattress-match";
import { appConfig } from "@/lib/config";

/**
 * Builds a single retailer affiliate URL with tracking parameters attached.
 * All outbound URLs must be constructed through this function so tracking stays consistent
 * and no component hard-codes a retailer URL directly.
 */
export function buildAffiliateLink(mattress: Mattress, partnerId: string, clickId: string): AffiliateLink {
  const partner = mattress.retailPartners.find((p) => p.partnerId === partnerId);
  if (!partner) {
    throw new Error(`Unknown retail partner "${partnerId}" for mattress "${mattress.id}"`);
  }

  const url = new URL(partner.baseUrl);
  url.searchParams.set("utm_source", appConfig.affiliate.utmSource);
  url.searchParams.set("utm_medium", appConfig.affiliate.utmMedium);
  url.searchParams.set("utm_campaign", `${partner.partnerId}-${partner.campaignSlug}`);
  url.searchParams.set("click_id", clickId);

  return {
    retailerName: partner.retailerName,
    partnerId: partner.partnerId,
    url: url.toString(),
  };
}

export function buildAffiliateLinksForMattress(mattress: Mattress): AffiliateLink[] {
  return mattress.retailPartners.map((partner) => buildAffiliateLink(mattress, partner.partnerId, randomUUID()));
}
