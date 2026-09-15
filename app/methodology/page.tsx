import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { CURRENT_MODEL_VERSION } from "@/lib/scoring/engine";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How the Mattress Match Score engine scores mattresses, flags risks, and separates sponsored placement from algorithmic ranking.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-slate-200 py-8 first:border-t-0 first:pt-0">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <div className="mt-3 space-y-3 text-slate-600">{children}</div>
    </section>
  );
}

export default function MethodologyPage() {
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
        Current model version: {CURRENT_MODEL_VERSION}
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Methodology</h1>
      <p className="mt-3 text-slate-600">
        Mattress Match Score is decision-support software: a transparent, rule-based estimate of fit, not a
        guarantee of comfort or a substitute for trying a mattress yourself.
      </p>

      <div className="mt-6">
        <Section title="What goes into your profile">
          <p>
            We collect your sleep position(s), weight range, firmness preference, budget, mattress type
            preferences, temperature preference, motion sensitivity / couple status, and (optionally) height, BMI
            range, comfort focus, and preferred surface feel. BMI range is used only to refine support estimates
            and is never presented as a medical judgment.
          </p>
        </Section>

        <Section title="What we know about each mattress">
          <p>
            Every mattress in the catalog has a normalized set of construction attributes: firmness scale,
            materials, support-core design, measured airflow rating, motion isolation rating, edge support rating,
            responsiveness rating, and durability indicators (expected lifespan and sag-risk rating). These
            attributes are computed once during data ingestion (see{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">scripts/ingest-mattresses.js</code>) into a
            set of construction-derived <em>baseline sub-scores</em>, before any profile-specific adjustment is
            applied.
          </p>
        </Section>

        <Section title="How scoring works">
          <p>
            The engine (<code className="rounded bg-slate-100 px-1 py-0.5 text-sm">scoreEngine</code>, version{" "}
            {CURRENT_MODEL_VERSION}) starts from a mattress's baseline sub-scores and applies a configurable set of
            rules from <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">data/scoring-rules.json</code>.
            Each rule compares your profile and a mattress's attributes; when both match a rule's conditions, it
            adds or subtracts points from one of seven category scores. Every rule that fires is recorded in a
            trace so the result is fully auditable.
          </p>
          <p>The seven category scores, each on a 0&ndash;100 scale:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li><strong>Pressure Relief</strong> &mdash; how well the surface cushions the shoulder and hip.</li>
            <li><strong>Support &amp; Alignment</strong> &mdash; whether the core keeps your spine level overnight.</li>
            <li><strong>Cooling &amp; Airflow</strong> &mdash; how likely the construction is to trap or dissipate heat.</li>
            <li><strong>Motion Isolation</strong> &mdash; how much a partner's movement transfers across the bed.</li>
            <li><strong>Edge Support</strong> &mdash; how usable the perimeter is for sitting and sleeping.</li>
            <li><strong>Responsiveness</strong> &mdash; how easily the surface lets you change positions.</li>
            <li><strong>Durability</strong> &mdash; expected lifespan and long-term sag risk for your weight band.</li>
          </ul>
          <p>
            The <strong>overall Match Score</strong> is a weighted average of the seven category scores (weights are
            configured in the ruleset, not hard-coded per mattress), rounded to the nearest whole number and bucketed
            into a tier: Excellent, Great, Good, Fair, or Weak Match.
          </p>
        </Section>

        <Section title="Risk flags">
          <p>
            Separately from the score, a set of risk rules checks for specific mismatches: support mismatches, heat
            retention likelihood, edge support concerns, and sag/durability risk. A risk flag only ever appears when
            a specific rule in the ruleset matched your profile and the mattress's attributes &mdash; each flag
            carries the rule's rationale and a concrete mitigation. Nothing is fabricated or shown without a
            matching rule.
          </p>
        </Section>

        <Section title="Why this match?">
          <p>
            Every recommendation includes a short list of the highest-impact rules that improved its score for your
            specific profile, plus a note on whether the price falls within your stated budget. You can see the full
            trace &mdash; every rule that fired, in both directions &mdash; via the score API.
          </p>
        </Section>

        <Section title="Review-tag mapping">
          <p>
            Review highlights are tagged from a controlled vocabulary (e.g. <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">sleepsHot</code>,{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">greatEdgeSupport</code>). We re-rank which
            highlights surface first based on your profile: a hot sleeper sees cooling-related highlights first, a
            couple sees motion-isolation and edge-support highlights first, and so on. See{" "}
            <Link href="/guides/hot-sleeper-cooling-comparison" className="text-teal-700 hover:underline">
              our cooling guide
            </Link>{" "}
            for a worked example.
          </p>
        </Section>

        <Section title="Confidence and data freshness">
          <p>
            Review highlights and catalog data are labeled with a confidence level: verified, sourced, seeded, or
            uncertain. The current catalog and review set is demo/seed data, clearly labeled as such throughout the
            product &mdash; we never present seed data as independently verified.
          </p>
        </Section>

        <Section title="Sponsorship vs. algorithmic ranking">
          <p>
            Sponsorship is resolved completely separately from scoring. A sponsored placement can occupy a
            designated slot on a results or comparison page, but it never changes that mattress's algorithmic score
            or its independent algorithmic rank &mdash; both are always computed and displayed. See our{" "}
            <Link href="/sponsored-policy" className="text-teal-700 hover:underline">
              sponsored policy
            </Link>{" "}
            and{" "}
            <Link href="/affiliate-disclosure" className="text-teal-700 hover:underline">
              affiliate disclosure
            </Link>{" "}
            for details.
          </p>
        </Section>

        <Section title="Limitations">
          <p>
            Match Score is a decision-support estimate based on a rule set and a normalized catalog, not a
            guarantee of comfort. Individual results vary. It cannot account for factors we don't collect (e.g.
            existing injuries) and should not be treated as medical advice. Always use a mattress's sleep trial to
            confirm fit.
          </p>
        </Section>
      </div>
    </Container>
  );
}
