'use client';

import { create } from 'zustand';
import type { ActiveBeat, GPUTier, MattressLayer, RevealScore, SleepPosition } from './types';

interface NarrativeState {
  progress: number;
  activeBeat: ActiveBeat;
  gpuTier: GPUTier;
  isMobile: boolean;
  previewFirmnessBias: number;
  previewHighlightLayer: MattressLayer | null;
  previewCoolingShimmer: boolean;
  previewSleepPosition: SleepPosition | null;
  loadingStatus: 'idle' | 'loading';
  revealScore: RevealScore | null;

  setProgress: (progress: number) => void;
  setActiveBeat: (beat: ActiveBeat) => void;
  setGpuTier: (tier: GPUTier, isMobile: boolean) => void;
  setPreviewFirmnessBias: (bias: number) => void;
  setPreviewHighlightLayer: (layer: MattressLayer | null) => void;
  setPreviewCoolingShimmer: (enabled: boolean) => void;
  setPreviewSleepPosition: (position: SleepPosition | null) => void;
  setLoadingStatus: (status: 'idle' | 'loading') => void;
  setReveal: (score: RevealScore | null) => void;
}

export const narrativeStore = create<NarrativeState>((set) => ({
  progress: 0,
  activeBeat: 1,
  gpuTier: 1,
  isMobile: false,
  previewFirmnessBias: 0,
  previewHighlightLayer: null,
  previewCoolingShimmer: false,
  previewSleepPosition: null,
  loadingStatus: 'idle',
  revealScore: null,

  setProgress: (progress) => set({ progress }),
  setActiveBeat: (activeBeat) => set({ activeBeat }),
  setGpuTier: (gpuTier, isMobile) => set({ gpuTier, isMobile }),
  setPreviewFirmnessBias: (previewFirmnessBias) => set({ previewFirmnessBias }),
  setPreviewHighlightLayer: (previewHighlightLayer) => set({ previewHighlightLayer }),
  setPreviewCoolingShimmer: (previewCoolingShimmer) => set({ previewCoolingShimmer }),
  setPreviewSleepPosition: (previewSleepPosition) => set({ previewSleepPosition }),
  setLoadingStatus: (loadingStatus) => set({ loadingStatus }),
  setReveal: (revealScore) => set({ revealScore }),
}));

export const useNarrativeProgress = () => narrativeStore((s) => s.progress);
export const useNarrativeActiveBeat = () => narrativeStore((s) => s.activeBeat);
export const useNarrativeGpuTier = () => narrativeStore((s) => ({ tier: s.gpuTier, isMobile: s.isMobile }));
export const useNarrativePreview = () =>
  narrativeStore((s) => ({
    firmnessBias: s.previewFirmnessBias,
    highlightLayer: s.previewHighlightLayer,
    coolingShimmer: s.previewCoolingShimmer,
    sleepPosition: s.previewSleepPosition,
  }));
export const useNarrativeLoadingStatus = () => narrativeStore((s) => s.loadingStatus);
export const useNarrativeRevealScore = () => narrativeStore((s) => s.revealScore);
