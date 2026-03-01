import * as Tone from "tone";
import { AUDIO_CACHE_LIMIT, AUTO_PLAY_DEBOUNCE_MS } from "./config";
import { addToHistory } from "./textLists";
import {
	fetchAndRenderIntonation,
	isIntonationDirty,
	resetIntonationState,
} from "./intonation";
import { appState } from "./state";
import { updateExportButtonState } from "./uiControls";
import { showStatus, scheduleHideStatus, getColorVariable } from "./status";
import {
	combineAudioBuffers,
	encodeAudioBufferToWav,
	getAudioQuery,
	synthesize,
} from "./audio";
import {
	buildTextSegments,
	getSelectedStyleId,
	parseDelimiterConfig,
	populateSpeakerStyleSelect,
	selectRandomStyleId,
	setSelectedStyleId,
} from "./styleManager";
import {
	drawRenderedWaveform,
	initializeVisualizationCanvases,
	isPlaybackActive,
	playAudio,
	stopActivePlayback,
} from "./visualization";

const audioCache = new Map<string, ArrayBuffer>();
const PLAY_ICON_SVG =
	'<svg class="icon icon--play" aria-hidden="true" viewBox="0 0 24 24" focusable="false" preserveAspectRatio="xMidYMid meet"><polygon points="3,2 22,12 3,22"/></svg>';
const STOP_ICON_SVG =
	'<svg class="icon icon--stop" aria-hidden="true" viewBox="0 0 24 24" focusable="false" preserveAspectRatio="xMidYMid meet"><rect x="3" y="3" width="18" height="18" rx="2.5"></rect></svg>';
let autoPlayTimer: number | null = null;
let loopCheckboxEl: HTMLInputElement | null = null;
let playRequestPending = false;
let stopInProgress = false;

export function setLoopCheckboxElement(element: HTMLInputElement | null) {
	loopCheckboxEl = element;
}

export function setPlayButtonAppearance(mode: "play" | "stop") {
	const playButton = document.getElementById(
		"playButton",
	) as HTMLButtonElement | null;
	if (!playButton) return;
	if (mode === "play") {
		playButton.innerHTML = PLAY_ICON_SVG;
		playButton.dataset.icon = "play";
		playButton.setAttribute("aria-label", "Play");
		playButton.title = "Play";
	} else {
		playButton.innerHTML = STOP_ICON_SVG;
		playButton.dataset.icon = "stop";
		playButton.setAttribute("aria-label", "Stop");
		playButton.title = "Stop";
	}
}

export function isPlayRequestPending() {
	return playRequestPending;
}

function stopPlaybackAndResetLoop() {
	stopInProgress = true;
	stopActivePlayback();
	if (loopCheckboxEl) {
		loopCheckboxEl.checked = false;
	}
	setPlayButtonAppearance("play");
	setTimeout(() => {
		stopInProgress = false;
	}, 0);
}

export function getAudioCacheKey(text: string, styleId: number) {
	return `${styleId}::${text}`;
}

export function setTextAndPlay(text: string) {
	const textArea = document.getElementById(
		"text",
	) as HTMLTextAreaElement | null;
	if (!textArea) return;
	textArea.value = text;
	if (autoPlayTimer !== null) {
		window.clearTimeout(autoPlayTimer);
		autoPlayTimer = null;
	}
	scheduleAutoPlay();
}

