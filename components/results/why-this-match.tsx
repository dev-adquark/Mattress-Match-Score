import { CheckCircle2 } from "lucide-react";
import type { MatchReason } from "@/contracts/mattress-match";

export function WhyThisMatch({ reasons }: { reasons: MatchReason[] }) {
  if (reasons.length === 0) return null;
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-900">Why this match?</h4>
      <ul className="mt-2 space-y-2">
        {reasons.map((reason, idx) => (
          <li key={reason.code} className={`flex animate-fadeInUp items-start gap-2 text-sm text-slate-600 stagger-${Math.min(idx + 1, 6)}`}>
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
            <span>
              <span className="font-medium text-slate-800">{reason.label}: </span>
              {reason.detail}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
