import appConfigData from "@/data/app-config.json";

export interface BandOption<T extends string = string> {
  value: T;
  label: string;
}

export interface AppConfig {
  comparison: { maxSelected: number };
  sponsored: { staleAfterDays: number };
  affiliate: { utmSource: string; utmMedium: string };
  bands: {
    weight: BandOption[];
    height: BandOption[];
    bmi: BandOption[];
    budget: BandOption[];
  };
}

export const appConfig = appConfigData as AppConfig;
