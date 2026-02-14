import { INTONATION_FAVORITES_STORAGE_KEY, IntonationFavorite, TEXT_LIST_LIMIT } from './config';
import { showStatus, scheduleHideStatus } from './status';
import { intonationState, updateIntonationTiming } from './intonationState';
import { cloneAudioQuery, isValidAudioQueryShape } from './intonationUtils';
import {
  adjustIntonationScale,
  buildIntonationPointsFromQuery,
  calculateLetterKeyAdjustment,
  calculateStepSize,
  applyRangeExtra,
  clampPitchToDisplayRange,
  clampRangeExtra,
  drawIntonationChart,
  ensureWheelHandler,
  findNearestIntonationPoint,
  getBaseDisplayRange,
  initializeIntonationCanvas,
  pitchFromY,
  refreshDisplayRange,
  updateInitialRangeFromPoints,
} from './intonationDisplay';
import {
  fetchAndRenderIntonation,
  playUpdatedIntonation,
  replayCachedIntonationAudio,
  resetIntonationToInitial,
  scheduleIntonationPlayback,
} from './intonationPlayback';

export type { RangeExtra } from './intonationState';
export {
  adjustIntonationScale,
  buildIntonationPointsFromQuery,
  calculateLetterKeyAdjustment,
  calculateStepSize,
  applyRangeExtra,
  clampPitchToDisplayRange,
  clampRangeExtra,
  drawIntonationChart,
  getBaseDisplayRange,
  initializeIntonationCanvas,
  refreshDisplayRange,
} from './intonationDisplay';
export {
  fetchAndRenderIntonation,
  playUpdatedIntonation,
  replayCachedIntonationAudio,
  resetIntonationToInitial,
  scheduleIntonationPlayback,
} from './intonationPlayback';

const state = intonationState;

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
    localStorage.setItem(INTONATION_FAVORITES_STORAGE_KEY, JSON.stringify(state.intonationFavorites));
  } catch (error) {
    console.warn('Failed to save intonation favorites:', error);
  }
}

function disableLoopOnIntonationEdit() {
  if (state.loopCheckboxEl && state.loopCheckboxEl.checked) {
    state.loopCheckboxEl.checked = false;
  }
}

export function resetIntonationState() {
  state.intonationInitialQuery = null;
  state.intonationInitialPitchRange = null;
  state.intonationDisplayRange = null;
  state.intonationRangeExtra = { top: 0, bottom: 0 };
  state.intonationStepSize = 1;
  state.currentIntonationQuery = null;
  state.intonationPoints = [];
  state.intonationPointPositions = [];
  state.intonationSelectedIndex = null;
  state.intonationTopScale = 1;
  state.intonationBottomScale = 1;
  state.intonationDirty = false;
  if (state.intonationCanvas) {
    const ctx = state.intonationCanvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, state.intonationCanvas.width, state.intonationCanvas.height);
    }
  }
  if (state.intonationLabelsEl) {
    state.intonationLabelsEl.textContent = '';
  }
  updateIntonationTiming('イントネーション未取得');
}

export function setStyleChangeHandler(handler: (styleId: number) => void) {
  state.onStyleChange = handler;
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
  state.intonationCanvas = options.canvas;
  state.intonationTimingEl = options.timingEl;
  state.intonationLabelsEl = options.labelsEl;
  state.intonationMaxValueEl = options.maxValueEl;
  state.intonationMinValueEl = options.minValueEl;
  state.intonationFavoritesListEl = options.favoritesListEl;
  state.loopCheckboxEl = options.loopCheckbox;
  state.intonationFavorites = loadIntonationFavorites();
  persistIntonationFavorites();
  renderIntonationFavoritesList();
  ensureWheelHandler();
}

export function isIntonationDirty() {
  return state.intonationDirty;
}

export function setIntonationKeyboardEnabled(enabled: boolean) {
  state.intonationKeyboardEnabled = enabled;
}

export function getIntonationKeyboardEnabled() {
  return state.intonationKeyboardEnabled;
}

