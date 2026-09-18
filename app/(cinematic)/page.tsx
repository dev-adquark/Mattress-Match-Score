import Link from "next/link";
import type { Metadata } from "next";
import {
  AlertTriangle,
  Gauge,
  ListChecks,
  MoveHorizontal,
  ShieldCheck,
  Snowflake,
  Sofa,
  SplitSquareHorizontal,
  Wind,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CinematicStage } from "@/components/three/cinematic-stage";
import { getAllComparisonTopics } from "@/lib/repositories/comparison-topic-repository";

export const metadata: Metadata = {
  title: "Find Your Personalized Mattress Match",
  description:
    "Mattress Match Score evaluates your sleep profile and produces a transparent, auditable Match Score — not just a generic star rating.",
};

const SCORE_CATEGORIES = [
  { icon: Sofa, title: "Pressure Relief", detail: "How well the surface cushions the shoulder and hip." },
  { icon: Gauge, title: "Support & Alignment", detail: "Whether the core keeps your spine level all night." },
  { icon: Wind, title: "Cooling & Airflow", detail: "How likely the construction is to trap or dissipate heat." },
  { icon: SplitSquareHorizontal, title: "Motion Isolation", detail: "How much a partner's movement transfers to you." },
  { icon: ShieldCheck, title: "Edge Support", detail: "How usable the perimeter is for sitting and sleeping." },
  { icon: MoveHorizontal, title: "Responsiveness", detail: "How easily the surface lets you change positions." },
  { icon: Snowflake, title: "Durability", detail: "Expected lifespan and long-term sag risk for your weight." },
];

const heroSection = (
  <section className="border-b border-slate-200 bg-gradient-to-b from-teal-50 to-white">
    <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-28">
      <div>
        <span className="inline-flex items-center rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
          A transparent, rule-based Match Score
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Find a mattress that matches <span className="text-teal-700">your</span> sleep profile — not
          just someone else&rsquo;s rating.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-slate-600">
          Generic star ratings average everyone together. Mattress Match Score evaluates your sleep position,
          weight, firmness preference, and temperature to produce a personalized score you can actually audit.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/match">Find My Match</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/methodology">How scoring works</Link>
          </Button>
        </div>
      </div>
      <div className="relative">
        <Card className="rotate-1 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Your Match Score</p>
                <p className="text-5xl font-bold text-teal-700">92</p>
                <p className="text-sm font-semibold text-teal-800">Excellent Match</p>
              </div>
              <Gauge className="h-12 w-12 text-teal-200" aria-hidden="true" />
            </div>
            <ul className="mt-6 space-y-3">
              {[
                ["Pressure Relief", 94],
                ["Support & Alignment", 90],
                ["Cooling & Airflow", 82],
                ["Motion Isolation", 96],
              ].map(([label, value]) => (
                <li key={label as string}>
                  <div className="mb-1 flex justify-between text-xs font-medium text-slate-600">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-teal-600" style={{ width: `${value}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Container>
  </section>
);

const problemSection = (
  <section className="py-16 sm:py-20">
    <Container>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Star ratings hide who they're averaged over</h2>
        <p className="mt-4 text-slate-600">
          A 4.7-star mattress might be a fantastic match for a lightweight side sleeper and a poor match for a
          heavier back sleeper who runs hot. Averaging thousands of different sleepers into one number erases
          exactly the information you need to make a good decision. Mattress Match Score keeps your profile in
          the loop instead of averaging it away.
        </p>
      </div>
    </Container>
  </section>
);

const profileTeaserSection = (
  <section className="py-16 sm:py-20">
    <Container className="mx-auto max-w-3xl">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Your personalized score is just minutes away</h2>
        <p className="mt-4 text-slate-600">
          Answer a few questions about your sleep preferences, and we'll show you exactly which mattresses match your profile—
          with a transparent, auditable score you can trust.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/match">Start Your Profile</Link>
          </Button>
        </div>
      </div>
    </Container>
  </section>
);

export default function HomePage() {
  const topics = getAllComparisonTopics();

  return (
    <>
      <CinematicStage hero={heroSection} problem={problemSection} profileTeaser={profileTeaserSection} />

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">How it works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "1", title: "Tell us how you sleep", detail: "Position, weight, firmness preference, budget, and temperature." },
              { step: "2", title: "Score your compatibility", detail: "Our rule-based engine scores every mattress against your profile." },
              { step: "3", title: "Compare the best matches", detail: "See ranked picks side-by-side with full sub-scores." },
              { step: "4", title: "Understand risks and tradeoffs", detail: "Every mismatch is flagged with a reason and a mitigation." },
            ].map((item) => (
              <Card key={item.step}>
                <CardContent className="p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <Link href="/match">Find My Match</Link>
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Seven scores, not one</h2>
            <Link href="/methodology" className="hidden text-sm font-semibold text-teal-700 hover:underline sm:block">
              Read the full methodology &rarr;
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SCORE_CATEGORIES.map(({ icon: Icon, title, detail }) => (
              <Card key={title}>
                <CardContent className="p-5">
                  <Icon className="h-6 w-6 text-teal-700" aria-hidden="true" />
                  <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600">{detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 sm:hidden">
            <Link href="/methodology" className="text-sm font-semibold text-teal-700 hover:underline">
              Read the full methodology &rarr;
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-amber-50 py-16 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-center">
          <div>
            <AlertTriangle className="h-8 w-8 text-amber-700" aria-hidden="true" />
            <h2 className="mt-3 text-2xl font-bold text-slate-900">We tell you when something might not fit</h2>
          </div>
          <p className="text-slate-700">
            Every recommendation is checked against a rule set for support mismatches, heat retention likelihood,
            edge support concerns, and sag/durability risk. When a mismatch applies to your profile, you'll see a
            plain-language risk flag with the reason and a concrete mitigation — not just a lower star rating
            with no explanation.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Featured comparisons</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {topics.map((topic) => (
              <Link key={topic.slug} href={`/compare/${topic.slug}`} className="group block">
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base group-hover:text-teal-700">{topic.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">{topic.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
        <Container>
          <div className="flex items-center gap-3">
            <ListChecks className="h-6 w-6 text-teal-700" />
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How we handle trust &amp; disclosure</h2>
          </div>
          <p className="mt-4 max-w-3xl text-slate-600">
            Some listings on this site are sponsored. We never let sponsorship change an algorithmic Match Score, and
            we never label a sponsored listing as an algorithmic recommendation. Read the details:
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/methodology">Methodology</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sponsored-policy">Sponsored policy</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/affiliate-disclosure">Affiliate disclosure</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/faq">FAQ</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
