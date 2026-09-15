"use client";

import { ExternalLink } from "lucide-react";
import { buttonVariants, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { trackEvent } from "@/lib/analytics/events";

interface AffiliateCtaProps {
  href: string;
  retailerName: string;
  mattressId: string;
  placementType: "algorithmic" | "sponsored";
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}

/**
 * The single reusable affiliate CTA used on recommendation cards, comparison rows, and mattress
 * detail pages. Sponsored and algorithmic clicks are tracked as separate event names so
 * reporting never blends the two.
 */
export function AffiliateCta({
  href,
  retailerName,
  mattressId,
  placementType,
  variant = "primary",
  size = "md",
  className,
}: AffiliateCtaProps) {
  function handleClick() {
    trackEvent(placementType === "sponsored" ? "sponsored_click" : "affiliate_click", {
      mattressId,
      retailerName,
      placementType,
    });
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className={cn(buttonVariants({ variant, size }), className)}
      aria-label={`View at ${retailerName} (opens in a new tab)`}
    >
      View at {retailerName}
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
