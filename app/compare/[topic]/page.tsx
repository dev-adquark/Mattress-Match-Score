import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { randomUUID } from "crypto";
import { Container } from "@/components/layout/container";
import { ProfileSummary } from "@/components/results/profile-summary";
import { RecommendationListWithComparison } from "@/components/results/recommendation-list-with-comparison";
import { getAllComparisonTopics, getComparisonTopicBySlug } from "@/lib/repositories/comparison-topic-repository";
import { getMattressesByIds } from "@/lib/repositories/mattress-repository";
import { buildRecommendations } from "@/lib/recommendations/build-recommendations";
import { CURRENT_MODEL_VERSION } from "@/lib/scoring/engine";
import type { SleepProfile } from "@/contracts/mattress-match";

export function generateStaticParams() {
  return getAllComparisonTopics().map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = getComparisonTopicBySlug(topicSlug);
  if (!topic) return { title: "Comparison not found" };
  return { title: topic.title, description: topic.description };
}

export default async function ComparisonTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: topicSlug } = await params;
  const topic = getComparisonTopicBySlug(topicSlug);
  if (!topic) notFound();

  const profile: SleepProfile = {
    ...topic.presetProfile,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  let candidates = getMattressesByIds(topic.mattressIds);
  if (topic.maxPrice) {
    candidates = candidates.filter((m) => m.basePrice <= topic.maxPrice!);
  }

  const recommendations = buildRecommendations(profile, candidates, { topic: topic.slug });

  return (
    <Container className="max-w-5xl py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/compare" className="hover:text-teal-700">
          Compare
        </Link>{" "}
        / <span className="text-slate-700">{topic.title}</span>
      </nav>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{topic.title}</h1>
      <p className="mt-3 max-w-2xl text-slate-600">{topic.description}</p>
      {topic.maxPrice && (
        <p className="mt-1 text-sm text-slate-500">Showing mattresses priced at ${topic.maxPrice} or less.</p>
      )}
      <p className="mt-3 text-sm text-slate-500">
        Read the{" "}
        <Link href="/methodology" className="text-teal-700 hover:underline">
          methodology
        </Link>{" "}
        behind these scores.
      </p>

      <div className="mt-6 space-y-8">
        <ProfileSummary profile={topic.presetProfile} modelVersion={CURRENT_MODEL_VERSION} />
        <RecommendationListWithComparison results={recommendations} totalCandidates={recommendations.length} />
      </div>
    </Container>
  );
}
