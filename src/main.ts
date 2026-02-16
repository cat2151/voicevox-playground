import './styles.css';
import { AUTO_PLAY_DEBOUNCE_MS, DELIMITER_STORAGE_KEY, FrequencyScale } from './config';
import { initializeTextLists } from './textLists';
import {
  adjustIntonationScale,
  getIntonationKeyboardEnabled,
  handleIntonationKeyDown,
  handleIntonationPointerDown,
  handleIntonationPointerMove,
  handleIntonationPointerUp,
  initializeIntonationCanvas,
  initializeIntonationElements,
  refreshIntonationChart,
  resetIntonationToInitial,
  saveCurrentIntonationFavorite,
  setIntonationKeyboardEnabled,
  setStyleChangeHandler,
} from './intonation';
import { appState } from './state';
import { updateExportButtonState } from './uiControls';
import {
  downloadLastAudio,
  handlePlay,
  handlePlayButtonClick,
  isPlayRequestPending,
  scheduleAutoPlay,
  setLoopCheckboxElement,
  setPlayButtonAppearance,
  setTextAndPlay,
} from './playback';
import {
  fetchVoiceStyles,
  getSelectedStyleId,
  populateStyleSelect,
  populateSpeakerStyleSelect,
  selectRandomStyleId,
  setSelectedStyleId,
} from './styleManager';
import {
  getSpectrogramScale,
  initializeVisualizationCanvases,
  isPlaybackActive,
  setSpectrogramScale,
} from './visualization';

let delimiterSaveTimer: number | null = null;

