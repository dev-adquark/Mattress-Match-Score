import Link from "next/link";
import type { SleepProfileInput } from "@/lib/validation/sleep-profile";

function chip(label: string) {
  return (
    <span key={label} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
      {label}
    </span>
  );
}

export function ProfileSummary({ profile, modelVersion }: { profile: SleepProfileInput; modelVersion: string }) {
  const chips = [
    profile.sleepPositions.join(" + "),
    profile.weightBand,
    profile.firmnessPreference,
    profile.budgetBand,
    profile.temperaturePreference,
    profile.motionSensitivity,
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">{chips.map(chip)}</div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white">
            Model {modelVersion}
          </span>
          <Link href="/match/full" className="text-xs font-semibold text-teal-700 hover:underline">
            Edit profile
          </Link>
        </div>
      </div>
    </div>
  );
}
