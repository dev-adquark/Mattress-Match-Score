import type { Metadata } from "next";
import { ArticleLayout } from "@/components/content/article-layout";

export const metadata: Metadata = {
  title: "Firmness Tradeoffs",
  description: "Why there's no single \"best\" firmness, and how it interacts with sleep position and body weight.",
};

export default function FirmnessTradeoffsPage() {
  return (
    <ArticleLayout
      eyebrow="FAQ"
      eyebrowHref="/faq"
      title="Firmness Tradeoffs"
      dek="There's no universally “best” firmness — only a best firmness for your position and weight."
      relatedLinks={[
        { href: "/guides/back-support-for-heavy-back-sleepers", label: "Guide: Back Support for Heavier Back Sleepers" },
        { href: "/faq/pressure-relief", label: "FAQ: Pressure Relief" },
        { href: "/methodology", label: "Methodology" },
      ]}
    >
      <p>
        Firmness is often marketed as a single number, but what actually matters is the combination of firmness,
        your sleep position, and your body weight. A firmness rating that feels perfect for one shopper can feel
        completely wrong for another.
      </p>
      <h2>Why position changes the math</h2>
      <p>
        Side sleepers generally need more give at the shoulder and hip, so a softer-to-medium surface tends to
        relieve pressure better. Back and stomach sleepers generally need a firmer, more supportive core to keep the
        hips from sinking out of alignment with the shoulders. That's why our scoring engine applies different
        firmness-related rules depending on which position (or positions) you selected.
      </p>
      <h2>Why weight changes the math</h2>
      <p>
        A given firmness rating compresses differently under different body weights. A mattress rated &ldquo;medium&rdquo;
        might feel medium-soft to a lighter sleeper and medium-firm to a heavier sleeper. Our weight-band rules
        exist specifically to correct for this: a heavier back sleeper on a soft mattress triggers a support-mismatch
        risk flag even if the listed firmness sounds reasonable on paper.
      </p>
      <h2>What to do with this</h2>
      <p>
        Use your Match Score's Support &amp; Alignment and Pressure Relief sub-scores together, not firmness alone.
        If one is high and the other is low, that tension is exactly what a single star rating would hide.
      </p>
    </ArticleLayout>
  );
}