export function downloadLastAudio() {
	if (!appState.lastSynthesizedBuffer) return;

	const blob = new Blob([appState.lastSynthesizedBuffer], {
		type: "audio/wav",
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = "voicevox-output.wav";
	document.body.appendChild(link);
	link.click();
	window.setTimeout(() => {
		URL.revokeObjectURL(url);
		link.remove();
	}, 0);
}

export function scheduleAutoPlay() {
	if (autoPlayTimer !== null) {
		window.clearTimeout(autoPlayTimer);
	}

	const textArea = document.getElementById(
		"text",
	) as HTMLTextAreaElement | null;
	if (!textArea) return;
	const text = textArea.value.trim();
	if (!text) {
		autoPlayTimer = null;
		return;
	}

	const triggerPlay = () => {
		autoPlayTimer = null;
		if (appState.isProcessing) {
			autoPlayTimer = window.setTimeout(triggerPlay, AUTO_PLAY_DEBOUNCE_MS);
			return;
		}
		void handlePlay();
	};

	autoPlayTimer = window.setTimeout(triggerPlay, AUTO_PLAY_DEBOUNCE_MS);
}

async function confirmResetIntonationBeforePlay() {
	const dialog = document.getElementById("playConfirmDialog");
	const resetButton = document.getElementById("playConfirmReset");
	const cancelButton = document.getElementById("playConfirmCancel");
	if (!dialog || !resetButton || !cancelButton) {
		return window.confirm(
			"イントネーションの編集内容が破棄されます。再生してよろしいですか？",
		);
	}
	const previousActiveElement = document.activeElement as HTMLElement | null;
	dialog.removeAttribute("hidden");
	let settled = false;
	(resetButton as HTMLElement).focus();
	return new Promise<boolean>((resolve) => {
		let keydownHandler: ((event: KeyboardEvent) => void) | null = null;
		const cleanup = () => {
			if (settled) return;
			settled = true;
			dialog.setAttribute("hidden", "true");
			if (keydownHandler) {
				dialog.removeEventListener("keydown", keydownHandler);
			}
			resetButton.removeEventListener("click", handleReset);
			cancelButton.removeEventListener("click", handleCancel);
			if (
				previousActiveElement &&
				typeof previousActiveElement.focus === "function"
			) {
				previousActiveElement.focus();
			}
		};
		const handleReset = () => {
			cleanup();
			resolve(true);
		};
		const handleCancel = () => {
			cleanup();
			resolve(false);
		};
		keydownHandler = (event: KeyboardEvent) => {
			if (event.key === "Escape" || event.key === "Esc") {
				event.preventDefault();
				handleCancel();
			}
		};
		dialog.addEventListener("keydown", keydownHandler);
		resetButton.addEventListener("click", handleReset, { once: true });
		cancelButton.addEventListener("click", handleCancel, { once: true });
	});
}

export function handlePlayButtonClick() {
	if (stopInProgress) {
		return;
	}
	if (isPlaybackActive()) {
		if (import.meta.env.DEV) {
			console.debug("Stop button clicked");
		}
		stopPlaybackAndResetLoop();
		return;
	}
	if (playRequestPending || appState.isProcessing) {
		return;
	}
	void handlePlay();
}

export async function handlePlay() {
	const textArea = document.getElementById(
		"text",
	) as HTMLTextAreaElement | null;
	const playButton = document.getElementById(
		"playButton",
	) as HTMLButtonElement | null;
	const exportButton = document.getElementById(
		"exportButton",
	) as HTMLButtonElement | null;
	const renderedCanvas = document.getElementById(
		"renderedWaveform",
	) as HTMLCanvasElement | null;
	const realtimeCanvas = document.getElementById(
		"realtimeWaveform",
	) as HTMLCanvasElement | null;
	const spectrogramCanvas = document.getElementById(
		"spectrogram",
	) as HTMLCanvasElement | null;
	const loopCheckbox = document.getElementById(
		"loopCheckbox",
	) as HTMLInputElement | null;
	const styleSelect = document.getElementById(
		"styleSelect",
	) as HTMLSelectElement | null;
	const speakerStyleSelect = document.getElementById(
		"speakerStyleSelect",
	) as HTMLSelectElement | null;
	const delimiterInput = document.getElementById(
		"delimiterInput",
	) as HTMLInputElement | null;
	const randomStyleCheckbox = document.getElementById(
		"randomStyleCheckbox",
	) as HTMLInputElement | null;

	if (!textArea || !playButton) {
		console.error("Required UI elements not found");
		return;
	}

	const text = textArea.value.trim();

	if (!text) {
		showStatus("テキストを入力してください", "error");
		return;
	}

	const randomStyleEnabled = randomStyleCheckbox?.checked ?? false;

	if (randomStyleEnabled) {
		const randomStyleId = selectRandomStyleId();
		if (styleSelect) {
			styleSelect.value = String(randomStyleId);
		}
		populateSpeakerStyleSelect(speakerStyleSelect, randomStyleId);
	} else if (styleSelect && styleSelect.value) {
		const parsed = Number(styleSelect.value);
		if (!Number.isNaN(parsed)) {
			setSelectedStyleId(parsed);
		}
	}

	const delimiter = parseDelimiterConfig(delimiterInput?.value ?? "");
	const segments = buildTextSegments(text, delimiter, getSelectedStyleId());
	if (segments.length === 0) {
		showStatus("テキストを入力してください", "error");
		return;
	}

	if (appState.isProcessing || playRequestPending) {
		return;
	}

	playRequestPending = true;

	if (isIntonationDirty()) {
		const shouldReset = await confirmResetIntonationBeforePlay();
		if (!shouldReset) {
			playRequestPending = false;
			return;
		}
		resetIntonationState();
	}

	appState.isProcessing = true;
	playButton.disabled = true;
	updateExportButtonState(exportButton);

	try {
		const audioContext = Tone.getContext().rawContext as BaseAudioContext;
		const decodedBuffers: AudioBuffer[] = [];
		const bypassCache = randomStyleEnabled;
		let usedCache = false;
		let allSegmentsCached = !bypassCache;
		const currentSignature = segments
			.map((segment) => getAudioCacheKey(segment.text, segment.styleId))
			.join("|");
		for (const segment of segments) {
			const cacheKey = getAudioCacheKey(segment.text, segment.styleId);
			let audioBuffer = bypassCache ? null : (audioCache.get(cacheKey) ?? null);
			if (audioBuffer) {
				usedCache = true;
			} else {
				allSegmentsCached = false;
				showStatus("音声クエリを作成中...", "info");
				const audioQuery = await getAudioQuery(segment.text, segment.styleId);
				showStatus("音声を生成中...", "info");
				audioBuffer = await synthesize(audioQuery, segment.styleId);
				if (!bypassCache) {
					if (audioCache.size >= AUDIO_CACHE_LIMIT) {
						const oldest = audioCache.keys().next().value;
						if (oldest !== undefined) {
							audioCache.delete(oldest);
						}
					}
					audioCache.set(cacheKey, audioBuffer);
				}
			}
			const decodedBuffer = await audioContext.decodeAudioData(
				audioBuffer.slice(0),
			);
			decodedBuffers.push(decodedBuffer);
		}

		const combinedBuffer = combineAudioBuffers(decodedBuffers, audioContext);
		if (!combinedBuffer) {
			throw new Error("音声の結合に失敗しました。");
		}

		appState.lastSynthesizedBuffer = encodeAudioBufferToWav(combinedBuffer);

		const shouldPreserveSpectrogram =
			!bypassCache &&
			allSegmentsCached &&
			appState.lastSpectrogramSignature === currentSignature;
		initializeVisualizationCanvases({
			preserveSpectrogram: shouldPreserveSpectrogram,
		});
		if (renderedCanvas) {
			drawRenderedWaveform(combinedBuffer, renderedCanvas);
		}

		if (!usedCache) {
			showStatus("音声を再生中...", "info");
		} else {
			showStatus("音声を再生中（キャッシュ）...", "info");
		}
		setPlayButtonAppearance("stop");
		playButton.disabled = false;
		const playbackResult = await playAudio(
			combinedBuffer,
			realtimeCanvas,
			spectrogramCanvas,
			{
				resetSpectrogram: !shouldPreserveSpectrogram,
			},
		);
		if (playbackResult.stopped) {
			showStatus("再生を停止しました", "info");
			scheduleHideStatus(1500);
			clearRealtimeWaveformCanvas(realtimeCanvas);
			return;
		}
		appState.lastSpectrogramSignature = currentSignature;
		const spokenText = segments.map((segment) => segment.text).join("");
		const intonationStyleId = segments[0]?.styleId ?? getSelectedStyleId();
		await fetchAndRenderIntonation(spokenText, intonationStyleId);
		addToHistory(text);

		showStatus("再生完了！", "success");
		clearRealtimeWaveformCanvas(realtimeCanvas);
		scheduleHideStatus(3000);

		if (loopCheckbox?.checked) {
			setTimeout(() => {
				if (loopCheckbox.checked) {
					void handlePlay();
				}
			}, 0);
		}
	} catch (error) {
		console.error("Error:", error);
		showStatus(
			`エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
			"error",
		);
	} finally {
		setPlayButtonAppearance("play");
		playButton.disabled = false;
		playRequestPending = false;
		appState.isProcessing = false;
		updateExportButtonState(exportButton);
	}
}

function clearRealtimeWaveformCanvas(canvas: HTMLCanvasElement | null) {
	if (!canvas) return;
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = getColorVariable("--bg-color", "#ffffff");
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = getColorVariable("--border-color", "#e0e0e0");
	ctx.beginPath();
	ctx.moveTo(0, canvas.height / 2);
	ctx.lineTo(canvas.width, canvas.height / 2);
	ctx.stroke();
}
