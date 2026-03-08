/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from "vitest";
import { handlePlay } from "./playback";
import { TEXT_MAX_LENGTH } from "./config";

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

vi.mock("./status", () => ({
	showStatus: vi.fn(),
	scheduleHideStatus: vi.fn(),
}));

vi.mock("./textLists", () => ({
	addToHistory: vi.fn(),
}));

vi.mock("./intonation", () => ({
	fetchAndRenderIntonation: vi.fn(),
	hasActiveIntonationQuery: vi.fn(() => false),
	isIntonationActive: vi.fn(() => false),
	isIntonationDirty: vi.fn(() => false),
	playUpdatedIntonation: vi.fn(async () => {}),
	replayCachedIntonationAudio: vi.fn(async () => true),
	resetIntonationState: vi.fn(),
}));

vi.mock("./uiControls", () => ({
	updateExportButtonState: vi.fn(),
}));

vi.mock("./styleManager", () => ({
	buildTextSegments: vi.fn(() => [{ text: "hello", styleId: 1 }]),
	getSelectedStyleId: vi.fn(() => 1),
	getApiBaseForStyleId: vi.fn(() => "http://localhost:50021"),
	parseDelimiterConfig: vi.fn(() => ({})),
	setSelectedStyleId: vi.fn(),
}));

vi.mock("./audio", () => ({
	combineAudioBuffers: vi.fn(() => dummyAudioBuffer),
	encodeAudioBufferToWav: vi.fn(() => new ArrayBuffer(4)),
	getAudioQuery: vi.fn(async () => ({})),
	synthesize: vi.fn(async () => new ArrayBuffer(8)),
}));

vi.mock("./visualization", () => {
	let active = false;
	let resolvePlayback: ((result: { stopped: boolean }) => void) | null = null;
	const stopActivePlayback = vi.fn(() => {
		active = false;
		resolvePlayback?.({ stopped: true });
		resolvePlayback = null;
	});
	const playAudio = vi.fn(async () => {
		active = true;
		return new Promise<{ stopped: boolean }>((resolve) => {
			resolvePlayback = resolve;
		});
	});
	return {
		drawRenderedWaveform: vi.fn(),
		initializeVisualizationCanvases: vi.fn(),
		isPlaybackActive: vi.fn(() => active),
		playAudio,
		stopActivePlayback,
	};
});

afterEach(() => {
	document.body.innerHTML = "";
	vi.clearAllMocks();
});

describe("handlePlay text truncation", () => {
	const makeDOM = (text: string) => {
		document.body.innerHTML = `
      <textarea id="text">${text}</textarea>
      <button id="playButton"></button>
      <button id="exportButton"></button>
      <canvas id="renderedWaveform"></canvas>
      <canvas id="realtimeWaveform"></canvas>
      <canvas id="spectrogram"></canvas>
      <input id="loopCheckbox" type="checkbox" />
      <select id="styleSelect"></select>
      <input id="delimiterInput" />
    `;
	};

	it("passes text unchanged when within limit", async () => {
		const shortText = "あ".repeat(TEXT_MAX_LENGTH - 1);
		makeDOM(shortText);

		const { buildTextSegments } = await import("./styleManager");
		const { playAudio } = await import("./visualization");
		vi.mocked(playAudio).mockResolvedValueOnce({ stopped: false });

		await handlePlay();

		expect(vi.mocked(buildTextSegments)).toHaveBeenCalledWith(
			shortText,
			expect.anything(),
			expect.anything(),
		);

		const { showStatus } = await import("./status");
		const statusCalls = vi.mocked(showStatus).mock.calls;
		const completionCall = statusCalls.find(([msg]) =>
			(msg as string).includes("再生完了"),
		);
		expect(completionCall?.[0]).toBe("再生完了！");
	});

	it("truncates text to TEXT_MAX_LENGTH when over limit", async () => {
		const longText = "あ".repeat(TEXT_MAX_LENGTH + 100);
		makeDOM(longText);

		const { buildTextSegments } = await import("./styleManager");
		const { playAudio } = await import("./visualization");
		vi.mocked(playAudio).mockResolvedValueOnce({ stopped: false });

		await handlePlay();

		const expectedText = "あ".repeat(TEXT_MAX_LENGTH);
		expect(vi.mocked(buildTextSegments)).toHaveBeenCalledWith(
			expectedText,
			expect.anything(),
			expect.anything(),
		);
	});

	it("shows truncation notice in status when text is over limit", async () => {
		const longText = "あ".repeat(TEXT_MAX_LENGTH + 1);
		makeDOM(longText);

		const { playAudio } = await import("./visualization");
		vi.mocked(playAudio).mockResolvedValueOnce({ stopped: false });

		await handlePlay();

		const { showStatus } = await import("./status");
		const statusCalls = vi
			.mocked(showStatus)
			.mock.calls.map(([msg]) => msg as string);
		expect(statusCalls.some((msg) => msg.includes("カット"))).toBe(true);
		const completionMsg = statusCalls.find((msg) => msg.includes("再生完了"));
		expect(completionMsg).toContain("カット");
	});

	it("shows truncation notice when playUpdatedIntonation path is taken with long text", async () => {
		const longText = "あ".repeat(TEXT_MAX_LENGTH + 1);
		document.body.innerHTML = `
      <textarea id="text">${longText}</textarea>
      <button id="playButton"></button>
      <button id="exportButton"></button>
      <canvas id="renderedWaveform"></canvas>
      <canvas id="realtimeWaveform"></canvas>
      <canvas id="spectrogram"></canvas>
      <input id="loopCheckbox" type="checkbox" />
      <select id="styleSelect"></select>
      <input id="delimiterInput" />
    `;

		const {
			hasActiveIntonationQuery,
			isIntonationDirty,
			playUpdatedIntonation,
		} = await import("./intonation");
		const { showStatus } = await import("./status");
		vi.mocked(hasActiveIntonationQuery).mockReturnValue(true);
		vi.mocked(isIntonationDirty).mockReturnValue(true);

		await handlePlay();

		expect(playUpdatedIntonation).toHaveBeenCalledTimes(1);
		const statusCalls = vi
			.mocked(showStatus)
			.mock.calls.map(([msg]) => msg as string);
		expect(statusCalls.some((msg) => msg.includes("カット"))).toBe(true);

		vi.mocked(hasActiveIntonationQuery).mockReturnValue(false);
		vi.mocked(isIntonationDirty).mockReturnValue(false);
	});
});
