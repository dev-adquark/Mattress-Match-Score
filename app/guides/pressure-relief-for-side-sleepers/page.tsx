import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout } from "@/components/content/article-layout";
import { GuideExamplePicks } from "@/components/content/guide-example-picks";
import type { SleepProfile } from "@/contracts/mattress-match";

export const metadata: Metadata = {
  title: "Pressure Relief for Side Sleepers",
  description: "Why the shoulder and hip need a contouring surface, and which constructions deliver it, with real scored examples.",
};

const exampleProfile: SleepProfile = {
  id: "guide-pressure-relief-side",
  sleepPositions: ["side"],
  weightBand: "130-180",
  firmnessPreference: "medium-soft",
  budgetBand: "1200-1800",
  temperaturePreference: "neutral",
  motionSensitivity: "single",
  comfortFocus: ["pressure-points", "shoulder-relief", "hip-relief"],
  isFullProfile: true,
  createdAt: "2026-09-01T00:00:00.000Z",
};

export default function PressureReliefGuidePage() {
  return (
    <ArticleLayout
      eyebrow="Guides"
      eyebrowHref="/guides"
      title="Pressure Relief for Side Sleepers"
      dek="Side sleeping concentrates your body weight on the shoulder and hip — here's what actually cushions that, and which mattresses in our catalog score best for it."
      relatedLinks={[
        { href: "/faq/side-sleeping", label: "FAQ: Side Sleeping" },
        { href: "/faq/pressure-relief", label: "FAQ: Pressure Relief" },
        { href: "/faq/firmness-tradeoffs", label: "FAQ: Firmness Tradeoffs" },
        { href: "/compare/best-for-side-sleepers-under-1000", label: "Compare: Best for Side Sleepers Under $1,000" },
        { href: "/methodology", label: "Methodology" },
      ]}
    >
      <p>
        When you sleep on your side, roughly two-thirds of your body weight passes through the shoulder and hip.
        Unlike back sleeping, where weight spreads across a wider area, side sleeping needs a comfort layer that
        can compress enough at those two points without letting the rest of the body sink out of alignment.
      </p>

      <h2>What actually helps</h2>
      <p>
        Three things reliably improve pressure relief for side sleepers: a firmness in the soft-to-medium range
        (roughly 3&ndash;6 on a 10-point scale), a contouring material like memory foam or latex in the comfort
        layer, and enough comfort-layer thickness that you don't feel the firmer support core underneath at the hip.
      </p>

      <h2>What our scoring engine checks</h2>
      <p>
        Our Pressure Relief sub-score starts from a construction-derived baseline (firmness and materials), then
        applies rules like <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">PRESSURE_SIDE_SOFT_001</code>{" "}
        (a bonus for softer mattresses when you're a side sleeper) and{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">PRESSURE_SIDE_FIRM_PENALTY_001</code> (a penalty
        for firm mattresses in the same case). If you also flagged pressure points, hip relief, or shoulder relief
        as a comfort focus, that penalty/bonus is reinforced further.
      </p>

      <h2>Example: a side sleeper, medium-soft preference, $1,200&ndash;$1,800 budget</h2>
      <p>Here's how our catalog actually scores for that profile right now:</p>
      <GuideExamplePicks exampleProfile={exampleProfile} />

      <h2>What to watch for</h2>
      <p>
        A mattress that's soft enough to feel plush in the showroom can still score poorly on Support &amp;
        Alignment if the support core underneath is too weak for your weight band — check both sub-scores
        together, not just Pressure Relief in isolation. See our{" "}
        <Link href="/faq/back-support">back support FAQ</Link> for the alignment side of this tradeoff.
      </p>
    </ArticleLayout>
  );
}
