import {
	INTONATION_FAVORITES_STORAGE_KEY,
	type IntonationFavorite,
	TEXT_LIST_LIMIT,
} from "../config";
import { showStatus, scheduleHideStatus } from "../status";
import { intonationState as state } from "./state";
import { cloneAudioQuery, isValidAudioQueryShape } from "./utils";
import {
	buildIntonationPointsFromQuery,
	drawIntonationChart,
	updateInitialRangeFromPoints,
} from "./display";
import { playUpdatedIntonation } from "./playback";
import { stopActivePlayback } from "../visualization";

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

export function loadIntonationFavorites(): IntonationFavorite[] {
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

export function persistIntonationFavorites(): void {
	try {
		localStorage.setItem(
			INTONATION_FAVORITES_STORAGE_KEY,
			JSON.stringify(state.intonationFavorites),
		);
	} catch (error) {
		console.warn("Failed to save intonation favorites:", error);
	}
}

export function renderIntonationFavoritesList(): void {
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
