import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { appConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "How affiliate links work on Mattress Match Score, and how affiliate relationships relate to the Match Score.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-slate-200 py-8 first:border-t-0 first:pt-0">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <div className="mt-3 space-y-3 text-slate-600">{children}</div>
    </section>
  );
}

export default function AffiliateDisclosurePage() {
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Affiliate Disclosure</h1>
      <p className="mt-3 text-slate-600">
        In plain language: some of the &ldquo;View at [Retailer]&rdquo; buttons on this site are affiliate links.
      </p>

      <div className="mt-6">
        <Section title="What that means">
          <p>
            When you click a &ldquo;View at [Retailer]&rdquo; button and make a purchase, we may earn a commission
            from that retailer, at no extra cost to you. Every outbound retailer link on this site is generated
            through the same tracked link format, tagged with{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">utm_source={appConfig.affiliate.utmSource}</code>,{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">utm_medium={appConfig.affiliate.utmMedium}</code>, a
            campaign identifier, and a click id.
          </p>
        </Section>

        <Section title="Affiliate relationships do not set the score">
          <p>
            Whether we have an affiliate relationship with a retailer has no bearing on a mattress's algorithmic
            Match Score. The scoring engine only ever looks at your sleep profile and a mattress's construction
            attributes &mdash; see our{" "}
            <Link href="/methodology" className="text-teal-700 hover:underline">
              methodology
            </Link>
            .
          </p>
        </Section>

        <Section title="Sponsored listings are labeled separately">
          <p>
            Some listings are additionally <em>sponsored</em>, meaning a brand paid for placement in a specific
            slot. Those are always labeled <strong>Sponsored</strong>, never disguised as an algorithmic
            recommendation. Read our{" "}
            <Link href="/sponsored-policy" className="text-teal-700 hover:underline">
              sponsored policy
            </Link>{" "}
            for the details.
          </p>
        </Section>

        <Section title="Our commitment">
          <p>
            We will never hide that a link is an affiliate link, never fabricate a verification status, and never
            let a commercial relationship change a Match Score.
          </p>
        </Section>
      </div>
    </Container>
  );
}
