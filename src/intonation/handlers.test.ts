/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handleIntonationKeyDown } from "./handlers";
import { intonationState } from "./state";

vi.mock("./display", () => ({
	applyRangeExtra: vi.fn(),
	calculateLetterKeyAdjustment: vi.fn(() => ({
		pitch: 5,
		rangeExtra: { top: 0, bottom: 0 },
	})),
	clampPitchToDisplayRange: vi.fn((p: number) => p),
	drawIntonationChart: vi.fn(),
	findNearestIntonationPoint: vi.fn(() => -1),
	getBaseDisplayRange: vi.fn(() => ({ min: 0, max: 10 })),
	pitchFromY: vi.fn(() => 5),
	refreshDisplayRange: vi.fn(),
	updateHoveredLabel: vi.fn(),
	updateInitialRangeFromPoints: vi.fn(),
}));

vi.mock("./playback", () => ({
	playUpdatedIntonation: vi.fn(),
	replayCachedIntonationAudio: vi.fn(),
	scheduleIntonationPlayback: vi.fn(),
	showPlaybackStatus: vi.fn(),
}));

function makeKeyEvent(
	key: string,
	opts: { shiftKey?: boolean; ctrlKey?: boolean } = {},
): KeyboardEvent {
	return new KeyboardEvent("keydown", {
		key,
		bubbles: true,
		cancelable: true,
		shiftKey: opts.shiftKey ?? false,
		ctrlKey: opts.ctrlKey ?? false,
	});
}

function enableKeyboard(canvas: HTMLCanvasElement) {
	intonationState.intonationCanvas = canvas;
	intonationState.intonationKeyboardEnabled = true;
	intonationState.intonationPointPositions = [{ x: 50, y: 50 }];
	intonationState.intonationPoints = [
		{ pitch: 5, phraseIndex: 0, moraIndex: 0, label: "ア" },
	];
}

beforeEach(() => {
	document.body.innerHTML = `
    <canvas id="intonationCanvas" tabindex="0"></canvas>
    <textarea id="text"></textarea>
    <input id="delimiterInput" />
  `;
	const canvas = document.getElementById(
		"intonationCanvas",
	) as HTMLCanvasElement;
	enableKeyboard(canvas);
});

afterEach(() => {
	vi.clearAllMocks();
	intonationState.intonationCanvas = null;
	intonationState.intonationKeyboardEnabled = false;
	intonationState.intonationPointPositions = [];
	intonationState.intonationPoints = [];
	intonationState.intonationSelectedIndex = null;
	intonationState.intonationInitialPitchRange = null;
});

describe("handleIntonationKeyDown – textarea bypass", () => {
	it("does not replay audio on Enter when textarea is focused", async () => {
		const { replayCachedIntonationAudio } = await import("./playback");
		const textarea = document.getElementById("text") as HTMLTextAreaElement;
		textarea.focus();

		const event = makeKeyEvent("Enter");
		handleIntonationKeyDown(event);

		expect(vi.mocked(replayCachedIntonationAudio)).not.toHaveBeenCalled();
	});

	it("does not replay audio on Space when textarea is focused", async () => {
		const { replayCachedIntonationAudio } = await import("./playback");
		const textarea = document.getElementById("text") as HTMLTextAreaElement;
		textarea.focus();

		const event = makeKeyEvent(" ");
		handleIntonationKeyDown(event);

		expect(vi.mocked(replayCachedIntonationAudio)).not.toHaveBeenCalled();
	});

	it("does not change intonation on letter key when textarea is focused", async () => {
		const { drawIntonationChart } = await import("./display");
		const textarea = document.getElementById("text") as HTMLTextAreaElement;
		textarea.focus();

		const event = makeKeyEvent("a");
		handleIntonationKeyDown(event);

		expect(vi.mocked(drawIntonationChart)).not.toHaveBeenCalled();
	});

	it("does not replay audio on Enter when input is focused", async () => {
		const { replayCachedIntonationAudio } = await import("./playback");
		const input = document.getElementById("delimiterInput") as HTMLInputElement;
		input.focus();

		const event = makeKeyEvent("Enter");
		handleIntonationKeyDown(event);

		expect(vi.mocked(replayCachedIntonationAudio)).not.toHaveBeenCalled();
	});

	it("does not replay audio on Space when input is focused", async () => {
		const { replayCachedIntonationAudio } = await import("./playback");
		const input = document.getElementById("delimiterInput") as HTMLInputElement;
		input.focus();

		const event = makeKeyEvent(" ");
		handleIntonationKeyDown(event);

		expect(vi.mocked(replayCachedIntonationAudio)).not.toHaveBeenCalled();
	});

	it("does not change intonation on letter key when input is focused", async () => {
		const { drawIntonationChart } = await import("./display");
		const input = document.getElementById("delimiterInput") as HTMLInputElement;
		input.focus();

		const event = makeKeyEvent("a");
		handleIntonationKeyDown(event);

		expect(vi.mocked(drawIntonationChart)).not.toHaveBeenCalled();
	});

	it("does not call preventDefault on ArrowLeft when textarea is focused", async () => {
		const textarea = document.getElementById("text") as HTMLTextAreaElement;
		textarea.focus();

		const event = makeKeyEvent("ArrowLeft");
		const spy = vi.spyOn(event, "preventDefault");
		handleIntonationKeyDown(event);

		expect(spy).not.toHaveBeenCalled();
	});

	it("replays audio on plain Enter when canvas is focused", async () => {
		const { replayCachedIntonationAudio, showPlaybackStatus } = await import(
			"./playback"
		);
		const canvas = document.getElementById(
			"intonationCanvas",
		) as HTMLCanvasElement;
		canvas.focus();

		const event = makeKeyEvent("Enter");
		handleIntonationKeyDown(event);

		expect(vi.mocked(showPlaybackStatus)).toHaveBeenCalled();
		expect(vi.mocked(replayCachedIntonationAudio)).toHaveBeenCalled();
	});

	it("does not replay audio on Shift+Enter even when canvas is focused", async () => {
		const { replayCachedIntonationAudio } = await import("./playback");
		const canvas = document.getElementById(
			"intonationCanvas",
		) as HTMLCanvasElement;
		canvas.focus();

		const event = makeKeyEvent("Enter", { shiftKey: true });
		handleIntonationKeyDown(event);

		expect(vi.mocked(replayCachedIntonationAudio)).not.toHaveBeenCalled();
	});

	it("does not replay audio on Ctrl+Enter even when canvas is focused", async () => {
		const { replayCachedIntonationAudio } = await import("./playback");
		const canvas = document.getElementById(
			"intonationCanvas",
		) as HTMLCanvasElement;
		canvas.focus();

		const event = makeKeyEvent("Enter", { ctrlKey: true });
		handleIntonationKeyDown(event);

		expect(vi.mocked(replayCachedIntonationAudio)).not.toHaveBeenCalled();
	});
});
