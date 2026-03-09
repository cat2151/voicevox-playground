import {
	INTONATION_FAVORITES_STORAGE_KEY,
	IntonationFavorite,
	TEXT_LIST_LIMIT,
} from "./config";
import { showStatus, scheduleHideStatus } from "./status";
import { intonationState, updateIntonationTiming } from "./intonation/state";
import { cloneAudioQuery, isValidAudioQueryShape } from "./intonation/utils";
import {
	buildIntonationPointsFromQuery,
	drawIntonationChart,
	ensureWheelHandler,
	refreshDisplayRange,
	updateInitialRangeFromPoints,
	adjustIntonationScale,
} from "./intonation/display";
import {
	playUpdatedIntonation,
	resetIntonationToInitial,
} from "./intonation/playback";
import { stopActivePlayback } from "./visualization";
import {
	handleIntonationKeyDown,
	handleIntonationMouseLeave,
	handleIntonationMouseMove,
	handleIntonationPointerDown,
	handleIntonationPointerMove,
	handleIntonationPointerUp,
} from "./intonation/handlers";
import { getSelectedStyleId } from "./styleManager";
export {
	handleIntonationKeyDown,
	handleIntonationMouseLeave,
	handleIntonationMouseMove,
	handleIntonationPointerDown,
	handleIntonationPointerMove,
	handleIntonationPointerUp,
};

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
	updateHoveredLabel,
} from "./intonation/display";
export {
	fetchAndRenderIntonation,
	playUpdatedIntonation,
	replayCachedIntonationAudio,
	resetIntonationToInitial,
	scheduleIntonationPlayback,
} from "./intonation/playback";

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

function parseIntonationFavoritesArray(parsed: unknown): IntonationFavorite[] {
	if (!Array.isArray(parsed)) return [];
	return parsed
		.map((item) => {
			if (!item || typeof item !== "object") return null;
			const { text, styleId, query } = item as Partial<IntonationFavorite>;
			if (
				typeof text !== "string" ||
				typeof styleId !== "number" ||
				!isValidAudioQueryShape(query)
			)
				return null;
			return { text: text.trim(), styleId, query } as IntonationFavorite;
		})
		.filter((item): item is IntonationFavorite => item !== null);
}

