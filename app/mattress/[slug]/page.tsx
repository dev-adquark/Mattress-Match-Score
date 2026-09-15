import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Clock, ShieldAlert } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AffiliateCta } from "@/components/mattress/affiliate-cta";
import { MattressScoreDemo } from "@/components/mattress/mattress-score-demo";
import { ReviewHighlights } from "@/components/results/review-highlights";
import { getAllSlugs, getMattressBySlug } from "@/lib/repositories/mattress-repository";
import { getReviewHighlightsForMattress } from "@/lib/repositories/review-repository";
import { buildAffiliateLinksForMattress } from "@/lib/affiliate/links";
import { buildGenericRiskIndicators } from "@/lib/mattress/risk-indicators";
import { listSponsoredPlacements } from "@/lib/repositories/sponsored-repository";
import { isPlacementStale } from "@/lib/sponsored/placements";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const mattress = getMattressBySlug(slug);
  if (!mattress) return { title: "Mattress not found" };
  return {
    title: `${mattress.brand} ${mattress.model} — Specs, Score & Reviews`,
    description: mattress.description,
  };
}

export default async function MattressDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mattress = getMattressBySlug(slug);
  if (!mattress) notFound();

  const reviewHighlights = [...getReviewHighlightsForMattress(mattress.id)]
    .sort((a, b) => (b.helpfulVotes ?? 0) - (a.helpfulVotes ?? 0))
    .slice(0, 5)
    .map((h) => ({ ...h, relevanceScore: h.helpfulVotes ?? 0 }));
  const affiliateLinks = buildAffiliateLinksForMattress(mattress);
  const riskIndicators = buildGenericRiskIndicators(mattress);
  const sponsoredPlacements = listSponsoredPlacements()
    .filter((p) => p.mattressId === mattress.id)
    .map((p) => ({ ...p, isStale: isPlacementStale(p) }));

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${mattress.brand} ${mattress.model}`,
    description: mattress.description,
    brand: { "@type": "Brand", name: mattress.brand },
    offers: {
      "@type": "Offer",
      price: mattress.basePrice,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <Container className="max-w-4xl py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/results" className="hover:text-teal-700">
          Results
        </Link>{" "}
        / <span className="text-slate-700">{mattress.brand} {mattress.model}</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {mattress.brand} {mattress.model}
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">{mattress.description}</p>
        </div>
        <p className="text-2xl font-bold text-slate-900">${mattress.basePrice}</p>
      </div>

      {sponsoredPlacements.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {sponsoredPlacements.map((p) => (
            <Badge key={p.id} variant="sponsored">
              Sponsored{p.scope.type === "topic" ? ` — ${p.scope.topic}` : ""}
              {p.verificationStatus === "verified" && !p.isStale && p.lastVerifiedAt ? (
                <span className="ml-1 inline-flex items-center gap-1 text-emerald-800">
                  <BadgeCheck className="h-3 w-3" /> Verified &mdash; {p.lastVerifiedAt}
                </span>
              ) : p.verificationStatus === "pending" ? (
                <span className="ml-1 inline-flex items-center gap-1 text-slate-600">
                  <Clock className="h-3 w-3" /> Verification pending
                </span>
              ) : (
                <span className="ml-1 inline-flex items-center gap-1 text-red-700">
                  <ShieldAlert className="h-3 w-3" /> Verification expired
                </span>
              )}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-900">Specs</h2>
              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-slate-500">Type</dt>
                  <dd className="font-medium text-slate-900">{mattress.types.join(", ")}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Height</dt>
                  <dd className="font-medium text-slate-900">{mattress.heightInches}&Prime;</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Firmness</dt>
                  <dd className="font-medium text-slate-900">
                    {mattress.firmnessScale}/10 ({mattress.firmnessLabel})
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Trial</dt>
                  <dd className="font-medium text-slate-900">{mattress.trialNights} nights</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Warranty</dt>
                  <dd className="font-medium text-slate-900">{mattress.warrantyYears} years</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Price</dt>
                  <dd className="font-medium text-slate-900">${mattress.basePrice}</dd>
                </div>
              </dl>
              <div className="mt-4">
                <dt className="text-sm text-slate-500">Materials</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {mattress.materials.map((m) => (
                    <span key={m} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {m}
                    </span>
                  ))}
                </dd>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">Your match score</h2>
            <p className="mt-1 text-sm text-slate-600">
              This uses the same scoring engine as your results page. Model version and full trace available via{" "}
              <Link href="/methodology" className="text-teal-700 hover:underline">
                methodology
              </Link>
              .
            </p>
            <div className="mt-4">
              <MattressScoreDemo mattressId={mattress.id} />
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-900">Review highlights</h2>
              <p className="mt-1 text-sm text-slate-600">Sorted by helpfulness. Run the score demo above for highlights ranked to your profile.</p>
              <div className="mt-4">
                <ReviewHighlights highlights={reviewHighlights} />
              </div>
            </CardContent>
          </Card>

          {riskIndicators.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900">General risk indicators</h2>
                <p className="mt-1 text-sm text-slate-600">
                  These are construction-based, not personalized. Run the score demo for risk flags specific to your
                  profile.
                </p>
                <ul className="mt-3 space-y-2">
                  {riskIndicators.map((indicator) => (
                    <li key={indicator.code} className="text-sm text-slate-700">
                      <Badge variant={indicator.severity === "high" ? "riskHigh" : "riskMedium"}>{indicator.severity}</Badge>{" "}
                      {indicator.label}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-3 p-6">
              <h2 className="text-sm font-semibold text-slate-900">Where to buy</h2>
              {affiliateLinks.map((link) => (
                <AffiliateCta
                  key={link.partnerId}
                  href={link.url}
                  retailerName={link.retailerName}
                  mattressId={mattress.id}
                  placementType={sponsoredPlacements.length > 0 ? "sponsored" : "algorithmic"}
                  className="w-full justify-center"
                />
              ))}
              <p className="text-xs text-slate-500">
                We may earn a commission from purchases. See our{" "}
                <Link href="/affiliate-disclosure" className="underline hover:text-teal-700">
                  affiliate disclosure
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2 p-6 text-sm">
              <Link href="/methodology" className="block font-medium text-teal-700 hover:underline">
                How Match Score works
              </Link>
              <Link href="/sponsored-policy" className="block font-medium text-teal-700 hover:underline">
                Sponsored placement policy
              </Link>
              <Link href="/affiliate-disclosure" className="block font-medium text-teal-700 hover:underline">
                Affiliate disclosure
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
