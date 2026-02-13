import * as Tone from 'tone';
import { AUDIO_CACHE_LIMIT, AUTO_PLAY_DEBOUNCE_MS, DELIMITER_STORAGE_KEY, FrequencyScale } from './config';
import { addToHistory, initializeTextLists } from './textLists';
import {
  adjustIntonationScale,
  fetchAndRenderIntonation,
  getIntonationKeyboardEnabled,
  handleIntonationKeyDown,
  handleIntonationPointerDown,
  handleIntonationPointerMove,
  handleIntonationPointerUp,
  initializeIntonationCanvas,
  initializeIntonationElements,
  isIntonationDirty,
  refreshIntonationChart,
  resetIntonationToInitial,
  resetIntonationState,
  saveCurrentIntonationFavorite,
  setIntonationKeyboardEnabled,
  setStyleChangeHandler,
} from './intonation';
import { appState } from './state';
import { updateExportButtonState } from './uiControls';
import { showStatus, scheduleHideStatus } from './status';
import { combineAudioBuffers, encodeAudioBufferToWav, getAudioQuery, synthesize } from './audio';
import {
  buildTextSegments,
  fetchVoiceStyles,
  getSelectedStyleId,
  parseDelimiterConfig,
  populateStyleSelect,
  setSelectedStyleId,
} from './styleManager';
import {
  drawRenderedWaveform,
  getSpectrogramScale,
  initializeVisualizationCanvases,
  isPlaybackActive,
  playAudio,
  requestSpectrogramReset,
  stopActivePlayback,
  setSpectrogramScale,
} from './visualization';

const audioCache = new Map<string, ArrayBuffer>();
let autoPlayTimer: number | null = null;
let delimiterSaveTimer: number | null = null;
let favoritesListEl: HTMLUListElement | null = null;
let historyListEl: HTMLUListElement | null = null;
let intonationFavoritesListEl: HTMLUListElement | null = null;
let loopCheckboxEl: HTMLInputElement | null = null;
let playRequestPending = false;
let stopInProgress = false;

function setPlayButtonAppearance(mode: 'play' | 'stop') {
  const playButton = document.getElementById('playButton') as HTMLButtonElement | null;
  if (!playButton) return;
  if (mode === 'play') {
    playButton.innerHTML = '<span aria-hidden="true">▶️</span>';
    playButton.setAttribute('aria-label', 'Play');
    playButton.title = 'Play';
  } else {
    playButton.innerHTML = '<span aria-hidden="true">⏹️</span>';
    playButton.setAttribute('aria-label', 'Stop');
    playButton.title = 'Stop';
  }
}

function stopPlaybackAndResetLoop() {
  stopInProgress = true;
  stopActivePlayback();
  if (loopCheckboxEl) {
    loopCheckboxEl.checked = false;
  }
  setPlayButtonAppearance('play');
  setTimeout(() => {
    stopInProgress = false;
  }, 0);
}

function getAudioCacheKey(text: string, styleId: number) {
  return `${styleId}::${text}`;
}

function setTextAndPlay(text: string) {
  const textArea = document.getElementById('text') as HTMLTextAreaElement | null;
  if (!textArea) return;
  textArea.value = text;
  if (autoPlayTimer !== null) {
    window.clearTimeout(autoPlayTimer);
    autoPlayTimer = null;
  }
  scheduleAutoPlay();
}

function downloadLastAudio() {
  if (!appState.lastSynthesizedBuffer) return;

  const blob = new Blob([appState.lastSynthesizedBuffer], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'voicevox-output.wav';
  document.body.appendChild(link);
  link.click();
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
    link.remove();
  }, 0);
}

function scheduleAutoPlay() {
  if (autoPlayTimer !== null) {
    window.clearTimeout(autoPlayTimer);
  }

  const textArea = document.getElementById('text') as HTMLTextAreaElement | null;
  if (!textArea) return;
  const text = textArea.value.trim();
  if (!text) {
    autoPlayTimer = null;
    return;
  }

  const triggerPlay = () => {
    autoPlayTimer = null;
    if (appState.isProcessing) {
      autoPlayTimer = window.setTimeout(triggerPlay, AUTO_PLAY_DEBOUNCE_MS);
      return;
    }
    void handlePlay();
  };

  autoPlayTimer = window.setTimeout(triggerPlay, AUTO_PLAY_DEBOUNCE_MS);
}

