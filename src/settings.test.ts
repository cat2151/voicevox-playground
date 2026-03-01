import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	DEFAULT_SETTINGS,
	getCurrentSettings,
	getFrequencyTopPercent,
	getVoicevoxApiBase,
	getVoicevoxNemoApiBase,
	loadSettings,
	resetSettings,
	setFrequencyTopPercent,
	setVoicevoxNemoPort,
	setVoicevoxPort,
} from "./settings";

const storageState: Record<string, string> = {};

const fakeLocalStorage = {
	getItem: (key: string) => storageState[key] ?? null,
	setItem: (key: string, value: string) => {
		storageState[key] = value;
	},
	removeItem: (key: string) => {
		delete storageState[key];
	},
	clear: () => {
		for (const key of Object.keys(storageState)) delete storageState[key];
	},
};

beforeEach(() => {
	fakeLocalStorage.clear();
	vi.stubGlobal("localStorage", fakeLocalStorage);
	resetSettings();
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("loadSettings", () => {
	it("applies defaults when localStorage is empty", () => {
		loadSettings();
		expect(getCurrentSettings()).toEqual(DEFAULT_SETTINGS);
	});

	it("restores valid saved settings from localStorage", () => {
		fakeLocalStorage.setItem(
			"voicevox-settings",
			JSON.stringify({
				voicevoxPort: 8080,
				voicevoxNemoPort: 9090,
				frequencyTopPercent: 5,
			}),
		);
		loadSettings();
		const s = getCurrentSettings();
		expect(s.voicevoxPort).toBe(8080);
		expect(s.voicevoxNemoPort).toBe(9090);
		expect(s.frequencyTopPercent).toBe(5);
	});

	it("falls back to default for malformed JSON in localStorage", () => {
		fakeLocalStorage.setItem("voicevox-settings", "not-json");
		loadSettings();
		expect(getCurrentSettings()).toEqual(DEFAULT_SETTINGS);
	});

	it("falls back per-field when port is out of range", () => {
		fakeLocalStorage.setItem(
			"voicevox-settings",
			JSON.stringify({
				voicevoxPort: 0,
				voicevoxNemoPort: 70000,
				frequencyTopPercent: 2,
			}),
		);
		loadSettings();
		const s = getCurrentSettings();
		expect(s.voicevoxPort).toBe(DEFAULT_SETTINGS.voicevoxPort);
		expect(s.voicevoxNemoPort).toBe(DEFAULT_SETTINGS.voicevoxNemoPort);
		expect(s.frequencyTopPercent).toBe(2);
	});

	it("falls back per-field when frequencyTopPercent is out of range", () => {
		fakeLocalStorage.setItem(
			"voicevox-settings",
			JSON.stringify({
				voicevoxPort: 50021,
				voicevoxNemoPort: 50121,
				frequencyTopPercent: 0,
			}),
		);
		loadSettings();
		expect(getCurrentSettings().frequencyTopPercent).toBe(
			DEFAULT_SETTINGS.frequencyTopPercent,
		);
	});

	it("falls back per-field for missing keys", () => {
		fakeLocalStorage.setItem(
			"voicevox-settings",
			JSON.stringify({ voicevoxPort: 1234 }),
		);
		loadSettings();
		const s = getCurrentSettings();
		expect(s.voicevoxPort).toBe(1234);
		expect(s.voicevoxNemoPort).toBe(DEFAULT_SETTINGS.voicevoxNemoPort);
		expect(s.frequencyTopPercent).toBe(DEFAULT_SETTINGS.frequencyTopPercent);
	});
});

describe("getFrequencyTopPercent", () => {
	it("converts percent to fraction (2% → 0.02)", () => {
		expect(getFrequencyTopPercent()).toBeCloseTo(
			DEFAULT_SETTINGS.frequencyTopPercent / 100,
		);
	});

	it("reflects updated percent after setFrequencyTopPercent", () => {
		setFrequencyTopPercent(10);
		expect(getFrequencyTopPercent()).toBeCloseTo(0.1);
	});
});

describe("getVoicevoxApiBase / getVoicevoxNemoApiBase", () => {
	it("returns default API base URLs", () => {
		expect(getVoicevoxApiBase()).toBe(
			`http://localhost:${DEFAULT_SETTINGS.voicevoxPort}`,
		);
		expect(getVoicevoxNemoApiBase()).toBe(
			`http://localhost:${DEFAULT_SETTINGS.voicevoxNemoPort}`,
		);
	});

	it("reflects updated port after setVoicevoxPort", () => {
		setVoicevoxPort(8080);
		expect(getVoicevoxApiBase()).toBe("http://localhost:8080");
	});

	it("reflects updated nemo port after setVoicevoxNemoPort", () => {
		setVoicevoxNemoPort(9090);
		expect(getVoicevoxNemoApiBase()).toBe("http://localhost:9090");
	});
});

describe("setVoicevoxPort", () => {
	it("accepts valid port values", () => {
		setVoicevoxPort(8080);
		expect(getCurrentSettings().voicevoxPort).toBe(8080);
	});

	it("ignores port 0 (out of range)", () => {
		setVoicevoxPort(0);
		expect(getCurrentSettings().voicevoxPort).toBe(
			DEFAULT_SETTINGS.voicevoxPort,
		);
	});

	it("ignores port 65536 (out of range)", () => {
		setVoicevoxPort(65536);
		expect(getCurrentSettings().voicevoxPort).toBe(
			DEFAULT_SETTINGS.voicevoxPort,
		);
	});

	it("ignores non-integer port values", () => {
		setVoicevoxPort(80.5);
		expect(getCurrentSettings().voicevoxPort).toBe(
			DEFAULT_SETTINGS.voicevoxPort,
		);
	});
});

describe("setVoicevoxNemoPort", () => {
	it("accepts valid port values", () => {
		setVoicevoxNemoPort(9090);
		expect(getCurrentSettings().voicevoxNemoPort).toBe(9090);
	});

	it("ignores invalid port values", () => {
		setVoicevoxNemoPort(0);
		expect(getCurrentSettings().voicevoxNemoPort).toBe(
			DEFAULT_SETTINGS.voicevoxNemoPort,
		);
	});
});

describe("setFrequencyTopPercent", () => {
	it("accepts values within range", () => {
		setFrequencyTopPercent(5);
		expect(getCurrentSettings().frequencyTopPercent).toBe(5);
	});

	it("ignores values below minimum (0)", () => {
		setFrequencyTopPercent(0);
		expect(getCurrentSettings().frequencyTopPercent).toBe(
			DEFAULT_SETTINGS.frequencyTopPercent,
		);
	});

	it("ignores values above maximum (101)", () => {
		setFrequencyTopPercent(101);
		expect(getCurrentSettings().frequencyTopPercent).toBe(
			DEFAULT_SETTINGS.frequencyTopPercent,
		);
	});
});

describe("resetSettings", () => {
	it("reverts to defaults", () => {
		setVoicevoxPort(8080);
		setVoicevoxNemoPort(9090);
		setFrequencyTopPercent(10);
		resetSettings();
		expect(getCurrentSettings()).toEqual(DEFAULT_SETTINGS);
	});

	it("persists reset to localStorage", () => {
		setVoicevoxPort(8080);
		resetSettings();
		const stored = JSON.parse(
			fakeLocalStorage.getItem("voicevox-settings") ?? "{}",
		);
		expect(stored.voicevoxPort).toBe(DEFAULT_SETTINGS.voicevoxPort);
	});
});
