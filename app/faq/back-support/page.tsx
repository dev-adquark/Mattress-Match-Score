import type { Metadata } from "next";
import { ArticleLayout } from "@/components/content/article-layout";

export const metadata: Metadata = {
  title: "Back Support",
  description: "How the Support & Alignment sub-score works for back sleepers, and what changes it.",
};

export default function BackSupportFaqPage() {
  return (
    <ArticleLayout
      eyebrow="FAQ"
      eyebrowHref="/faq"
      title="Back Support"
      dek="For back sleepers, the goal is a level spine from shoulders to hips — not maximum firmness."
      relatedLinks={[
        { href: "/guides/back-support-for-heavy-back-sleepers", label: "Guide: Back Support for Heavier Back Sleepers" },
        { href: "/faq/firmness-tradeoffs", label: "FAQ: Firmness Tradeoffs" },
      ]}
    >
      <p>
        Back sleeping distributes weight more evenly than side sleeping, but the lower back (lumbar region) still
        needs enough support to avoid arching or sinking. The Support &amp; Alignment sub-score is built around
        that specific balance.
      </p>
      <h2>What raises the score</h2>
      <ul>
        <li>A firm, supportive core matched to your weight band — heavier back sleepers need a higher firmness and support rating than lighter ones.</li>
        <li>Zoned support layers, which add reinforcement specifically under the lumbar region.</li>
      </ul>
      <h2>What lowers it</h2>
      <p>
        A mattress that's too soft for your weight band lets the hips sink further than the shoulders, arching the
        lower back out of alignment overnight. This is exactly what our support-mismatch risk flag is designed to
        catch — it only appears when your weight band and the mattress's firmness/support combination cross a
        specific threshold, never as a generic warning.
      </p>
      <h2>Zoned support, explained</h2>
      <p>
        A &ldquo;zoned&rdquo; support core uses different coil gauges or foam densities across the length of the
        mattress — typically firmer under the hips and lower back, softer under the shoulders. If you selected
        back alignment as a comfort focus, mattresses with zoned support get an additional score boost.
      </p>
    </ArticleLayout>
  );
}
