import type { FrequencyScale } from "../config";
import { getColorVariable } from "../status";
import { prepareCanvas } from "./canvas";
import {
	analyzeSpectrogramFrames,
	drawOfflineSpectrogram,
	type OfflineSpectrogramData,
} from "./spectrogram";
import { SPECTROGRAM_LEFT_MARGIN } from "./timeAxis";

type SpectrogramCache = {
	linear: OfflineSpectrogramData | null;
	log: OfflineSpectrogramData | null;
};

type SpectrogramImageCache = {
	linear: ImageBitmap | null;
	log: ImageBitmap | null;
};

export const spectrogramCacheState = {
	scale: "linear" as FrequencyScale,
	needsReset: false,
	cachedData: { linear: null, log: null } as SpectrogramCache,
	cachedImage: { linear: null, log: null } as SpectrogramImageCache,
	pendingSignature: null as string | null,
};

export function getSpectrogramScale(): FrequencyScale {
	return spectrogramCacheState.scale;
}

export function setSpectrogramScale(scale: FrequencyScale) {
	spectrogramCacheState.scale = scale;
	spectrogramCacheState.needsReset = true;
	const spectrogramCanvas = document.getElementById(
		"spectrogram",
	) as HTMLCanvasElement | null;
	if (spectrogramCanvas) {
		if (spectrogramCacheState.cachedImage[spectrogramCacheState.scale]) {
			const { ctx, width, height } = prepareCanvas(spectrogramCanvas);
			if (ctx) {
				ctx.clearRect(0, 0, width, height);
				ctx.drawImage(
					spectrogramCacheState.cachedImage[spectrogramCacheState.scale]!,
					0,
					0,
					width,
					height,
				);
			}
			spectrogramCacheState.needsReset = false;
			return;
		}
		if (spectrogramCacheState.cachedData[spectrogramCacheState.scale]) {
			drawOfflineSpectrogram(
				spectrogramCacheState.cachedData[spectrogramCacheState.scale]!,
				spectrogramCanvas,
				spectrogramCacheState.scale,
				true,
			);
			createSpectrogramImageCache(
				spectrogramCanvas,
				spectrogramCacheState.scale,
			);
			spectrogramCacheState.needsReset = false;
		} else {
			const { ctx, width, height } = prepareCanvas(spectrogramCanvas);
			if (ctx) {
				ctx.clearRect(0, 0, width, height);
				ctx.fillStyle = getColorVariable("--bg-color", "#ffffff");
				ctx.fillRect(0, 0, width, height);
				ctx.strokeStyle = getColorVariable("--border-color", "#e0e0e0");
				ctx.beginPath();
				ctx.moveTo(0, height / 2);
				ctx.lineTo(width, height / 2);
				ctx.stroke();
			}
		}
	}
}

export function requestSpectrogramReset() {
	spectrogramCacheState.needsReset = true;
}

export function createSpectrogramImageCache(
	canvas: HTMLCanvasElement,
	scale: FrequencyScale,
) {
	if (!window.createImageBitmap) return;
	window
		.createImageBitmap(canvas)
		.then((bitmap) => {
			spectrogramCacheState.cachedImage[scale] = bitmap;
			const spectrogramCanvas = document.getElementById(
				"spectrogram",
			) as HTMLCanvasElement | null;
			if (spectrogramCanvas && spectrogramCacheState.scale === scale) {
				const { ctx, width, height } = prepareCanvas(spectrogramCanvas);
				if (ctx) {
					ctx.clearRect(0, 0, width, height);
					ctx.drawImage(bitmap, 0, 0, width, height);
				}
				spectrogramCacheState.needsReset = false;
			}
		})
		.catch((error) => {
			console.error("Error creating spectrogram image bitmap:", error);
			spectrogramCacheState.cachedImage[scale] = null;
		});
}

function analyzeAndCacheSpectrogram({
	decodedBuffer,
	columnCount,
	analysisSignature,
	requestSpectrogramDraw,
}: {
	decodedBuffer: AudioBuffer;
	columnCount: number;
	analysisSignature: string;
	requestSpectrogramDraw: (forceReset: boolean) => void;
}) {
	spectrogramCacheState.needsReset = true;
	spectrogramCacheState.pendingSignature = analysisSignature;
	spectrogramCacheState.cachedImage = { linear: null, log: null };
	void Promise.resolve()
		.then(async () => {
			const analysis = await analyzeSpectrogramFrames(
				decodedBuffer,
				columnCount,
			);
			if (spectrogramCacheState.pendingSignature !== analysisSignature) {
				return;
			}
			spectrogramCacheState.cachedData = {
				linear: { ...analysis, signature: analysisSignature },
				log: { ...analysis, signature: analysisSignature },
			};
			spectrogramCacheState.pendingSignature = null;
			spectrogramCacheState.needsReset = true;
			requestSpectrogramDraw(true);
		})
		.catch((error) => {
			console.error("Error during spectrogram analysis:", error);
		});
}

export function handleSpectrogramInitialization({
	decodedBuffer,
	spectrogramCanvas,
	shouldResetSpectrogram,
	spectrogramSignature,
	requestSpectrogramDraw,
}: {
	decodedBuffer: AudioBuffer;
	spectrogramCanvas: HTMLCanvasElement;
	shouldResetSpectrogram: boolean;
	spectrogramSignature: string;
	requestSpectrogramDraw: (forceReset: boolean) => void;
}) {
	const { width } = prepareCanvas(spectrogramCanvas);
	const columnCount = Math.max(1, width - SPECTROGRAM_LEFT_MARGIN);
	const shouldAnalyze =
		shouldResetSpectrogram ||
		!spectrogramCacheState.cachedData.linear ||
		!spectrogramCacheState.cachedData.log ||
		spectrogramCacheState.cachedData.linear.signature !==
			spectrogramSignature ||
		spectrogramCacheState.cachedData.log.signature !== spectrogramSignature;
	if (shouldAnalyze) {
		analyzeAndCacheSpectrogram({
			decodedBuffer,
			columnCount,
			analysisSignature: spectrogramSignature,
			requestSpectrogramDraw,
		});
	} else if (
		spectrogramCacheState.needsReset &&
		(spectrogramCacheState.cachedData.linear ||
			spectrogramCacheState.cachedData.log)
	) {
		requestSpectrogramDraw(true);
	}
}

export function resetSpectrogramCaches() {
	spectrogramCacheState.cachedData = { linear: null, log: null };
	spectrogramCacheState.cachedImage = { linear: null, log: null };
	spectrogramCacheState.pendingSignature = null;
	spectrogramCacheState.needsReset = false;
}
