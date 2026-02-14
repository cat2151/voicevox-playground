import * as Tone from 'tone';
import {
  AudioQuery,
  INTONATION_DEBOUNCE_MS,
  INTONATION_FAVORITES_STORAGE_KEY,
  IntonationChartRange,
  IntonationFavorite,
  IntonationPoint,
  MONOKAI_COLORS,
  TEXT_LIST_LIMIT,
  ZUNDAMON_SPEAKER_ID,
} from './config';
import { getAudioQuery, synthesize } from './audio';
import { showStatus, scheduleHideStatus, getColorVariable } from './status';
import { initializeVisualizationCanvases, drawRenderedWaveform, playAudio } from './visualization';
import { appState } from './state';
import { updateExportButtonState } from './uiControls';

export type RangeExtra = { top: number; bottom: number };

let intonationCanvas: HTMLCanvasElement | null = null;
let intonationTimingEl: HTMLElement | null = null;
let intonationLabelsEl: HTMLElement | null = null;
let intonationMaxValueEl: HTMLElement | null = null;
let intonationMinValueEl: HTMLElement | null = null;
let intonationFavoritesListEl: HTMLUListElement | null = null;
let loopCheckboxEl: HTMLInputElement | null = null;
let intonationInitialQuery: AudioQuery | null = null;
let intonationInitialPitchRange: { min: number; max: number } | null = null;
let intonationDisplayRange: { min: number; max: number } | null = null;
let intonationRangeExtra: RangeExtra = { top: 0, bottom: 0 };
let intonationPoints: IntonationPoint[] = [];
let intonationPointPositions: Array<{ x: number; y: number }> = [];
let intonationSelectedIndex: number | null = null;
let intonationDebounceTimer: number | null = null;
let intonationDragIndex: number | null = null;
let intonationActivePointerId: number | null = null;
let intonationPlaybackPending = false;
let intonationChartRange: IntonationChartRange | null = null;
let intonationTopScale = 1;
let intonationBottomScale = 1;
let intonationStepSize = 1;
let intonationKeyboardEnabled = false;
let currentIntonationStyleId = ZUNDAMON_SPEAKER_ID;
let currentIntonationQuery: AudioQuery | null = null;
let intonationDirty = false;
let intonationFavorites: IntonationFavorite[] = [];
let onStyleChange: ((styleId: number) => void) | null = null;
let wheelHandlerAttached = false;
let scrollLocked = false;
let previousBodyOverflow: string | null = null;

function isValidAudioQueryShape(query: unknown): query is AudioQuery {
  return (
    query !== null &&
    typeof query === 'object' &&
    Array.isArray((query as { accent_phrases?: unknown }).accent_phrases)
  );
}

function cloneAudioQuery(query: AudioQuery): AudioQuery {
  return JSON.parse(JSON.stringify(query)) as AudioQuery;
}

