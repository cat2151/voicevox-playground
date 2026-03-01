import { appState } from "./state";

export function updateExportButtonState(
	exportButton?: HTMLButtonElement | null,
) {
	if (exportButton) {
		exportButton.disabled =
			appState.isProcessing || !appState.lastSynthesizedBuffer;
	}
}
