import { MONOKAI_COLORS } from './config';
import { getColorVariable } from './status';
import { intonationState as state, RangeExtra } from './intonationState';
import type { AudioQuery, IntonationPoint } from './config';

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

export function getBaseDisplayRange(): { min: number; max: number } | null {
  if (!state.intonationInitialPitchRange) return null;
  const span = Math.max(state.intonationInitialPitchRange.max - state.intonationInitialPitchRange.min, 0);
  const basePadding = calculateBasePadding(span);
  const topPadding = basePadding * state.intonationTopScale;
  const bottomPadding = basePadding * state.intonationBottomScale;
  return {
    min: state.intonationInitialPitchRange.min - bottomPadding,
    max: state.intonationInitialPitchRange.max + topPadding,
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

export function applyRangeExtra(desiredExtra: RangeExtra) {
  const baseRange = getBaseDisplayRange();
  if (!baseRange) return;
  const dataRange = getPitchRange(state.intonationPoints);
  state.intonationRangeExtra = clampRangeExtra(desiredExtra, baseRange, dataRange);
  const range = calculateDisplayRange(state.intonationRangeExtra);
  if (range) {
    state.intonationDisplayRange = range;
    if (state.intonationChartRange) {
      state.intonationChartRange.min = range.min;
      state.intonationChartRange.max = range.max;
    }
  }
}

export function refreshDisplayRange() {
  applyRangeExtra(state.intonationRangeExtra);
}

export function clampPitchToDisplayRange(pitch: number) {
  if (!state.intonationDisplayRange) return pitch;
  return Math.min(Math.max(pitch, state.intonationDisplayRange.min), state.intonationDisplayRange.max);
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
  if (state.intonationDragIndex !== null) {
    event.preventDefault();
  }
}

export function ensureWheelHandler() {
  if (!state.wheelHandlerAttached) {
    window.addEventListener('wheel', handleIntonationWheel, { passive: false });
    state.wheelHandlerAttached = true;
  }
}

export function updateInitialRangeFromPoints(points: IntonationPoint[]) {
  const range = getPitchRange(points);
  state.intonationInitialPitchRange = range;
  state.intonationStepSize = calculateStepSize(range);
  state.intonationRangeExtra = { top: 0, bottom: 0 };
  refreshDisplayRange();
}

export function initializeIntonationCanvas() {
  if (!state.intonationCanvas) return;
  const ctx = state.intonationCanvas.getContext('2d');
  if (!ctx) return;

  const rect = state.intonationCanvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = Math.max(1, Math.floor(rect.width));
  const displayHeight = Math.max(1, Math.floor(rect.height));
  const width = Math.max(1, Math.floor(displayWidth * dpr));
  const height = Math.max(1, Math.floor(displayHeight * dpr));

  if (state.intonationCanvas.width !== width || state.intonationCanvas.height !== height) {
    state.intonationCanvas.width = width;
    state.intonationCanvas.height = height;
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  const margin = 32;
  const innerHeight = Math.max(1, displayHeight - margin * 2);
  state.intonationChartRange = {
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
  if (!state.intonationLabelsEl) return;
  state.intonationLabelsEl.textContent = '';
  const width = state.intonationChartRange?.width ?? 1;
  state.intonationLabelsEl.style.width = `${width}px`;
  state.intonationLabelsEl.style.marginLeft = 'auto';
  points.forEach((point, index) => {
    const pos = state.intonationPointPositions[index];
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
    state.intonationLabelsEl?.appendChild(span);
  });
}

export function drawIntonationChart(points: IntonationPoint[]) {
  if (!state.intonationCanvas || !state.intonationChartRange) return;
  const ctx = state.intonationCanvas.getContext('2d');
  if (!ctx) return;

  const { width, height, margin, innerHeight } = state.intonationChartRange;
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

  if (!state.intonationInitialPitchRange) {
    updateInitialRangeFromPoints(points);
  }
  if (!state.intonationDisplayRange) {
    refreshDisplayRange();
  }
  const rangeMin = state.intonationDisplayRange?.min ?? 0;
  const rangeMax = state.intonationDisplayRange?.max ?? 10;
  const rangeSpan = Math.max(rangeMax - rangeMin, 0.0001);

  if (state.intonationChartRange) {
    state.intonationChartRange.min = rangeMin;
    state.intonationChartRange.max = rangeMax;
  }
  if (state.intonationMaxValueEl) state.intonationMaxValueEl.textContent = `${rangeMax.toFixed(1)}`;
  if (state.intonationMinValueEl) state.intonationMinValueEl.textContent = `${rangeMin.toFixed(1)}`;

  ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
  ctx.fillRect(0, 0, width, height);

  const pointSpacing = Math.max(1, (width - margin * 2) / Math.max(points.length - 1, 1));
  state.intonationPointPositions = points.map((point, index) => {
    const x = margin + index * pointSpacing;
    const normalized = (clampPitchToDisplayRange(point.pitch) - rangeMin) / rangeSpan;
    const y = height - margin - normalized * innerHeight;
    return { x, y };
  });

  ctx.save();
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.25;
  state.intonationPointPositions.forEach((pos, index) => {
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
  state.intonationPointPositions.forEach((pos, index) => {
    if (index === 0) {
      ctx.moveTo(pos.x, pos.y);
    } else {
      ctx.lineTo(pos.x, pos.y);
    }
  });
  ctx.stroke();

  state.intonationPointPositions.forEach((pos, index) => {
    const color = MONOKAI_COLORS[index % MONOKAI_COLORS.length];
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
    ctx.fill();

    if (state.intonationSelectedIndex === index) {
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
    state.intonationTopScale = Math.max(0.05, state.intonationTopScale * factor);
  } else {
    state.intonationBottomScale = Math.max(0.05, state.intonationBottomScale * factor);
  }
  refreshDisplayRange();
  drawIntonationChart(state.intonationPoints);
}

export function pitchFromY(y: number) {
  if (!state.intonationChartRange) return 0;
  const { min, max, margin, innerHeight } = state.intonationChartRange;
  const clampedY = Math.max(margin, Math.min(margin + innerHeight, y));
  const normalized = 1 - (clampedY - margin) / innerHeight;
  return min + normalized * (max - min);
}

export function findNearestIntonationPoint(x: number) {
  if (!state.intonationPointPositions.length) return -1;
  let closestIndex = 0;
  let closestDistance = Infinity;
  state.intonationPointPositions.forEach((pos, index) => {
    const distance = Math.abs(pos.x - x);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });
  return closestIndex;
}