function dedupeIntonationFavorites(list: IntonationFavorite[]) {
  const seen = new Set<string>();
  const result: IntonationFavorite[] = [];
  for (const item of list) {
    if (!item || !item.text || !item.query || typeof item.styleId !== 'number') continue;
    const key = `${item.styleId}::${item.text.trim()}`;
    if (!item.text.trim() || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
    if (result.length >= TEXT_LIST_LIMIT) break;
  }
  return result;
}

function loadIntonationFavorites() {
  try {
    const raw = localStorage.getItem(INTONATION_FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return dedupeIntonationFavorites(
        parsed.map((item) => {
          if (!item || typeof item !== 'object') return null;
          const { text, styleId, query } = item as Partial<IntonationFavorite>;
          if (typeof text !== 'string' || typeof styleId !== 'number' || !isValidAudioQueryShape(query)) return null;
          return { text: text.trim(), styleId, query } as IntonationFavorite;
        }).filter((item): item is IntonationFavorite => item !== null)
      );
    }
  } catch (error) {
    console.warn('Failed to load intonation favorites:', error);
  }
  return [];
}

function persistIntonationFavorites() {
  try {
    localStorage.setItem(INTONATION_FAVORITES_STORAGE_KEY, JSON.stringify(intonationFavorites));
  } catch (error) {
    console.warn('Failed to save intonation favorites:', error);
  }
}

function updateIntonationTiming(message: string) {
  if (intonationTimingEl) {
    intonationTimingEl.textContent = message;
  }
}

function disableLoopOnIntonationEdit() {
  if (loopCheckboxEl && loopCheckboxEl.checked) {
    loopCheckboxEl.checked = false;
  }
}

function getPitchRange(points: IntonationPoint[]): { min: number; max: number } {
  if (points.length === 0) {
    return { min: 0, max: 0 };
  }
  let min = points[0].pitch;
  let max = points[0].pitch;
  for (let i = 1; i < points.length; i += 1) {
    const pitch = points[i].pitch;
    if (pitch < min) min = pitch;
    if (pitch > max) max = pitch;
  }
  return { min, max };
}

function calculateBasePadding(span: number) {
  return span === 0 ? 0.1 : span * 0.1;
}

function getBaseDisplayRange(): { min: number; max: number } | null {
  if (!intonationInitialPitchRange) return null;
  const span = Math.max(intonationInitialPitchRange.max - intonationInitialPitchRange.min, 0);
  const basePadding = calculateBasePadding(span);
  const topPadding = basePadding * intonationTopScale;
  const bottomPadding = basePadding * intonationBottomScale;
  return {
    min: intonationInitialPitchRange.min - bottomPadding,
    max: intonationInitialPitchRange.max + topPadding,
  };
}

function calculateDisplayRange(extra: RangeExtra): { min: number; max: number } | null {
  const baseRange = getBaseDisplayRange();
  if (!baseRange) return null;
  let min = baseRange.min - extra.bottom;
  let max = baseRange.max + extra.top;
  if (min >= max) {
    const center = (min + max) / 2;
    min = center - 0.0001;
    max = center + 0.0001;
  }
  return { min, max };
}

function getMinimumAllowedExtra(): RangeExtra {
  const baseRange = getBaseDisplayRange();
  if (!baseRange) return { top: 0, bottom: 0 };
  const dataRange = getPitchRange(intonationPoints);
  return {
    top: dataRange.max - baseRange.max,
    bottom: baseRange.min - dataRange.min,
  };
}

export function clampRangeExtra(
  desiredExtra: RangeExtra,
  baseRange: { min: number; max: number },
  dataRange: { min: number; max: number }
): RangeExtra {
  const minimumExtra = {
    top: dataRange.max - baseRange.max,
    bottom: baseRange.min - dataRange.min,
  };
  return {
    top: Math.max(desiredExtra.top, minimumExtra.top),
    bottom: Math.max(desiredExtra.bottom, minimumExtra.bottom),
  };
}

function applyRangeExtra(desiredExtra: RangeExtra) {
  const baseRange = getBaseDisplayRange();
  if (!baseRange) return;
  const dataRange = getPitchRange(intonationPoints);
  intonationRangeExtra = clampRangeExtra(desiredExtra, baseRange, dataRange);
  const range = calculateDisplayRange(intonationRangeExtra);
  if (range) {
    intonationDisplayRange = range;
    if (intonationChartRange) {
      intonationChartRange.min = range.min;
      intonationChartRange.max = range.max;
    }
  }
}

function refreshDisplayRange() {
  applyRangeExtra(intonationRangeExtra);
}

function clampPitchToDisplayRange(pitch: number) {
  if (!intonationDisplayRange) return pitch;
  return Math.min(Math.max(pitch, intonationDisplayRange.min), intonationDisplayRange.max);
}

export function calculateStepSize(range: { min: number; max: number }) {
  const span = Math.max(range.max - range.min, 0);
  const step = span / 10;
  return step > 0 ? step : 0.1;
}

export function calculateLetterKeyAdjustment(params: {
  currentPitch: number;
  baseRange: { min: number; max: number };
  rangeExtra: RangeExtra;
  stepSize: number;
  direction: 'up' | 'down';
  ctrlModifier: boolean;
}) {
  const step = params.stepSize * (params.ctrlModifier ? 0.5 : 1);
  const delta = step * (params.direction === 'up' ? 1 : -1);
  let desiredTopExtra = params.rangeExtra.top;
  let desiredBottomExtra = params.rangeExtra.bottom;
  const tentativePitch = params.currentPitch + delta;
  const maxWithExtra = params.baseRange.max + desiredTopExtra;
  const minWithExtra = params.baseRange.min - desiredBottomExtra;
  if (tentativePitch > maxWithExtra) {
    desiredTopExtra = Math.max(desiredTopExtra, tentativePitch - params.baseRange.max);
  } else if (tentativePitch < minWithExtra) {
    desiredBottomExtra = Math.max(desiredBottomExtra, params.baseRange.min - tentativePitch);
  }
  const adjustedMin = params.baseRange.min - desiredBottomExtra;
  const adjustedMax = params.baseRange.max + desiredTopExtra;
  const pitch = Math.min(Math.max(tentativePitch, adjustedMin), adjustedMax);
  return { pitch, rangeExtra: { top: desiredTopExtra, bottom: desiredBottomExtra } };
}

function handleIntonationWheel(event: WheelEvent) {
  if (intonationDragIndex !== null) {
    event.preventDefault();
  }
}

function updateInitialRangeFromPoints(points: IntonationPoint[]) {
  const range = getPitchRange(points);
  intonationInitialPitchRange = range;
  intonationStepSize = calculateStepSize(range);
  intonationRangeExtra = { top: 0, bottom: 0 };
  refreshDisplayRange();
}

export function resetIntonationState() {
  intonationInitialQuery = null;
  intonationInitialPitchRange = null;
  intonationDisplayRange = null;
  intonationRangeExtra = { top: 0, bottom: 0 };
  intonationStepSize = 1;
  currentIntonationQuery = null;
  intonationPoints = [];
  intonationPointPositions = [];
  intonationSelectedIndex = null;
  intonationTopScale = 1;
  intonationBottomScale = 1;
  intonationDirty = false;
  if (intonationCanvas) {
    const ctx = intonationCanvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, intonationCanvas.width, intonationCanvas.height);
    }
  }
  if (intonationLabelsEl) {
    intonationLabelsEl.textContent = '';
  }
  updateIntonationTiming('イントネーション未取得');
}

