import type { MattressLayer } from './types';

export const LAYER_HIGHLIGHT_HEX: Record<MattressLayer, number> = {
  cover: 0x22d3ee,
  comfort: 0x2dd4bf,
  transition: 0x14b8a6,
  core: 0x0f766e,
};

export const LAYER_HIGHLIGHT_CSS: Record<MattressLayer, string> = {
  cover: '#22d3ee',
  comfort: '#2dd4bf',
  transition: '#14b8a6',
  core: '#0f766e',
};
