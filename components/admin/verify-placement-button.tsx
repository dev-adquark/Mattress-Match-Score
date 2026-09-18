"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { VerificationStatus } from "@/contracts/mattress-match";

interface VerifyPlacementButtonProps {
  placementId: string;
  targetStatus: VerificationStatus;
  label: string;
}

export function VerifyPlacementButton({ placementId, targetStatus, label }: VerifyPlacementButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/verify-sponsored", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placementId, verificationStatus: targetStatus }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error?.message ?? "Verification update failed.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification update failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button type="button" size="sm" variant="outline" onClick={handleClick} disabled={pending}>
        {pending ? "Updating…" : label}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
