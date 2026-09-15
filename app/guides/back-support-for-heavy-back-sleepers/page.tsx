import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/content/article-layout";
import { GuideExamplePicks } from "@/components/content/guide-example-picks";
import type { SleepProfile } from "@/contracts/mattress-match";

export const metadata: Metadata = {
  title: "Back Support for Heavier Back Sleepers",
  description: "How body weight changes the firmness and support-core math for back sleepers, with real scored examples.",
};

const exampleProfile: SleepProfile = {
  id: "guide-back-support-heavy",
  sleepPositions: ["back"],
  weightBand: "230-280",
  firmnessPreference: "medium-firm",
  budgetBand: "1200-1800",
  temperaturePreference: "neutral",
  motionSensitivity: "single",
  comfortFocus: ["back-alignment"],
  isFullProfile: true,
  createdAt: "2026-09-01T00:00:00.000Z",
};

export default function BackSupportGuidePage() {
  return (
    <ArticleLayout
      eyebrow="Guides"
      eyebrowHref="/guides"
      title="Back Support for Heavier Back Sleepers"
      dek="The same firmness rating that supports a lighter back sleeper can let a heavier back sleeper's hips sink out of alignment. Here's the math, and which mattresses hold up."
      relatedLinks={[
        { href: "/faq/back-support", label: "FAQ: Back Support" },
        { href: "/faq/firmness-tradeoffs", label: "FAQ: Firmness Tradeoffs" },
        { href: "/faq/durability-timelines", label: "FAQ: Durability Timelines" },
        { href: "/methodology", label: "Methodology" },
      ]}
    >
      <p>
        Back sleeping is generally easier on the body than side or stomach sleeping, but only if the mattress keeps
        the spine level from shoulders to hips. Body weight is the biggest variable most buying guides ignore: a
        mattress that supports a 150-pound back sleeper well can let a 250-pound back sleeper's hips sink further
        than their shoulders, arching the lower back overnight.
      </p>

      <h2>Why firmness numbers alone don't tell the story</h2>
      <p>
        A firmness rating describes how the mattress feels under a reference weight, not under yours specifically.
        Heavier sleepers compress the comfort layer further, effectively experiencing a softer mattress than the
        listed rating suggests. That's why our scoring rules apply a specific bonus for firmer, well-supported
        mattresses (firmness 6+ with a support rating of 70+) when your profile combines back sleeping with a
        heavier weight band, and a specific penalty when the same profile meets a mattress with firmness 5 or below.
      </p>

      <h2>Zoned support matters more here</h2>
      <p>
        A zoned support core reinforces the lumbar region specifically, rather than relying on uniform firmness
        across the whole mattress. If you flagged back alignment as a comfort focus, zoned-support mattresses get an
        additional score boost in our rule set.
      </p>

      <h2>Example: a heavier back sleeper, medium-firm preference</h2>
      <p>Scored against a 230&ndash;280 lb back sleeper with a $1,200&ndash;$1,800 budget:</p>
      <GuideExamplePicks exampleProfile={exampleProfile} />

      <h2>Don't ignore durability</h2>
      <p>
        Heavier body weight also accelerates long-term sag, which is why our Durability sub-score and sag/durability
        risk flag both factor in weight band separately from support. See{" "}
        <Link href="/faq/durability-timelines">durability timelines</Link> for the full picture.
      </p>
    </ArticleLayout>
  );
}
