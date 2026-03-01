import * as Tone from "tone";
import { FrequencyScale } from "./config";
import { getColorVariable, invalidateColorVariableCache } from "./status";
import { prepareCanvas } from "./visualization/canvas";
import {
	drawRealtimeWaveformBackground,
	drawRealtimeWaveformOnly,
} from "./visualization/waveform";
import { drawRealtimeFFT } from "./visualization/fftOverlay";
import { getMaxFreqByThreshold } from "./visualization/fftMaxFreq";
import {
	buildSpectrogramSignature,
	drawOfflineSpectrogram,
	drawSpectrogram,
	OfflineSpectrogramData,
} from "./visualization/spectrogram";
import { SPECTROGRAM_LEFT_MARGIN } from "./visualization/timeAxis";
import {
	spectrogramCacheState,
	createSpectrogramImageCache,
	handleSpectrogramInitialization,
	resetSpectrogramCaches,
} from "./visualization/spectrogramCache";
export {
	getSpectrogramScale,
	setSpectrogramScale,
	requestSpectrogramReset,
} from "./visualization/spectrogramCache";

let realtimePreviousSegment: Float32Array | null = null;
let activePlaybackStopper: (() => void) | null = null;

export function isPlaybackActive() {
	return activePlaybackStopper !== null;
}

export function stopActivePlayback() {
	activePlaybackStopper?.();
}

export function initializeVisualizationCanvases(options?: {
	preserveSpectrogram?: boolean;
}) {
	const preserveSpectrogram = options?.preserveSpectrogram ?? false;
	if (!preserveSpectrogram) {
		resetSpectrogramCaches();
	}
	invalidateColorVariableCache();
	["renderedWaveform", "realtimeWaveform", "spectrogram"].forEach((id) => {
		const canvas = document.getElementById(id) as HTMLCanvasElement | null;
		if (!canvas) return;
		if (id === "spectrogram" && preserveSpectrogram) {
			return;
		}
		clearWaveformCanvas(canvas);
		if (id === "spectrogram") {
			drawSpectrogram(
				new Float32Array([0, 0]),
				canvas,
				0,
				1,
				-1,
				Tone.getContext().sampleRate ?? 48000,
				spectrogramCacheState.scale,
				true,
			);
			spectrogramCacheState.needsReset = false;
			spectrogramCacheState.cachedImage[spectrogramCacheState.scale] = null;
		}
	});
}

function clearWaveformCanvas(canvas: HTMLCanvasElement) {
	const { ctx, width, height } = prepareCanvas(canvas);
	if (!ctx) return;
	ctx.clearRect(0, 0, width, height);
	ctx.fillStyle = getColorVariable("--bg-color", "#ffffff");
	ctx.fillRect(0, 0, width, height);
	ctx.strokeStyle = getColorVariable("--border-color", "#e0e0e0");
	ctx.beginPath();
	ctx.moveTo(0, height / 2);
	ctx.lineTo(width, height / 2);
	ctx.stroke();
}

