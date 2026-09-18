import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllComparisonTopics } from "@/lib/repositories/comparison-topic-repository";

export const metadata: Metadata = {
  title: "Compare Mattresses",
  description: "Curated, scored mattress comparisons for common sleep profiles.",
};

export default function ComparePage() {
  const topics = getAllComparisonTopics();

  return (
    <Container className="max-w-4xl py-10 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Compare Mattresses</h1>
      <p className="mt-3 text-slate-600">
        Curated bundles scored with the same rule-based engine used across the site, for shoppers who match a common
        profile.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {topics.map((topic, idx) => (
          <Link key={topic.slug} href={`/compare/${topic.slug}`} className={`group block animate-fadeInUp stagger-${Math.min(idx + 1, 6)}`}>
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardHeader>
                <CardTitle className="group-hover:text-teal-700">{topic.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{topic.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
