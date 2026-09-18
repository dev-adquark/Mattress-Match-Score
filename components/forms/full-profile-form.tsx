"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultiChoiceCardGroup, SingleChoiceCardGroup } from "@/components/forms/choice-card-group";
import {
  bmiRangeOptions,
  budgetBandOptions,
  comfortFocusOptions,
  firmnessPreferenceOptions,
  heightBandOptions,
  mattressTypeOptions,
  motionSensitivityOptions,
  sleepPositionOptions,
  surfaceFeelOptions,
  temperaturePreferenceOptions,
  weightBandOptions,
} from "@/lib/content/form-options";
import { sleepProfileInputSchema, type SleepProfileInput } from "@/lib/validation/sleep-profile";
import { loadSleepProfileInput, saveSleepProfileInput } from "@/lib/client/sleep-profile-storage";
import { trackEvent } from "@/lib/analytics/events";
import { setPreviewFirmness, setPreviewHighlightLayer, setPreviewCoolingShimmer } from "@/lib/three/scene-preview-mapping";

interface FullProfileState {
  sleepPositions: string[];
  weightBand?: string;
  heightBand?: string;
  bmiRange?: string;
  firmnessPreference?: string;
  mattressTypes: string[];
  surfaceFeel?: string;
  temperaturePreference?: string;
  motionSensitivity?: string;
  comfortFocus: string[];
  budgetBand?: string;
}

const STEP_TITLES = ["Sleep position & body", "Firmness & mattress type", "Temperature & motion", "Budget & review"];

function buildInitialState(): FullProfileState {
  const stored = loadSleepProfileInput();
  return {
    sleepPositions: stored?.sleepPositions ?? [],
    weightBand: stored?.weightBand,
    heightBand: stored?.heightBand,
    bmiRange: stored?.bmiRange,
    firmnessPreference: stored?.firmnessPreference,
    mattressTypes: stored?.mattressTypes ?? [],
    surfaceFeel: stored?.surfaceFeel,
    temperaturePreference: stored?.temperaturePreference,
    motionSensitivity: stored?.motionSensitivity,
    comfortFocus: stored?.comfortFocus ?? [],
    budgetBand: stored?.budgetBand,
  };
}

