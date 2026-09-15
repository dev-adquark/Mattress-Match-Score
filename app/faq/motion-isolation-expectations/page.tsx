import type { Metadata } from "next";
import { ArticleLayout } from "@/components/content/article-layout";

export const metadata: Metadata = {
  title: "Motion Isolation Expectations",
  description: "What good motion isolation actually feels like for a shared bed, and which constructions deliver it.",
};

export default function MotionIsolationExpectationsPage() {
  return (
    <ArticleLayout
      eyebrow="FAQ"
      eyebrowHref="/faq"
      title="Motion Isolation Expectations"
      dek="Good motion isolation means your partner's 2am alarm doesn't wake you up too."
      relatedLinks={[
        { href: "/compare/motion-isolation-for-couples", label: "Compare: Motion Isolation for Couples" },
        { href: "/faq/edge-support", label: "FAQ: Edge Support" },
      ]}
    >
      <p>
        Motion isolation measures how much movement on one side of the bed transfers to the other side. It matters
        most for couples and light sleepers, which is why our Motion Isolation sub-score is weighted more heavily
        for anyone who selects &ldquo;Couple / shared bed&rdquo; or &ldquo;Highly motion-sensitive&rdquo;.
      </p>
      <h2>What drives it</h2>
      <p>
        All-foam and memory-foam constructions generally isolate motion best, since foam absorbs movement instead
        of transferring it. Traditional innerspring mattresses, especially those with interconnected coils, tend to
        transfer more motion across the bed. Hybrids fall somewhere in between depending on the coil design.
      </p>
      <h2>What a realistic expectation looks like</h2>
      <p>
        Even a mattress with excellent motion isolation won't fully hide a partner getting completely out of bed
        — it minimizes the ripple of smaller movements like shifting position or a phone buzzing. If your
        primary complaint is a partner's alarm waking you at a set time each morning, that's a scheduling problem a
        mattress can't fully solve.
      </p>
      <h2>How we prioritize this in reviews</h2>
      <p>
        For a couple or highly motion-sensitive profile, review highlights tagged{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">motionIsolationGood</code> and{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">motionIsolationPoor</code> are surfaced first, so
        you see the most relevant real feedback before anything else.
      </p>
    </ArticleLayout>
  );
}
