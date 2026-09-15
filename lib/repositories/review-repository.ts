import reviewTagsData from "@/data/review-tags.json";
import type { ReviewHighlight } from "@/contracts/mattress-match";

const reviewHighlights = reviewTagsData as ReviewHighlight[];

export function getAllReviewHighlights(): ReviewHighlight[] {
  return reviewHighlights;
}

export function getReviewHighlightsForMattress(mattressId: string): ReviewHighlight[] {
  return reviewHighlights.filter((r) => r.mattressId === mattressId);
}
