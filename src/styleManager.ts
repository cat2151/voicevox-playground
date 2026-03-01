import {
	REQUEST_TIMEOUT_MS,
	VoiceStyleOption,
	VoiceVoxSpeaker,
	ZUNDAMON_SPEAKER_ID,
} from "./config";
import { getVoicevoxApiBase, getVoicevoxNemoApiBase } from "./settings";

export type DelimiterConfig = { start: string; end: string };
export type TextSegment = { text: string; styleId: number };

let availableStyles: VoiceStyleOption[] = [];
let selectedStyleId = ZUNDAMON_SPEAKER_ID;

export function getSelectedStyleId() {
	return selectedStyleId;
}

export function setSelectedStyleId(styleId: number) {
	selectedStyleId = styleId;
}

export function selectRandomStyleId() {
	if (availableStyles.length === 0) {
		return selectedStyleId;
	}
	const randomIndex = Math.floor(Math.random() * availableStyles.length);
	const randomStyle = availableStyles[randomIndex];
	selectedStyleId = randomStyle.id;
	return selectedStyleId;
}

function getStyleLabel(style: VoiceStyleOption) {
	return `${style.speakerName} - ${style.name} (ID: ${style.id})`;
}

function getStyleById(id: number) {
	return availableStyles.find((style) => style.id === id) ?? null;
}

export function getApiBaseForStyleId(styleId: number): string {
	return getStyleById(styleId)?.apiBase ?? getVoicevoxApiBase();
}

function getSpeakerStylesByStyleId(styleId: number) {
	const baseStyle = getStyleById(styleId);
	if (!baseStyle) return [];
	return availableStyles.filter(
		(style) => style.speakerName === baseStyle.speakerName,
	);
}

function resolveStyleMarker(marker: string, currentStyleId: number) {
	const trimmed = marker.trim();
	if (!trimmed) return null;

	const currentStyle = getStyleById(currentStyleId);
	const currentSpeaker = currentStyle?.speakerName ?? null;

	const speakerStyles = availableStyles.filter(
		(style) => style.speakerName === trimmed,
	);
	if (speakerStyles.length > 0) {
		const normalStyle = speakerStyles.find(
			(style) => style.name === "ノーマル",
		);
		return normalStyle ?? speakerStyles[0];
	}

	if (currentSpeaker) {
		const sameSpeakerStyle = availableStyles.find(
			(style) => style.speakerName === currentSpeaker && style.name === trimmed,
		);
		if (sameSpeakerStyle) return sameSpeakerStyle;
	}

	if (/^\d+$/.test(trimmed)) {
		const numericId = Number(trimmed);
		const byId = getStyleById(numericId);
		if (byId) return byId;
	}

	return null;
}

export function parseDelimiterConfig(rawValue: string): DelimiterConfig | null {
	const trimmed = rawValue.trim();
	if (trimmed.length < 2) return null;
	const parts = trimmed.split(/\s+/).filter(Boolean);
	if (parts.length >= 2) {
		return { start: parts[0], end: parts[1] };
	}
	return { start: trimmed[0], end: trimmed[trimmed.length - 1] };
}

function addSegment(segments: TextSegment[], text: string, styleId: number) {
	if (!text) return;
	const last = segments[segments.length - 1];
	if (last && last.styleId === styleId) {
		last.text += text;
	} else {
		segments.push({ text, styleId });
	}
}

export function buildTextSegments(
	text: string,
	delimiter: DelimiterConfig | null,
	initialStyleId: number,
) {
	if (!delimiter) {
		return text ? [{ text, styleId: initialStyleId }] : [];
	}

	const segments: TextSegment[] = [];
	let cursor = 0;
	let currentStyleId = initialStyleId;

	while (cursor < text.length) {
		const startIndex = text.indexOf(delimiter.start, cursor);
		if (startIndex === -1) {
			addSegment(segments, text.slice(cursor), currentStyleId);
			break;
		}

		if (startIndex > cursor) {
			addSegment(segments, text.slice(cursor, startIndex), currentStyleId);
		}

		const endIndex = text.indexOf(
			delimiter.end,
			startIndex + delimiter.start.length,
		);
		if (endIndex === -1) {
			addSegment(segments, text.slice(startIndex), currentStyleId);
			break;
		}

		const markerContent = text.slice(
			startIndex + delimiter.start.length,
			endIndex,
		);
		const matchedStyle = resolveStyleMarker(markerContent, currentStyleId);
		if (matchedStyle) {
			currentStyleId = matchedStyle.id;
		} else {
			const fullMarker = text.slice(
				startIndex,
				endIndex + delimiter.end.length,
			);
			addSegment(segments, fullMarker, currentStyleId);
		}
		cursor = endIndex + delimiter.end.length;
	}

	return segments;
}

