export type GPUTier = 0 | 1 | 2 | 3;
export type MattressLayer = 'cover' | 'comfort' | 'transition' | 'core';
export type ActiveBeat = 1 | 2 | 3 | 4 | 5;

export interface RevealScore {
  overallScore: number;
  subScores: Record<string, number>;
  matchReasons: string[];
}
