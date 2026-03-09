import {
	getCurrentSettings,
	resetSettings,
	setFrequencyTopPercent,
	setVoicevoxNemoPort,
	setVoicevoxPort,
} from "./settings";
import { clearAudioCache } from "./playback";
import { fetchVoiceStyles } from "./styleManager";

interface SettingsPanelElements {
	settingsToggleButton: HTMLButtonElement | null;
	settingsPanel: HTMLElement | null;
	voicevoxPortInput: HTMLInputElement | null;
	voicevoxNemoPortInput: HTMLInputElement | null;
	frequencyTopPercentInput: HTMLInputElement | null;
	settingsResetButton: HTMLButtonElement | null;
	styleSelect: HTMLSelectElement | null;
	speakerStyleSelect: HTMLSelectElement | null;
}

export function initializeSettingsPanel(elements: SettingsPanelElements): void {
	const {
		settingsToggleButton,
		settingsPanel,
		voicevoxPortInput,
		voicevoxNemoPortInput,
		frequencyTopPercentInput,
		settingsResetButton,
		styleSelect,
		speakerStyleSelect,
	} = elements;

	const applySettingsToInputs = () => {
		const s = getCurrentSettings();
		if (voicevoxPortInput) voicevoxPortInput.value = String(s.voicevoxPort);
		if (voicevoxNemoPortInput)
			voicevoxNemoPortInput.value = String(s.voicevoxNemoPort);
		if (frequencyTopPercentInput)
			frequencyTopPercentInput.value = String(s.frequencyTopPercent);
	};
	applySettingsToInputs();

	const refreshStylesAfterPortChange = () => {
		clearAudioCache();
		void fetchVoiceStyles(styleSelect ?? null, speakerStyleSelect ?? null);
	};

	if (settingsToggleButton && settingsPanel) {
		settingsToggleButton.addEventListener("click", () => {
			const isHidden = settingsPanel.hidden;
			settingsPanel.hidden = !isHidden;
			settingsToggleButton.setAttribute("aria-expanded", String(isHidden));
		});
	}

	if (voicevoxPortInput) {
		voicevoxPortInput.addEventListener("change", () => {
			const port = Number(voicevoxPortInput.value);
			if (Number.isInteger(port) && port >= 1 && port <= 65535) {
				setVoicevoxPort(port);
				refreshStylesAfterPortChange();
			} else {
				applySettingsToInputs();
			}
		});
	}

	if (voicevoxNemoPortInput) {
		voicevoxNemoPortInput.addEventListener("change", () => {
			const port = Number(voicevoxNemoPortInput.value);
			if (Number.isInteger(port) && port >= 1 && port <= 65535) {
				setVoicevoxNemoPort(port);
				refreshStylesAfterPortChange();
			} else {
				applySettingsToInputs();
			}
		});
	}

	if (frequencyTopPercentInput) {
		frequencyTopPercentInput.addEventListener("change", () => {
			const pct = Number(frequencyTopPercentInput.value);
			if (Number.isFinite(pct) && pct >= 0.1 && pct <= 100) {
				setFrequencyTopPercent(pct);
			} else {
				applySettingsToInputs();
			}
		});
	}

	if (settingsResetButton) {
		settingsResetButton.addEventListener("click", () => {
			resetSettings();
			applySettingsToInputs();
			refreshStylesAfterPortChange();
		});
	}
}