export function populateStyleSelect(styleSelect: HTMLSelectElement | null) {
	if (!styleSelect) return;
	styleSelect.innerHTML = "";

	if (availableStyles.length === 0) {
		const fallback = document.createElement("option");
		fallback.value = String(ZUNDAMON_SPEAKER_ID);
		fallback.textContent = `ID ${ZUNDAMON_SPEAKER_ID}`;
		styleSelect.appendChild(fallback);
		selectedStyleId = ZUNDAMON_SPEAKER_ID;
		return;
	}

	availableStyles.forEach((style) => {
		const option = document.createElement("option");
		option.value = String(style.id);
		option.textContent = getStyleLabel(style);
		styleSelect.appendChild(option);
	});

	const defaultStyle =
		availableStyles.find((style) => style.id === selectedStyleId) ??
		availableStyles[0];
	selectedStyleId = defaultStyle.id;
	styleSelect.value = String(selectedStyleId);
}

export function populateSpeakerStyleSelect(
	speakerStyleSelect: HTMLSelectElement | null,
	baseStyleId: number,
) {
	if (!speakerStyleSelect) return;
	speakerStyleSelect.innerHTML = "";
	const speakerStyles = getSpeakerStylesByStyleId(baseStyleId);
	if (speakerStyles.length === 0) {
		speakerStyleSelect.disabled = true;
		return;
	}
	speakerStyleSelect.disabled = false;
	speakerStyles.forEach((style) => {
		const option = document.createElement("option");
		option.value = String(style.id);
		option.textContent = `${style.name} (ID: ${style.id})`;
		speakerStyleSelect.appendChild(option);
	});
	const defaultStyle =
		speakerStyles.find((style) => style.id === baseStyleId) ?? speakerStyles[0];
	speakerStyleSelect.value = String(defaultStyle.id);
}

export async function fetchVoiceStyles(
	styleSelect: HTMLSelectElement | null,
	speakerStyleSelect?: HTMLSelectElement | null,
): Promise<boolean> {
	const voicevoxApiBase = getVoicevoxApiBase();
	const voicevoxNemoApiBase = getVoicevoxNemoApiBase();
	const endpoints = [
		{ url: `${voicevoxApiBase}/speakers`, apiBase: voicevoxApiBase },
		{
			url: `${voicevoxNemoApiBase}/speakers`,
			apiBase: voicevoxNemoApiBase,
		},
	];

	const results = await Promise.allSettled(
		endpoints.map(async ({ url, apiBase }) => {
			const controller = new AbortController();
			const timeoutId = setTimeout(
				() => controller.abort(),
				REQUEST_TIMEOUT_MS,
			);
			try {
				const response = await fetch(url, { signal: controller.signal });
				if (!response.ok) {
					throw new Error(
						`Failed to fetch styles: ${response.status} ${response.statusText}`,
					);
				}
				const speakers = (await response.json()) as VoiceVoxSpeaker[];
				return { speakers, apiBase };
			} finally {
				clearTimeout(timeoutId);
			}
		}),
	);

	const seenIds = new Set<number>();
	const newStyles: VoiceStyleOption[] = [];
	let anySuccess = false;

	for (let i = 0; i < results.length; i++) {
		const result = results[i];
		const { url, apiBase } = endpoints[i];
		if (result.status === "fulfilled") {
			anySuccess = true;
			const { speakers } = result.value;
			for (const speaker of speakers) {
				for (const style of speaker.styles) {
					if (!seenIds.has(style.id)) {
						seenIds.add(style.id);
						newStyles.push({
							id: style.id,
							name: style.name,
							speakerName: speaker.name,
							apiBase,
						});
					}
				}
			}
		} else {
			console.error(
				`Failed to fetch speaker styles from ${url}:`,
				result.reason,
			);
		}
	}

	if (anySuccess) {
		availableStyles = newStyles;
	} else if (availableStyles.length === 0) {
		availableStyles = [
			{
				id: ZUNDAMON_SPEAKER_ID,
				name: "未取得",
				speakerName: "デフォルト",
				apiBase: getVoicevoxApiBase(),
			},
		];
	}

	populateStyleSelect(styleSelect);
	populateSpeakerStyleSelect(speakerStyleSelect ?? null, selectedStyleId);

	return anySuccess;
}