export function setStyleChangeHandler(handler: (styleId: number) => void) {
  onStyleChange = handler;
}

export function initializeIntonationElements(options: {
  canvas: HTMLCanvasElement | null;
  timingEl: HTMLElement | null;
  labelsEl: HTMLElement | null;
  maxValueEl: HTMLElement | null;
  minValueEl: HTMLElement | null;
  favoritesListEl: HTMLUListElement | null;
  loopCheckbox: HTMLInputElement | null;
}) {
  intonationCanvas = options.canvas;
  intonationTimingEl = options.timingEl;
  intonationLabelsEl = options.labelsEl;
  intonationMaxValueEl = options.maxValueEl;
  intonationMinValueEl = options.minValueEl;
  intonationFavoritesListEl = options.favoritesListEl;
  loopCheckboxEl = options.loopCheckbox;
  intonationFavorites = loadIntonationFavorites();
  persistIntonationFavorites();
  renderIntonationFavoritesList();
  if (!wheelHandlerAttached) {
    window.addEventListener('wheel', handleIntonationWheel, { passive: false });
    wheelHandlerAttached = true;
  }
}

export function isIntonationDirty() {
  return intonationDirty;
}

export function setIntonationKeyboardEnabled(enabled: boolean) {
  intonationKeyboardEnabled = enabled;
}

export function getIntonationKeyboardEnabled() {
  return intonationKeyboardEnabled;
}

