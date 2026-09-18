import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { VerifyPlacementButton } from "@/components/admin/verify-placement-button";
import { listSponsoredPlacements } from "@/lib/repositories/sponsored-repository";
import { getMattressById } from "@/lib/repositories/mattress-repository";
import { isPlacementStale } from "@/lib/sponsored/placements";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Always reflect the live verification state; this must never be statically
// prerendered against a build-time snapshot of the sponsored-placements store.
export const dynamic = "force-dynamic";

const STATUS_BADGE_VARIANT: Record<string, BadgeProps["variant"]> = {
  verified: "verified",
  pending: "pending",
  expired: "expired",
};

export default function AdminPage() {
  const placements = listSponsoredPlacements();

  return (
    <Container className="max-w-4xl py-10 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin</h1>
      <p className="mt-3 text-slate-600">
        Verification workflow for sponsored placements. Marking a placement verified confirms its listing details
        are current; this never changes its algorithmic Match Score or rank.
      </p>

      <div className="mt-8 space-y-4">
        {placements.map((placement) => {
          const mattress = getMattressById(placement.mattressId);
          const stale = isPlacementStale(placement);

          return (
            <Card key={placement.id}>
              <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                <div>
                  <CardTitle className="text-base">
                    {mattress ? `${mattress.brand} ${mattress.model}` : placement.mattressId}
                  </CardTitle>
                  <p className="mt-1 text-xs text-slate-500">
                    {placement.scope.type === "global" ? "Global placement" : `Topic: ${placement.scope.topic}`} &middot; slot{" "}
                    {placement.placementSlot}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={STATUS_BADGE_VARIANT[placement.verificationStatus]}>
                    {placement.verificationStatus}
                  </Badge>
                  {stale && <Badge variant="riskMedium">Stale</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{placement.disclosureText}</p>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-xs text-slate-500">
                    Last verified: {placement.lastVerifiedAt ?? "never"}
                  </p>
                  <VerifyPlacementButton
                    placementId={placement.id}
                    targetStatus="verified"
                    label="Mark verified today"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
