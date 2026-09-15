"use client";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/events";

interface ComparisonBarProps {
  selectedNames: string[];
  maxSelected: number;
  onClear: () => void;
}

export function ComparisonBar({ selectedNames, maxSelected, onClear }: ComparisonBarProps) {
  if (selectedNames.length === 0) return null;

  function scrollToComparison() {
    trackEvent("comparison_opened", { selectedCount: selectedNames.length });
    document.getElementById("comparison")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-slate-700">
          Comparing {selectedNames.length} of {maxSelected}: <span className="text-slate-500">{selectedNames.join(", ")}</span>
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
          <Button type="button" size="sm" onClick={scrollToComparison}>
            View comparison
          </Button>
        </div>
      </div>
    </div>
  );
}
