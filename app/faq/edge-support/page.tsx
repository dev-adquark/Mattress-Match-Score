import type { Metadata } from "next";
import { ArticleLayout } from "@/components/content/article-layout";

export const metadata: Metadata = {
  title: "Edge Support",
  description: "Why edge support matters more than people expect, especially for couples.",
};

export default function EdgeSupportFaqPage() {
  return (
    <ArticleLayout
      eyebrow="FAQ"
      eyebrowHref="/faq"
      title="Edge Support"
      dek="Weak edges effectively shrink the usable surface of the mattress — which matters most when two people share it."
      relatedLinks={[
        { href: "/faq/motion-isolation-expectations", label: "FAQ: Motion Isolation Expectations" },
        { href: "/compare/motion-isolation-for-couples", label: "Compare: Motion Isolation for Couples" },
      ]}
    >
      <p>
        Edge support describes how much the mattress compresses when weight is placed near its perimeter, whether
        you're sitting on the edge to put on shoes or sleeping close to it. Weak edge support effectively reduces
        how much of the mattress is comfortably usable.
      </p>
      <h2>Why it matters more for couples</h2>
      <p>
        On a shared bed, each person typically sleeps closer to their own edge rather than the center. If the
        edges compress significantly, both people lose usable space, which is why our edge-support rules apply
        extra weight for anyone who selected &ldquo;Couple / shared bed&rdquo; or &ldquo;Highly motion-sensitive&rdquo;.
      </p>
      <h2>What drives a strong edge-support rating</h2>
      <p>
        A reinforced perimeter — typically a firmer foam encasement or denser coil border around the edge of
        the mattress — is the single biggest factor. Mattresses without one are flagged for couples even when
        their overall edge rating isn't extremely low, since a moderate edge rating combined with no reinforcement
        tends to feel worse in practice than the number alone suggests.
      </p>
      <h2>A reasonable mitigation</h2>
      <p>
        If you love a mattress that scores lower here, bed rails or a slightly larger mattress size than you'd
        otherwise choose can help offset the practical impact of weaker edge support.
      </p>
    </ArticleLayout>
  );
}
