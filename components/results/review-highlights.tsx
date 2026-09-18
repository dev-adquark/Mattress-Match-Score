import { Quote } from "lucide-react";
import type { ScoredReviewHighlight } from "@/contracts/mattress-match";
import { DataConfidenceBadge } from "@/components/results/data-confidence-badge";

const TAG_LABELS: Record<string, string> = {
  sleepsHot: "Sleeps hot",
  sleepsCool: "Sleeps cool",
  greatEdgeSupport: "Great edge support",
  weakEdgeSupport: "Weak edge support",
  tooFirm: "Runs firm",
  tooSoft: "Runs soft",
  offGassing: "Off-gassing smell",
  motionIsolationGood: "Good motion isolation",
  motionIsolationPoor: "Poor motion isolation",
  sagsAfterTime: "Sags over time",
  greatPressureRelief: "Great pressure relief",
  goodBackSupport: "Good back support",
  easySetup: "Easy setup",
  durableLongTerm: "Durable long-term",
  responsiveBounce: "Responsive bounce",
};

export function ReviewHighlights({ highlights }: { highlights: ScoredReviewHighlight[] }) {
  if (highlights.length === 0) {
    return <p className="text-sm text-slate-500">No review highlights are available for this mattress yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {highlights.map((highlight, idx) => (
        <li key={highlight.id} data-testid="review-highlight" className={`animate-fadeInUp rounded-lg border border-slate-200 bg-slate-50 p-3 stagger-${Math.min(idx + 1, 6)}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span
              data-testid="review-highlight-tag"
              className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200"
            >
              {TAG_LABELS[highlight.tag] ?? highlight.tag}
            </span>
            <DataConfidenceBadge confidence={highlight.confidence} />
          </div>
          <p className="mt-2 flex gap-2 text-sm text-slate-700">
            <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span>&ldquo;{highlight.snippet}&rdquo;</span>
          </p>
          <p className="mt-1.5 text-xs text-slate-500">{highlight.source}</p>
        </li>
      ))}
    </ul>
  );
}
