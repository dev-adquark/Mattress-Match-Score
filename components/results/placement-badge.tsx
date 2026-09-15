import { BadgeCheck, Clock, ShieldAlert, Sparkles } from "lucide-react";
import type { PlacementMetadata } from "@/contracts/mattress-match";
import { Badge } from "@/components/ui/badge";

export function PlacementBadge({ placement }: { placement: PlacementMetadata }) {
  if (placement.type === "algorithmic") {
    return (
      <Badge variant="algorithmic" data-testid="placement-algorithmic">
        <Sparkles className="h-3 w-3" aria-hidden="true" /> Algorithmic Pick
      </Badge>
    );
  }

  const { sponsored } = placement;
  if (!sponsored) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="placement-sponsored">
      <Badge variant="sponsored">Sponsored</Badge>
      {sponsored.verificationStatus === "verified" && sponsored.lastVerifiedAt && !sponsored.isStale ? (
        <Badge variant="verified">
          <BadgeCheck className="h-3 w-3" aria-hidden="true" /> Verified &mdash; {sponsored.lastVerifiedAt}
        </Badge>
      ) : sponsored.verificationStatus === "pending" ? (
        <Badge variant="pending">
          <Clock className="h-3 w-3" aria-hidden="true" /> Verification pending
        </Badge>
      ) : (
        <Badge variant="expired">
          <ShieldAlert className="h-3 w-3" aria-hidden="true" />
          {sponsored.lastVerifiedAt ? `Verification expired (last: ${sponsored.lastVerifiedAt})` : "Not yet verified"}
        </Badge>
      )}
    </div>
  );
}

export function PlacementDisclosure({ placement }: { placement: PlacementMetadata }) {
  if (placement.type !== "sponsored" || !placement.sponsored) return null;
  return <p className="text-xs text-slate-500">{placement.sponsored.disclosureText}</p>;
}
