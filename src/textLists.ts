import {
	FAVORITES_STORAGE_KEY,
	HISTORY_STORAGE_KEY,
	TEXT_LIST_LIMIT,
} from "./config";

let favoriteTexts: string[] = [];
let historyTexts: string[] = [];
let favoritesListEl: HTMLUListElement | null = null;
let historyListEl: HTMLUListElement | null = null;
let onSelectText: ((text: string) => void) | null = null;

function loadStoredList(key: string) {
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed)) {
			return parsed.filter((item): item is string => typeof item === "string");
		}
	} catch (error) {
		console.warn(`Failed to load ${key}:`, error);
	}
	return [];
}

function persistList(key: string, list: string[]) {
	try {
		localStorage.setItem(key, JSON.stringify(list));
	} catch (error) {
		console.warn(`Failed to save ${key}:`, error);
	}
}

function persistLists() {
	persistList(FAVORITES_STORAGE_KEY, favoriteTexts);
	persistList(HISTORY_STORAGE_KEY, historyTexts);
}

function dedupeAndLimit(list: string[]) {
	const seen = new Set<string>();
	const result: string[] = [];
	for (const item of list) {
		const trimmed = item.trim();
		if (!trimmed || seen.has(trimmed)) continue;
		seen.add(trimmed);
		result.push(trimmed);
		if (result.length >= TEXT_LIST_LIMIT) break;
	}
	return result;
}

function renderList(
	listEl: HTMLUListElement | null,
	items: string[],
	type: "favorites" | "history",
) {
	if (!listEl) return;
	listEl.textContent = "";
	items.forEach((text) => {
		const listItem = document.createElement("li");
		listItem.className = "text-list__item";

		const playButton = document.createElement("button");
		playButton.type = "button";
		playButton.className = "text-list__text";
		playButton.textContent = text;
		playButton.addEventListener("click", () => onSelectText?.(text));

		const actionButton = document.createElement("button");
		actionButton.type = "button";
		actionButton.className = `text-list__action ${
			type === "history"
				? "text-list__action--add"
				: "text-list__action--remove"
		}`;
		actionButton.textContent = type === "history" ? "＋" : "－";
		actionButton.setAttribute(
			"aria-label",
			type === "history" ? "お気に入りに入れる" : "お気に入りから削除する",
		);
		actionButton.addEventListener("click", () => {
			if (type === "history") {
				moveToFavorites(text);
			} else {
				moveToHistory(text);
			}
		});

		listItem.appendChild(playButton);
		listItem.appendChild(actionButton);
		listEl.appendChild(listItem);
	});
}

function renderTextLists() {
	renderList(favoritesListEl, favoriteTexts, "favorites");
	renderList(historyListEl, historyTexts, "history");
}

function moveToFavorites(text: string) {
	const target = text.trim();
	if (!target) return;
	historyTexts = historyTexts.filter((item) => item !== target);
	favoriteTexts = [target, ...favoriteTexts.filter((item) => item !== target)];
	favoriteTexts = dedupeAndLimit(favoriteTexts);
	historyTexts = dedupeAndLimit(historyTexts);
	persistLists();
	renderTextLists();
}

function moveToHistory(text: string) {
	const target = text.trim();
	if (!target) return;
	favoriteTexts = favoriteTexts.filter((item) => item !== target);
	historyTexts = [target, ...historyTexts.filter((item) => item !== target)];
	favoriteTexts = dedupeAndLimit(favoriteTexts);
	historyTexts = dedupeAndLimit(historyTexts);
	persistLists();
	renderTextLists();
}

export function addToHistory(text: string) {
	const target = text.trim();
	if (!target) return;
	if (favoriteTexts.includes(target)) return;
	historyTexts = [target, ...historyTexts.filter((item) => item !== target)];
	historyTexts = dedupeAndLimit(historyTexts);
	persistLists();
	renderTextLists();
}

export function initializeTextLists(options: {
	favoritesList: HTMLUListElement | null;
	historyList: HTMLUListElement | null;
	onSelectText: (text: string) => void;
}) {
	favoritesListEl = options.favoritesList;
	historyListEl = options.historyList;
	onSelectText = options.onSelectText;
	favoriteTexts = dedupeAndLimit(loadStoredList(FAVORITES_STORAGE_KEY));
	historyTexts = dedupeAndLimit(loadStoredList(HISTORY_STORAGE_KEY));
	persistLists();
	renderTextLists();
}
