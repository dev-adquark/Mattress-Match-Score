import Link from "next/link";
import type { RecommendationResult } from "@/contracts/mattress-match";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScoreDisplay } from "@/components/results/score-display";
import { SubScoreBars } from "@/components/results/sub-score-bars";
import { RiskFlagCard } from "@/components/results/risk-flag-card";
import { WhyThisMatch } from "@/components/results/why-this-match";
import { ReviewHighlights } from "@/components/results/review-highlights";
import { PlacementBadge, PlacementDisclosure } from "@/components/results/placement-badge";
import { SatisfactionFeedback } from "@/components/results/satisfaction-feedback";
import { AffiliateCta } from "@/components/mattress/affiliate-cta";

interface RecommendationCardProps {
  result: RecommendationResult;
  totalCandidates: number;
  isSelected: boolean;
  onToggleCompare: (mattressId: string) => void;
  compareDisabled: boolean;
  cinematic?: boolean;
}

export function RecommendationCard({
  result,
  totalCandidates,
  isSelected,
  onToggleCompare,
  compareDisabled,
  cinematic,
}: RecommendationCardProps) {
  const { mattress, score, reviewHighlights, affiliateLinks, placement } = result;
  const compareCheckboxId = `compare-${mattress.id}`;

  return (
    <Card data-testid="recommendation-card" data-mattress-id={mattress.id} className="animate-fadeInUp">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <PlacementBadge placement={placement} />
            <h3 className="mt-2 text-xl font-semibold text-slate-900">
              <Link href={`/mattress/${mattress.slug}`} className="hover:text-teal-700">
                {mattress.brand} {mattress.model}
              </Link>
            </h3>
            <p className="text-sm text-slate-500">
              {mattress.types.join(" / ")} &middot; Firmness {mattress.firmnessScale}/10 ({mattress.firmnessLabel})
              &middot; ${mattress.basePrice}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Algorithmic rank: #{placement.algorithmicRank} of {totalCandidates}
            </p>
            <div className="mt-1">
              <PlacementDisclosure placement={placement} />
            </div>
          </div>
          <ScoreDisplay score={score.overallScore} tier={score.matchTier} cinematic={cinematic} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <SubScoreBars subScores={score.subScores} />

        {score.riskFlags.length > 0 ? (
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Risk flags</h4>
            <div className="mt-2 space-y-2">
              {score.riskFlags.map((flag) => (
                <RiskFlagCard key={flag.code} flag={flag} />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No risk flags for your profile.</p>
        )}

        <WhyThisMatch reasons={score.matchReasons} />

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Review highlights</h4>
          <div className="mt-2">
            <ReviewHighlights highlights={reviewHighlights.slice(0, 3)} />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id={compareCheckboxId}
              checked={isSelected}
              disabled={compareDisabled}
              onCheckedChange={() => onToggleCompare(mattress.id)}
            />
            <Label htmlFor={compareCheckboxId} className="text-sm font-normal text-slate-600">
              Add to comparison
            </Label>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/mattress/${mattress.slug}`}
              className="text-sm font-semibold text-teal-700 hover:underline"
            >
              View full details
            </Link>
            {affiliateLinks[0] && (
              <AffiliateCta
                href={affiliateLinks[0].url}
                retailerName={affiliateLinks[0].retailerName}
                mattressId={mattress.id}
                placementType={placement.type}
              />
            )}
          </div>
        </div>
        <SatisfactionFeedback mattressId={mattress.id} />
      </CardContent>
    </Card>
  );
}
