import { appConfig } from "@/lib/config";
import type { ChoiceOption } from "@/components/forms/choice-card-group";

export const sleepPositionOptions: ChoiceOption[] = [
  { value: "side", label: "Side", description: "Mostly sleep on your left or right side." },
  { value: "back", label: "Back", description: "Mostly sleep flat on your back." },
  { value: "stomach", label: "Stomach", description: "Mostly sleep face-down." },
  { value: "combination", label: "Combination", description: "Change positions through the night." },
];

export const weightBandOptions: ChoiceOption[] = appConfig.bands.weight.map((b) => ({
  value: b.value,
  label: b.label,
}));

export const heightBandOptions: ChoiceOption[] = appConfig.bands.height.map((b) => ({
  value: b.value,
  label: b.label,
}));

export const bmiRangeOptions: ChoiceOption[] = appConfig.bands.bmi.map((b) => ({
  value: b.value,
  label: b.label,
}));

export const firmnessPreferenceOptions: ChoiceOption[] = [
  { value: "soft", label: "Soft" },
  { value: "medium-soft", label: "Medium-soft" },
  { value: "medium", label: "Medium" },
  { value: "medium-firm", label: "Medium-firm" },
  { value: "firm", label: "Firm" },
];

export const budgetBandOptions: ChoiceOption[] = appConfig.bands.budget.map((b) => ({
  value: b.value,
  label: b.label,
}));

export const mattressTypeOptions: ChoiceOption[] = [
  { value: "foam", label: "Foam", description: "All-foam construction." },
  { value: "hybrid", label: "Hybrid", description: "Foam or latex comfort layers over coils." },
  { value: "innerspring", label: "Innerspring", description: "Traditional coil-based support." },
];

export const temperaturePreferenceOptions: ChoiceOption[] = [
  { value: "hot", label: "I sleep hot", description: "You often wake up too warm." },
  { value: "neutral", label: "I'm temperature neutral", description: "Temperature isn't usually an issue." },
  { value: "cold", label: "I sleep cold", description: "You often wake up too cool." },
];

export const motionSensitivityOptions: ChoiceOption[] = [
  { value: "single", label: "Single sleeper", description: "You sleep alone most nights." },
  { value: "couple", label: "Couple / shared bed", description: "You regularly share the bed." },
  {
    value: "high-sensitivity",
    label: "Highly motion-sensitive",
    description: "Even small movements wake you up.",
  },
];

export const comfortFocusOptions: ChoiceOption[] = [
  { value: "pressure-points", label: "Pressure points" },
  { value: "back-alignment", label: "Back alignment" },
  { value: "hip-relief", label: "Hip relief" },
  { value: "shoulder-relief", label: "Shoulder relief" },
  { value: "general-comfort", label: "General comfort" },
];

export const surfaceFeelOptions: ChoiceOption[] = [
  { value: "soft", label: "Soft" },
  { value: "medium", label: "Medium" },
  { value: "firm", label: "Firm" },
];
