import {
	AudioQuery,
	IntonationChartRange,
	IntonationFavorite,
	IntonationPoint,
	ZUNDAMON_SPEAKER_ID,
} from "../config";

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
	currentIntonationText: string | null;
	intonationFavorites: IntonationFavorite[];
	onStyleChange: ((styleId: number) => void) | null;
	onHandlePlay: (() => void) | null;
	wheelHandlerAttached: boolean;
	scrollLocked: boolean;
	previousBodyOverflow: string | null;
	intonationHoverIndex: number | null;
	synthesisCache: Map<string, ArrayBuffer>;
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
	currentIntonationText: null,
	intonationFavorites: [],
	onStyleChange: null,
	onHandlePlay: null,
	wheelHandlerAttached: false,
	scrollLocked: false,
	previousBodyOverflow: null,
	intonationHoverIndex: null,
	synthesisCache: new Map(),
};

export function updateIntonationTiming(message: string) {
	if (intonationState.intonationTimingEl) {
		intonationState.intonationTimingEl.textContent = message;
	}
}

export function getIntonationKeyboardEnabled(): boolean {
	return intonationState.intonationKeyboardEnabled;
}

export function setIntonationKeyboardEnabled(enabled: boolean): void {
	intonationState.intonationKeyboardEnabled = enabled;
}

export function resetIntonationState(): void {
	intonationState.intonationInitialQuery = null;
	intonationState.intonationInitialPitchRange = null;
	intonationState.intonationDisplayRange = null;
	intonationState.intonationRangeExtra = { top: 0, bottom: 0 };
	intonationState.intonationStepSize = 1;
	intonationState.currentIntonationQuery = null;
	intonationState.currentIntonationText = null;
	intonationState.intonationPoints = [];
	intonationState.intonationPointPositions = [];
	intonationState.intonationSelectedIndex = null;
	intonationState.intonationTopScale = 1;
	intonationState.intonationBottomScale = 1;
	intonationState.intonationDirty = false;
	if (intonationState.intonationCanvas) {
		const ctx = intonationState.intonationCanvas.getContext("2d");
		if (ctx) {
			ctx.clearRect(
				0,
				0,
				intonationState.intonationCanvas.width,
				intonationState.intonationCanvas.height,
			);
		}
	}
	if (intonationState.intonationLabelsEl) {
		intonationState.intonationLabelsEl.textContent = "";
	}
	updateIntonationTiming("イントネーション未取得");
}