export async function playAudio(
	decodedBuffer: AudioBuffer,
	realtimeCanvas?: HTMLCanvasElement | null,
	spectrogramCanvas?: HTMLCanvasElement | null,
	options?: { resetSpectrogram?: boolean },
): Promise<{ stopped: boolean }> {
	await Tone.start();

	const sampleRate = Math.max(decodedBuffer.sampleRate, 1);
	const player = new Tone.Player(decodedBuffer);
	const channelData = decodedBuffer.getChannelData(0);
	const maxFreq = getMaxFreqByThreshold(channelData, sampleRate, 0.01);
	const waveformAnalyser = realtimeCanvas
		? new Tone.Analyser("waveform", 1024)
		: null;
	const fftAnalyser = realtimeCanvas ? new Tone.Analyser("fft", 1024) : null;
	const renderedProgress = document.getElementById(
		"renderedWaveformProgress",
	) as HTMLDivElement | null;
	const spectrogramProgress = document.getElementById(
		"spectrogramProgress",
	) as HTMLDivElement | null;
	function setProgressPosition(
		element: HTMLDivElement,
		ratio: number,
		leftMargin: number,
	) {
		const parent = element.parentElement;
		const width = parent?.clientWidth ?? 0;
		const clamped = Math.min(Math.max(ratio, 0), 1);
		if (width > 0) {
			const usableWidth = Math.max(width - leftMargin, 1);
			const leftPx = leftMargin + clamped * usableWidth;
			const leftPercent = (leftPx / width) * 100;
			element.style.left = `${leftPercent}%`;
		} else {
			element.style.left = `${clamped * 100}%`;
		}
		element.classList.add("is-active");
	}

	function updateProgressLines(ratio: number) {
		if (renderedProgress) {
			setProgressPosition(renderedProgress, ratio, 0);
		}
		if (spectrogramProgress) {
			setProgressPosition(spectrogramProgress, ratio, SPECTROGRAM_LEFT_MARGIN);
		}
	}

	function clearProgressLines() {
		[renderedProgress, spectrogramProgress].forEach((el) => {
			if (el) {
				el.classList.remove("is-active");
			}
		});
	}

	function drawRealtimeVisuals({
		waveformAnalyser,
		fftAnalyser,
		realtimeCanvas,
		sampleRate,
		maxFreq,
	}: {
		waveformAnalyser: Tone.Analyser | null;
		fftAnalyser: Tone.Analyser | null;
		realtimeCanvas: HTMLCanvasElement | null | undefined;
		sampleRate: number;
		maxFreq: number;
	}): number | undefined {
		if (realtimeCanvas) {
			drawRealtimeWaveformBackground(realtimeCanvas);
		}
		let fftTopFreq: number | undefined = undefined;
		if (fftAnalyser && realtimeCanvas) {
			const fftValues = fftAnalyser.getValue() as Float32Array;
			drawRealtimeFFT(fftValues, realtimeCanvas, sampleRate, maxFreq);
			const binCount = fftValues.length;
			const nyquist = sampleRate / 2;
			const valueWithIndex = Array.from(fftValues, (v, i) => ({ v, i }));
			valueWithIndex.sort((a, b) => b.v - a.v);
			const topBin = valueWithIndex[0]?.i;
			if (typeof topBin === "number") {
				fftTopFreq = (topBin / (binCount - 1)) * nyquist;
			}
		}
		if (waveformAnalyser && realtimeCanvas) {
			const values = waveformAnalyser.getValue() as Float32Array;
			const targetFreq =
				typeof fftTopFreq === "number" && isFinite(fftTopFreq) && fftTopFreq > 0
					? fftTopFreq
					: 440;
			const result = drawRealtimeWaveformOnly(
				values,
				realtimeCanvas,
				sampleRate,
				realtimePreviousSegment,
				targetFreq,
			);
			realtimePreviousSegment = result.previousSegment;
		}
		return fftTopFreq;
	}

	function handleSpectrogramDraw({
		spectrogramCanvas,
		cache,
		scale,
		forceReset,
	}: {
		spectrogramCanvas: HTMLCanvasElement;
		cache: OfflineSpectrogramData;
		scale: FrequencyScale;
		forceReset: boolean;
	}) {
		drawOfflineSpectrogram(cache, spectrogramCanvas, scale, forceReset);
		createSpectrogramImageCache(spectrogramCanvas, scale);
		spectrogramCacheState.needsReset = false;
		spectrogramDrawPending = false;
	}

	function cleanupPlayback({
		animationId,
		waveformAnalyser,
		fftAnalyser,
		player,
	}: {
		animationId: number | null;
		waveformAnalyser: Tone.Analyser | null;
		fftAnalyser: Tone.Analyser | null;
		player: Tone.Player;
	}) {
		if (animationId !== null) {
			cancelAnimationFrame(animationId);
		}
		clearProgressLines();
		waveformAnalyser?.dispose();
		fftAnalyser?.dispose();
		player.dispose();
	}

	const playbackDurationMs = Math.max(decodedBuffer.duration * 1000, 1);
	const shouldResetSpectrogram = options?.resetSpectrogram ?? true;
	spectrogramCacheState.needsReset = shouldResetSpectrogram;
	const spectrogramSignature = buildSpectrogramSignature(decodedBuffer);
	let animationId: number | null = null;
	realtimePreviousSegment = null;
	let playbackStarted = false;
	let spectrogramDrawPending = false;
	function requestSpectrogramDraw(forceReset: boolean) {
		if (!spectrogramCanvas) return;
		const cache = spectrogramCacheState.cachedData[spectrogramCacheState.scale];
		if (!cache || cache.signature !== spectrogramSignature) return;
		if (!playbackStarted) {
			spectrogramDrawPending = true;
			return;
		}
		handleSpectrogramDraw({
			spectrogramCanvas,
			cache,
			scale: spectrogramCacheState.scale,
			forceReset,
		});
	}

	if (spectrogramCanvas) {
		handleSpectrogramInitialization({
			decodedBuffer,
			spectrogramCanvas,
			shouldResetSpectrogram,
			spectrogramSignature,
			requestSpectrogramDraw,
		});
	}

	if (waveformAnalyser) {
		player.connect(waveformAnalyser);
	}

	if (fftAnalyser) {
		player.connect(fftAnalyser);
	}

	player.toDestination();
	player.start();
	const startTime = performance.now();
	playbackStarted = true;
	updateProgressLines(0);
	if (spectrogramDrawPending) {
		requestSpectrogramDraw(true);
	}

	function render() {
		const elapsed = performance.now() - startTime;
		const progress = Math.min(elapsed / playbackDurationMs, 1);
		drawRealtimeVisuals({
			waveformAnalyser,
			fftAnalyser,
			realtimeCanvas,
			sampleRate,
			maxFreq,
		});
		if (spectrogramCacheState.needsReset) {
			requestSpectrogramDraw(true);
		}
		updateProgressLines(progress);
		animationId = requestAnimationFrame(render);
	}

	if (waveformAnalyser || fftAnalyser) {
		render();
	}

	return new Promise<{ stopped: boolean }>((resolve) => {
		let resolved = false;
		let stoppedByUser = false;

		function finalize() {
			cleanupPlayback({
				animationId,
				waveformAnalyser,
				fftAnalyser,
				player,
			});
			if (activePlaybackStopper === stopPlayback) {
				activePlaybackStopper = null;
			}
			if (realtimeCanvas) {
				clearWaveformCanvas(realtimeCanvas);
			}
		}

		function stopPlayback() {
			if (resolved) return;
			resolved = true;
			stoppedByUser = true;
			if (player.state === "started") {
				player.stop();
			}
			finalize();
			resolve({ stopped: stoppedByUser });
		}

		const previousStopper = activePlaybackStopper;
		activePlaybackStopper = stopPlayback;
		if (previousStopper && previousStopper !== stopPlayback) {
			previousStopper();
		}

		player.onstop = () => {
			if (!resolved) {
				resolved = true;
				finalize();
				resolve({ stopped: stoppedByUser });
			}
		};

		setTimeout(
			() => {
				if (!resolved) {
					resolved = true;
					if (player.state === "started") {
						player.stop();
					}
					finalize();
					resolve({ stopped: stoppedByUser });
				}
			},
			decodedBuffer.duration * 1000 + 100,
		);
	});
}

export {
	analyzeSpectrogramFrames,
	buildSpectrogramSignature,
} from "./visualization/spectrogram";
export { drawRenderedWaveform } from "./visualization/waveform";
export { buildTimeTicks } from "./visualization/timeAxis";
