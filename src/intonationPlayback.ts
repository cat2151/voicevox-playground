import * as Tone from 'tone';
import { INTONATION_DEBOUNCE_MS } from './config';
import { getAudioQuery, synthesize } from './audio';
import { showStatus, scheduleHideStatus } from './status';
import { initializeVisualizationCanvases, drawRenderedWaveform, playAudio } from './visualization';
import { appState } from './state';
import { updateExportButtonState } from './uiControls';
import { intonationState as state, updateIntonationTiming } from './intonationState';
import { cloneAudioQuery } from './intonationUtils';
import {
  buildIntonationPointsFromQuery,
  drawIntonationChart,
  updateInitialRangeFromPoints,
} from './intonationDisplay';

export function scheduleIntonationPlayback(playbackFn: () => Promise<void>) {
  if (state.intonationDebounceTimer !== null) {
    window.clearTimeout(state.intonationDebounceTimer);
  }
  state.intonationDebounceTimer = window.setTimeout(() => {
    state.intonationDebounceTimer = null;
    if (appState.isProcessing) {
      scheduleIntonationPlayback(playbackFn);
      return;
    }
    void playbackFn();
  }, INTONATION_DEBOUNCE_MS);
}

export async function replayCachedIntonationAudio() {
  if (!appState.lastSynthesizedBuffer || appState.isProcessing) return false;
  const playButton = document.getElementById('playButton') as HTMLButtonElement | null;
  const exportButton = document.getElementById('exportButton') as HTMLButtonElement | null;
  const renderedCanvas = document.getElementById('renderedWaveform') as HTMLCanvasElement | null;
  const realtimeCanvas = document.getElementById('realtimeWaveform') as HTMLCanvasElement | null;
  const spectrogramCanvas = document.getElementById('spectrogram') as HTMLCanvasElement | null;
  try {
    appState.isProcessing = true;
    if (playButton) playButton.disabled = true;
    updateExportButtonState(exportButton);
    initializeVisualizationCanvases({ preserveSpectrogram: true });
    const audioContext = Tone.getContext().rawContext as BaseAudioContext;
    const decodedBuffer = await audioContext.decodeAudioData(appState.lastSynthesizedBuffer.slice(0));
    if (renderedCanvas) {
      drawRenderedWaveform(decodedBuffer, renderedCanvas);
    }
    await playAudio(decodedBuffer, realtimeCanvas, spectrogramCanvas, { resetSpectrogram: false });
    return true;
  } catch (error) {
    console.error('Intonation cache playback error:', error);
    showStatus('キャッシュの再生に失敗しました', 'error');
    return false;
  } finally {
    appState.isProcessing = false;
    if (playButton) playButton.disabled = false;
    updateExportButtonState(exportButton);
  }
}

export async function playUpdatedIntonation() {
  if (!state.currentIntonationQuery) return;
  if (appState.isProcessing) return;

  const playButton = document.getElementById('playButton') as HTMLButtonElement | null;
  const exportButton = document.getElementById('exportButton') as HTMLButtonElement | null;
  const renderedCanvas = document.getElementById('renderedWaveform') as HTMLCanvasElement | null;
  const realtimeCanvas = document.getElementById('realtimeWaveform') as HTMLCanvasElement | null;
  const spectrogramCanvas = document.getElementById('spectrogram') as HTMLCanvasElement | null;

  appState.isProcessing = true;
  if (playButton) playButton.disabled = true;
  updateExportButtonState(exportButton);
  initializeVisualizationCanvases();

  try {
    showStatus('イントネーションを適用中...', 'info');
    const synthesisStart = performance.now();
    const audioBuffer = await synthesize(state.currentIntonationQuery, state.currentIntonationStyleId);
    const synthesisElapsed = performance.now() - synthesisStart;
    updateIntonationTiming(`イントネーション反映: ${Math.round(synthesisElapsed)} ms`);

    appState.lastSynthesizedBuffer = audioBuffer;
    const audioContext = Tone.getContext().rawContext as BaseAudioContext;
    const decodedBuffer = await audioContext.decodeAudioData(audioBuffer.slice(0));

    if (renderedCanvas) {
      drawRenderedWaveform(decodedBuffer, renderedCanvas);
    }

    await playAudio(decodedBuffer, realtimeCanvas, spectrogramCanvas);

    showStatus('更新したイントネーションで再生しました', 'success');
    scheduleHideStatus(2500);
  } catch (error) {
    console.error('Intonation playback error:', error);
    showStatus(
      `イントネーション適用中にエラーが発生しました: ${
        error instanceof Error ? error.message : String(error)
      }`,
      'error'
    );
  } finally {
    appState.isProcessing = false;
    if (playButton) playButton.disabled = false;
    updateExportButtonState(exportButton);
  }
}

export async function fetchAndRenderIntonation(text: string, styleId: number) {
  if (!state.intonationCanvas) return;
  const start = performance.now();
  try {
    const query = await getAudioQuery(text, styleId);
    const elapsed = performance.now() - start;
    state.intonationInitialQuery = cloneAudioQuery(query);
    state.currentIntonationQuery = cloneAudioQuery(query);
    state.currentIntonationStyleId = styleId;
    state.intonationPoints = buildIntonationPointsFromQuery(query);
    state.intonationTopScale = 1;
    state.intonationBottomScale = 1;
    state.intonationSelectedIndex = state.intonationPoints.length > 0 ? 0 : null;
    updateInitialRangeFromPoints(state.intonationPoints);
    drawIntonationChart(state.intonationPoints);
    state.intonationDirty = false;
    updateIntonationTiming(`イントネーション取得: ${Math.round(elapsed)} ms`);
  } catch (error) {
    console.error('Failed to fetch intonation:', error);
    updateIntonationTiming('イントネーションの取得に失敗しました');
    showStatus('イントネーションの取得に失敗しました', 'error');
  }
}

export function resetIntonationToInitial() {
  if (!state.intonationInitialQuery) return;
  state.currentIntonationQuery = cloneAudioQuery(state.intonationInitialQuery);
  state.intonationPoints = buildIntonationPointsFromQuery(state.currentIntonationQuery);
  state.intonationTopScale = 1;
  state.intonationBottomScale = 1;
  state.intonationSelectedIndex = state.intonationPoints.length > 0 ? 0 : null;
  state.intonationDirty = false;
  state.intonationPlaybackPending = false;
  if (state.intonationDebounceTimer !== null) {
    window.clearTimeout(state.intonationDebounceTimer);
    state.intonationDebounceTimer = null;
  }
  updateInitialRangeFromPoints(state.intonationPoints);
  drawIntonationChart(state.intonationPoints);
}
