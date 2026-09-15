import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { appConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Sponsored Policy",
  description: "How sponsored placements work on Mattress Match Score, and how they differ from algorithmic recommendations.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-slate-200 py-8 first:border-t-0 first:pt-0">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <div className="mt-3 space-y-3 text-slate-600">{children}</div>
    </section>
  );
}

export default function SponsoredPolicyPage() {
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sponsored Policy</h1>
      <p className="mt-3 text-slate-600">
        Some brands pay to appear in a designated sponsored slot on results, comparison, and mattress pages. This
        page explains exactly what that means and what it never means.
      </p>

      <div className="mt-6">
        <Section title="What a sponsored placement is">
          <p>
            A sponsored placement gives a specific mattress a guaranteed, clearly labeled slot (
            <Badge variant="sponsored">Sponsored</Badge>) on a results page, a comparison topic page, or both. It is
            purchased by the brand or retailer, not earned algorithmically.
          </p>
        </Section>

        <Section title="What it never does">
          <ul className="ml-5 list-disc space-y-1">
            <li>It never changes that mattress's algorithmic Match Score.</li>
            <li>It never changes that mattress's independent algorithmic rank, which is always shown alongside it.</li>
            <li>
              It never appears labeled as <Badge variant="algorithmic">Algorithmic Pick</Badge> &mdash; the two
              labels are mutually exclusive and visually distinct everywhere on the site.
            </li>
            <li>We never use language like &ldquo;Best&rdquo; or &ldquo;Editor&rsquo;s Pick&rdquo; for a paid placement.</li>
          </ul>
        </Section>

        <Section title="Verification process">
          <p>
            Sponsored listings carry a verification status: <Badge variant="verified">Verified</Badge>,{" "}
            <Badge variant="pending">Pending</Badge>, or <Badge variant="expired">Expired</Badge>. A verified
            listing shows the real date it was last verified (e.g. &ldquo;Verified &mdash; 2026-08-20&rdquo;) &mdash;
            never today's date unless verification actually happened today. Verification is performed through an
            internal workflow (see <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">POST /api/verify-sponsored</code>)
            that requires an explicit status and timestamp; a placement can never silently appear verified without
            one.
          </p>
        </Section>

        <Section title="Stale listing handling">
          <p>
            A verified placement is automatically treated as stale once it is older than{" "}
            {appConfig.sponsored.staleAfterDays} days, and any placement that is pending or expired is always
            treated as needing attention. Stale or unverified listings are shown with their actual status rather
            than a false &ldquo;Verified&rdquo; badge.
          </p>
        </Section>

        <Section title="Disclosure">
          <p>
            Every sponsored card includes its own disclosure text explaining that the brand paid for placement and
            that sponsorship does not affect its Match Score. See our{" "}
            <Link href="/affiliate-disclosure" className="text-teal-700 hover:underline">
              affiliate disclosure
            </Link>{" "}
            for how outbound retailer links work, and our{" "}
            <Link href="/methodology" className="text-teal-700 hover:underline">
              methodology
            </Link>{" "}
            for how scoring works.
          </p>
        </Section>
      </div>
    </Container>
  );
}