async function confirmResetIntonationBeforePlay() {
  const dialog = document.getElementById('playConfirmDialog');
  const resetButton = document.getElementById('playConfirmReset');
  const cancelButton = document.getElementById('playConfirmCancel');
  if (!dialog || !resetButton || !cancelButton) {
    return window.confirm('イントネーションの編集内容が破棄されます。再生してよろしいですか？');
  }
  const previousActiveElement = document.activeElement as HTMLElement | null;
  dialog.removeAttribute('hidden');
  let settled = false;
  let keydownHandler: ((event: KeyboardEvent) => void) | null = null;
  const cleanup = () => {
    if (settled) return;
    settled = true;
    dialog.setAttribute('hidden', 'true');
    if (keydownHandler) {
      dialog.removeEventListener('keydown', keydownHandler);
    }
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  };
  (resetButton as HTMLElement).focus();
  return new Promise<boolean>((resolve) => {
    const handleReset = () => {
      cleanup();
      resolve(true);
    };
    const handleCancel = () => {
      cleanup();
      resolve(false);
    };
    keydownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        event.preventDefault();
        handleCancel();
      }
    };
    dialog.addEventListener('keydown', keydownHandler);
    resetButton.addEventListener('click', handleReset, { once: true });
    cancelButton.addEventListener('click', handleCancel, { once: true });
  });
}

function handlePlayButtonClick() {
  if (stopInProgress || playRequestPending) {
    return;
  }
  if (isPlaybackActive()) {
    stopPlaybackAndResetLoop();
    return;
  }
  if (appState.isProcessing) {
    return;
  }
  void handlePlay();
}

