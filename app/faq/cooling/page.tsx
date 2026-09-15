import type { Metadata } from "next";
import { ArticleLayout } from "@/components/content/article-layout";

export const metadata: Metadata = {
  title: "Cooling & Temperature",
  description: "The difference between airflow rating, heat retention, and active cooling features.",
};

export default function CoolingFaqPage() {
  return (
    <ArticleLayout
      eyebrow="FAQ"
      eyebrowHref="/faq"
      title="Cooling & Temperature"
      dek="Three different things get lumped together as “cooling” — here's how we separate them."
      relatedLinks={[
        { href: "/guides/hot-sleeper-cooling-comparison", label: "Guide: Cooling Comparison for Hot Sleepers" },
        { href: "/compare/cooling-hybrid-for-couples", label: "Compare: Cooling Hybrid for Couples" },
      ]}
    >
      <p>
        &ldquo;Sleeps cool&rdquo; is one of the most common marketing claims and one of the least standardized. Our
        Cooling &amp; Airflow sub-score is built from three separate, measurable inputs.
      </p>
      <h2>Airflow rating</h2>
      <p>
        A 0&ndash;100 rating reflecting how easily heat and moisture can move through the construction. Coil-based
        support layers generally score higher here than dense all-foam layers, because air can circulate through
        the coil layer.
      </p>
      <h2>Heat retention flag</h2>
      <p>
        A simple yes/no attribute for whether the comfort layer is a dense, heat-trapping material without active
        cooling countermeasures. This is what drives our heat-retention risk flag for hot sleepers.
      </p>
      <h2>Active cooling features</h2>
      <p>
        Things like gel infusion, copper infusion, phase-change covers, or latex (which is naturally more breathable
        than standard memory foam). These features offset, but don't fully cancel out, a low airflow rating or a
        heat-retaining base layer.
      </p>
      <h2>What we recommend for hot sleepers</h2>
      <p>
        Prioritize an airflow rating above 70 and a &ldquo;no&rdquo; on heat retention. If a mattress you like scores
        lower on both, you'll see it flagged — with a mitigation like a breathable mattress protector or
        moisture-wicking sheets — rather than a silent low score.
      </p>
    </ArticleLayout>
  );
}
