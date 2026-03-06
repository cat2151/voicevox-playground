/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { playUpdatedIntonation } from "./playback";
import { intonationState } from "./state";
import { appState } from "../state";
import type { AudioQuery } from "../config";

const dummyAudioBuffer = {
	length: 1,
	numberOfChannels: 1,
	sampleRate: 48000,
	duration: 0.01,
	getChannelData: () => new Float32Array(1),
} as unknown as AudioBuffer;

vi.mock("tone", () => ({
	getContext: () => ({
		rawContext: {
			decodeAudioData: vi.fn(async () => dummyAudioBuffer),
		},
	}),
}));

vi.mock("../audio", () => ({
	getAudioQuery: vi.fn(),
	synthesize: vi.fn(async () => new ArrayBuffer(8)),
}));

vi.mock("../visualization", () => ({
	drawRenderedWaveform: vi.fn(),
	initializeVisualizationCanvases: vi.fn(),
	playAudio: vi.fn(async () => ({ stopped: false })),
}));

vi.mock("../status", () => ({
	showStatus: vi.fn(),
	scheduleHideStatus: vi.fn(),
}));

vi.mock("../uiControls", () => ({
	updateExportButtonState: vi.fn(),
}));

vi.mock("../styleManager", () => ({
	getApiBaseForStyleId: vi.fn(() => "http://localhost:50021"),
}));

const stubQuery: AudioQuery = { accent_phrases: [] } as unknown as AudioQuery;

beforeEach(() => {
	document.body.innerHTML = `
    <button id="playButton"></button>
    <button id="exportButton"></button>
    <canvas id="renderedWaveform"></canvas>
    <canvas id="realtimeWaveform"></canvas>
    <canvas id="spectrogram"></canvas>
  `;
	intonationState.currentIntonationQuery = stubQuery;
	intonationState.currentIntonationStyleId = 1;
	intonationState.intonationDirty = true;
	intonationState.synthesisCache.clear();
	appState.isProcessing = false;
	appState.lastSynthesizedBuffer = null;
});

afterEach(() => {
	vi.clearAllMocks();
	intonationState.synthesisCache.clear();
	intonationState.currentIntonationQuery = null;
	intonationState.intonationDirty = false;
	appState.isProcessing = false;
	appState.lastSynthesizedBuffer = null;
});

describe("playUpdatedIntonation cache behavior", () => {
	it("calls synthesize on cache miss and stores result in synthesisCache", async () => {
		const { synthesize } = await import("../audio");

		await playUpdatedIntonation();

		expect(vi.mocked(synthesize)).toHaveBeenCalledTimes(1);
		expect(intonationState.synthesisCache.size).toBe(1);
	});

	it("skips synthesize on cache hit and reuses the cached buffer", async () => {
		const { synthesize } = await import("../audio");

		await playUpdatedIntonation();
		vi.mocked(synthesize).mockClear();

		intonationState.intonationDirty = true;
		await playUpdatedIntonation();

		expect(vi.mocked(synthesize)).not.toHaveBeenCalled();
		expect(intonationState.synthesisCache.size).toBe(1);
	});

	it("sets intonationDirty to false after successful synthesis", async () => {
		await playUpdatedIntonation();

		expect(intonationState.intonationDirty).toBe(false);
	});

	it("populates appState.lastSynthesizedBuffer after synthesis", async () => {
		await playUpdatedIntonation();

		expect(appState.lastSynthesizedBuffer).not.toBeNull();
	});

	it("caches different buffers for different queries", async () => {
		const { synthesize } = await import("../audio");

		await playUpdatedIntonation();

		const query2 = {
			accent_phrases: [{ moras: [] }],
		} as unknown as AudioQuery;
		intonationState.currentIntonationQuery = query2;
		intonationState.intonationDirty = true;
		await playUpdatedIntonation();

		expect(vi.mocked(synthesize)).toHaveBeenCalledTimes(2);
		expect(intonationState.synthesisCache.size).toBe(2);
	});
});
