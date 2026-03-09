import { AUTO_PLAY_DEBOUNCE_MS, DELIMITER_STORAGE_KEY } from "./config";
import { appState } from "./state";

export function updateExportButtonState(
	exportButton?: HTMLButtonElement | null,
) {
	if (exportButton) {
		exportButton.disabled =
			appState.isProcessing || !appState.lastSynthesizedBuffer;
	}
}

export function initializePanelToggles(): void {
	const usageToggleButton = document.getElementById(
		"usageToggleButton",
	) as HTMLButtonElement | null;
	const usagePanel = document.getElementById("usagePanel");
	const favoritesToggleButton = document.getElementById(
		"favoritesToggleButton",
	) as HTMLButtonElement | null;
	const favoritesPanel = document.getElementById("favoritesPanel");

	if (usageToggleButton && usagePanel) {
		usageToggleButton.addEventListener("click", () => {
			const isHidden = usagePanel.hidden;
			usagePanel.hidden = !isHidden;
			usageToggleButton.setAttribute("aria-expanded", String(isHidden));
		});
	}

	if (favoritesToggleButton && favoritesPanel) {
		favoritesPanel.hidden = true;
		favoritesToggleButton.setAttribute("aria-expanded", "false");
		favoritesToggleButton.addEventListener("click", () => {
			const isHidden = favoritesPanel.hidden;
			favoritesPanel.hidden = !isHidden;
			favoritesToggleButton.setAttribute("aria-expanded", String(isHidden));
		});
	}
}

export function initializeDelimiterInput(): void {
	const delimiterInput = document.getElementById(
		"delimiterInput",
	) as HTMLInputElement | null;
	if (!delimiterInput) return;

	try {
		const savedDelimiter = localStorage.getItem(DELIMITER_STORAGE_KEY);
		if (savedDelimiter !== null) {
			delimiterInput.value = savedDelimiter;
		}
	} catch (error) {
		console.warn("Failed to restore delimiter config:", error);
	}

	let delimiterSaveTimer: number | null = null;

	const saveDelimiter = () => {
		try {
			localStorage.setItem(DELIMITER_STORAGE_KEY, delimiterInput.value);
		} catch (error) {
			console.warn("Failed to save delimiter config:", error);
		}
	};

	delimiterInput.addEventListener("input", () => {
		if (delimiterSaveTimer !== null) {
			window.clearTimeout(delimiterSaveTimer);
		}
		delimiterSaveTimer = window.setTimeout(
			saveDelimiter,
			AUTO_PLAY_DEBOUNCE_MS,
		);
	});
}
