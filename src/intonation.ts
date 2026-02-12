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

let intonationCanvas: HTMLCanvasElement | null = null;
let intonationTimingEl: HTMLElement | null = null;
let intonationLabelsEl: HTMLElement | null = null;
let intonationMaxValueEl: HTMLElement | null = null;
let intonationMinValueEl: HTMLElement | null = null;
let intonationFavoritesListEl: HTMLUListElement | null = null;
let loopCheckboxEl: HTMLInputElement | null = null;
let intonationPoints: IntonationPoint[] = [];
let intonationPointPositions: Array<{ x: number; y: number }> = [];
let intonationSelectedIndex: number | null = null;
let intonationDebounceTimer: number | null = null;
let intonationDragIndex: number | null = null;
let intonationActivePointerId: number | null = null;
let intonationChartRange: IntonationChartRange | null = null;
let intonationTopScale = 1;
let intonationBottomScale = 1;
let intonationKeyboardEnabled = false;
let currentIntonationStyleId = ZUNDAMON_SPEAKER_ID;
let currentIntonationQuery: AudioQuery | null = null;
let intonationDirty = false;
let intonationFavorites: IntonationFavorite[] = [];
let onStyleChange: ((styleId: number) => void) | null = null;

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

export function resetIntonationState() {
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
  points.forEach((point, index) => {
    const pos = intonationPointPositions[index];
    const span = document.createElement('span');
    span.classList.add('intonation-label');
    if (point.label && point.label.length === 1) {
      span.classList.add('intonation-label__key');
    }
    if (pos) {
      const clamped = Math.min(1, Math.max(0, pos.x / Math.max(width, 1)));
      span.style.left = `${clamped * 100}%`;
    }
    span.textContent = point.label;
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

  let min = points[0].pitch;
  let max = points[0].pitch;
  for (let i = 1; i < points.length; i += 1) {
    const pitch = points[i].pitch;
    if (pitch < min) min = pitch;
    if (pitch > max) max = pitch;
  }

  const topPadding = Math.max(1, (max - min) * (intonationTopScale - 1));
  const bottomPadding = Math.max(1, (max - min) * (intonationBottomScale - 1));
  const rangeMin = Math.floor(min - bottomPadding);
  const rangeMax = Math.ceil(max + topPadding);
  const rangeSpan = Math.max(rangeMax - rangeMin, 1);

  if (intonationChartRange) {
    intonationChartRange.min = rangeMin;
    intonationChartRange.max = rangeMax;
  }
  if (intonationMaxValueEl) intonationMaxValueEl.textContent = `${Math.round(rangeMax)}`;
  if (intonationMinValueEl) intonationMinValueEl.textContent = `${Math.round(rangeMin)}`;

  ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = getColorVariable('--canvas-grid', '#e0e0e0');
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= 5; i += 1) {
    const y = margin + (innerHeight * i) / 5;
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  const pointSpacing = Math.max(1, (width - margin * 2) / Math.max(points.length - 1, 1));
  intonationPointPositions = points.map((point, index) => {
    const x = margin + index * pointSpacing;
    const normalized = (point.pitch - rangeMin) / rangeSpan;
    const y = height - margin - normalized * innerHeight;
    return { x, y };
  });

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
    intonationTopScale = Math.max(1, intonationTopScale * factor);
  } else {
    intonationBottomScale = Math.max(1, intonationBottomScale * factor);
  }
  drawIntonationChart(intonationPoints);
}

function pitchFromY(y: number) {
  if (!intonationChartRange) return 0;
  const { min, max, margin, innerHeight } = intonationChartRange;
  const clampedY = Math.max(margin, Math.min(margin + innerHeight, y));
  const normalized = 1 - (clampedY - margin) / innerHeight;
  return min + normalized * (max - min);
}

function findNearestIntonationPoint(x: number, y: number) {
  if (!intonationPointPositions.length) return -1;
  let closestIndex = 0;
  let closestDistance = Infinity;
  intonationPointPositions.forEach((pos, index) => {
    const dx = pos.x - x;
    const dy = pos.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
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
    currentIntonationQuery = query;
    currentIntonationStyleId = styleId;
    intonationPoints = buildIntonationPointsFromQuery(query);
    intonationTopScale = 1;
    intonationBottomScale = 1;
    intonationSelectedIndex = intonationPoints.length > 0 ? 0 : null;
    drawIntonationChart(intonationPoints);
    intonationDirty = false;
    updateIntonationTiming(`イントネーション取得: ${Math.round(elapsed)} ms`);
  } catch (error) {
    console.error('Failed to fetch intonation:', error);
    updateIntonationTiming('イントネーションの取得に失敗しました');
    showStatus('イントネーションの取得に失敗しました', 'error');
  }
}

export function handleIntonationPointerDown(event: MouseEvent | PointerEvent) {
  if ('button' in event && event.button !== 0) return;
  if (!intonationCanvas || intonationPointPositions.length === 0) return;
  const rect = intonationCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const targetIndex = findNearestIntonationPoint(x, y);
  if (targetIndex !== -1) {
    intonationDragIndex = targetIndex;
    intonationSelectedIndex = targetIndex;
    disableLoopOnIntonationEdit();
    intonationCanvas.focus();
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
  if ('pointerId' in event && intonationActivePointerId !== null && event.pointerId !== intonationActivePointerId) {
    return;
  }
  const rect = intonationCanvas.getBoundingClientRect();
  const y = event.clientY - rect.top;
  const newPitch = pitchFromY(y);
  intonationPoints[intonationDragIndex].pitch = newPitch;
  intonationSelectedIndex = intonationDragIndex;
  applyPitchToQuery(intonationDragIndex, newPitch);
  disableLoopOnIntonationEdit();
  intonationDirty = true;
  drawIntonationChart(intonationPoints);
  scheduleIntonationPlayback();
}

export function handleIntonationPointerUp() {
  if (intonationDragIndex !== null) {
    intonationDragIndex = null;
  }
  if (intonationActivePointerId !== null && intonationCanvas) {
    intonationCanvas.releasePointerCapture(intonationActivePointerId);
    intonationActivePointerId = null;
  }
}

export function handleIntonationKeyDown(event: KeyboardEvent) {
  if (!intonationCanvas || intonationPointPositions.length === 0 || !intonationKeyboardEnabled) {
    return;
  }
  if (event.key === 'Enter') {
    event.preventDefault();
    if (intonationSelectedIndex === null) {
      intonationSelectedIndex = 0;
      drawIntonationChart(intonationPoints);
      return;
    }
    const targetIndex = intonationSelectedIndex;
    const target = intonationPointPositions[targetIndex];
    const rect = intonationCanvas.getBoundingClientRect();
    const x = target.x + rect.left;
    const y = target.y + rect.top;
    const syntheticEvent = new PointerEvent('pointerdown', {
      clientX: x,
      clientY: y,
      pointerId: 1,
      bubbles: true,
      cancelable: true,
    });
    intonationCanvas.dispatchEvent(syntheticEvent);
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
  if (event.key === ' ' && intonationSelectedIndex !== null) {
    const targetIndex = intonationSelectedIndex;
    const target = intonationPointPositions[targetIndex];
    if (target) {
      const rect = intonationCanvas.getBoundingClientRect();
      const x = target.x + rect.left;
      const y = target.y + rect.top;
      const syntheticEvent = new PointerEvent('pointerdown', {
        clientX: x,
        clientY: y,
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      });
      intonationCanvas.dispatchEvent(syntheticEvent);
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
    const range = intonationChartRange ? intonationChartRange.max - intonationChartRange.min : 0;
    const delta = Math.max(range * 0.02, 1);
    const targetIndex = intonationSelectedIndex ?? 0;
    const adjustment = event.key === 'ArrowUp' ? delta : -delta;
    const newPitch = intonationPoints[targetIndex].pitch + adjustment;
    intonationPoints[targetIndex].pitch = newPitch;
    applyPitchToQuery(targetIndex, newPitch);
    disableLoopOnIntonationEdit();
    intonationDirty = true;
    drawIntonationChart(intonationPoints);
    scheduleIntonationPlayback();
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
  currentIntonationQuery = cloneAudioQuery(item.query);
  intonationPoints = buildIntonationPointsFromQuery(currentIntonationQuery);
  intonationTopScale = 1;
  intonationBottomScale = 1;
  intonationSelectedIndex = intonationPoints.length > 0 ? 0 : null;
  intonationDirty = false;
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
  drawIntonationChart(intonationPoints);
}