async function handlePlay() {
  const textArea = document.getElementById('text') as HTMLTextAreaElement | null;
  const playButton = document.getElementById('playButton') as HTMLButtonElement | null;
  const exportButton = document.getElementById('exportButton') as HTMLButtonElement | null;
  const renderedCanvas = document.getElementById('renderedWaveform') as HTMLCanvasElement | null;
  const realtimeCanvas = document.getElementById('realtimeWaveform') as HTMLCanvasElement | null;
  const spectrogramCanvas = document.getElementById('spectrogram') as HTMLCanvasElement | null;
  const loopCheckbox = document.getElementById('loopCheckbox') as HTMLInputElement | null;
  const styleSelect = document.getElementById('styleSelect') as HTMLSelectElement | null;
  const delimiterInput = document.getElementById('delimiterInput') as HTMLInputElement | null;

  if (!textArea || !playButton) {
    console.error('Required UI elements not found');
    return;
  }

  const text = textArea.value.trim();

  if (!text) {
    showStatus('テキストを入力してください', 'error');
    return;
  }

  if (styleSelect && styleSelect.value) {
    const parsed = Number(styleSelect.value);
    if (!Number.isNaN(parsed)) {
      setSelectedStyleId(parsed);
    }
  }

  const delimiter = parseDelimiterConfig(delimiterInput?.value ?? '');
  const segments = buildTextSegments(text, delimiter, getSelectedStyleId());
  if (segments.length === 0) {
    showStatus('テキストを入力してください', 'error');
    return;
  }

  if (appState.isProcessing || playRequestPending) {
    return;
  }

  if (isIntonationDirty()) {
    const shouldReset = await confirmResetIntonationBeforePlay();
    if (!shouldReset) {
      return;
    }
    resetIntonationState();
  }

  playRequestPending = true;
  appState.isProcessing = true;
  playButton.disabled = true;
  updateExportButtonState(exportButton);

  try {
    const audioContext = Tone.getContext().rawContext as BaseAudioContext;
    const decodedBuffers: AudioBuffer[] = [];
    let usedCache = false;
    let allSegmentsCached = true;
    const currentSignature = segments.map((segment) => getAudioCacheKey(segment.text, segment.styleId)).join('|');
    for (const segment of segments) {
      const cacheKey = getAudioCacheKey(segment.text, segment.styleId);
      let audioBuffer = audioCache.get(cacheKey) ?? null;
      if (audioBuffer) {
        usedCache = true;
      } else {
        allSegmentsCached = false;
        showStatus('音声クエリを作成中...', 'info');
        const audioQuery = await getAudioQuery(segment.text, segment.styleId);
        showStatus('音声を生成中...', 'info');
        audioBuffer = await synthesize(audioQuery, segment.styleId);
        if (audioCache.size >= AUDIO_CACHE_LIMIT) {
          const oldest = audioCache.keys().next().value;
          if (oldest !== undefined) {
            audioCache.delete(oldest);
          }
        }
        audioCache.set(cacheKey, audioBuffer);
      }
      const decodedBuffer = await audioContext.decodeAudioData(audioBuffer.slice(0));
      decodedBuffers.push(decodedBuffer);
    }

    const combinedBuffer = combineAudioBuffers(decodedBuffers, audioContext);
    if (!combinedBuffer) {
      throw new Error('音声の結合に失敗しました。');
    }

    appState.lastSynthesizedBuffer = encodeAudioBufferToWav(combinedBuffer);

    const shouldPreserveSpectrogram = allSegmentsCached && appState.lastSpectrogramSignature === currentSignature;
    initializeVisualizationCanvases({ preserveSpectrogram: shouldPreserveSpectrogram });
    if (renderedCanvas) {
      drawRenderedWaveform(combinedBuffer, renderedCanvas);
    }

    if (!usedCache) {
      showStatus('音声を再生中...', 'info');
    } else {
      showStatus('音声を再生中（キャッシュ）...', 'info');
    }
    setPlayButtonAppearance('stop');
    playButton.disabled = false;
    const playbackResult = await playAudio(combinedBuffer, realtimeCanvas, spectrogramCanvas, {
      resetSpectrogram: !shouldPreserveSpectrogram,
    });
    if (playbackResult.stopped) {
      showStatus('再生を停止しました', 'info');
      scheduleHideStatus(1500);
      return;
    }
    appState.lastSpectrogramSignature = currentSignature;
    const spokenText = segments.map((segment) => segment.text).join('');
    const intonationStyleId = segments[0]?.styleId ?? getSelectedStyleId();
    await fetchAndRenderIntonation(spokenText, intonationStyleId);
    addToHistory(text);

    showStatus('再生完了！', 'success');
    scheduleHideStatus(3000);

    if (loopCheckbox?.checked) {
      setTimeout(() => {
        if (loopCheckbox.checked) {
          void handlePlay();
        }
      }, 0);
    }
  } catch (error) {
    console.error('Error:', error);
    showStatus(
      `エラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      'error'
    );
  } finally {
    setPlayButtonAppearance('play');
    playButton.disabled = false;
    playRequestPending = false;
    appState.isProcessing = false;
    updateExportButtonState(exportButton);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const playButton = document.getElementById('playButton') as HTMLButtonElement | null;
  const textArea = document.getElementById('text') as HTMLTextAreaElement | null;
  const exportButton = document.getElementById('exportButton') as HTMLButtonElement | null;
  const usageToggleButton = document.getElementById('usageToggleButton') as HTMLButtonElement | null;
  const usagePanel = document.getElementById('usagePanel');
  const spectrogramScaleToggle = document.getElementById('spectrogramScaleToggle') as HTMLButtonElement | null;
  const styleSelect = document.getElementById('styleSelect') as HTMLSelectElement | null;
  const delimiterInput = document.getElementById('delimiterInput') as HTMLInputElement | null;
  const favoritesToggleButton = document.getElementById('favoritesToggleButton') as HTMLButtonElement | null;
  const favoritesPanel = document.getElementById('favoritesPanel');
  favoritesListEl = document.getElementById('favoritesList') as HTMLUListElement | null;
  historyListEl = document.getElementById('historyList') as HTMLUListElement | null;
  intonationFavoritesListEl = document.getElementById('intonationFavoritesList') as HTMLUListElement | null;
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
  loopCheckboxEl = document.getElementById('loopCheckbox') as HTMLInputElement | null;

  if (loopCheckboxEl) {
    loopCheckboxEl.addEventListener('change', () => {
      if (
        loopCheckboxEl?.checked &&
        !appState.isProcessing &&
        !isPlaybackActive() &&
        !playRequestPending
      ) {
        void handlePlay();
      }
    });
  }

  setStyleChangeHandler((styleId) => {
    setSelectedStyleId(styleId);
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
        setSelectedStyleId(parsed);
      }
    });
  }
  void fetchVoiceStyles(styleSelect ?? null);

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
    favoritesToggleButton.addEventListener('click', () => {
      const isHidden = favoritesPanel.hasAttribute('hidden');
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
      initializeVisualizationCanvases();
      requestSpectrogramReset();
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
    intonationCanvas.addEventListener('keydown', handleIntonationKeyDown);
    intonationCanvas.addEventListener('focus', () => {
      refreshIntonationChart();
    });
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