export function initializeIntonationCanvas() {
  if (!intonationCanvas) return;
  const ctx = intonationCanvas.getContext('2d');
  if (!ctx) return;

  const rect = intonationCanvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = Math.max(1, Math.floor(rect.width));
  const displayHeight = Math.max(1, Math.floor(rect.height));
  const width = Math.max(1, Math.floor(displayWidth * dpr));
  const height = Math.max(1, Math.floor(displayHeight * dpr));

  if (intonationCanvas.width !== width || intonationCanvas.height !== height) {
    intonationCanvas.width = width;
    intonationCanvas.height = height;
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  const margin = 32;
  const innerHeight = Math.max(1, displayHeight - margin * 2);
  intonationChartRange = {
    min: 0,
    max: 10,
    margin,
    height: displayHeight,
    innerHeight,
    width: displayWidth,
  };
}

export function buildIntonationPointsFromQuery(query: AudioQuery) {
  const points: IntonationPoint[] = [];
  let phraseIndex = 0;
  for (const phrase of query.accent_phrases) {
    let moraIndex = 0;
    for (const mora of phrase.moras) {
      points.push({
        phraseIndex,
        moraIndex,
        label: mora.text || '・',
        pitch: mora.pitch,
      });
      moraIndex += 1;
    }
    if (phrase.pause_mora) {
      points.push({
        phraseIndex,
        moraIndex,
        label: phrase.pause_mora.text || '・',
        pitch: phrase.pause_mora.pitch,
      });
    }
    phraseIndex += 1;
  }
  return points;
}

function renderIntonationLabels(points: IntonationPoint[]) {
  const labelsEl = intonationLabelsEl;
  if (!labelsEl) return;
  labelsEl.textContent = '';
  const width = intonationChartRange?.width ?? 1;
  labelsEl.style.width = `${width}px`;
  labelsEl.style.marginLeft = 'auto';
  points.forEach((point, index) => {
    const pos = intonationPointPositions[index];
    const span = document.createElement('span');
    span.classList.add('intonation-label');
    if (pos) {
      const clamped = Math.min(1, Math.max(0, pos.x / Math.max(width, 1)));
      span.style.left = `${clamped * 100}%`;
    }
    const keySpan = document.createElement('span');
    keySpan.classList.add('intonation-label__key');
    keySpan.textContent = String.fromCharCode('a'.charCodeAt(0) + (index % 26));
    span.appendChild(keySpan);

    const textSpan = document.createElement('span');
    textSpan.textContent = point.label;
    span.appendChild(textSpan);
    labelsEl.appendChild(span);
  });
}

export function drawIntonationChart(points: IntonationPoint[]) {
  if (!intonationCanvas || !intonationChartRange) return;
  const ctx = intonationCanvas.getContext('2d');
  if (!ctx) return;

  const { width, height, margin, innerHeight } = intonationChartRange;
  ctx.clearRect(0, 0, width, height);

  if (points.length === 0) {
    ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#999';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('再生後に表示されます', width / 2, height / 2);
    return;
  }

  if (!intonationInitialPitchRange) {
    updateInitialRangeFromPoints(points);
  }
  if (!intonationDisplayRange) {
    refreshDisplayRange();
  }
  const rangeMin = intonationDisplayRange?.min ?? 0;
  const rangeMax = intonationDisplayRange?.max ?? 10;
  const rangeSpan = Math.max(rangeMax - rangeMin, 0.0001);

  if (intonationChartRange) {
    intonationChartRange.min = rangeMin;
    intonationChartRange.max = rangeMax;
  }
  if (intonationMaxValueEl) intonationMaxValueEl.textContent = `${rangeMax.toFixed(1)}`;
  if (intonationMinValueEl) intonationMinValueEl.textContent = `${rangeMin.toFixed(1)}`;

  ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
  ctx.fillRect(0, 0, width, height);

  const pointSpacing = Math.max(1, (width - margin * 2) / Math.max(points.length - 1, 1));
  intonationPointPositions = points.map((point, index) => {
    const x = margin + index * pointSpacing;
    const normalized = (clampPitchToDisplayRange(point.pitch) - rangeMin) / rangeSpan;
    const y = height - margin - normalized * innerHeight;
    return { x, y };
  });

  ctx.save();
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.25;
  intonationPointPositions.forEach((pos, index) => {
    const color = MONOKAI_COLORS[index % MONOKAI_COLORS.length];
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, pos.y);
    ctx.lineTo(width, pos.y);
    ctx.stroke();
  });
  ctx.restore();

  ctx.strokeStyle = getColorVariable('--accent-color', '#4CAF50');
  ctx.lineWidth = 2;
  ctx.beginPath();
  intonationPointPositions.forEach((pos, index) => {
    if (index === 0) {
      ctx.moveTo(pos.x, pos.y);
    } else {
      ctx.lineTo(pos.x, pos.y);
    }
  });
  ctx.stroke();

  intonationPointPositions.forEach((pos, index) => {
    const color = MONOKAI_COLORS[index % MONOKAI_COLORS.length];
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
    ctx.fill();

    if (intonationSelectedIndex === index) {
      ctx.strokeStyle = getColorVariable('--highlight-color', '#ff9800');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  renderIntonationLabels(points);
}

export function adjustIntonationScale(direction: 'top' | 'bottom', factor: number) {
  if (direction === 'top') {
    intonationTopScale = Math.max(0.05, intonationTopScale * factor);
  } else {
    intonationBottomScale = Math.max(0.05, intonationBottomScale * factor);
  }
  refreshDisplayRange();
  drawIntonationChart(intonationPoints);
}

function pitchFromY(y: number) {
  if (!intonationChartRange) return 0;
  const { min, max, margin, innerHeight } = intonationChartRange;
  const clampedY = Math.max(margin, Math.min(margin + innerHeight, y));
  const normalized = 1 - (clampedY - margin) / innerHeight;
  return min + normalized * (max - min);
}

function findNearestIntonationPoint(x: number) {
  if (!intonationPointPositions.length) return -1;
  let closestIndex = 0;
  let closestDistance = Infinity;
  intonationPointPositions.forEach((pos, index) => {
    const distance = Math.abs(pos.x - x);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });
  return closestIndex;
}

function applyPitchToQuery(pointIndex: number, pitch: number) {
  if (!currentIntonationQuery) return;
  if (pointIndex < 0 || pointIndex >= intonationPoints.length) return;
  const target = intonationPoints[pointIndex];
  const phrase = currentIntonationQuery.accent_phrases[target.phraseIndex];
  if (!phrase) return;
  if (target.moraIndex < phrase.moras.length) {
    phrase.moras[target.moraIndex].pitch = pitch;
  } else if (phrase.pause_mora) {
    phrase.pause_mora.pitch = pitch;
  }
}

function applyPitchEdit(
  pointIndex: number,
  pitch: number,
  options: { redraw?: boolean; schedulePlayback?: boolean } = {}
) {
  if (pointIndex < 0 || pointIndex >= intonationPoints.length) return;
  const redraw = options.redraw !== false;
  const schedulePlayback = options.schedulePlayback !== false;
  intonationPoints[pointIndex].pitch = pitch;
  applyPitchToQuery(pointIndex, pitch);
  disableLoopOnIntonationEdit();
  intonationDirty = true;
  if (redraw) {
    drawIntonationChart(intonationPoints);
  }
  if (schedulePlayback) {
    scheduleIntonationPlayback();
  }
}

function scheduleIntonationPlayback() {
  if (intonationDebounceTimer !== null) {
    window.clearTimeout(intonationDebounceTimer);
  }
  intonationDebounceTimer = window.setTimeout(() => {
    intonationDebounceTimer = null;
    if (appState.isProcessing) {
      scheduleIntonationPlayback();
      return;
    }
    void playUpdatedIntonation();
  }, INTONATION_DEBOUNCE_MS);
}

async function replayCachedIntonationAudio() {
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
  if (!currentIntonationQuery) return;
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
    const audioBuffer = await synthesize(currentIntonationQuery, currentIntonationStyleId);
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
  if (!intonationCanvas) return;
  const start = performance.now();
  try {
    const query = await getAudioQuery(text, styleId);
    const elapsed = performance.now() - start;
    intonationInitialQuery = cloneAudioQuery(query);
    currentIntonationQuery = cloneAudioQuery(query);
    currentIntonationStyleId = styleId;
    intonationPoints = buildIntonationPointsFromQuery(query);
    intonationTopScale = 1;
    intonationBottomScale = 1;
    intonationSelectedIndex = intonationPoints.length > 0 ? 0 : null;
    updateInitialRangeFromPoints(intonationPoints);
    drawIntonationChart(intonationPoints);
    intonationDirty = false;
    updateIntonationTiming(`イントネーション取得: ${Math.round(elapsed)} ms`);
  } catch (error) {
    console.error('Failed to fetch intonation:', error);
    updateIntonationTiming('イントネーションの取得に失敗しました');
    showStatus('イントネーションの取得に失敗しました', 'error');
  }
}

export function resetIntonationToInitial() {
  if (!intonationInitialQuery) return;
  currentIntonationQuery = cloneAudioQuery(intonationInitialQuery);
  intonationPoints = buildIntonationPointsFromQuery(currentIntonationQuery);
  intonationTopScale = 1;
  intonationBottomScale = 1;
  intonationSelectedIndex = intonationPoints.length > 0 ? 0 : null;
  intonationDirty = false;
  intonationPlaybackPending = false;
  if (intonationDebounceTimer !== null) {
    window.clearTimeout(intonationDebounceTimer);
    intonationDebounceTimer = null;
  }
  updateInitialRangeFromPoints(intonationPoints);
  drawIntonationChart(intonationPoints);
}

export function handleIntonationPointerDown(event: MouseEvent | PointerEvent) {
  if (event.button !== 0) return;
  if (!intonationCanvas || intonationPointPositions.length === 0) return;
  const rect = intonationCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const targetIndex = findNearestIntonationPoint(x);
  if (targetIndex !== -1) {
    intonationDragIndex = targetIndex;
    intonationSelectedIndex = targetIndex;
    disableLoopOnIntonationEdit();
    intonationCanvas.focus();
    if (!scrollLocked) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      scrollLocked = true;
    }
    if ('pointerId' in event) {
      intonationActivePointerId = event.pointerId;
      intonationCanvas.setPointerCapture(event.pointerId);
    }
    handleIntonationPointerMove(event);
    event.preventDefault();
  }
}

export function handleIntonationPointerMove(event: MouseEvent | PointerEvent) {
  if (intonationDragIndex === null || !intonationCanvas || intonationPointPositions.length === 0) {
    return;
  }
  event.preventDefault();
  if ('pointerId' in event && intonationActivePointerId !== null && event.pointerId !== intonationActivePointerId) {
    return;
  }
  const rect = intonationCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const targetIndex = findNearestIntonationPoint(x);
  if (targetIndex === -1) return;
  intonationDragIndex = targetIndex;
  const y = event.clientY - rect.top;
  refreshDisplayRange();
  const newPitch = clampPitchToDisplayRange(pitchFromY(y));
  intonationSelectedIndex = targetIndex;
  applyPitchEdit(targetIndex, newPitch, { schedulePlayback: false });
  intonationPlaybackPending = true;
}

export function handleIntonationPointerUp() {
  if (intonationDragIndex !== null) {
    intonationDragIndex = null;
  }
  if (scrollLocked) {
    document.body.style.overflow = previousBodyOverflow ?? '';
    scrollLocked = false;
    previousBodyOverflow = null;
  }
  if (intonationActivePointerId !== null && intonationCanvas) {
    intonationCanvas.releasePointerCapture(intonationActivePointerId);
    intonationActivePointerId = null;
  }
  if (intonationPlaybackPending) {
    intonationPlaybackPending = false;
    scheduleIntonationPlayback();
  }
}

export function handleIntonationKeyDown(event: KeyboardEvent) {
  if (!intonationCanvas || intonationPointPositions.length === 0 || !intonationKeyboardEnabled) {
    return;
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    void replayCachedIntonationAudio();
    return;
  }
  if (event.key === 'Escape' || event.key === 'Esc') {
    event.preventDefault();
    intonationSelectedIndex = null;
    drawIntonationChart(intonationPoints);
    return;
  }
  if (event.key === 'Tab') {
    if (intonationSelectedIndex !== null) {
      intonationSelectedIndex = null;
      drawIntonationChart(intonationPoints);
    }
    return;
  }
  const letterIndex =
    event.key.length === 1 ? event.key.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) : -1;
  if (letterIndex >= 0 && letterIndex < 26) {
    const targetIndex = intonationPoints.findIndex((_, idx) => idx % 26 === letterIndex);
    if (targetIndex !== -1) {
      intonationSelectedIndex = targetIndex;
      if (!intonationInitialPitchRange) {
        updateInitialRangeFromPoints(intonationPoints);
      }
      const baseRange = getBaseDisplayRange();
      if (baseRange) {
        const isUpperCase =
          event.key.length === 1 && event.key === event.key.toUpperCase() && event.key !== event.key.toLowerCase();
        const { pitch, rangeExtra } = calculateLetterKeyAdjustment({
          currentPitch: intonationPoints[targetIndex].pitch,
          baseRange,
          rangeExtra: intonationRangeExtra,
          stepSize: intonationStepSize,
          direction: isUpperCase ? 'down' : 'up',
          ctrlModifier: event.ctrlKey,
        });
        applyRangeExtra(rangeExtra);
        const newPitch = clampPitchToDisplayRange(pitch);
        applyPitchEdit(targetIndex, newPitch);
      } else {
        drawIntonationChart(intonationPoints);
      }
      event.preventDefault();
    }
    return;
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    intonationSelectedIndex = Math.max(0, (intonationSelectedIndex ?? 0) - 1);
    drawIntonationChart(intonationPoints);
    return;
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    intonationSelectedIndex = Math.min(intonationPoints.length - 1, (intonationSelectedIndex ?? 0) + 1);
    drawIntonationChart(intonationPoints);
    return;
  }
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
    if (intonationSelectedIndex === null) {
      intonationSelectedIndex = 0;
    }
    if (!intonationInitialPitchRange) {
      updateInitialRangeFromPoints(intonationPoints);
    }
    refreshDisplayRange();
    const step = intonationStepSize * (event.shiftKey && !event.ctrlKey ? 0.5 : 1);
    if (event.ctrlKey) {
      const rangeDelta = event.key === 'ArrowUp' ? step : -step;
      applyRangeExtra({
        top: intonationRangeExtra.top + rangeDelta,
        bottom: intonationRangeExtra.bottom + rangeDelta,
      });
      drawIntonationChart(intonationPoints);
      return;
    }
    const targetIndex = intonationSelectedIndex ?? 0;
    const adjustment = event.key === 'ArrowUp' ? step : -step;
    const newPitch = clampPitchToDisplayRange(intonationPoints[targetIndex].pitch + adjustment);
    applyPitchEdit(targetIndex, newPitch);
  }
}