function applyPitchToQuery(pointIndex: number, pitch: number) {
  if (!state.currentIntonationQuery) return;
  if (pointIndex < 0 || pointIndex >= state.intonationPoints.length) return;
  const target = state.intonationPoints[pointIndex];
  const phrase = state.currentIntonationQuery.accent_phrases[target.phraseIndex];
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
  if (pointIndex < 0 || pointIndex >= state.intonationPoints.length) return;
  const redraw = options.redraw !== false;
  const schedulePlayback = options.schedulePlayback !== false;
  state.intonationPoints[pointIndex].pitch = pitch;
  applyPitchToQuery(pointIndex, pitch);
  disableLoopOnIntonationEdit();
  state.intonationDirty = true;
  if (redraw) {
    drawIntonationChart(state.intonationPoints);
  }
  if (schedulePlayback) {
    scheduleIntonationPlayback(playUpdatedIntonation);
  }
}


export function handleIntonationPointerDown(event: MouseEvent | PointerEvent) {
  if (event.button !== 0) return;
  if (!state.intonationCanvas || state.intonationPointPositions.length === 0) return;
  const rect = state.intonationCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const targetIndex = findNearestIntonationPoint(x);
  if (targetIndex !== -1) {
    state.intonationDragIndex = targetIndex;
    state.intonationSelectedIndex = targetIndex;
    disableLoopOnIntonationEdit();
    state.intonationCanvas.focus();
    if (!state.scrollLocked) {
      state.previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      state.scrollLocked = true;
    }
    if ('pointerId' in event) {
      state.intonationActivePointerId = event.pointerId;
      state.intonationCanvas.setPointerCapture(event.pointerId);
    }
    handleIntonationPointerMove(event);
    event.preventDefault();
  }
}

export function handleIntonationPointerMove(event: MouseEvent | PointerEvent) {
  if (state.intonationDragIndex === null || !state.intonationCanvas || state.intonationPointPositions.length === 0) {
    return;
  }
  event.preventDefault();
  if ('pointerId' in event && state.intonationActivePointerId !== null && event.pointerId !== state.intonationActivePointerId) {
    return;
  }
  const rect = state.intonationCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const targetIndex = findNearestIntonationPoint(x);
  if (targetIndex === -1) return;
  state.intonationDragIndex = targetIndex;
  const y = event.clientY - rect.top;
  refreshDisplayRange();
  const newPitch = clampPitchToDisplayRange(pitchFromY(y));
  state.intonationSelectedIndex = targetIndex;
  applyPitchEdit(targetIndex, newPitch, { schedulePlayback: false });
  state.intonationPlaybackPending = true;
}

export function handleIntonationPointerUp() {
  if (state.intonationDragIndex !== null) {
    state.intonationDragIndex = null;
  }
  if (state.scrollLocked) {
    document.body.style.overflow = state.previousBodyOverflow ?? '';
    state.scrollLocked = false;
    state.previousBodyOverflow = null;
  }
  if (state.intonationActivePointerId !== null && state.intonationCanvas) {
    state.intonationCanvas.releasePointerCapture(state.intonationActivePointerId);
    state.intonationActivePointerId = null;
  }
  if (state.intonationPlaybackPending) {
    state.intonationPlaybackPending = false;
    scheduleIntonationPlayback(playUpdatedIntonation);
  }
}

