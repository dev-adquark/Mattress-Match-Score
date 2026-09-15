import type { DataConfidence } from "@/contracts/mattress-match";
import { cn } from "@/lib/utils/cn";

const LABELS: Record<DataConfidence, string> = {
  verified: "Verified",
  sourced: "Sourced",
  seeded: "Seed data",
  uncertain: "Uncertain",
};

const CLASSES: Record<DataConfidence, string> = {
  verified: "bg-emerald-50 text-emerald-800 border-emerald-200",
  sourced: "bg-sky-50 text-sky-800 border-sky-200",
  seeded: "bg-slate-100 text-slate-600 border-slate-300",
  uncertain: "bg-amber-50 text-amber-800 border-amber-200",
};

export function DataConfidenceBadge({ confidence }: { confidence: DataConfidence }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium", CLASSES[confidence])}
      title={
        confidence === "seeded"
          ? "This review is demo/seed data, not an independently verified real-world review."
          : undefined
      }
    >
      {LABELS[confidence]}
    </span>
  );
}
