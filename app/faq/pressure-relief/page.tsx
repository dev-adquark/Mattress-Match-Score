import type { Metadata } from "next";
import { ArticleLayout } from "@/components/content/article-layout";

export const metadata: Metadata = {
  title: "Pressure Relief",
  description: "How the Pressure Relief sub-score is derived, and what improves it.",
};

export default function PressureReliefFaqPage() {
  return (
    <ArticleLayout
      eyebrow="FAQ"
      eyebrowHref="/faq"
      title="Pressure Relief"
      dek="Pressure relief is about cushioning specific contact points, not overall softness."
      relatedLinks={[
        { href: "/guides/pressure-relief-for-side-sleepers", label: "Guide: Pressure Relief for Side Sleepers" },
        { href: "/faq/firmness-tradeoffs", label: "FAQ: Firmness Tradeoffs" },
      ]}
    >
      <p>
        The Pressure Relief sub-score starts from a mattress's baseline, computed from its firmness scale and
        materials during data ingestion: softer firmness and contouring materials like memory foam, latex, and
        pillow-top layers all raise the baseline.
      </p>
      <h2>How your profile adjusts it</h2>
      <p>
        If you're a side sleeper, or selected pressure points, hip relief, or shoulder relief as a comfort focus, a
        firmer mattress gets an additional penalty and a softer one gets a boost — because side sleeping
        concentrates weight on smaller contact points that need more cushioning. Stomach sleepers see the opposite
        adjustment, since too much sinkage at the hips causes its own problems.
      </p>
      <h2>Why it's a separate score from Support &amp; Alignment</h2>
      <p>
        A mattress can relieve pressure well at the surface while still providing poor deep support (common with
        very soft all-foam beds), or provide excellent support while feeling firm at contact points (common with
        firm hybrids). Splitting these into two sub-scores keeps that tradeoff visible instead of averaging it away.
      </p>
      <h2>What the review tags mean</h2>
      <p>
        Reviews tagged <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">greatPressureRelief</code> are
        prioritized to the top for exactly this profile combination; reviews tagged{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">tooFirm</code> or{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">tooSoft</code> surface alongside them so you see
        both sides.
      </p>
    </ArticleLayout>
  );
}
