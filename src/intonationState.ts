import {
  AudioQuery,
  IntonationChartRange,
  IntonationFavorite,
  IntonationPoint,
  ZUNDAMON_SPEAKER_ID,
} from './config';

export type RangeExtra = { top: number; bottom: number };

export interface IntonationState {
  intonationCanvas: HTMLCanvasElement | null;
  intonationTimingEl: HTMLElement | null;
  intonationLabelsEl: HTMLElement | null;
  intonationMaxValueEl: HTMLElement | null;
  intonationMinValueEl: HTMLElement | null;
  intonationFavoritesListEl: HTMLUListElement | null;
  loopCheckboxEl: HTMLInputElement | null;
  intonationInitialQuery: AudioQuery | null;
  intonationInitialPitchRange: { min: number; max: number } | null;
  intonationDisplayRange: { min: number; max: number } | null;
  intonationRangeExtra: RangeExtra;
  intonationPoints: IntonationPoint[];
  intonationPointPositions: Array<{ x: number; y: number }>;
  intonationSelectedIndex: number | null;
  intonationDebounceTimer: number | null;
  intonationDragIndex: number | null;
  intonationActivePointerId: number | null;
  intonationPlaybackPending: boolean;
  intonationChartRange: IntonationChartRange | null;
  intonationTopScale: number;
  intonationBottomScale: number;
  intonationStepSize: number;
  intonationKeyboardEnabled: boolean;
  currentIntonationStyleId: number;
  currentIntonationQuery: AudioQuery | null;
  intonationDirty: boolean;
  intonationFavorites: IntonationFavorite[];
  onStyleChange: ((styleId: number) => void) | null;
  wheelHandlerAttached: boolean;
  scrollLocked: boolean;
  previousBodyOverflow: string | null;
  intonationHoverIndex: number | null;
}

export const intonationState: IntonationState = {
  intonationCanvas: null,
  intonationTimingEl: null,
  intonationLabelsEl: null,
  intonationMaxValueEl: null,
  intonationMinValueEl: null,
  intonationFavoritesListEl: null,
  loopCheckboxEl: null,
  intonationInitialQuery: null,
  intonationInitialPitchRange: null,
  intonationDisplayRange: null,
  intonationRangeExtra: { top: 0, bottom: 0 },
  intonationPoints: [],
  intonationPointPositions: [],
  intonationSelectedIndex: null,
  intonationDebounceTimer: null,
  intonationDragIndex: null,
  intonationActivePointerId: null,
  intonationPlaybackPending: false,
  intonationChartRange: null,
  intonationTopScale: 1,
  intonationBottomScale: 1,
  intonationStepSize: 1,
  intonationKeyboardEnabled: false,
  currentIntonationStyleId: ZUNDAMON_SPEAKER_ID,
  currentIntonationQuery: null,
  intonationDirty: false,
  intonationFavorites: [],
  onStyleChange: null,
  wheelHandlerAttached: false,
  scrollLocked: false,
  previousBodyOverflow: null,
  intonationHoverIndex: null,
};

export function updateIntonationTiming(message: string) {
  if (intonationState.intonationTimingEl) {
    intonationState.intonationTimingEl.textContent = message;
  }
}
