import { AlertTriangle } from "lucide-react";
import type { RiskFlag } from "@/contracts/mattress-match";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const SEVERITY_BADGE = {
  low: "riskLow",
  medium: "riskMedium",
  high: "riskHigh",
} as const;

const SEVERITY_BORDER = {
  low: "border-slate-200",
  medium: "border-amber-200",
  high: "border-red-200",
};

export function RiskFlagCard({ flag }: { flag: RiskFlag }) {
  return (
    <div className={cn("rounded-xl border bg-white p-4", SEVERITY_BORDER[flag.severity])} data-testid="risk-flag">
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0",
            flag.severity === "high" ? "text-red-600" : flag.severity === "medium" ? "text-amber-600" : "text-slate-500"
          )}
          aria-hidden="true"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-900">{flag.label}</h4>
            <Badge variant={SEVERITY_BADGE[flag.severity]}>{flag.severity} severity</Badge>
          </div>
          <p className="mt-1.5 text-sm text-slate-600">
            <span className="font-medium text-slate-700">Why: </span>
            {flag.rationale}
          </p>
          <p className="mt-1.5 text-sm text-slate-600">
            <span className="font-medium text-slate-700">What you can do: </span>
            {flag.mitigation}
          </p>
        </div>
      </div>
    </div>
  );
}
