import {
	INTONATION_FAVORITES_STORAGE_KEY,
	IntonationFavorite,
	TEXT_LIST_LIMIT,
} from "./config";
import { showStatus, scheduleHideStatus } from "./status";
import { intonationState, updateIntonationTiming } from "./intonationState";
import { cloneAudioQuery, isValidAudioQueryShape } from "./intonationUtils";
import {
	buildIntonationPointsFromQuery,
	drawIntonationChart,
	ensureWheelHandler,
	refreshDisplayRange,
	updateInitialRangeFromPoints,
} from "./intonationDisplay";
import { playUpdatedIntonation } from "./intonationPlayback";
export {
	handleIntonationKeyDown,
	handleIntonationMouseLeave,
	handleIntonationMouseMove,
	handleIntonationPointerDown,
	handleIntonationPointerMove,
	handleIntonationPointerUp,
} from "./intonationHandlers";

export type { RangeExtra } from "./intonationState";
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
	updateHoveredLabel,
} from "./intonationDisplay";
export {
	fetchAndRenderIntonation,
	playUpdatedIntonation,
	replayCachedIntonationAudio,
	resetIntonationToInitial,
	scheduleIntonationPlayback,
} from "./intonationPlayback";

const state = intonationState;

function dedupeIntonationFavorites(list: IntonationFavorite[]) {
	const seen = new Set<string>();
	const result: IntonationFavorite[] = [];
	for (const item of list) {
		if (!item || !item.text || !item.query || typeof item.styleId !== "number")
			continue;
		const key = `${item.styleId}::${item.text.trim()}`;
		if (!item.text.trim() || seen.has(key)) continue;
		seen.add(key);
		result.push(item);
		if (result.length >= TEXT_LIST_LIMIT) break;
	}
	return result;
}

function loadIntonationFavorites() {
	try {
		const raw = localStorage.getItem(INTONATION_FAVORITES_STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed)) {
			return dedupeIntonationFavorites(
				parsed
					.map((item) => {
						if (!item || typeof item !== "object") return null;
						const { text, styleId, query } =
							item as Partial<IntonationFavorite>;
						if (
							typeof text !== "string" ||
							typeof styleId !== "number" ||
							!isValidAudioQueryShape(query)
						)
							return null;
						return { text: text.trim(), styleId, query } as IntonationFavorite;
					})
					.filter((item): item is IntonationFavorite => item !== null),
			);
		}
	} catch (error) {
		console.warn("Failed to load intonation favorites:", error);
	}
	return [];
}

function persistIntonationFavorites() {
	try {
		localStorage.setItem(
			INTONATION_FAVORITES_STORAGE_KEY,
			JSON.stringify(state.intonationFavorites),
		);
	} catch (error) {
		console.warn("Failed to save intonation favorites:", error);
	}
}

export function resetIntonationState() {
	state.intonationInitialQuery = null;
	state.intonationInitialPitchRange = null;
	state.intonationDisplayRange = null;
	state.intonationRangeExtra = { top: 0, bottom: 0 };
	state.intonationStepSize = 1;
	state.currentIntonationQuery = null;
	state.intonationPoints = [];
	state.intonationPointPositions = [];
	state.intonationSelectedIndex = null;
	state.intonationTopScale = 1;
	state.intonationBottomScale = 1;
	state.intonationDirty = false;
	if (state.intonationCanvas) {
		const ctx = state.intonationCanvas.getContext("2d");
		if (ctx) {
			ctx.clearRect(
				0,
				0,
				state.intonationCanvas.width,
				state.intonationCanvas.height,
			);
		}
	}
	if (state.intonationLabelsEl) {
		state.intonationLabelsEl.textContent = "";
	}
	updateIntonationTiming("イントネーション未取得");
}

export function setStyleChangeHandler(handler: (styleId: number) => void) {
	state.onStyleChange = handler;
}

export function initializeIntonationElements(options: {
	canvas: HTMLCanvasElement | null;
	timingEl: HTMLElement | null;
	labelsEl: HTMLElement | null;
	maxValueEl: HTMLElement | null;
	minValueEl: HTMLElement | null;
	favoritesListEl: HTMLUListElement | null;
	loopCheckbox: HTMLInputElement | null;
}) {
	state.intonationCanvas = options.canvas;
	state.intonationTimingEl = options.timingEl;
	state.intonationLabelsEl = options.labelsEl;
	state.intonationMaxValueEl = options.maxValueEl;
	state.intonationMinValueEl = options.minValueEl;
	state.intonationFavoritesListEl = options.favoritesListEl;
	state.loopCheckboxEl = options.loopCheckbox;
	state.intonationFavorites = loadIntonationFavorites();
	persistIntonationFavorites();
	renderIntonationFavoritesList();
	ensureWheelHandler();
}

