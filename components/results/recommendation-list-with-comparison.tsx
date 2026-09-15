"use client";

import { useMemo, useState } from "react";
import type { RecommendationResult } from "@/contracts/mattress-match";
import { RecommendationCard } from "@/components/results/recommendation-card";
import { ComparisonBar } from "@/components/comparison/comparison-bar";
import { ComparisonTable } from "@/components/comparison/comparison-table";
import { appConfig } from "@/lib/config";
import { trackEvent } from "@/lib/analytics/events";

const DISPLAY_LIMIT = 6;

/**
 * Shared recommendation list + comparison UI, used by both /results (client-fetched
 * recommendations) and every /compare/[topic] page (server-computed recommendations passed in
 * as a prop). Keeping this in one component means selection/compare behavior is identical
 * everywhere it appears.
 */
export function RecommendationListWithComparison({
  results,
  totalCandidates,
}: {
  results: RecommendationResult[];
  totalCandidates: number;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const displayed = useMemo(() => results.slice(0, DISPLAY_LIMIT), [results]);

  const selectedResults = useMemo(
    () => selectedIds.map((id) => results.find((r) => r.mattress.id === id)).filter((r): r is RecommendationResult => Boolean(r)),
    [selectedIds, results]
  );

  function toggleCompare(mattressId: string) {
    setSelectedIds((prev) => {
      if (prev.includes(mattressId)) return prev.filter((id) => id !== mattressId);
      if (prev.length >= appConfig.comparison.maxSelected) return prev;
      trackEvent("mattress_selected", { mattressId });
      return [...prev, mattressId];
    });
  }

  return (
    <>
      <div className="space-y-6">
        {displayed.map((result) => (
          <RecommendationCard
            key={result.mattress.id}
            result={result}
            totalCandidates={totalCandidates}
            isSelected={selectedIds.includes(result.mattress.id)}
            onToggleCompare={toggleCompare}
            compareDisabled={!selectedIds.includes(result.mattress.id) && selectedIds.length >= appConfig.comparison.maxSelected}
          />
        ))}
      </div>

      <section id="comparison" className="scroll-mt-20 mt-8">
        <h2 className="text-xl font-bold text-slate-900">Side-by-side comparison</h2>
        <p className="mt-1 text-sm text-slate-600">
          Select up to {appConfig.comparison.maxSelected} mattresses above to compare them here.
        </p>
        <div className="mt-4">
          <ComparisonTable results={selectedResults} onRemove={toggleCompare} />
        </div>
      </section>

      <ComparisonBar
        selectedNames={selectedResults.map((r) => `${r.mattress.brand} ${r.mattress.model}`)}
        maxSelected={appConfig.comparison.maxSelected}
        onClear={() => setSelectedIds([])}
      />
    </>
  );
}
