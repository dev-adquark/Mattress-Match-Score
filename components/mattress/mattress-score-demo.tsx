"use client";

import { useCallback, useEffect, useState } from "react";
import type { RecommendationResult } from "@/contracts/mattress-match";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SingleChoiceCardGroup } from "@/components/forms/choice-card-group";
import { ScoreDisplay } from "@/components/results/score-display";
import { SubScoreBars } from "@/components/results/sub-score-bars";
import { RiskFlagCard } from "@/components/results/risk-flag-card";
import { WhyThisMatch } from "@/components/results/why-this-match";
import { LoadingState, ErrorState } from "@/components/results/request-states";
import {
  budgetBandOptions,
  firmnessPreferenceOptions,
  motionSensitivityOptions,
  sleepPositionOptions,
  temperaturePreferenceOptions,
  weightBandOptions,
} from "@/lib/content/form-options";
import { quickMatchSchema, sleepProfileInputSchema, type SleepProfileInput } from "@/lib/validation/sleep-profile";
import { loadSleepProfileInput, saveSleepProfileInput } from "@/lib/client/sleep-profile-storage";
import { fetchScore, ApiRequestError } from "@/lib/client/api-client";

type DemoStatus = "checking" | "form" | "loading" | "result" | "error";

interface MiniFormState {
  sleepPosition?: string;
  weightBand?: string;
  firmnessPreference?: string;
  budgetBand?: string;
  temperaturePreference?: string;
  motionSensitivity?: string;
}

export function MattressScoreDemo({ mattressId }: { mattressId: string }) {
  const [status, setStatus] = useState<DemoStatus>("checking");
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [formState, setFormState] = useState<MiniFormState>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [usingSavedProfile, setUsingSavedProfile] = useState(false);

  const runScore = useCallback(
    async (input: SleepProfileInput) => {
      setStatus("loading");
      try {
        const data = await fetchScore(input);
        const match = data.recommendations.find((r) => r.mattress.id === mattressId);
        if (!match) throw new Error("This mattress wasn't included in the scored results.");
        setResult(match);
        setStatus("result");
      } catch (error) {
        setErrorMessage(
          error instanceof ApiRequestError ? error.message : "Couldn't calculate a score. Please try again."
        );
        setStatus("error");
      }
    },
    [mattressId]
  );

  useEffect(() => {
    queueMicrotask(() => {
      const stored = loadSleepProfileInput();
      const parsed = sleepProfileInputSchema.safeParse(stored ?? {});
      if (parsed.success) {
        setUsingSavedProfile(true);
        runScore(parsed.data);
      } else {
        setStatus("form");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const candidate = {
      sleepPositions: formState.sleepPosition ? [formState.sleepPosition] : [],
      weightBand: formState.weightBand,
      firmnessPreference: formState.firmnessPreference,
      budgetBand: formState.budgetBand,
      temperaturePreference: formState.temperaturePreference,
      motionSensitivity: formState.motionSensitivity,
    };
    const parsed = quickMatchSchema.safeParse(candidate);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] === "sleepPositions" ? "sleepPosition" : String(issue.path[0]);
        nextErrors[key] = issue.message || "Required";
      }
      setFormErrors(nextErrors);
      return;
    }
    setFormErrors({});
    const fullInput = { ...parsed.data, isFullProfile: false };
    saveSleepProfileInput(fullInput);
    setUsingSavedProfile(true);
    runScore(fullInput);
  }

  if (status === "checking") return <LoadingState label="Checking for a saved sleep profile…" />;
  if (status === "loading") return <LoadingState label="Calculating your match score…" />;
  if (status === "error") return <ErrorState message={errorMessage} onRetry={() => setStatus("form")} />;

  if (status === "form") {
    return (
      <Card>
        <CardContent className="space-y-6 p-6">
          <p className="text-sm text-slate-600">
            Answer a few quick questions to see your personalized match score for this mattress.
          </p>
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <SingleChoiceCardGroup
              name="demoSleepPosition"
              legend="Sleep position"
              options={sleepPositionOptions}
              value={formState.sleepPosition}
              onChange={(v) => setFormState((s) => ({ ...s, sleepPosition: v }))}
              error={formErrors.sleepPosition}
            />
            <SingleChoiceCardGroup
              name="demoWeightBand"
              legend="Weight range"
              options={weightBandOptions}
              value={formState.weightBand}
              onChange={(v) => setFormState((s) => ({ ...s, weightBand: v }))}
              error={formErrors.weightBand}
            />
            <SingleChoiceCardGroup
              name="demoFirmness"
              legend="Firmness preference"
              options={firmnessPreferenceOptions}
              value={formState.firmnessPreference}
              onChange={(v) => setFormState((s) => ({ ...s, firmnessPreference: v }))}
              columns={3}
              error={formErrors.firmnessPreference}
            />
            <SingleChoiceCardGroup
              name="demoTemperature"
              legend="Temperature preference"
              options={temperaturePreferenceOptions}
              value={formState.temperaturePreference}
              onChange={(v) => setFormState((s) => ({ ...s, temperaturePreference: v }))}
              columns={3}
              error={formErrors.temperaturePreference}
            />
            <SingleChoiceCardGroup
              name="demoMotion"
              legend="Who's sleeping in the bed?"
              options={motionSensitivityOptions}
              value={formState.motionSensitivity}
              onChange={(v) => setFormState((s) => ({ ...s, motionSensitivity: v }))}
              error={formErrors.motionSensitivity}
            />
            <SingleChoiceCardGroup
              name="demoBudget"
              legend="Budget"
              options={budgetBandOptions}
              value={formState.budgetBand}
              onChange={(v) => setFormState((s) => ({ ...s, budgetBand: v }))}
              error={formErrors.budgetBand}
            />
            <Button type="submit">Calculate my match score</Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (status === "result" && result) {
    return (
      <Card>
        <CardContent className="space-y-6 p-6">
          {usingSavedProfile && <p className="text-xs text-slate-500">Using your saved sleep profile.</p>}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <ScoreDisplay score={result.score.overallScore} tier={result.score.matchTier} />
            <Button variant="outline" size="sm" onClick={() => setStatus("form")}>
              Try different answers
            </Button>
          </div>
          <SubScoreBars subScores={result.score.subScores} />
          {result.score.riskFlags.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Risk flags</h4>
              <div className="mt-2 space-y-2">
                {result.score.riskFlags.map((flag) => (
                  <RiskFlagCard key={flag.code} flag={flag} />
                ))}
              </div>
            </div>
          )}
          <WhyThisMatch reasons={result.score.matchReasons} />
        </CardContent>
      </Card>
    );
  }

  return null;
}
