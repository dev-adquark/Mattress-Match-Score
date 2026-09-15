import type { Metadata } from "next";
import { ArticleLayout } from "@/components/content/article-layout";

export const metadata: Metadata = {
  title: "Durability Timelines",
  description: "What sag-risk rating and expected lifespan mean in practice, and how body weight changes them.",
};

export default function DurabilityTimelinesPage() {
  return (
    <ArticleLayout
      eyebrow="FAQ"
      eyebrowHref="/faq"
      title="Durability Timelines"
      dek="Two numbers drive the Durability sub-score: expected lifespan and sag-risk rating."
      relatedLinks={[
        { href: "/faq/trial-periods", label: "FAQ: Trial Periods" },
        { href: "/guides/back-support-for-heavy-back-sleepers", label: "Guide: Back Support for Heavier Back Sleepers" },
      ]}
    >
      <p>
        Every mattress in the catalog has an expected lifespan (in years) and a sag-risk rating (0&ndash;100, where
        higher means a greater chance of visible body impressions forming over time). Both feed the Durability
        sub-score, along with your weight band.
      </p>
      <h2>Why weight matters so much here</h2>
      <p>
        A sag-risk rating is measured independent of who's sleeping on the mattress, but heavier body weight
        accelerates how quickly that risk shows up in practice. That's why our scoring rules specifically boost
        or penalize the Durability sub-score based on your weight band: the same mattress can be a safe long-term
        bet for a lighter sleeper and a real risk for a heavier one.
      </p>
      <h2>What &ldquo;sag&rdquo; actually looks like</h2>
      <p>
        Sag typically shows up as a visible or felt depression where you consistently sleep, most common on
        all-foam constructions without a reinforced support core. Hybrids with a zoned, pocketed-coil support layer
        generally hold up better under sustained weight, which is reflected in their sag-risk ratings.
      </p>
      <h2>What the risk flag tells you</h2>
      <p>
        If you see a sag/durability risk flag, it means your weight band combined with that specific mattress's
        sag-risk rating crossed a threshold in our rule set. The mitigation text always suggests a concrete
        alternative construction, not just a generic warning.
      </p>
    </ArticleLayout>
  );
}