export function isIntonationDirty() {
	return state.intonationDirty;
}

export function setIntonationKeyboardEnabled(enabled: boolean) {
	state.intonationKeyboardEnabled = enabled;
}

export function getIntonationKeyboardEnabled() {
	return state.intonationKeyboardEnabled;
}

function renderIntonationFavoritesList() {
	const listEl = state.intonationFavoritesListEl;
	if (!listEl) return;
	listEl.textContent = "";
	state.intonationFavorites.forEach((item, index) => {
		const listItem = document.createElement("li");
		listItem.className = "text-list__item";

		const playButton = document.createElement("button");
		playButton.type = "button";
		playButton.className = "text-list__text";

		const pill = document.createElement("span");
		pill.className = "text-list__pill";
		pill.textContent = "イントネーション付き";
		playButton.appendChild(pill);

		const textSpan = document.createElement("span");
		textSpan.textContent = item.text;
		playButton.appendChild(textSpan);

		playButton.addEventListener("click", () => applyIntonationFavorite(item));

		const removeButton = document.createElement("button");
		removeButton.type = "button";
		removeButton.className = "text-list__action text-list__action--remove";
		removeButton.textContent = "－";
		removeButton.setAttribute(
			"aria-label",
			"イントネーション付きお気に入りから削除する",
		);
		removeButton.addEventListener("click", () =>
			removeIntonationFavorite(index),
		);

		listItem.appendChild(playButton);
		listItem.appendChild(removeButton);
		listEl.appendChild(listItem);
	});
}

function removeIntonationFavorite(index: number) {
	if (index < 0 || index >= state.intonationFavorites.length) return;
	state.intonationFavorites = [
		...state.intonationFavorites.slice(0, index),
		...state.intonationFavorites.slice(index + 1),
	];
	persistIntonationFavorites();
	renderIntonationFavoritesList();
}

export function applyIntonationFavorite(item: IntonationFavorite) {
	if (!isValidAudioQueryShape(item.query)) {
		showStatus(
			"保存したイントネーションデータが破損しています。削除しました。",
			"error",
		);
		const idx = state.intonationFavorites.findIndex(
			(fav) => fav.text === item.text && fav.styleId === item.styleId,
		);
		if (idx !== -1) {
			removeIntonationFavorite(idx);
		}
		return;
	}
	const textArea = document.getElementById(
		"text",
	) as HTMLTextAreaElement | null;
	const styleSelect = document.getElementById(
		"styleSelect",
	) as HTMLSelectElement | null;
	if (textArea) {
		textArea.value = item.text;
	}
	if (styleSelect) {
		styleSelect.value = String(item.styleId);
	}
	state.onStyleChange?.(item.styleId);
	state.currentIntonationStyleId = item.styleId;
	state.intonationInitialQuery = cloneAudioQuery(item.query);
	state.currentIntonationQuery = cloneAudioQuery(item.query);
	state.intonationPoints = buildIntonationPointsFromQuery(
		state.currentIntonationQuery,
	);
	state.intonationTopScale = 1;
	state.intonationBottomScale = 1;
	state.intonationSelectedIndex = state.intonationPoints.length > 0 ? 0 : null;
	state.intonationDirty = false;
	updateInitialRangeFromPoints(state.intonationPoints);
	drawIntonationChart(state.intonationPoints);
	void playUpdatedIntonation();
}

export function saveCurrentIntonationFavorite(selectedStyleId: number) {
	const textArea = document.getElementById(
		"text",
	) as HTMLTextAreaElement | null;
	if (!textArea) return;
	const text = textArea.value.trim();
	if (!text) {
		showStatus("テキストを入力してください", "error");
		return;
	}
	if (!state.currentIntonationQuery) {
		showStatus("イントネーション取得後に登録してください", "error");
		return;
	}
	const entry: IntonationFavorite = {
		text,
		styleId: selectedStyleId,
		query: cloneAudioQuery(state.currentIntonationQuery),
	};
	state.intonationFavorites = dedupeIntonationFavorites([
		entry,
		...state.intonationFavorites,
	]);
	persistIntonationFavorites();
	renderIntonationFavoritesList();
	showStatus("イントネーション付きのお気に入りを保存しました", "success");
	scheduleHideStatus(2000);
}

export function refreshIntonationChart() {
	refreshDisplayRange();
	drawIntonationChart(state.intonationPoints);
}
