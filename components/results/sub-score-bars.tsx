import type { SubScores } from "@/contracts/mattress-match";

const LABELS: Record<keyof SubScores, string> = {
  pressureRelief: "Pressure Relief",
  supportAlignment: "Support & Alignment",
  coolingAirflow: "Cooling & Airflow",
  motionIsolation: "Motion Isolation",
  edgeSupport: "Edge Support",
  responsiveness: "Responsiveness",
  durability: "Durability",
};

const ORDER: (keyof SubScores)[] = [
  "pressureRelief",
  "supportAlignment",
  "coolingAirflow",
  "motionIsolation",
  "edgeSupport",
  "responsiveness",
  "durability",
];

function barColor(value: number) {
  if (value >= 80) return "bg-teal-600";
  if (value >= 60) return "bg-sky-600";
  if (value >= 45) return "bg-amber-500";
  return "bg-red-500";
}

export function SubScoreBars({ subScores }: { subScores: SubScores }) {
  return (
    <ul className="space-y-3" aria-label="Category sub-scores">
      {ORDER.map((key) => {
        const value = subScores[key];
        return (
          <li key={key}>
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span className="font-medium text-slate-700">{LABELS[key]}</span>
              <span className="font-semibold text-slate-900">{value}</span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuenow={value}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={LABELS[key]}
            >
              <div className={`h-full rounded-full animate-fillBar ${barColor(value)}`} style={{ "--fill-width": `${value}%` } as React.CSSProperties} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
