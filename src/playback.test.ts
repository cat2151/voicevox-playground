/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	getAudioCacheKey,
	handlePlay,
	handlePlayButtonClick,
	isPlayRequestPending,
	setLoopCheckboxElement,
	setPlayButtonAppearance,
	setTextAndPlay,
} from "./playback";
import { stopActivePlayback } from "./visualization";
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
	playUpdatedIntonation: vi.fn(async () => {}),
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

describe("getAudioCacheKey", () => {
	it("combines style id and text", () => {
		expect(getAudioCacheKey("hello", 42)).toBe("42::hello");
	});
});

describe("setPlayButtonAppearance", () => {
	it("sets play and stop button states", () => {
		const button = document.createElement("button");
		button.id = "playButton";
		document.body.appendChild(button);

		setPlayButtonAppearance("play");
		expect(button.getAttribute("aria-label")).toBe("Play");
		expect(button.title).toBe("Play");
		expect(button.dataset.icon).toBe("play");
		expect(button.querySelector("svg.icon--play")).not.toBeNull();

		setPlayButtonAppearance("stop");
		expect(button.getAttribute("aria-label")).toBe("Stop");
		expect(button.title).toBe("Stop");
		expect(button.dataset.icon).toBe("stop");
		expect(button.querySelector("svg.icon--stop")).not.toBeNull();
	});
});

describe("handlePlayButtonClick", () => {
	it("stops playback even when a play request is pending", async () => {
		document.body.innerHTML = `
      <textarea id="text">hello</textarea>
      <button id="playButton"></button>
      <button id="exportButton"></button>
      <canvas id="renderedWaveform"></canvas>
      <canvas id="realtimeWaveform"></canvas>
      <canvas id="spectrogram"></canvas>
      <input id="loopCheckbox" type="checkbox" />
      <select id="styleSelect"></select>
      <input id="delimiterInput" />
    `;

		const playPromise = handlePlay();
		expect(isPlayRequestPending()).toBe(true);

		await new Promise((resolve) => setTimeout(resolve, 0));
		handlePlayButtonClick();

		expect(stopActivePlayback).toHaveBeenCalledTimes(1);

		await playPromise;
	});
});

describe("setTextAndPlay", () => {
	it("stops active playback before scheduling auto-play", async () => {
		document.body.innerHTML = `
      <textarea id="text">hello</textarea>
      <button id="playButton"></button>
      <button id="exportButton"></button>
      <canvas id="renderedWaveform"></canvas>
      <canvas id="realtimeWaveform"></canvas>
      <canvas id="spectrogram"></canvas>
      <input id="loopCheckbox" type="checkbox" checked />
      <select id="styleSelect"></select>
      <input id="delimiterInput" />
    `;

		const loopCheckbox = document.getElementById(
			"loopCheckbox",
		) as HTMLInputElement;
		setLoopCheckboxElement(loopCheckbox);

		try {
			vi.useFakeTimers();
			const playPromise = handlePlay();
			await vi.runAllTimersAsync();

			setTextAndPlay("new text");

			expect(stopActivePlayback).toHaveBeenCalled();
			expect(loopCheckbox.checked).toBe(false);

			vi.clearAllTimers();
			await playPromise;
		} finally {
			vi.useRealTimers();
			setLoopCheckboxElement(null);
		}
	});
});

