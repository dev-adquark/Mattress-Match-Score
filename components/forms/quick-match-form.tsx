"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SingleChoiceCardGroup } from "@/components/forms/choice-card-group";
import {
  budgetBandOptions,
  firmnessPreferenceOptions,
  motionSensitivityOptions,
  sleepPositionOptions,
  temperaturePreferenceOptions,
  weightBandOptions,
} from "@/lib/content/form-options";
import { quickMatchSchema } from "@/lib/validation/sleep-profile";
import { saveSleepProfileInput } from "@/lib/client/sleep-profile-storage";
import { trackEvent } from "@/lib/analytics/events";
import { setPreviewFirmness, setPreviewCoolingShimmer, setPreviewSleepPositions } from "@/lib/three/scene-preview-mapping";

interface QuickMatchState {
  sleepPosition?: string;
  weightBand?: string;
  firmnessPreference?: string;
  budgetBand?: string;
  temperaturePreference?: string;
  motionSensitivity?: string;
}

export function QuickMatchForm() {
  const router = useRouter();
  const [state, setState] = useState<QuickMatchState>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [startedTracked, setStartedTracked] = useState(false);

  function update<K extends keyof QuickMatchState>(key: K, value: string) {
    if (!startedTracked) {
      trackEvent("profile_started", { variant: "quick" });
      setStartedTracked(true);
    }
    setState((s) => ({ ...s, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
    if (key === "firmnessPreference") setPreviewFirmness(value);
    if (key === "temperaturePreference") setPreviewCoolingShimmer(value === "cold");
    if (key === "sleepPosition") setPreviewSleepPositions([value]);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const candidate = {
      sleepPositions: state.sleepPosition ? [state.sleepPosition] : [],
      weightBand: state.weightBand,
      firmnessPreference: state.firmnessPreference,
      budgetBand: state.budgetBand,
      temperaturePreference: state.temperaturePreference,
      motionSensitivity: state.motionSensitivity,
    };

    const parsed = quickMatchSchema.safeParse(candidate);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] === "sleepPositions" ? "sleepPosition" : String(issue.path[0]);
        fieldErrors[key] = issue.message || "This field is required.";
      }
      const requiredKeys: (keyof QuickMatchState)[] = [
        "sleepPosition",
        "weightBand",
        "firmnessPreference",
        "budgetBand",
        "temperaturePreference",
        "motionSensitivity",
      ];
      for (const key of requiredKeys) {
        if (!state[key] && !fieldErrors[key]) fieldErrors[key] = "Please make a selection.";
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    saveSleepProfileInput({ ...parsed.data, isFullProfile: false });
    trackEvent("profile_completed", { variant: "quick" });
    router.push("/results");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <SingleChoiceCardGroup
        name="sleepPosition"
        legend="How do you mostly sleep?"
        options={sleepPositionOptions}
        value={state.sleepPosition}
        onChange={(v) => update("sleepPosition", v)}
        columns={2}
        error={errors.sleepPosition}
      />
      <SingleChoiceCardGroup
        name="weightBand"
        legend="What's your weight range?"
        helpText="This affects how much support and durability you'll need."
        options={weightBandOptions}
        value={state.weightBand}
        onChange={(v) => update("weightBand", v)}
        columns={2}
        error={errors.weightBand}
      />
      <SingleChoiceCardGroup
        name="firmnessPreference"
        legend="What firmness do you usually prefer?"
        options={firmnessPreferenceOptions}
        value={state.firmnessPreference}
        onChange={(v) => update("firmnessPreference", v)}
        columns={3}
        error={errors.firmnessPreference}
      />
      <SingleChoiceCardGroup
        name="budgetBand"
        legend="What's your budget?"
        options={budgetBandOptions}
        value={state.budgetBand}
        onChange={(v) => update("budgetBand", v)}
        columns={2}
        error={errors.budgetBand}
      />
      <SingleChoiceCardGroup
        name="temperaturePreference"
        legend="How do you sleep, temperature-wise?"
        options={temperaturePreferenceOptions}
        value={state.temperaturePreference}
        onChange={(v) => update("temperaturePreference", v)}
        columns={3}
        error={errors.temperaturePreference}
      />
      <SingleChoiceCardGroup
        name="motionSensitivity"
        legend="Who's sleeping in the bed?"
        options={motionSensitivityOptions}
        value={state.motionSensitivity}
        onChange={(v) => update("motionSensitivity", v)}
        columns={1}
        error={errors.motionSensitivity}
      />

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/match/full" className="text-sm font-semibold text-teal-700 hover:underline">
          Want more precision? Try the full sleep profile
        </Link>
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Finding matches&hellip;
            </>
          ) : (
            "Find My Matches"
          )}
        </Button>
      </div>
    </form>
  );
}