function renderIntonationFavoritesList() {
  const listEl = intonationFavoritesListEl;
  if (!listEl) return;
  listEl.textContent = '';
  intonationFavorites.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'text-list__item';

    const playButton = document.createElement('button');
    playButton.type = 'button';
    playButton.className = 'text-list__text';

    const pill = document.createElement('span');
    pill.className = 'text-list__pill';
    pill.textContent = 'イントネーション付き';
    playButton.appendChild(pill);

    const textSpan = document.createElement('span');
    textSpan.textContent = item.text;
    playButton.appendChild(textSpan);

    playButton.addEventListener('click', () => applyIntonationFavorite(item));

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'text-list__action text-list__action--remove';
    removeButton.textContent = '－';
    removeButton.setAttribute('aria-label', 'イントネーション付きお気に入りから削除する');
    removeButton.addEventListener('click', () => removeIntonationFavorite(index));

    listItem.appendChild(playButton);
    listItem.appendChild(removeButton);
    listEl.appendChild(listItem);
  });
}

function removeIntonationFavorite(index: number) {
  if (index < 0 || index >= intonationFavorites.length) return;
  intonationFavorites = [...intonationFavorites.slice(0, index), ...intonationFavorites.slice(index + 1)];
  persistIntonationFavorites();
  renderIntonationFavoritesList();
}

