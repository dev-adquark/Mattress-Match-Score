import type { Metadata } from "next";
import { ArticleLayout } from "@/components/content/article-layout";

export const metadata: Metadata = {
  title: "Side Sleeping",
  description: "What side sleepers should prioritize in a mattress, and where mismatches usually show up.",
};

export default function SideSleepingFaqPage() {
  return (
    <ArticleLayout
      eyebrow="FAQ"
      eyebrowHref="/faq"
      title="Side Sleeping"
      dek="Side sleepers concentrate their body weight on the shoulder and hip — the mattress needs to plan for that."
      relatedLinks={[
        { href: "/guides/pressure-relief-for-side-sleepers", label: "Guide: Pressure Relief for Side Sleepers" },
        { href: "/compare/best-for-side-sleepers-under-1000", label: "Compare: Best for Side Sleepers Under $1,000" },
      ]}
    >
      <p>
        Side sleeping puts most of your body weight through two relatively small contact points: the shoulder and
        the hip. Without enough give in the comfort layer, that pressure has nowhere to go, which is the most
        common cause of numbness or soreness reported by side sleepers.
      </p>
      <h2>What to prioritize</h2>
      <ul>
        <li>A firmness in the soft-to-medium range, generally 6/10 or below.</li>
        <li>A comfort layer with real contouring — memory foam and latex both do this well.</li>
        <li>A Pressure Relief sub-score that's clearly higher than the mattress's overall score, not just an average.</li>
      </ul>
      <h2>Where mismatches show up</h2>
      <p>
        A too-firm mattress for a side sleeper typically triggers a lower Pressure Relief sub-score and review
        highlights tagged <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">tooFirm</code>. If you also
        selected shoulder or hip relief as a comfort focus, those highlights are prioritized to the top of the
        review list for exactly this reason.
      </p>
      <h2>Combination sleepers who spend time on their side</h2>
      <p>
        If you selected combination sleeping, our rules still apply the side-sleeping pressure-relief logic when it
        matches, alongside responsiveness rules that reward a surface you can reposition on easily.
      </p>
    </ArticleLayout>
  );
}
