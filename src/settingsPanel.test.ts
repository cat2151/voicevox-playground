/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	DEFAULT_SETTINGS,
	getCurrentSettings,
	resetSettings,
} from "./settings";
import { initializeSettingsPanel } from "./settingsPanel";

vi.mock("./playback", () => ({
	clearAudioCache: vi.fn(),
}));

vi.mock("./styleManager", () => ({
	fetchVoiceStyles: vi.fn(async () => true),
}));

import { clearAudioCache } from "./playback";
import { fetchVoiceStyles } from "./styleManager";

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

function makeInput(value = ""): HTMLInputElement {
	const el = document.createElement("input");
	el.value = value;
	return el;
}

function makeButton(): HTMLButtonElement {
	return document.createElement("button");
}

function makePanel(): HTMLElement {
	const el = document.createElement("div");
	el.hidden = true;
	return el;
}

function fireChange(el: HTMLInputElement, value: string) {
	el.value = value;
	el.dispatchEvent(new Event("change"));
}

beforeEach(() => {
	fakeLocalStorage.clear();
	vi.stubGlobal("localStorage", fakeLocalStorage);
	resetSettings();
	vi.clearAllMocks();
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("initializeSettingsPanel", () => {
	describe("applySettingsToInputs on init", () => {
		it("fills inputs with current settings on initialization", () => {
			const portInput = makeInput();
			const nemoPortInput = makeInput();
			const freqInput = makeInput();

			initializeSettingsPanel({
				settingsToggleButton: null,
				settingsPanel: null,
				voicevoxPortInput: portInput,
				voicevoxNemoPortInput: nemoPortInput,
				frequencyTopPercentInput: freqInput,
				settingsResetButton: null,
				styleSelect: null,
				speakerStyleSelect: null,
			});

			expect(portInput.value).toBe(String(DEFAULT_SETTINGS.voicevoxPort));
			expect(nemoPortInput.value).toBe(
				String(DEFAULT_SETTINGS.voicevoxNemoPort),
			);
			expect(freqInput.value).toBe(
				String(DEFAULT_SETTINGS.frequencyTopPercent),
			);
		});
	});

	describe("settingsToggleButton", () => {
		it("toggles panel visibility and aria-expanded on click", () => {
			const button = makeButton();
			const panel = makePanel();
			panel.hidden = true;

			initializeSettingsPanel({
				settingsToggleButton: button,
				settingsPanel: panel,
				voicevoxPortInput: null,
				voicevoxNemoPortInput: null,
				frequencyTopPercentInput: null,
				settingsResetButton: null,
				styleSelect: null,
				speakerStyleSelect: null,
			});

			button.click();
			expect(panel.hidden).toBe(false);
			expect(button.getAttribute("aria-expanded")).toBe("true");

			button.click();
			expect(panel.hidden).toBe(true);
			expect(button.getAttribute("aria-expanded")).toBe("false");
		});
	});

	describe("voicevoxPortInput", () => {
		it("calls setVoicevoxPort and refreshes styles on valid port", () => {
			const portInput = makeInput();

			initializeSettingsPanel({
				settingsToggleButton: null,
				settingsPanel: null,
				voicevoxPortInput: portInput,
				voicevoxNemoPortInput: null,
				frequencyTopPercentInput: null,
				settingsResetButton: null,
				styleSelect: null,
				speakerStyleSelect: null,
			});

			fireChange(portInput, "8080");

			expect(getCurrentSettings().voicevoxPort).toBe(8080);
			expect(clearAudioCache).toHaveBeenCalledOnce();
			expect(fetchVoiceStyles).toHaveBeenCalledOnce();
		});

		it("reverts input to current settings on invalid port", () => {
			const portInput = makeInput();

			initializeSettingsPanel({
				settingsToggleButton: null,
				settingsPanel: null,
				voicevoxPortInput: portInput,
				voicevoxNemoPortInput: null,
				frequencyTopPercentInput: null,
				settingsResetButton: null,
				styleSelect: null,
				speakerStyleSelect: null,
			});

			fireChange(portInput, "99999");

			expect(getCurrentSettings().voicevoxPort).toBe(
				DEFAULT_SETTINGS.voicevoxPort,
			);
			expect(portInput.value).toBe(String(DEFAULT_SETTINGS.voicevoxPort));
			expect(clearAudioCache).not.toHaveBeenCalled();
		});

		it("does not refresh styles on invalid port", () => {
			const portInput = makeInput();

			initializeSettingsPanel({
				settingsToggleButton: null,
				settingsPanel: null,
				voicevoxPortInput: portInput,
				voicevoxNemoPortInput: null,
				frequencyTopPercentInput: null,
				settingsResetButton: null,
				styleSelect: null,
				speakerStyleSelect: null,
			});

			fireChange(portInput, "0");

			expect(fetchVoiceStyles).not.toHaveBeenCalled();
		});
	});

	describe("voicevoxNemoPortInput", () => {
		it("calls setVoicevoxNemoPort and refreshes styles on valid port", () => {
			const nemoPortInput = makeInput();

			initializeSettingsPanel({
				settingsToggleButton: null,
				settingsPanel: null,
				voicevoxPortInput: null,
				voicevoxNemoPortInput: nemoPortInput,
				frequencyTopPercentInput: null,
				settingsResetButton: null,
				styleSelect: null,
				speakerStyleSelect: null,
			});

			fireChange(nemoPortInput, "9090");

			expect(getCurrentSettings().voicevoxNemoPort).toBe(9090);
			expect(clearAudioCache).toHaveBeenCalledOnce();
			expect(fetchVoiceStyles).toHaveBeenCalledOnce();
		});

		it("reverts nemo port input on invalid value", () => {
			const nemoPortInput = makeInput();

			initializeSettingsPanel({
				settingsToggleButton: null,
				settingsPanel: null,
				voicevoxPortInput: null,
				voicevoxNemoPortInput: nemoPortInput,
				frequencyTopPercentInput: null,
				settingsResetButton: null,
				styleSelect: null,
				speakerStyleSelect: null,
			});

			fireChange(nemoPortInput, "0");

			expect(getCurrentSettings().voicevoxNemoPort).toBe(
				DEFAULT_SETTINGS.voicevoxNemoPort,
			);
			expect(nemoPortInput.value).toBe(
				String(DEFAULT_SETTINGS.voicevoxNemoPort),
			);
			expect(clearAudioCache).not.toHaveBeenCalled();
		});
	});

	describe("frequencyTopPercentInput", () => {
		it("calls setFrequencyTopPercent on valid value", () => {
			const freqInput = makeInput();

			initializeSettingsPanel({
				settingsToggleButton: null,
				settingsPanel: null,
				voicevoxPortInput: null,
				voicevoxNemoPortInput: null,
				frequencyTopPercentInput: freqInput,
				settingsResetButton: null,
				styleSelect: null,
				speakerStyleSelect: null,
			});

			fireChange(freqInput, "5");

			expect(getCurrentSettings().frequencyTopPercent).toBe(5);
		});

		it("reverts frequency input on invalid value", () => {
			const freqInput = makeInput();

			initializeSettingsPanel({
				settingsToggleButton: null,
				settingsPanel: null,
				voicevoxPortInput: null,
				voicevoxNemoPortInput: null,
				frequencyTopPercentInput: freqInput,
				settingsResetButton: null,
				styleSelect: null,
				speakerStyleSelect: null,
			});

			fireChange(freqInput, "0");

			expect(getCurrentSettings().frequencyTopPercent).toBe(
				DEFAULT_SETTINGS.frequencyTopPercent,
			);
			expect(freqInput.value).toBe(
				String(DEFAULT_SETTINGS.frequencyTopPercent),
			);
		});
	});

	describe("settingsResetButton", () => {
		it("resets all settings and refreshes styles on click", () => {
			const portInput = makeInput();
			const nemoPortInput = makeInput();
			const freqInput = makeInput();
			const resetButton = makeButton();

			initializeSettingsPanel({
				settingsToggleButton: null,
				settingsPanel: null,
				voicevoxPortInput: portInput,
				voicevoxNemoPortInput: nemoPortInput,
				frequencyTopPercentInput: freqInput,
				settingsResetButton: resetButton,
				styleSelect: null,
				speakerStyleSelect: null,
			});

			// Simulate user changing port first
			fireChange(portInput, "8080");
			vi.clearAllMocks();

			// Now reset
			resetButton.click();

			expect(getCurrentSettings().voicevoxPort).toBe(
				DEFAULT_SETTINGS.voicevoxPort,
			);
			expect(portInput.value).toBe(String(DEFAULT_SETTINGS.voicevoxPort));
			expect(clearAudioCache).toHaveBeenCalledOnce();
			expect(fetchVoiceStyles).toHaveBeenCalledOnce();
		});
	});
});