document.addEventListener('DOMContentLoaded', () => {
  const playButton = document.getElementById('playButton') as HTMLButtonElement | null;
  const textArea = document.getElementById('text') as HTMLTextAreaElement | null;
  const exportButton = document.getElementById('exportButton') as HTMLButtonElement | null;
  const usageToggleButton = document.getElementById('usageToggleButton') as HTMLButtonElement | null;
  const usagePanel = document.getElementById('usagePanel');
  const spectrogramScaleToggle = document.getElementById('spectrogramScaleToggle') as HTMLButtonElement | null;
  const styleSelect = document.getElementById('styleSelect') as HTMLSelectElement | null;
  const speakerStyleSelect = document.getElementById('speakerStyleSelect') as HTMLSelectElement | null;
  const delimiterInput = document.getElementById('delimiterInput') as HTMLInputElement | null;
  const randomStyleCheckbox = document.getElementById('randomStyleCheckbox') as HTMLInputElement | null;
  const favoritesToggleButton = document.getElementById('favoritesToggleButton') as HTMLButtonElement | null;
  const favoritesPanel = document.getElementById('favoritesPanel');
  const favoritesListEl = document.getElementById('favoritesList') as HTMLUListElement | null;
  const historyListEl = document.getElementById('historyList') as HTMLUListElement | null;
  const intonationFavoritesListEl = document.getElementById('intonationFavoritesList') as HTMLUListElement | null;
  const intonationCanvas = document.getElementById('intonationCanvas') as HTMLCanvasElement | null;
  const intonationTimingEl = null;
  const intonationLabelsEl = document.getElementById('intonationLabels');
  const intonationMaxValueEl = document.getElementById('intonationMaxValue');
  const intonationMinValueEl = document.getElementById('intonationMinValue');
  const intonationExpandTop = document.getElementById('intonationExpandTop') as HTMLButtonElement | null;
  const intonationShrinkTop = document.getElementById('intonationShrinkTop') as HTMLButtonElement | null;
  const intonationShrinkBottom = document.getElementById('intonationShrinkBottom') as HTMLButtonElement | null;
  const intonationExpandBottom = document.getElementById('intonationExpandBottom') as HTMLButtonElement | null;
  const intonationKeyboardToggle = document.getElementById('intonationKeyboardToggle') as HTMLButtonElement | null;
  const intonationResetButton = document.getElementById('intonationResetButton') as HTMLButtonElement | null;
  const intonationFavoriteButton = document.getElementById('intonationFavoriteButton') as HTMLButtonElement | null;
  const loopCheckboxEl = document.getElementById('loopCheckbox') as HTMLInputElement | null;
  setLoopCheckboxElement(loopCheckboxEl);

  const applyStyleSelection = (styleId: number) => {
    setSelectedStyleId(styleId);
    if (styleSelect) {
      styleSelect.value = String(styleId);
    }
    populateSpeakerStyleSelect(speakerStyleSelect, styleId);
  };
  const applyRandomStyleSelection = () => {
    const randomStyleId = selectRandomStyleId();
    applyStyleSelection(randomStyleId);
    return randomStyleId;
  };

  if (loopCheckboxEl) {
    loopCheckboxEl.addEventListener('change', () => {
      if (
        loopCheckboxEl.checked &&
        !appState.isProcessing &&
        !isPlaybackActive() &&
        !isPlayRequestPending()
      ) {
        void handlePlay();
      }
    });
  }

  setStyleChangeHandler((styleId) => {
    applyStyleSelection(styleId);
  });

  if (playButton) {
    playButton.addEventListener('click', handlePlayButtonClick);
    setPlayButtonAppearance('play');
    playButton.focus();
  }

  if (textArea) {
    textArea.addEventListener('input', scheduleAutoPlay);
  }

  if (exportButton) {
    exportButton.addEventListener('click', downloadLastAudio);
    updateExportButtonState(exportButton);
  }

  if (styleSelect) {
    populateStyleSelect(styleSelect);
    styleSelect.addEventListener('change', () => {
      const parsed = Number(styleSelect.value);
      if (!Number.isNaN(parsed)) {
        applyStyleSelection(parsed);
      }
    });
    applyStyleSelection(getSelectedStyleId());
  }

  if (randomStyleCheckbox) {
    randomStyleCheckbox.addEventListener('change', () => {
      if (randomStyleCheckbox.checked) {
        applyRandomStyleSelection();
      }
    });
  }

  if (speakerStyleSelect) {
    speakerStyleSelect.addEventListener('change', () => {
      const parsed = Number(speakerStyleSelect.value);
      if (!Number.isNaN(parsed)) {
        applyStyleSelection(parsed);
      }
    });
  }
  void fetchVoiceStyles(styleSelect ?? null, speakerStyleSelect ?? null).then(() => {
    if (randomStyleCheckbox?.checked) {
      applyRandomStyleSelection();
    }
  });

  if (delimiterInput) {
    try {
      const savedDelimiter = localStorage.getItem(DELIMITER_STORAGE_KEY);
      if (savedDelimiter !== null) {
        delimiterInput.value = savedDelimiter;
      }
    } catch (error) {
      console.warn('Failed to restore delimiter config:', error);
    }

    const saveDelimiter = () => {
      try {
        localStorage.setItem(DELIMITER_STORAGE_KEY, delimiterInput.value);
      } catch (error) {
        console.warn('Failed to save delimiter config:', error);
      }
    };
    const scheduleSaveDelimiter = () => {
      if (delimiterSaveTimer !== null) {
        window.clearTimeout(delimiterSaveTimer);
      }
      delimiterSaveTimer = window.setTimeout(saveDelimiter, AUTO_PLAY_DEBOUNCE_MS);
    };
    delimiterInput.addEventListener('input', scheduleSaveDelimiter);
  }

  if (usageToggleButton && usagePanel) {
    usageToggleButton.addEventListener('click', () => {
      const isHidden = usagePanel.hidden;
      usagePanel.hidden = !isHidden;
      usageToggleButton.setAttribute('aria-expanded', String(isHidden));
    });
  }

  if (favoritesToggleButton && favoritesPanel) {
    favoritesPanel.hidden = true;
    favoritesToggleButton.setAttribute('aria-expanded', 'false');
    favoritesToggleButton.addEventListener('click', () => {
      const isHidden = favoritesPanel.hidden;
      favoritesPanel.hidden = !isHidden;
      favoritesToggleButton.setAttribute('aria-expanded', String(isHidden));
    });
  }

  initializeTextLists({
    favoritesList: favoritesListEl,
    historyList: historyListEl,
    onSelectText: setTextAndPlay,
  });

  initializeIntonationElements({
    canvas: intonationCanvas,
    timingEl: intonationTimingEl,
    labelsEl: intonationLabelsEl,
    maxValueEl: intonationMaxValueEl,
    minValueEl: intonationMinValueEl,
    favoritesListEl: intonationFavoritesListEl,
    loopCheckbox: loopCheckboxEl,
  });

  const updateSpectrogramScaleLabel = () => {
    if (spectrogramScaleToggle) {
      const scale = getSpectrogramScale();
      const isLogScale = scale === 'log';
      const nextLabel = isLogScale ? 'リニアにする' : '対数にする';
      spectrogramScaleToggle.textContent = nextLabel;
      spectrogramScaleToggle.setAttribute('aria-pressed', String(isLogScale));
      spectrogramScaleToggle.setAttribute('aria-label', `スペクトログラムのスケールを${nextLabel}`);
    }
  };

  if (spectrogramScaleToggle) {
    updateSpectrogramScaleLabel();
    spectrogramScaleToggle.addEventListener('click', () => {
      const nextScale: FrequencyScale = getSpectrogramScale() === 'linear' ? 'log' : 'linear';
      setSpectrogramScale(nextScale);
      updateSpectrogramScaleLabel();
    });
  }

  const updateIntonationKeyboardToggle = () => {
    if (intonationKeyboardToggle) {
      const enabled = getIntonationKeyboardEnabled();
      intonationKeyboardToggle.textContent = enabled ? 'キーボード操作: ON' : 'キーボード操作: OFF';
      intonationKeyboardToggle.setAttribute('aria-pressed', String(enabled));
      intonationKeyboardToggle.setAttribute(
        'aria-label',
        enabled ? 'キーボード操作を無効にする' : 'キーボード操作を有効にする'
      );
    }
  };

  if (intonationKeyboardToggle) {
    updateIntonationKeyboardToggle();
    intonationKeyboardToggle.addEventListener('click', () => {
      setIntonationKeyboardEnabled(!getIntonationKeyboardEnabled());
      updateIntonationKeyboardToggle();
      if (getIntonationKeyboardEnabled() && intonationCanvas) {
        intonationCanvas.focus();
      }
      refreshIntonationChart();
    });
  }

  if (intonationResetButton) {
    intonationResetButton.addEventListener('click', () => {
      resetIntonationToInitial();
      if (getIntonationKeyboardEnabled() && intonationCanvas) {
        intonationCanvas.focus();
      }
    });
  }

  if (intonationFavoriteButton) {
    intonationFavoriteButton.addEventListener('click', () =>
      saveCurrentIntonationFavorite(getSelectedStyleId())
    );
  }

  if (intonationExpandTop) {
    intonationExpandTop.addEventListener('click', () => adjustIntonationScale('top', 2));
  }
  if (intonationShrinkTop) {
    intonationShrinkTop.addEventListener('click', () => adjustIntonationScale('top', 0.5));
  }
  if (intonationShrinkBottom) {
    intonationShrinkBottom.addEventListener('click', () => adjustIntonationScale('bottom', 0.5));
  }
  if (intonationExpandBottom) {
    intonationExpandBottom.addEventListener('click', () => adjustIntonationScale('bottom', 2));
  }

  if (intonationCanvas) {
    intonationCanvas.addEventListener('pointerdown', handleIntonationPointerDown);
    intonationCanvas.addEventListener('pointermove', handleIntonationPointerMove);
    intonationCanvas.addEventListener('pointerleave', handleIntonationPointerUp);
    intonationCanvas.addEventListener('pointercancel', handleIntonationPointerUp);
    intonationCanvas.addEventListener('lostpointercapture', handleIntonationPointerUp);
    intonationCanvas.addEventListener('focus', () => {
      refreshIntonationChart();
    });
    window.addEventListener('keydown', handleIntonationKeyDown);
  }
  window.addEventListener('mouseup', handleIntonationPointerUp);
  window.addEventListener('pointerup', handleIntonationPointerUp);

  initializeVisualizationCanvases();
  initializeIntonationCanvas();
  window.addEventListener('resize', () => {
    initializeVisualizationCanvases();
    initializeIntonationCanvas();
    refreshIntonationChart();
  });
});
