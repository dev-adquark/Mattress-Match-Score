import type { Metadata } from "next";
import { ArticleLayout } from "@/components/content/article-layout";
import { GuideExamplePicks } from "@/components/content/guide-example-picks";
import type { SleepProfile } from "@/contracts/mattress-match";

export const metadata: Metadata = {
  title: "Cooling Comparison for Hot Sleepers",
  description: "What airflow rating, materials, and coil design actually do for temperature at night, with real scored examples.",
};

const exampleProfile: SleepProfile = {
  id: "guide-hot-sleeper-cooling",
  sleepPositions: ["back", "side"],
  weightBand: "180-230",
  firmnessPreference: "medium",
  budgetBand: "1800-2500",
  temperaturePreference: "hot",
  motionSensitivity: "single",
  isFullProfile: true,
  createdAt: "2026-09-01T00:00:00.000Z",
};

export default function HotSleeperCoolingGuidePage() {
  return (
    <ArticleLayout
      eyebrow="Guides"
      eyebrowHref="/guides"
      title="Cooling Comparison for Hot Sleepers"
      dek="“Sleeps cool” claims are everywhere. Here's what airflow rating, heat retention, and cooling features actually measure, and which mattresses in our catalog back it up."
      relatedLinks={[
        { href: "/faq/cooling", label: "FAQ: Cooling & Temperature" },
        { href: "/compare/cooling-hybrid-for-couples", label: "Compare: Cooling Hybrid for Couples" },
        { href: "/methodology", label: "Methodology" },
      ]}
    >
      <p>
        Heat complaints are one of the most common mattress regrets, and one of the hardest to predict from
        marketing copy alone. Our Cooling &amp; Airflow sub-score is built from three separate signals rather than
        a single vague claim.
      </p>

      <h2>Airflow rating</h2>
      <p>
        A measured 0&ndash;100 score for how easily heat and moisture move through the construction. Coil-based
        support layers generally score higher than dense all-foam layers, because air circulates through the coil
        layer itself.
      </p>

      <h2>Heat retention</h2>
      <p>
        A specific flag for dense comfort layers without active cooling countermeasures. When this is true and
        you're a self-reported hot sleeper, it drives both a Cooling &amp; Airflow penalty and a heat-retention risk
        flag with a concrete mitigation.
      </p>

      <h2>Active cooling features</h2>
      <p>
        Gel infusion, copper infusion, and breathable covers all offset (but don't fully cancel) a lower airflow
        rating. Latex is naturally more breathable than standard memory foam, which is part of why latex hybrids
        tend to score well here.
      </p>

      <h2>Example: a hot sleeper, medium firmness, $1,800&ndash;$2,500 budget</h2>
      <GuideExamplePicks exampleProfile={exampleProfile} />

      <h2>What to check in reviews</h2>
      <p>
        For a hot-sleeper profile, review highlights tagged{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">sleepsCool</code> and{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">sleepsHot</code> are always surfaced first on
        every mattress page and results card, so you see real feedback on temperature before anything else.
      </p>
    </ArticleLayout>
  );
}
