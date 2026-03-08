/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
	applyIntonationFavorite,
	calculateLetterKeyAdjustment,
	calculateStepSize,
	clampRangeExtra,
	exportIntonationFavorites,
	hasActiveIntonationQuery,
	importIntonationFavorites,
	setHandlePlayHandler,
} from "./intonation";
import { intonationState } from "./intonation/state";
import { buildSynthesisCacheKey } from "./intonation/playback";
import * as statusModule from "./status";
import * as visualization from "./visualization";

describe("buildSynthesisCacheKey", () => {
	it("encodes apiBase, speakerId and query into a stable key", () => {
		const query = { accent_phrases: [] } as unknown as Parameters<
			typeof buildSynthesisCacheKey
		>[0];
		const key = buildSynthesisCacheKey(query, 3, "http://localhost:50021");
		expect(key).toBe(`http://localhost:50021:3:${JSON.stringify(query)}`);
	});

	it("produces different keys for different speakerIds", () => {
		const query = { accent_phrases: [] } as unknown as Parameters<
			typeof buildSynthesisCacheKey
		>[0];
		const key1 = buildSynthesisCacheKey(query, 1, "http://localhost:50021");
		const key2 = buildSynthesisCacheKey(query, 2, "http://localhost:50021");
		expect(key1).not.toBe(key2);
	});

	it("produces different keys for different apiBase values", () => {
		const query = { accent_phrases: [] } as unknown as Parameters<
			typeof buildSynthesisCacheKey
		>[0];
		const key1 = buildSynthesisCacheKey(query, 1, "http://localhost:50021");
		const key2 = buildSynthesisCacheKey(query, 1, "http://localhost:50121");
		expect(key1).not.toBe(key2);
	});
});

describe("calculateStepSize", () => {
	it("returns one tenth of the initial pitch span", () => {
		expect(calculateStepSize({ min: 1, max: 6 })).toBeCloseTo(0.5);
		expect(calculateStepSize({ min: -2, max: 8 })).toBeCloseTo(1);
	});

	it("falls back to a small non-zero step when span is zero or negative", () => {
		expect(calculateStepSize({ min: 3, max: 3 })).toBeCloseTo(0.1);
		expect(calculateStepSize({ min: 5, max: 2 })).toBeCloseTo(0.1);
	});
});

describe("calculateLetterKeyAdjustment", () => {
	it("raises pitch by one step for lowercase keys without expanding range", () => {
		const result = calculateLetterKeyAdjustment({
			currentPitch: 5,
			baseRange: { min: 0, max: 10 },
			rangeExtra: { top: 0, bottom: 0 },
			stepSize: 1,
			direction: "up",
			ctrlModifier: false,
		});
		expect(result.pitch).toBeCloseTo(6);
		expect(result.rangeExtra.top).toBeCloseTo(0);
		expect(result.rangeExtra.bottom).toBeCloseTo(0);
	});

	it("lowers pitch by a half step when ctrl is held for uppercase keys", () => {
		const result = calculateLetterKeyAdjustment({
			currentPitch: 5,
			baseRange: { min: 0, max: 10 },
			rangeExtra: { top: 0, bottom: 0 },
			stepSize: 1,
			direction: "down",
			ctrlModifier: true,
		});
		expect(result.pitch).toBeCloseTo(4.5);
		expect(result.rangeExtra.top).toBeCloseTo(0);
		expect(result.rangeExtra.bottom).toBeCloseTo(0);
	});

	it("expands the display range when the adjustment exceeds the current max", () => {
		const result = calculateLetterKeyAdjustment({
			currentPitch: 10,
			baseRange: { min: 0, max: 10 },
			rangeExtra: { top: 0, bottom: 0 },
			stepSize: 1,
			direction: "up",
			ctrlModifier: false,
		});
		expect(result.pitch).toBeCloseTo(11);
		expect(result.rangeExtra.top).toBeCloseTo(1);
		expect(result.rangeExtra.bottom).toBeCloseTo(0);
	});
});

describe("clampRangeExtra", () => {
	it("tightens bottom independently when top is already constrained by data max", () => {
		const baseRange = { min: -0.5, max: 10.5 };
		const dataRange = { min: 5, max: 10 };
		const desired = { top: -1, bottom: -2 };
		const clamped = clampRangeExtra(desired, baseRange, dataRange);
		expect(clamped.top).toBeCloseTo(-0.5);
		expect(clamped.bottom).toBeCloseTo(-2);
	});
});

