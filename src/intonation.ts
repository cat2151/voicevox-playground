import { intonationState } from "./intonation/state";

export {
	handleIntonationKeyDown,
	handleIntonationMouseLeave,
	handleIntonationMouseMove,
	handleIntonationPointerDown,
	handleIntonationPointerMove,
	handleIntonationPointerUp,
} from "./intonation/handlers";

export type { RangeExtra } from "./intonation/state";
export {
	adjustIntonationScale,
	buildIntonationPointsFromQuery,
	calculateLetterKeyAdjustment,
	calculateStepSize,
	applyRangeExtra,
	clampPitchToDisplayRange,
	clampRangeExtra,
	drawIntonationChart,
	getBaseDisplayRange,
	initializeIntonationCanvas,
	refreshDisplayRange,
	refreshIntonationChart,
	updateHoveredLabel,
} from "./intonation/display";
export {
	fetchAndRenderIntonation,
	playUpdatedIntonation,
	replayCachedIntonationAudio,
	resetIntonationToInitial,
	scheduleIntonationPlayback,
} from "./intonation/playback";
export {
	getIntonationKeyboardEnabled,
	resetIntonationState,
	setIntonationKeyboardEnabled,
} from "./intonation/state";
export {
	applyIntonationFavorite,
	exportIntonationFavorites,
	importIntonationFavorites,
	saveCurrentIntonationFavorite,
} from "./intonation/favorites";
export {
	initializeIntonationControls,
	initializeIntonationElements,
	setupIntonationCanvasEvents,
} from "./intonation/setup";

const state = intonationState;

export function setStyleChangeHandler(handler: (styleId: number) => void) {
	state.onStyleChange = handler;
}

export function setHandlePlayHandler(handler: () => void) {
	state.onHandlePlay = handler;
}

export function isIntonationDirty() {
	return state.intonationDirty;
}

export function isIntonationActive() {
	return state.currentIntonationQuery !== null;
}

export function hasActiveIntonationQuery(
	currentText: string,
	currentStyleId: number,
): boolean {
	return (
		state.currentIntonationQuery !== null &&
		state.currentIntonationText === currentText &&
		state.currentIntonationStyleId === currentStyleId
	);
}