export function FullProfileForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<FullProfileState>(buildInitialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [startedTracked, setStartedTracked] = useState(false);

  function markStarted() {
    if (!startedTracked) {
      trackEvent("profile_started", { variant: "full" });
      setStartedTracked(true);
    }
  }

  function set<K extends keyof FullProfileState>(key: K, value: FullProfileState[K]) {
    markStarted();
    setState((s) => ({ ...s, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
    if (key === "firmnessPreference") setPreviewFirmness(value as string);
    if (key === "temperaturePreference") setPreviewCoolingShimmer(value === "cold");
    if (key === "comfortFocus") {
      const focusArray = value as string[];
      const layer = focusArray.includes("pressure-points")
        ? "comfort"
        : focusArray.includes("back-alignment")
          ? "transition"
          : null;
      setPreviewHighlightLayer(layer);
    }
  }

  function validateStep(currentStep: number): boolean {
    const nextErrors: Record<string, string> = {};
    if (currentStep === 0) {
      if (state.sleepPositions.length === 0) nextErrors.sleepPositions = "Select at least one sleep position.";
      if (!state.weightBand) nextErrors.weightBand = "Select your weight range.";
    }
    if (currentStep === 1) {
      if (!state.firmnessPreference) nextErrors.firmnessPreference = "Select a firmness preference.";
    }
    if (currentStep === 2) {
      if (!state.temperaturePreference) nextErrors.temperaturePreference = "Select a temperature preference.";
      if (!state.motionSensitivity) nextErrors.motionSensitivity = "Select who's sleeping in the bed.";
    }
    if (currentStep === 3) {
      if (!state.budgetBand) nextErrors.budgetBand = "Select a budget range.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    if (step < STEP_TITLES.length - 1) setStep((s) => s + 1);
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  const candidate: unknown = useMemo(
    () => ({
      sleepPositions: state.sleepPositions,
      weightBand: state.weightBand,
      heightBand: state.heightBand || undefined,
      bmiRange: state.bmiRange || undefined,
      firmnessPreference: state.firmnessPreference,
      mattressTypes: state.mattressTypes.length ? state.mattressTypes : undefined,
      surfaceFeel: state.surfaceFeel || undefined,
      temperaturePreference: state.temperaturePreference,
      motionSensitivity: state.motionSensitivity,
      comfortFocus: state.comfortFocus.length ? state.comfortFocus : undefined,
      budgetBand: state.budgetBand,
      isFullProfile: true,
    }),
    [state]
  );

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validateStep(3)) return;

    const parsed = sleepProfileInputSchema.safeParse(candidate);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      // Jump back to the first step that has a problem.
      setStep(0);
      return;
    }

    setSubmitting(true);
    saveSleepProfileInput(parsed.data as SleepProfileInput);
    trackEvent("profile_completed", { variant: "full" });
    router.push("/results");
  }

  const progressPct = Math.round(((step + 1) / STEP_TITLES.length) * 100);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <div>
        <div className="flex items-center justify-between text-sm font-medium text-slate-600">
          <span>
            Step {step + 1} of {STEP_TITLES.length}: {STEP_TITLES[step]}
          </span>
          <span>{progressPct}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {step === 0 && (
        <div className="space-y-8">
          <MultiChoiceCardGroup
            name="sleepPositions"
            legend="Which positions do you sleep in?"
            helpText="Select every position you regularly use."
            options={sleepPositionOptions}
            values={state.sleepPositions}
            onChange={(v) => set("sleepPositions", v)}
            error={errors.sleepPositions}
          />
          <SingleChoiceCardGroup
            name="weightBand"
            legend="What's your weight range?"
            options={weightBandOptions}
            value={state.weightBand}
            onChange={(v) => set("weightBand", v)}
            error={errors.weightBand}
          />
          <SingleChoiceCardGroup
            name="heightBand"
            legend="What's your height? (optional)"
            options={heightBandOptions}
            value={state.heightBand}
            onChange={(v) => set("heightBand", v)}
          />
          <SingleChoiceCardGroup
            name="bmiRange"
            legend="BMI range (optional)"
            helpText="This is only used to refine support recommendations — it's not a medical judgment, and you can skip it."
            options={bmiRangeOptions}
            value={state.bmiRange}
            onChange={(v) => set("bmiRange", v)}
          />
        </div>
      )}

      {step === 1 && (
        <div className="space-y-8">
          <SingleChoiceCardGroup
            name="firmnessPreference"
            legend="What firmness do you usually prefer?"
            options={firmnessPreferenceOptions}
            value={state.firmnessPreference}
            onChange={(v) => set("firmnessPreference", v)}
            columns={3}
            error={errors.firmnessPreference}
          />
          <MultiChoiceCardGroup
            name="mattressTypes"
            legend="Any mattress type preferences? (optional)"
            options={mattressTypeOptions}
            values={state.mattressTypes}
            onChange={(v) => set("mattressTypes", v)}
            columns={3}
          />
          <SingleChoiceCardGroup
            name="surfaceFeel"
            legend="What surface feel do you like? (optional)"
            helpText="How the top layer feels to the touch, independent of overall firmness."
            options={surfaceFeelOptions}
            value={state.surfaceFeel}
            onChange={(v) => set("surfaceFeel", v)}
            columns={3}
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <SingleChoiceCardGroup
            name="temperaturePreference"
            legend="How do you sleep, temperature-wise?"
            options={temperaturePreferenceOptions}
            value={state.temperaturePreference}
            onChange={(v) => set("temperaturePreference", v)}
            columns={3}
            error={errors.temperaturePreference}
          />
          <SingleChoiceCardGroup
            name="motionSensitivity"
            legend="Who's sleeping in the bed?"
            options={motionSensitivityOptions}
            value={state.motionSensitivity}
            onChange={(v) => set("motionSensitivity", v)}
            columns={1}
            error={errors.motionSensitivity}
          />
          <MultiChoiceCardGroup
            name="comfortFocus"
            legend="What's your comfort focus? (optional)"
            helpText="This helps us surface relevant review highlights. This isn't medical advice."
            options={comfortFocusOptions}
            values={state.comfortFocus}
            onChange={(v) => set("comfortFocus", v)}
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8">
          <SingleChoiceCardGroup
            name="budgetBand"
            legend="What's your budget?"
            options={budgetBandOptions}
            value={state.budgetBand}
            onChange={(v) => set("budgetBand", v)}
            error={errors.budgetBand}
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-sm font-semibold text-slate-900">Review your profile</h3>
            <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm text-slate-600 sm:grid-cols-2">
              <div>
                <dt className="font-medium text-slate-800">Sleep position(s)</dt>
                <dd>{state.sleepPositions.join(", ") || "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-800">Weight range</dt>
                <dd>{state.weightBand ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-800">Firmness preference</dt>
                <dd>{state.firmnessPreference ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-800">Temperature</dt>
                <dd>{state.temperaturePreference ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-800">Motion sensitivity</dt>
                <dd>{state.motionSensitivity ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-800">Budget</dt>
                <dd>{state.budgetBand ?? "—"}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        <Button type="button" variant="outline" onClick={goBack} disabled={step === 0}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
        </Button>
        {step < STEP_TITLES.length - 1 ? (
          <Button type="button" onClick={goNext}>
            Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : (
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Finding matches&hellip;
              </>
            ) : (
              "Find My Matches"
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