export function applyIntonationFavorite(item: IntonationFavorite) {
  if (!isValidAudioQueryShape(item.query)) {
    showStatus('保存したイントネーションデータが破損しています。削除しました。', 'error');
    const idx = intonationFavorites.findIndex(
      (fav) => fav.text === item.text && fav.styleId === item.styleId
    );
    if (idx !== -1) {
      removeIntonationFavorite(idx);
    }
    return;
  }
  const textArea = document.getElementById('text') as HTMLTextAreaElement | null;
  const styleSelect = document.getElementById('styleSelect') as HTMLSelectElement | null;
  if (textArea) {
    textArea.value = item.text;
  }
  if (styleSelect) {
    styleSelect.value = String(item.styleId);
  }
  onStyleChange?.(item.styleId);
  currentIntonationStyleId = item.styleId;
  intonationInitialQuery = cloneAudioQuery(item.query);
  currentIntonationQuery = cloneAudioQuery(item.query);
  intonationPoints = buildIntonationPointsFromQuery(currentIntonationQuery);
  intonationTopScale = 1;
  intonationBottomScale = 1;
  intonationSelectedIndex = intonationPoints.length > 0 ? 0 : null;
  intonationDirty = false;
  updateInitialRangeFromPoints(intonationPoints);
  drawIntonationChart(intonationPoints);
  void playUpdatedIntonation();
}

export function saveCurrentIntonationFavorite(selectedStyleId: number) {
  const textArea = document.getElementById('text') as HTMLTextAreaElement | null;
  if (!textArea) return;
  const text = textArea.value.trim();
  if (!text) {
    showStatus('テキストを入力してください', 'error');
    return;
  }
  if (!currentIntonationQuery) {
    showStatus('イントネーション取得後に登録してください', 'error');
    return;
  }
  const entry: IntonationFavorite = {
    text,
    styleId: selectedStyleId,
    query: cloneAudioQuery(currentIntonationQuery),
  };
  intonationFavorites = dedupeIntonationFavorites([entry, ...intonationFavorites]);
  persistIntonationFavorites();
  renderIntonationFavoritesList();
  showStatus('イントネーション付きのお気に入りを保存しました', 'success');
  scheduleHideStatus(2000);
}

export function refreshIntonationChart() {
  refreshDisplayRange();
  drawIntonationChart(intonationPoints);
}