describe("hasActiveIntonationQuery", () => {
	const stubQuery = {} as NonNullable<
		typeof intonationState.currentIntonationQuery
	>;

	afterEach(() => {
		intonationState.currentIntonationQuery = null;
		intonationState.currentIntonationText = null;
		intonationState.currentIntonationStyleId = 0;
		intonationState.intonationDirty = false;
	});

	it("returns false when there is no current query", () => {
		intonationState.currentIntonationQuery = null;
		expect(hasActiveIntonationQuery("text", 1)).toBe(false);
	});

	it("returns true when text and style match", () => {
		intonationState.currentIntonationQuery = stubQuery;
		intonationState.currentIntonationText = "hello";
		intonationState.currentIntonationStyleId = 1;
		expect(hasActiveIntonationQuery("hello", 1)).toBe(true);
	});

	it("returns false when text mismatches even if style matches", () => {
		intonationState.currentIntonationQuery = stubQuery;
		intonationState.currentIntonationText = "hello";
		intonationState.currentIntonationStyleId = 1;
		expect(hasActiveIntonationQuery("different", 1)).toBe(false);
	});

	it("returns false when style mismatches even if text matches", () => {
		intonationState.currentIntonationQuery = stubQuery;
		intonationState.currentIntonationText = "hello";
		intonationState.currentIntonationStyleId = 1;
		expect(hasActiveIntonationQuery("hello", 2)).toBe(false);
	});

	it("returns false when dirty but text/style mismatch", () => {
		intonationState.currentIntonationQuery = stubQuery;
		intonationState.currentIntonationText = "hello";
		intonationState.currentIntonationStyleId = 1;
		intonationState.intonationDirty = true;
		expect(hasActiveIntonationQuery("different", 2)).toBe(false);
	});

	it("returns true when dirty and text/style match", () => {
		intonationState.currentIntonationQuery = stubQuery;
		intonationState.currentIntonationText = "hello";
		intonationState.currentIntonationStyleId = 1;
		intonationState.intonationDirty = true;
		expect(hasActiveIntonationQuery("hello", 1)).toBe(true);
	});
});

const stubQuery = {
	accent_phrases: [
		{
			moras: [{ text: "a", vowel: "a", vowel_length: 0.1, pitch: 5.5 }],
			accent: 1,
		},
	],
	speedScale: 1,
	pitchScale: 0,
	intonationScale: 1,
	volumeScale: 1,
	prePhonemeLength: 0.1,
	postPhonemeLength: 0.1,
	outputSamplingRate: 24000,
	outputStereo: false,
};

describe("exportIntonationFavorites", () => {
	let anchorClicked: boolean;
	let originalCreateElement: typeof document.createElement;

	beforeEach(() => {
		anchorClicked = false;
		originalCreateElement = document.createElement.bind(document);
		vi.useFakeTimers();
		vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test");
		vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
		vi.spyOn(document, "createElement").mockImplementation(
			(tag: string): HTMLElement => {
				if (tag === "a") {
					const anchor = originalCreateElement("a") as HTMLAnchorElement;
					anchor.click = () => {
						anchorClicked = true;
					};
					return anchor;
				}
				return originalCreateElement(tag);
			},
		);
		intonationState.intonationFavorites = [
			{ text: "テスト", styleId: 1, query: { ...stubQuery } },
		];
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
		intonationState.intonationFavorites = [];
	});

	it("triggers a file download with the current favorites as JSON", () => {
		exportIntonationFavorites();
		expect(anchorClicked).toBe(true);
		vi.runAllTimers();
		expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test");
	});
});