describe("handlePlay with active intonation", () => {
	it("calls playUpdatedIntonation instead of re-synthesizing when intonation is active", async () => {
		document.body.innerHTML = `
      <textarea id="text">hello</textarea>
      <button id="playButton"></button>
      <button id="exportButton"></button>
      <canvas id="renderedWaveform"></canvas>
      <canvas id="realtimeWaveform"></canvas>
      <canvas id="spectrogram"></canvas>
      <input id="loopCheckbox" type="checkbox" />
      <select id="styleSelect"></select>
      <input id="delimiterInput" />
    `;

		const { hasActiveIntonationQuery, playUpdatedIntonation } = await import(
			"./intonation"
		);
		const { getAudioQuery } = await import("./audio");

		vi.mocked(hasActiveIntonationQuery).mockReturnValue(true);

		await handlePlay();

		expect(playUpdatedIntonation).toHaveBeenCalledTimes(1);
		expect(getAudioQuery).not.toHaveBeenCalled();

		vi.mocked(hasActiveIntonationQuery).mockReturnValue(false);
	});

	it("shows confirm dialog and resets intonation when intonation is active but text changed", async () => {
		document.body.innerHTML = `
      <textarea id="text">hello</textarea>
      <button id="playButton"></button>
      <button id="exportButton"></button>
      <canvas id="renderedWaveform"></canvas>
      <canvas id="realtimeWaveform"></canvas>
      <canvas id="spectrogram"></canvas>
      <input id="loopCheckbox" type="checkbox" />
      <select id="styleSelect"></select>
      <input id="delimiterInput" />
      <div id="playConfirmDialog" hidden>
        <button id="playConfirmReset"></button>
        <button id="playConfirmCancel"></button>
      </div>
    `;

		const { isIntonationActive, resetIntonationState } = await import(
			"./intonation"
		);
		vi.mocked(isIntonationActive).mockReturnValue(true);

		const playPromise = handlePlay();

		await new Promise((resolve) => setTimeout(resolve, 0));
		const resetButton = document.getElementById(
			"playConfirmReset",
		) as HTMLButtonElement;
		resetButton.click();

		// Wait for synthesis to start then stop it so playPromise resolves
		await new Promise((resolve) => setTimeout(resolve, 0));
		handlePlayButtonClick();

		await playPromise;

		expect(resetIntonationState).toHaveBeenCalledTimes(1);

		vi.mocked(isIntonationActive).mockReturnValue(false);
	});

	it("cancels playback when user declines the intonation reset dialog", async () => {
		document.body.innerHTML = `
      <textarea id="text">hello</textarea>
      <button id="playButton"></button>
      <button id="exportButton"></button>
      <canvas id="renderedWaveform"></canvas>
      <canvas id="realtimeWaveform"></canvas>
      <canvas id="spectrogram"></canvas>
      <input id="loopCheckbox" type="checkbox" />
      <select id="styleSelect"></select>
      <input id="delimiterInput" />
      <div id="playConfirmDialog" hidden>
        <button id="playConfirmReset"></button>
        <button id="playConfirmCancel"></button>
      </div>
    `;

		const { isIntonationActive, resetIntonationState } = await import(
			"./intonation"
		);
		const { getAudioQuery } = await import("./audio");
		vi.mocked(isIntonationActive).mockReturnValue(true);

		const playPromise = handlePlay();

		await new Promise((resolve) => setTimeout(resolve, 0));
		const cancelButton = document.getElementById(
			"playConfirmCancel",
		) as HTMLButtonElement;
		cancelButton.click();

		await playPromise;

		expect(resetIntonationState).not.toHaveBeenCalled();
		expect(getAudioQuery).not.toHaveBeenCalled();
	});
});

describe("handlePlay with multiple styles", () => {
	it("resets intonation state and skips intonation fetch when multiple styles are used", async () => {
		document.body.innerHTML = `
      <textarea id="text">hello world</textarea>
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
			isIntonationActive,
			fetchAndRenderIntonation,
			resetIntonationState,
		} = await import("./intonation");
		const { buildTextSegments } = await import("./styleManager");
		const { playAudio } = await import("./visualization");

		vi.mocked(isIntonationActive).mockReturnValue(false);
		vi.mocked(buildTextSegments).mockReturnValueOnce([
			{ text: "hello", styleId: 1 },
			{ text: " world", styleId: 2 },
		]);
		vi.mocked(playAudio).mockResolvedValueOnce({ stopped: false });

		await handlePlay();

		expect(fetchAndRenderIntonation).not.toHaveBeenCalled();
		expect(resetIntonationState).not.toHaveBeenCalled();
	});

	it("silently resets active intonation without confirmation dialog when switching to multi-style", async () => {
		document.body.innerHTML = `
      <textarea id="text">hello world</textarea>
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
			isIntonationActive,
			fetchAndRenderIntonation,
			resetIntonationState,
		} = await import("./intonation");
		const { buildTextSegments } = await import("./styleManager");
		const { playAudio } = await import("./visualization");

		vi.mocked(isIntonationActive).mockReturnValue(true);
		vi.mocked(buildTextSegments).mockReturnValueOnce([
			{ text: "hello", styleId: 1 },
			{ text: " world", styleId: 2 },
		]);
		vi.mocked(playAudio).mockResolvedValueOnce({ stopped: false });

		const confirmSpy = vi.spyOn(window, "confirm");

		await handlePlay();

		expect(resetIntonationState).toHaveBeenCalled();
		expect(fetchAndRenderIntonation).not.toHaveBeenCalled();
		expect(confirmSpy).not.toHaveBeenCalled();

		confirmSpy.mockRestore();
		vi.mocked(isIntonationActive).mockReturnValue(false);
	});
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

		const { hasActiveIntonationQuery, playUpdatedIntonation } = await import(
			"./intonation"
		);
		const { showStatus } = await import("./status");
		vi.mocked(hasActiveIntonationQuery).mockReturnValue(true);

		await handlePlay();

		expect(playUpdatedIntonation).toHaveBeenCalledTimes(1);
		const statusCalls = vi
			.mocked(showStatus)
			.mock.calls.map(([msg]) => msg as string);
		expect(statusCalls.some((msg) => msg.includes("カット"))).toBe(true);

		vi.mocked(hasActiveIntonationQuery).mockReturnValue(false);
	});
});