function loadIntonationFavorites() {
	try {
		const raw = localStorage.getItem(INTONATION_FAVORITES_STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return dedupeIntonationFavorites(parseIntonationFavoritesArray(parsed));
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
	state.currentIntonationText = null;
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

export function setHandlePlayHandler(handler: () => void) {
	state.onHandlePlay = handler;
}

export function initializeIntonationElements(): void {
	state.intonationCanvas = document.getElementById(
		"intonationCanvas",
	) as HTMLCanvasElement | null;
	state.intonationTimingEl = null;
	state.intonationLabelsEl = document.getElementById("intonationLabels");
	state.intonationMaxValueEl = document.getElementById("intonationMaxValue");
	state.intonationMinValueEl = document.getElementById("intonationMinValue");
	state.intonationFavoritesListEl = document.getElementById(
		"intonationFavoritesList",
	) as HTMLUListElement | null;
	state.loopCheckboxEl = document.getElementById(
		"loopCheckbox",
	) as HTMLInputElement | null;
	state.intonationFavorites = loadIntonationFavorites();
	persistIntonationFavorites();
	renderIntonationFavoritesList();
	ensureWheelHandler();
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
	const loopCheckbox = state.loopCheckboxEl;
	const wasLooping = loopCheckbox?.checked ?? false;
	if (wasLooping && loopCheckbox) {
		loopCheckbox.checked = false;
	}
	stopActivePlayback();
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
	state.currentIntonationText = item.text;
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
	// Defer playback start to allow the current playback's async cleanup
	// (isProcessing reset, playRequestPending reset) to complete first.
	setTimeout(() => {
		if (state.onHandlePlay) {
			if (wasLooping && loopCheckbox) {
				loopCheckbox.checked = true;
			}
			// Mark dirty so handlePlay re-synthesizes the new intonation query,
			// then the loop will use the cached result on subsequent iterations.
			state.intonationDirty = true;
			state.onHandlePlay();
		} else {
			void playUpdatedIntonation();
		}
	}, 0);
}

export function exportIntonationFavorites() {
	const data = JSON.stringify(state.intonationFavorites, null, 2);
	const blob = new Blob([data], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = "intonation-favorites.json";
	document.body.appendChild(anchor);
	anchor.click();
	window.setTimeout(() => {
		URL.revokeObjectURL(url);
		anchor.remove();
	}, 0);
}

export function importIntonationFavorites(
	file: File,
	onDone?: () => void,
): void {
	const reader = new FileReader();
	reader.onload = (event) => {
		try {
			const raw = event.target?.result;
			if (typeof raw !== "string") throw new Error("Invalid file content");
			const parsed = JSON.parse(raw);
			if (!Array.isArray(parsed)) throw new Error("Expected an array");
			const incoming = parseIntonationFavoritesArray(parsed);
			state.intonationFavorites = dedupeIntonationFavorites([
				...incoming,
				...state.intonationFavorites,
			]);
			persistIntonationFavorites();
			renderIntonationFavoritesList();
			showStatus(
				"イントネーション付きお気に入りをインポートしました",
				"success",
			);
			scheduleHideStatus(2000);
		} catch (error) {
			console.warn("Failed to import intonation favorites:", error);
			showStatus(
				"インポートに失敗しました。JSONファイルを確認してください",
				"error",
			);
		}
		onDone?.();
	};
	reader.onerror = () => {
		showStatus("ファイルの読み込みに失敗しました", "error");
		onDone?.();
	};
	reader.readAsText(file);
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

export function setupIntonationCanvasEvents(): void {
	const canvas = state.intonationCanvas;
	if (canvas) {
		canvas.addEventListener("pointerdown", handleIntonationPointerDown);
		canvas.addEventListener("pointermove", handleIntonationPointerMove);
		canvas.addEventListener("pointerleave", handleIntonationPointerUp);
		canvas.addEventListener("pointercancel", handleIntonationPointerUp);
		canvas.addEventListener("lostpointercapture", handleIntonationPointerUp);
		canvas.addEventListener("mousemove", handleIntonationMouseMove);
		canvas.addEventListener("mouseleave", handleIntonationMouseLeave);
		canvas.addEventListener("focus", () => {
			refreshIntonationChart();
		});
		window.addEventListener("keydown", handleIntonationKeyDown);
	}
	window.addEventListener("mouseup", handleIntonationPointerUp);
	window.addEventListener("pointerup", handleIntonationPointerUp);
}

export function initializeIntonationControls(): void {
	const intonationCanvas = state.intonationCanvas;
	const intonationKeyboardToggle = document.getElementById(
		"intonationKeyboardToggle",
	) as HTMLButtonElement | null;
	const intonationResetButton = document.getElementById(
		"intonationResetButton",
	) as HTMLButtonElement | null;
	const intonationFavoriteButton = document.getElementById(
		"intonationFavoriteButton",
	) as HTMLButtonElement | null;
	const intonationExpandTop = document.getElementById(
		"intonationExpandTop",
	) as HTMLButtonElement | null;
	const intonationShrinkTop = document.getElementById(
		"intonationShrinkTop",
	) as HTMLButtonElement | null;
	const intonationShrinkBottom = document.getElementById(
		"intonationShrinkBottom",
	) as HTMLButtonElement | null;
	const intonationExpandBottom = document.getElementById(
		"intonationExpandBottom",
	) as HTMLButtonElement | null;
	const intonationFavoritesExportButton = document.getElementById(
		"intonationFavoritesExportButton",
	) as HTMLButtonElement | null;
	const intonationFavoritesImportButton = document.getElementById(
		"intonationFavoritesImportButton",
	) as HTMLButtonElement | null;
	const intonationFavoritesImportFile = document.getElementById(
		"intonationFavoritesImportFile",
	) as HTMLInputElement | null;

	const updateIntonationKeyboardToggle = () => {
		if (intonationKeyboardToggle) {
			const enabled = getIntonationKeyboardEnabled();
			intonationKeyboardToggle.textContent = enabled
				? "キーボード操作: ON"
				: "キーボード操作: OFF";
			intonationKeyboardToggle.setAttribute("aria-pressed", String(enabled));
			intonationKeyboardToggle.setAttribute(
				"aria-label",
				enabled ? "キーボード操作を無効にする" : "キーボード操作を有効にする",
			);
		}
	};

	if (intonationKeyboardToggle) {
		updateIntonationKeyboardToggle();
		intonationKeyboardToggle.addEventListener("click", () => {
			setIntonationKeyboardEnabled(!getIntonationKeyboardEnabled());
			updateIntonationKeyboardToggle();
			if (getIntonationKeyboardEnabled() && intonationCanvas) {
				intonationCanvas.focus();
			}
			refreshIntonationChart();
		});
	}

	if (intonationResetButton) {
		intonationResetButton.addEventListener("click", () => {
			resetIntonationToInitial();
			if (getIntonationKeyboardEnabled() && intonationCanvas) {
				intonationCanvas.focus();
			}
		});
	}

	if (intonationFavoriteButton) {
		intonationFavoriteButton.addEventListener("click", () =>
			saveCurrentIntonationFavorite(getSelectedStyleId()),
		);
	}

	if (intonationExpandTop) {
		intonationExpandTop.addEventListener("click", () =>
			adjustIntonationScale("top", 2),
		);
	}
	if (intonationShrinkTop) {
		intonationShrinkTop.addEventListener("click", () =>
			adjustIntonationScale("top", 0.5),
		);
	}
	if (intonationShrinkBottom) {
		intonationShrinkBottom.addEventListener("click", () =>
			adjustIntonationScale("bottom", 0.5),
		);
	}
	if (intonationExpandBottom) {
		intonationExpandBottom.addEventListener("click", () =>
			adjustIntonationScale("bottom", 2),
		);
	}

	if (intonationFavoritesExportButton) {
		intonationFavoritesExportButton.addEventListener("click", () => {
			exportIntonationFavorites();
		});
	}

	if (intonationFavoritesImportButton && intonationFavoritesImportFile) {
		intonationFavoritesImportButton.addEventListener("click", () => {
			intonationFavoritesImportFile.value = "";
			intonationFavoritesImportFile.click();
		});
		intonationFavoritesImportFile.addEventListener("change", () => {
			const file = intonationFavoritesImportFile.files?.[0];
			if (file) {
				importIntonationFavorites(file, () => {
					intonationFavoritesImportFile.value = "";
				});
			}
		});
	}
}
