const SETTINGS_STORAGE_KEY = "voicevox-settings";

const DEFAULT_VOICEVOX_PORT = 50021;
const DEFAULT_VOICEVOX_NEMO_PORT = 50121;
const DEFAULT_FREQUENCY_TOP_PERCENT = 2;

export const DEFAULT_SETTINGS = {
	voicevoxPort: DEFAULT_VOICEVOX_PORT,
	voicevoxNemoPort: DEFAULT_VOICEVOX_NEMO_PORT,
	frequencyTopPercent: DEFAULT_FREQUENCY_TOP_PERCENT,
};

interface Settings {
	voicevoxPort: number;
	voicevoxNemoPort: number;
	frequencyTopPercent: number;
}

let currentSettings: Settings = { ...DEFAULT_SETTINGS };

export function loadSettings(): void {
	try {
		const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
		if (saved !== null) {
			const parsed = JSON.parse(saved) as Partial<Settings>;
			const port = parsed.voicevoxPort ?? DEFAULT_VOICEVOX_PORT;
			const nemoPort = parsed.voicevoxNemoPort ?? DEFAULT_VOICEVOX_NEMO_PORT;
			const topPct =
				parsed.frequencyTopPercent ?? DEFAULT_FREQUENCY_TOP_PERCENT;
			currentSettings = {
				voicevoxPort:
					Number.isInteger(port) && port >= 1 && port <= 65535
						? port
						: DEFAULT_VOICEVOX_PORT,
				voicevoxNemoPort:
					Number.isInteger(nemoPort) && nemoPort >= 1 && nemoPort <= 65535
						? nemoPort
						: DEFAULT_VOICEVOX_NEMO_PORT,
				frequencyTopPercent:
					Number.isFinite(topPct) && topPct >= 0.1 && topPct <= 100
						? topPct
						: DEFAULT_FREQUENCY_TOP_PERCENT,
			};
		}
	} catch (error) {
		console.warn("Failed to restore settings:", error);
	}
}

function saveSettings(): void {
	try {
		localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(currentSettings));
	} catch (error) {
		console.warn("Failed to save settings:", error);
	}
}

export function resetSettings(): void {
	currentSettings = { ...DEFAULT_SETTINGS };
	saveSettings();
}

export function getVoicevoxApiBase(): string {
	return `http://localhost:${currentSettings.voicevoxPort}`;
}

export function getVoicevoxNemoApiBase(): string {
	return `http://localhost:${currentSettings.voicevoxNemoPort}`;
}

export function getFrequencyTopPercent(): number {
	return currentSettings.frequencyTopPercent / 100;
}

export function getCurrentSettings(): Settings {
	return { ...currentSettings };
}

export function setVoicevoxPort(port: number): void {
	if (!Number.isInteger(port) || port < 1 || port > 65535) return;
	currentSettings.voicevoxPort = port;
	saveSettings();
}

export function setVoicevoxNemoPort(port: number): void {
	if (!Number.isInteger(port) || port < 1 || port > 65535) return;
	currentSettings.voicevoxNemoPort = port;
	saveSettings();
}

export function setFrequencyTopPercent(percent: number): void {
	if (!Number.isFinite(percent) || percent < 0.1 || percent > 100) return;
	currentSettings.frequencyTopPercent = percent;
	saveSettings();
}
