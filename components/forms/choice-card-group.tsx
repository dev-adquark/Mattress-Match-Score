"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

export interface ChoiceOption {
  value: string;
  label: string;
  description?: string;
}

interface SingleChoiceCardGroupProps {
  name: string;
  legend: string;
  helpText?: string;
  options: ChoiceOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  columns?: 1 | 2 | 3;
  error?: string;
}

export function SingleChoiceCardGroup({
  name,
  legend,
  helpText,
  options,
  value,
  onChange,
  columns = 2,
  error,
}: SingleChoiceCardGroupProps) {
  const gridClass = columns === 1 ? "grid-cols-1" : columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-900">{legend}</legend>
      {helpText && <p className="mt-1 text-sm text-slate-500">{helpText}</p>}
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className={cn("mt-3 grid gap-3", gridClass)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      >
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition-colors",
                checked ? "border-teal-600 bg-teal-50" : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <RadioGroupItem value={option.value} id={id} className="mt-0.5" />
              <span>
                <span className="block font-medium text-slate-900">{option.label}</span>
                {option.description && <span className="mt-0.5 block text-xs text-slate-500">{option.description}</span>}
              </span>
            </label>
          );
        })}
      </RadioGroup>
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}

interface MultiChoiceCardGroupProps {
  name: string;
  legend: string;
  helpText?: string;
  options: ChoiceOption[];
  values: string[];
  onChange: (values: string[]) => void;
  columns?: 1 | 2 | 3;
  error?: string;
}

export function MultiChoiceCardGroup({
  name,
  legend,
  helpText,
  options,
  values,
  onChange,
  columns = 2,
  error,
}: MultiChoiceCardGroupProps) {
  const gridClass = columns === 1 ? "grid-cols-1" : columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  function toggle(value: string) {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  }

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-900">{legend}</legend>
      {helpText && <p className="mt-1 text-sm text-slate-500">{helpText}</p>}
      <div className={cn("mt-3 grid gap-3", gridClass)} aria-describedby={error ? `${name}-error` : undefined}>
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const checked = values.includes(option.value);
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition-colors",
                checked ? "border-teal-600 bg-teal-50" : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <Checkbox id={id} checked={checked} onCheckedChange={() => toggle(option.value)} className="mt-0.5" />
              <span>
                <span className="block font-medium text-slate-900">{option.label}</span>
                {option.description && <span className="mt-0.5 block text-xs text-slate-500">{option.description}</span>}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <Label htmlFor={htmlFor} className="text-sm font-semibold text-slate-900">
      {children}
    </Label>
  );
}
