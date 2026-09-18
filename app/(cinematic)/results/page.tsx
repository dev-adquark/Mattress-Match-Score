"use client";

import { useCallback, useEffect, useState } from "react";
import { Container } from "@/components/layout/container";
import { RecommendationListWithComparison } from "@/components/results/recommendation-list-with-comparison";
import { ProfileSummary } from "@/components/results/profile-summary";
import { CinematicPanel } from "@/components/results/cinematic-panel";
import { LoadingState, ErrorState, NoProfileEmptyState } from "@/components/results/request-states";
import { loadSleepProfileInput } from "@/lib/client/sleep-profile-storage";
import { fetchScore, ApiRequestError } from "@/lib/client/api-client";
import { sleepProfileInputSchema, type SleepProfileInput } from "@/lib/validation/sleep-profile";
import { trackEvent } from "@/lib/analytics/events";
import { narrativeStore } from "@/lib/three/narrative-store";
import type { RecommendationResponse } from "@/contracts/mattress-match";

type Status = "loading" | "success" | "error" | "empty";

export default function ResultsPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [profile, setProfile] = useState<SleepProfileInput | null>(null);
  const [response, setResponse] = useState<RecommendationResponse | null>(null);

  const load = useCallback(async () => {
    const stored = loadSleepProfileInput();
    const parsed = sleepProfileInputSchema.safeParse(stored ?? {});
    if (!parsed.success) {
      setStatus("empty");
      return;
    }

    setStatus("loading");
    setProfile(parsed.data);
    try {
      const data = await fetchScore(parsed.data);
      setResponse(data);
      setStatus("success");
      trackEvent("results_viewed", { recommendationCount: data.recommendations.length });

      const top = data.recommendations[0];
      if (top) {
        narrativeStore.getState().setReveal({
          overallScore: top.score.overallScore,
          subScores: top.score.subScores as unknown as Record<string, number>,
          matchReasons: top.score.matchReasons.map((r) => r.label),
        });
        narrativeStore.getState().setActiveBeat(5);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof ApiRequestError ? error.message : "Something went wrong loading your results. Please try again."
      );
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  return (
    <Container className="max-w-5xl py-10 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Matches</h1>
      <p className="mt-2 text-slate-600">Ranked mattresses scored against your sleep profile.</p>

      <div className="mt-6 space-y-8">
        {status === "loading" && <LoadingState />}
        {status === "error" && <ErrorState message={errorMessage} onRetry={load} />}
        {status === "empty" && <NoProfileEmptyState />}

        {status === "success" && profile && response && (
          <>
            <CinematicPanel>
              <div className="p-4 sm:p-6">
                <ProfileSummary profile={profile} modelVersion={response.modelVersion} />
              </div>
            </CinematicPanel>
            <CinematicPanel>
              <div className="p-4 sm:p-6">
                <RecommendationListWithComparison
                  results={response.recommendations}
                  totalCandidates={response.recommendations.length}
                  cinematic={true}
                />
              </div>
            </CinematicPanel>
          </>
        )}
      </div>
    </Container>
  );
}
