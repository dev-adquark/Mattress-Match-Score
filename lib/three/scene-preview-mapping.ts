import { narrativeStore } from './narrative-store';
import type { MattressLayer, SleepPosition } from './types';

export function mapFirmnessPreferenceToBias(preference: string): number {
  const biasMap: Record<string, number> = {
    'soft': -1.0,
    'medium-soft': -0.5,
    'medium': 0,
    'medium-firm': 0.5,
    'firm': 1.0,
  };
  return biasMap[preference] ?? 0;
}

export function setPreviewFirmness(preference: string) {
  const bias = mapFirmnessPreferenceToBias(preference);
  narrativeStore.getState().setPreviewFirmnessBias(bias);
}

export function setPreviewHighlightLayer(layer: MattressLayer | null) {
  narrativeStore.getState().setPreviewHighlightLayer(layer);
}

export function setPreviewCoolingShimmer(enabled: boolean) {
  narrativeStore.getState().setPreviewCoolingShimmer(enabled);
}

export function mapSleepPositionsToPreviewPosition(positions: string[]): SleepPosition | null {
  const priority: SleepPosition[] = ['side', 'back', 'stomach', 'combination'];
  return priority.find((p) => positions.includes(p)) ?? null;
}

export function setPreviewSleepPositions(positions: string[]) {
  const position = mapSleepPositionsToPreviewPosition(positions);
  narrativeStore.getState().setPreviewSleepPosition(position);
}