describe("importIntonationFavorites", () => {
	beforeEach(() => {
		intonationState.intonationFavorites = [];
		intonationState.intonationFavoritesListEl = null;
		localStorage.clear();
		vi.spyOn(statusModule, "scheduleHideStatus").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
		intonationState.intonationFavorites = [];
		localStorage.clear();
	});

	it("merges valid favorites from a JSON file", async () => {
		const data = JSON.stringify([
			{ text: "hello", styleId: 2, query: { ...stubQuery } },
		]);
		const file = new File([data], "test.json", { type: "application/json" });
		await new Promise<void>((resolve) => {
			importIntonationFavorites(file, resolve);
		});
		expect(intonationState.intonationFavorites).toHaveLength(1);
		expect(intonationState.intonationFavorites[0].text).toBe("hello");
		expect(intonationState.intonationFavorites[0].styleId).toBe(2);
	});

	it("deduplicates favorites on import", async () => {
		intonationState.intonationFavorites = [
			{ text: "hello", styleId: 2, query: { ...stubQuery } },
		];
		const data = JSON.stringify([
			{ text: "hello", styleId: 2, query: { ...stubQuery } },
		]);
		const file = new File([data], "test.json", { type: "application/json" });
		await new Promise<void>((resolve) => {
			importIntonationFavorites(file, resolve);
		});
		expect(intonationState.intonationFavorites).toHaveLength(1);
	});

	it("rejects invalid JSON with an error status", async () => {
		const file = new File(["not-json"], "bad.json", {
			type: "application/json",
		});
		let done = false;
		await new Promise<void>((resolve) => {
			importIntonationFavorites(file, () => {
				done = true;
				resolve();
			});
		});
		expect(done).toBe(true);
		expect(intonationState.intonationFavorites).toHaveLength(0);
	});

	it("skips items with missing or invalid fields", async () => {
		const data = JSON.stringify([
			{ text: "ok", styleId: 1, query: { ...stubQuery } },
			{ text: 123, styleId: 1, query: { ...stubQuery } },
			{ styleId: 1, query: { ...stubQuery } },
		]);
		const file = new File([data], "partial.json", {
			type: "application/json",
		});
		await new Promise<void>((resolve) => {
			importIntonationFavorites(file, resolve);
		});
		expect(intonationState.intonationFavorites).toHaveLength(1);
		expect(intonationState.intonationFavorites[0].text).toBe("ok");
	});
});

describe("applyIntonationFavorite with loop playback", () => {
	const favoriteItem = {
		text: "テスト",
		styleId: 1,
		query: { ...stubQuery },
	};

	beforeEach(() => {
		document.body.innerHTML = `
      <textarea id="text"></textarea>
      <select id="styleSelect"><option value="1">Style 1</option></select>
      <input id="loopCheckbox" type="checkbox" />
    `;
		intonationState.intonationFavorites = [];
		intonationState.intonationFavoritesListEl = null;
		intonationState.loopCheckboxEl = null;
		// Always register a no-op handler so the fallback playUpdatedIntonation()
		// path (which triggers real Tone/audio work) is never reached in tests.
		intonationState.onHandlePlay = vi.fn();
		intonationState.onStyleChange = null;
		vi.useFakeTimers();
		vi.spyOn(statusModule, "showStatus").mockImplementation(() => {});
		vi.spyOn(statusModule, "scheduleHideStatus").mockImplementation(() => {});
		vi.spyOn(visualization, "stopActivePlayback").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
		intonationState.loopCheckboxEl = null;
		intonationState.onHandlePlay = null;
	});

	it("stops active playback and turns off loop before setting up state", () => {
		const loopCheckbox = document.getElementById(
			"loopCheckbox",
		) as HTMLInputElement;
		loopCheckbox.checked = true;
		intonationState.loopCheckboxEl = loopCheckbox;

		applyIntonationFavorite(favoriteItem);

		expect(visualization.stopActivePlayback).toHaveBeenCalledTimes(1);
		expect(loopCheckbox.checked).toBe(false);
	});

	it("re-enables loop and calls onHandlePlay after a tick", async () => {
		const loopCheckbox = document.getElementById(
			"loopCheckbox",
		) as HTMLInputElement;
		loopCheckbox.checked = true;
		intonationState.loopCheckboxEl = loopCheckbox;

		const handlePlayMock = vi.fn();
		setHandlePlayHandler(handlePlayMock);

		applyIntonationFavorite(favoriteItem);

		expect(handlePlayMock).not.toHaveBeenCalled();
		expect(loopCheckbox.checked).toBe(false);

		await vi.runAllTimersAsync();

		expect(loopCheckbox.checked).toBe(true);
		expect(handlePlayMock).toHaveBeenCalledTimes(1);
	});

	it("sets intonationDirty to true inside the setTimeout so handlePlay re-synthesizes audio", async () => {
		const handlePlayMock = vi.fn();
		setHandlePlayHandler(handlePlayMock);

		applyIntonationFavorite(favoriteItem);
		expect(intonationState.intonationDirty).toBe(false);

		await vi.runAllTimersAsync();
		expect(intonationState.intonationDirty).toBe(true);
	});

	it("does not re-enable loop when it was not active", async () => {
		const loopCheckbox = document.getElementById(
			"loopCheckbox",
		) as HTMLInputElement;
		loopCheckbox.checked = false;
		intonationState.loopCheckboxEl = loopCheckbox;

		const handlePlayMock = vi.fn();
		setHandlePlayHandler(handlePlayMock);

		applyIntonationFavorite(favoriteItem);
		await vi.runAllTimersAsync();

		expect(loopCheckbox.checked).toBe(false);
		expect(handlePlayMock).toHaveBeenCalledTimes(1);
	});
});
