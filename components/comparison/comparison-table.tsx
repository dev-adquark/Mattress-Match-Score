import Link from "next/link";
import type { RecommendationResult, SubScores } from "@/contracts/mattress-match";
import { PlacementBadge } from "@/components/results/placement-badge";
import { AffiliateCta } from "@/components/mattress/affiliate-cta";
import { cn } from "@/lib/utils/cn";

const SUBSCORE_ROWS: { key: keyof SubScores; label: string }[] = [
  { key: "pressureRelief", label: "Pressure Relief" },
  { key: "supportAlignment", label: "Support & Alignment" },
  { key: "coolingAirflow", label: "Cooling & Airflow" },
  { key: "motionIsolation", label: "Motion Isolation" },
  { key: "edgeSupport", label: "Edge Support" },
  { key: "responsiveness", label: "Responsiveness" },
  { key: "durability", label: "Durability" },
];

function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <th
      scope="row"
      className="sticky left-0 z-10 w-40 min-w-40 bg-slate-50 p-3 text-left text-sm font-medium text-slate-600"
    >
      {children}
    </th>
  );
}

export function ComparisonTable({ results, onRemove }: { results: RecommendationResult[]; onRemove?: (id: string) => void }) {
  if (results.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        Select up to three mattresses above to compare them side-by-side.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white" data-testid="comparison-table">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr>
            <RowLabel>Mattress</RowLabel>
            {results.map((r) => (
              <th key={r.mattress.id} className="min-w-[200px] border-b border-slate-200 p-3 text-left align-top">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <PlacementBadge placement={r.placement} />
                    <p className="mt-2 font-semibold text-slate-900">
                      <Link href={`/mattress/${r.mattress.slug}`} className="hover:text-teal-700">
                        {r.mattress.brand} {r.mattress.model}
                      </Link>
                    </p>
                  </div>
                  {onRemove && (
                    <button
                      type="button"
                      onClick={() => onRemove(r.mattress.id)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-red-600"
                      aria-label={`Remove ${r.mattress.brand} ${r.mattress.model} from comparison`}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-100">
            <RowLabel>Overall score</RowLabel>
            {results.map((r) => (
              <td key={r.mattress.id} className="p-3 align-top">
                <span className="text-2xl font-bold text-teal-700">{r.score.overallScore}</span>
                <span className="ml-1 text-xs text-slate-500">/ 100</span>
              </td>
            ))}
          </tr>

          {SUBSCORE_ROWS.map((row) => (
            <tr key={row.key} className="border-b border-slate-100">
              <RowLabel>{row.label}</RowLabel>
              {results.map((r) => (
                <td key={r.mattress.id} className="p-3 align-top">
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>{r.score.subScores[row.key]}</span>
                  </div>
                  <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-teal-600"
                      style={{ width: `${r.score.subScores[row.key]}%` }}
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}

          <tr className="border-b border-slate-100">
            <RowLabel>Firmness</RowLabel>
            {results.map((r) => (
              <td key={r.mattress.id} className="p-3 align-top text-slate-700">
                {r.mattress.firmnessScale}/10 ({r.mattress.firmnessLabel})
              </td>
            ))}
          </tr>
          <tr className="border-b border-slate-100">
            <RowLabel>Type</RowLabel>
            {results.map((r) => (
              <td key={r.mattress.id} className="p-3 align-top text-slate-700">
                {r.mattress.types.join(", ")}
              </td>
            ))}
          </tr>
          <tr className="border-b border-slate-100">
            <RowLabel>Height</RowLabel>
            {results.map((r) => (
              <td key={r.mattress.id} className="p-3 align-top text-slate-700">
                {r.mattress.heightInches}&Prime;
              </td>
            ))}
          </tr>
          <tr className="border-b border-slate-100">
            <RowLabel>Trial</RowLabel>
            {results.map((r) => (
              <td key={r.mattress.id} className="p-3 align-top text-slate-700">
                {r.mattress.trialNights} nights
              </td>
            ))}
          </tr>
          <tr className="border-b border-slate-100">
            <RowLabel>Warranty</RowLabel>
            {results.map((r) => (
              <td key={r.mattress.id} className="p-3 align-top text-slate-700">
                {r.mattress.warrantyYears} years
              </td>
            ))}
          </tr>
          <tr className="border-b border-slate-100">
            <RowLabel>Price</RowLabel>
            {results.map((r) => (
              <td key={r.mattress.id} className="p-3 align-top text-slate-700">
                ${r.mattress.basePrice}
              </td>
            ))}
          </tr>
          <tr className="border-b border-slate-100">
            <RowLabel>Risk flags</RowLabel>
            {results.map((r) => (
              <td key={r.mattress.id} className="p-3 align-top">
                {r.score.riskFlags.length === 0 ? (
                  <span className="text-slate-400">None</span>
                ) : (
                  <ul className="space-y-1">
                    {r.score.riskFlags.map((flag) => (
                      <li
                        key={flag.code}
                        className={cn(
                          "text-xs",
                          flag.severity === "high"
                            ? "text-red-700"
                            : flag.severity === "medium"
                              ? "text-amber-700"
                              : "text-slate-600"
                        )}
                      >
                        {flag.label}
                      </li>
                    ))}
                  </ul>
                )}
              </td>
            ))}
          </tr>
          <tr>
            <RowLabel>Retailer</RowLabel>
            {results.map((r) => (
              <td key={r.mattress.id} className="p-3 align-top">
                {r.affiliateLinks[0] && (
                  <AffiliateCta
                    href={r.affiliateLinks[0].url}
                    retailerName={r.affiliateLinks[0].retailerName}
                    mattressId={r.mattress.id}
                    placementType={r.placement.type}
                    size="sm"
                  />
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
