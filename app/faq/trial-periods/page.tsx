import type { Metadata } from "next";
import { ArticleLayout } from "@/components/content/article-layout";

export const metadata: Metadata = {
  title: "Trial Periods",
  description: "How mattress sleep trials work, how long they typically last, and what to actually test during one.",
};

export default function TrialPeriodsPage() {
  return (
    <ArticleLayout
      eyebrow="FAQ"
      eyebrowHref="/faq"
      title="Trial Periods"
      dek="A trial period is your real-world check against the Match Score estimate."
      relatedLinks={[
        { href: "/faq/durability-timelines", label: "FAQ: Durability Timelines" },
        { href: "/methodology", label: "Methodology" },
      ]}
    >
      <p>
        Trial nights in the catalog (shown on every mattress page) reflect how long you can sleep on the mattress
        at home before deciding whether to keep it, typically with a full refund if you return it. In our catalog
        trial lengths range from 60 to 365 nights.
      </p>
      <h2>Why the number varies so much</h2>
      <p>
        Longer trials are more common on premium hybrids, since manufacturers expect the break-in period (when
        foam layers soften slightly) to take several weeks. Budget mattresses sometimes offer shorter trials.
        Check the specific trial length on each mattress's detail page before buying.
      </p>
      <h2>What to actually test</h2>
      <ul>
        <li>Sleep in every position you selected in your profile, not just your usual one.</li>
        <li>Pay attention to temperature over at least a few nights, not just the first one.</li>
        <li>If you share the bed, have both people test getting in and out near the edge.</li>
        <li>Compare how you feel against the specific risk flags shown on your Match Score — if a support-mismatch flag was raised, check for lower-back stiffness in the morning.</li>
      </ul>
      <h2>Trials don't replace the score, they confirm it</h2>
      <p>
        The Match Score is meant to narrow down which mattresses are worth trialing in the first place — it's
        not a substitute for actually sleeping on one.
      </p>
    </ArticleLayout>
  );
}
