import "./styles.css";
import { loadSettings } from "./settings";
import { initializeSettingsPanelFromDOM } from "./settingsPanel";
import { initializeTextLists } from "./textLists";
import {
	initializeIntonationCanvas,
	initializeIntonationControls,
	initializeIntonationElements,
	refreshIntonationChart,
	setHandlePlayHandler,
	setStyleChangeHandler,
	setupIntonationCanvasEvents,
} from "./intonation";
import {
	handlePlay,
	initializePlaybackControls,
	scheduleAutoPlay,
	setTextAndPlay,
} from "./playback";
import { applyStyleSelection, initializeStyleControls } from "./styleManager";
import { initializeDelimiterInput, initializePanelToggles } from "./uiControls";
import {
	initializeSpectrogramScaleToggle,
	initializeVisualizationCanvases,
} from "./visualization";

document.addEventListener("DOMContentLoaded", () => {
	loadSettings();
	initializeSettingsPanelFromDOM();
	initializePlaybackControls();
	initializeStyleControls(scheduleAutoPlay);
	initializeDelimiterInput();
	initializePanelToggles();
	initializeTextLists({ onSelectText: setTextAndPlay });
	initializeIntonationElements();
	setStyleChangeHandler(applyStyleSelection);
	setHandlePlayHandler(() => void handlePlay());
	initializeIntonationControls();
	setupIntonationCanvasEvents();
	initializeSpectrogramScaleToggle();
	initializeVisualizationCanvases();
	initializeIntonationCanvas();
	window.addEventListener("resize", () => {
		initializeVisualizationCanvases();
		initializeIntonationCanvas();
		refreshIntonationChart();
	});
});
