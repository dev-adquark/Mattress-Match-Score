import Link from "next/link";
import type { SleepProfile } from "@/contracts/mattress-match";
import { Card, CardContent } from "@/components/ui/card";
import { getAllMattresses } from "@/lib/repositories/mattress-repository";
import { buildRecommendations } from "@/lib/recommendations/build-recommendations";

export function GuideExamplePicks({ exampleProfile, count = 3 }: { exampleProfile: SleepProfile; count?: number }) {
  const recommendations = buildRecommendations(exampleProfile, getAllMattresses()).slice(0, count);

  return (
    <div className="not-prose grid gap-4 sm:grid-cols-3">
      {recommendations.map((r) => (
        <Link key={r.mattress.id} href={`/mattress/${r.mattress.slug}`} className="group block">
          <Card className="h-full transition-shadow group-hover:shadow-md">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-teal-700">{r.score.overallScore}</p>
              <p className="text-sm font-semibold text-slate-900 group-hover:text-teal-700">
                {r.mattress.brand} {r.mattress.model}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Firmness {r.mattress.firmnessScale}/10 &middot; ${r.mattress.basePrice}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
