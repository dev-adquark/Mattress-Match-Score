import topicsData from "@/data/comparison-topics.json";
import type { ComparisonTopic } from "@/contracts/mattress-match";

const topics = topicsData as ComparisonTopic[];

export function getAllComparisonTopics(): ComparisonTopic[] {
  return topics;
}

export function getComparisonTopicBySlug(slug: string): ComparisonTopic | undefined {
  return topics.find((t) => t.slug === slug);
}
