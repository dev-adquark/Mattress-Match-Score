import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/repositories/mattress-repository";
import { getAllComparisonTopics } from "@/lib/repositories/comparison-topic-repository";
import { guideLinks, faqLinks } from "@/lib/content/site-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mattressmatchscore.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/match",
    "/match/full",
    "/results",
    "/compare",
    "/guides",
    "/faq",
    "/methodology",
    "/sponsored-policy",
    "/affiliate-disclosure",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const mattressRoutes = getAllSlugs().map((slug) => ({
    url: `${SITE_URL}/mattress/${slug}`,
    lastModified: new Date(),
  }));

  const compareRoutes = getAllComparisonTopics().map((topic) => ({
    url: `${SITE_URL}/compare/${topic.slug}`,
    lastModified: new Date(),
  }));

  const guideRoutes = guideLinks.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: new Date(),
  }));

  const faqRoutes = faqLinks.map((faq) => ({
    url: `${SITE_URL}/faq/${faq.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...mattressRoutes, ...compareRoutes, ...guideRoutes, ...faqRoutes];
}