export function handleIntonationKeyDown(event: KeyboardEvent) {
  if (!state.intonationCanvas || state.intonationPointPositions.length === 0 || !state.intonationKeyboardEnabled) {
    return;
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    void replayCachedIntonationAudio();
    return;
  }
  if (event.key === 'Escape' || event.key === 'Esc') {
    event.preventDefault();
    state.intonationSelectedIndex = null;
    drawIntonationChart(state.intonationPoints);
    return;
  }
  if (event.key === 'Tab') {
    if (state.intonationSelectedIndex !== null) {
      state.intonationSelectedIndex = null;
      drawIntonationChart(state.intonationPoints);
    }
    return;
  }
  const letterIndex =
    event.key.length === 1 ? event.key.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) : -1;
  if (letterIndex >= 0 && letterIndex < 26) {
    const targetIndex = state.intonationPoints.findIndex((_, idx) => idx % 26 === letterIndex);
    if (targetIndex !== -1) {
      state.intonationSelectedIndex = targetIndex;
      if (!state.intonationInitialPitchRange) {
        updateInitialRangeFromPoints(state.intonationPoints);
      }
      const baseRange = getBaseDisplayRange();
      if (baseRange) {
        const isUpperCase =
          event.key.length === 1 && event.key === event.key.toUpperCase() && event.key !== event.key.toLowerCase();
        const { pitch, rangeExtra } = calculateLetterKeyAdjustment({
          currentPitch: state.intonationPoints[targetIndex].pitch,
          baseRange,
          rangeExtra: state.intonationRangeExtra,
          stepSize: state.intonationStepSize,
          direction: isUpperCase ? 'down' : 'up',
          ctrlModifier: event.ctrlKey,
        });
        applyRangeExtra(rangeExtra);
        const newPitch = clampPitchToDisplayRange(pitch);
        applyPitchEdit(targetIndex, newPitch);
      } else {
        drawIntonationChart(state.intonationPoints);
      }
      event.preventDefault();
    }
    return;
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    state.intonationSelectedIndex = Math.max(0, (state.intonationSelectedIndex ?? 0) - 1);
    drawIntonationChart(state.intonationPoints);
    return;
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    state.intonationSelectedIndex = Math.min(state.intonationPoints.length - 1, (state.intonationSelectedIndex ?? 0) + 1);
    drawIntonationChart(state.intonationPoints);
    return;
  }
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
    if (state.intonationSelectedIndex === null) {
      state.intonationSelectedIndex = 0;
    }
    if (!state.intonationInitialPitchRange) {
      updateInitialRangeFromPoints(state.intonationPoints);
    }
    refreshDisplayRange();
    const step = state.intonationStepSize * (event.shiftKey && !event.ctrlKey ? 0.5 : 1);
    if (event.ctrlKey) {
      const rangeDelta = event.key === 'ArrowUp' ? step : -step;
      applyRangeExtra({
        top: state.intonationRangeExtra.top + rangeDelta,
        bottom: state.intonationRangeExtra.bottom + rangeDelta,
      });
      drawIntonationChart(state.intonationPoints);
      return;
    }
    const targetIndex = state.intonationSelectedIndex ?? 0;
    const adjustment = event.key === 'ArrowUp' ? step : -step;
    const newPitch = clampPitchToDisplayRange(state.intonationPoints[targetIndex].pitch + adjustment);
    applyPitchEdit(targetIndex, newPitch);
  }
}

function renderIntonationFavoritesList() {
  const listEl = state.intonationFavoritesListEl;
  if (!listEl) return;
  listEl.textContent = '';
  state.intonationFavorites.forEach((item, index) => {
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
  if (index < 0 || index >= state.intonationFavorites.length) return;
  state.intonationFavorites = [...state.intonationFavorites.slice(0, index), ...state.intonationFavorites.slice(index + 1)];
  persistIntonationFavorites();
  renderIntonationFavoritesList();
}

export function applyIntonationFavorite(item: IntonationFavorite) {
  if (!isValidAudioQueryShape(item.query)) {
    showStatus('保存したイントネーションデータが破損しています。削除しました。', 'error');
    const idx = state.intonationFavorites.findIndex(
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
  state.onStyleChange?.(item.styleId);
  state.currentIntonationStyleId = item.styleId;
  state.intonationInitialQuery = cloneAudioQuery(item.query);
  state.currentIntonationQuery = cloneAudioQuery(item.query);
  state.intonationPoints = buildIntonationPointsFromQuery(state.currentIntonationQuery);
  state.intonationTopScale = 1;
  state.intonationBottomScale = 1;
  state.intonationSelectedIndex = state.intonationPoints.length > 0 ? 0 : null;
  state.intonationDirty = false;
  updateInitialRangeFromPoints(state.intonationPoints);
  drawIntonationChart(state.intonationPoints);
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
  if (!state.currentIntonationQuery) {
    showStatus('イントネーション取得後に登録してください', 'error');
    return;
  }
  const entry: IntonationFavorite = {
    text,
    styleId: selectedStyleId,
    query: cloneAudioQuery(state.currentIntonationQuery),
  };
  state.intonationFavorites = dedupeIntonationFavorites([entry, ...state.intonationFavorites]);
  persistIntonationFavorites();
  renderIntonationFavoritesList();
  showStatus('イントネーション付きのお気に入りを保存しました', 'success');
  scheduleHideStatus(2000);
}

export function refreshIntonationChart() {
  refreshDisplayRange();
  drawIntonationChart(state.intonationPoints);
}
