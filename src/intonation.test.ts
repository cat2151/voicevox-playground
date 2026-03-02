/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from "vitest";

import {
	calculateLetterKeyAdjustment,
	calculateStepSize,
	clampRangeExtra,
	hasActiveIntonationQuery,
} from "./intonation";
import { intonationState } from "./intonationState";

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
