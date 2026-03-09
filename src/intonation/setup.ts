import { intonationState as state } from "./state";
import {
	getIntonationKeyboardEnabled,
	setIntonationKeyboardEnabled,
} from "./state";
import {
	adjustIntonationScale,
	ensureWheelHandler,
	refreshIntonationChart,
} from "./display";
import { resetIntonationToInitial } from "./playback";
import {
	handleIntonationKeyDown,
	handleIntonationMouseLeave,
	handleIntonationMouseMove,
	handleIntonationPointerDown,
	handleIntonationPointerMove,
	handleIntonationPointerUp,
} from "./handlers";
import {
	exportIntonationFavorites,
	importIntonationFavorites,
	loadIntonationFavorites,
	persistIntonationFavorites,
	renderIntonationFavoritesList,
	saveCurrentIntonationFavorite,
} from "./favorites";
import { getSelectedStyleId } from "../styleManager";

export function initializeIntonationElements(): void {
	state.intonationCanvas = document.getElementById(
		"intonationCanvas",
	) as HTMLCanvasElement | null;
	state.intonationTimingEl = null;
	state.intonationLabelsEl = document.getElementById("intonationLabels");
	state.intonationMaxValueEl = document.getElementById("intonationMaxValue");
	state.intonationMinValueEl = document.getElementById("intonationMinValue");
	state.intonationFavoritesListEl = document.getElementById(
		"intonationFavoritesList",
	) as HTMLUListElement | null;
	state.loopCheckboxEl = document.getElementById(
		"loopCheckbox",
	) as HTMLInputElement | null;
	state.intonationFavorites = loadIntonationFavorites();
	persistIntonationFavorites();
	renderIntonationFavoritesList();
	ensureWheelHandler();
}

export function setupIntonationCanvasEvents(): void {
	const canvas = state.intonationCanvas;
	if (canvas) {
		canvas.addEventListener("pointerdown", handleIntonationPointerDown);
		canvas.addEventListener("pointermove", handleIntonationPointerMove);
		canvas.addEventListener("pointerleave", handleIntonationPointerUp);
		canvas.addEventListener("pointercancel", handleIntonationPointerUp);
		canvas.addEventListener("lostpointercapture", handleIntonationPointerUp);
		canvas.addEventListener("mousemove", handleIntonationMouseMove);
		canvas.addEventListener("mouseleave", handleIntonationMouseLeave);
		canvas.addEventListener("focus", () => {
			refreshIntonationChart();
		});
		window.addEventListener("keydown", handleIntonationKeyDown);
	}
	window.addEventListener("mouseup", handleIntonationPointerUp);
	window.addEventListener("pointerup", handleIntonationPointerUp);
}

export function initializeIntonationControls(): void {
	const intonationCanvas = state.intonationCanvas;
	const intonationKeyboardToggle = document.getElementById(
		"intonationKeyboardToggle",
	) as HTMLButtonElement | null;
	const intonationResetButton = document.getElementById(
		"intonationResetButton",
	) as HTMLButtonElement | null;
	const intonationFavoriteButton = document.getElementById(
		"intonationFavoriteButton",
	) as HTMLButtonElement | null;
	const intonationExpandTop = document.getElementById(
		"intonationExpandTop",
	) as HTMLButtonElement | null;
	const intonationShrinkTop = document.getElementById(
		"intonationShrinkTop",
	) as HTMLButtonElement | null;
	const intonationShrinkBottom = document.getElementById(
		"intonationShrinkBottom",
	) as HTMLButtonElement | null;
	const intonationExpandBottom = document.getElementById(
		"intonationExpandBottom",
	) as HTMLButtonElement | null;
	const intonationFavoritesExportButton = document.getElementById(
		"intonationFavoritesExportButton",
	) as HTMLButtonElement | null;
	const intonationFavoritesImportButton = document.getElementById(
		"intonationFavoritesImportButton",
	) as HTMLButtonElement | null;
	const intonationFavoritesImportFile = document.getElementById(
		"intonationFavoritesImportFile",
	) as HTMLInputElement | null;

	const updateIntonationKeyboardToggle = () => {
		if (intonationKeyboardToggle) {
			const enabled = getIntonationKeyboardEnabled();
			intonationKeyboardToggle.textContent = enabled
				? "キーボード操作: ON"
				: "キーボード操作: OFF";
			intonationKeyboardToggle.setAttribute("aria-pressed", String(enabled));
			intonationKeyboardToggle.setAttribute(
				"aria-label",
				enabled ? "キーボード操作を無効にする" : "キーボード操作を有効にする",
			);
		}
	};

	if (intonationKeyboardToggle) {
		updateIntonationKeyboardToggle();
		intonationKeyboardToggle.addEventListener("click", () => {
			setIntonationKeyboardEnabled(!getIntonationKeyboardEnabled());
			updateIntonationKeyboardToggle();
			if (getIntonationKeyboardEnabled() && intonationCanvas) {
				intonationCanvas.focus();
			}
			refreshIntonationChart();
		});
	}

	if (intonationResetButton) {
		intonationResetButton.addEventListener("click", () => {
			resetIntonationToInitial();
			if (getIntonationKeyboardEnabled() && intonationCanvas) {
				intonationCanvas.focus();
			}
		});
	}

	if (intonationFavoriteButton) {
		intonationFavoriteButton.addEventListener("click", () =>
			saveCurrentIntonationFavorite(getSelectedStyleId()),
		);
	}

	if (intonationExpandTop) {
		intonationExpandTop.addEventListener("click", () =>
			adjustIntonationScale("top", 2),
		);
	}
	if (intonationShrinkTop) {
		intonationShrinkTop.addEventListener("click", () =>
			adjustIntonationScale("top", 0.5),
		);
	}
	if (intonationShrinkBottom) {
		intonationShrinkBottom.addEventListener("click", () =>
			adjustIntonationScale("bottom", 0.5),
		);
	}
	if (intonationExpandBottom) {
		intonationExpandBottom.addEventListener("click", () =>
			adjustIntonationScale("bottom", 2),
		);
	}

	if (intonationFavoritesExportButton) {
		intonationFavoritesExportButton.addEventListener("click", () => {
			exportIntonationFavorites();
		});
	}

	if (intonationFavoritesImportButton && intonationFavoritesImportFile) {
		intonationFavoritesImportButton.addEventListener("click", () => {
			intonationFavoritesImportFile.value = "";
			intonationFavoritesImportFile.click();
		});
		intonationFavoritesImportFile.addEventListener("change", () => {
			const file = intonationFavoritesImportFile.files?.[0];
			if (file) {
				importIntonationFavorites(file, () => {
					intonationFavoritesImportFile.value = "";
				});
			}
		});
	}
}
