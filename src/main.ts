import * as Tone from 'tone';

// VOICEVOX API settings
const VOICEVOX_API_BASE = 'http://localhost:50021';
const ZUNDAMON_SPEAKER_ID = 3; // ずんだもんのスピーカーID
const REQUEST_TIMEOUT_MS = 10000; // 10 second timeout
const AUTO_PLAY_DEBOUNCE_MS = 700;
const WAVEFORM_TARGET_RATIO = 0.8;
const SPECTROGRAM_MAX_COLUMNS_PER_FRAME = 12;
const AUDIO_CACHE_LIMIT = 10;
const INTONATION_DEBOUNCE_MS = 700;
const MIN_LOG_FREQUENCY = 20;
const MIN_TICK_SPACING_PX = 60;
type FrequencyScale = 'linear' | 'log';

// VOICEVOX API types (minimal interface based on API documentation)
interface AudioQuery {
  accent_phrases: Array<{
    moras: Array<{
      text: string;
      vowel: string;
      vowel_length: number;
      pitch: number;
    }>;
    accent: number;
    pause_mora?: {
      text: string;
      vowel: string;
      vowel_length: number;
      pitch: number;
    };
  }>;
  speedScale: number;
  pitchScale: number;
  intonationScale: number;
  volumeScale: number;
  prePhonemeLength: number;
  postPhonemeLength: number;
  outputSamplingRate: number;
  outputStereo: boolean;
  kana?: string;
}

interface IntonationPoint {
  phraseIndex: number;
  moraIndex: number;
  label: string;
  pitch: number;
}

interface IntonationChartRange {
  min: number;
  max: number;
  margin: number;
  height: number;
  innerHeight: number;
  width: number;
}

// Status display helper
function showStatus(message: string, type: 'info' | 'error' | 'success') {
  const statusDiv = document.getElementById('status');
  if (statusDiv) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    // Use assertive for errors so screen readers interrupt to announce them
    statusDiv.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
  }
}

function hideStatus() {
  const statusDiv = document.getElementById('status');
  if (statusDiv) {
    statusDiv.style.display = 'none';
  }
}

let cachedRootComputedStyle: CSSStyleDeclaration | null = null;
const colorVariableCache: Record<string, string> = {};
let isProcessing = false;
let autoPlayTimer: number | null = null;
let lastSynthesizedBuffer: ArrayBuffer | null = null;
const audioCache = new Map<string, ArrayBuffer>();
let intonationCanvas: HTMLCanvasElement | null = null;
let intonationTimingEl: HTMLElement | null = null;
let spectrogramScale: FrequencyScale = 'linear';
let spectrogramNeedsReset = false;
let lastSpectrogramScale: FrequencyScale = 'linear';
let currentIntonationQuery: AudioQuery | null = null;
let intonationPoints: IntonationPoint[] = [];
let intonationPointPositions: Array<{ x: number; y: number }> = [];
let intonationSelectedIndex: number | null = null;
let intonationDebounceTimer: number | null = null;
let intonationDragIndex: number | null = null;
let intonationActivePointerId: number | null = null;
let intonationChartRange: IntonationChartRange | null = null;

function invalidateColorVariableCache() {
  cachedRootComputedStyle = null;
  Object.keys(colorVariableCache).forEach((key) => delete colorVariableCache[key]);
}

function getColorVariable(name: string, fallback: string) {
  if (!cachedRootComputedStyle) {
    cachedRootComputedStyle = getComputedStyle(document.documentElement);
  }

  const cached = colorVariableCache[name];
  if (cached !== undefined && cached !== '') {
    return cached;
  }

  const value = cachedRootComputedStyle.getPropertyValue(name).trim() || fallback;
  colorVariableCache[name] = value;
  return value;
}

function prepareCanvas(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = Math.max(1, Math.floor(rect.width));
  const displayHeight = Math.max(1, Math.floor(rect.height));
  const width = Math.max(1, Math.floor(displayWidth * dpr));
  const height = Math.max(1, Math.floor(displayHeight * dpr));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  return { ctx, width: displayWidth, height: displayHeight, dpr };
}

function fftRadix2(real: Float32Array, imag: Float32Array) {
  const n = real.length;
  if (n <= 1) return;

  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) {
      j ^= bit;
    }
    j ^= bit;
    if (i < j) {
      const tempReal = real[i];
      real[i] = real[j];
      real[j] = tempReal;
      const tempImag = imag[i];
      imag[i] = imag[j];
      imag[j] = tempImag;
    }
  }

  for (let len = 2; len <= n; len <<= 1) {
    const angle = (-2 * Math.PI) / len;
    const wlenReal = Math.cos(angle);
    const wlenImag = Math.sin(angle);
    for (let i = 0; i < n; i += len) {
      let wReal = 1;
      let wImag = 0;
      for (let j = 0; j < len / 2; j++) {
        const uReal = real[i + j];
        const uImag = imag[i + j];
        const vReal = real[i + j + len / 2] * wReal - imag[i + j + len / 2] * wImag;
        const vImag = real[i + j + len / 2] * wImag + imag[i + j + len / 2] * wReal;
        real[i + j] = uReal + vReal;
        imag[i + j] = uImag + vImag;
        real[i + j + len / 2] = uReal - vReal;
        imag[i + j + len / 2] = uImag - vImag;

        const nextWReal = wReal * wlenReal - wImag * wlenImag;
        wImag = wReal * wlenImag + wImag * wlenReal;
        wReal = nextWReal;
      }
    }
  }
}

const hannWindowCache = new Map<number, Float32Array>();
function getHannWindow(size: number) {
  const cached = hannWindowCache.get(size);
  if (cached) {
    return cached;
  }
  const window = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (size - 1)));
  }
  hannWindowCache.set(size, window);
  return window;
}

function estimateFrequencySeries(
  channelData: Float32Array,
  sampleRate: number,
  maxPoints: number
): Array<{ time: number; freq: number }> {
  const windowSize = 2048;
  const targetPoints = Math.max(1, Math.min(maxPoints, Math.floor(channelData.length / windowSize)));
  const hopSize = Math.max(
    windowSize / 2,
    Math.floor((channelData.length - windowSize) / Math.max(targetPoints - 1, 1))
  );
  if (channelData.length < windowSize || sampleRate <= 0) {
    return [];
  }

  const window = getHannWindow(windowSize);
  const real = new Float32Array(windowSize);
  const imag = new Float32Array(windowSize);
  const result: Array<{ time: number; freq: number }> = [];

  for (let offset = 0; offset + windowSize <= channelData.length; offset += hopSize) {
    for (let i = 0; i < windowSize; i++) {
      real[i] = channelData[offset + i] * window[i];
      imag[i] = 0;
    }
    fftRadix2(real, imag);

    let maxIndex = 1;
    let maxMagnitude = 0;
    for (let i = 1; i < windowSize / 2; i++) {
      const magnitude = real[i] * real[i] + imag[i] * imag[i];
      if (magnitude > maxMagnitude) {
        maxMagnitude = magnitude;
        maxIndex = i;
      }
    }

    const freq = maxMagnitude > 0 ? (maxIndex * sampleRate) / windowSize : 0;
    const time = (offset + windowSize * 0.5) / sampleRate;
    result.push({ time, freq });
  }

  return result;
}

function drawRenderedWaveform(buffer: AudioBuffer, canvas: HTMLCanvasElement) {
  const { ctx, width, height } = prepareCanvas(canvas);
  if (!ctx) return;
  const channelData = buffer.getChannelData(0);
  const maxAbs = channelData.reduce((max, value) => {
    const abs = Math.abs(value);
    return abs > max ? abs : max;
  }, 0);
  const leftMargin = 52;
  const rightMargin = 8;
  const topMargin = 8;
  const bottomMargin = 28;
  const innerWidth = Math.max(1, width - leftMargin - rightMargin);
  const innerHeight = Math.max(1, height - topMargin - bottomMargin);
  const centerY = topMargin + innerHeight / 2;
  const amplitudeScale =
    (innerHeight * 0.5 * WAVEFORM_TARGET_RATIO) / (maxAbs > 0 ? maxAbs : 1);
  const samplesPerPixel = Math.max(1, Math.floor(channelData.length / innerWidth));
  const durationMs = Math.max(buffer.duration * 1000, 1);
  const durationSec = Math.max(buffer.duration, 0.001);
  const labelColor = getColorVariable('--muted-text', '#6b7280');

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

  // dB ticks
  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.fillStyle = labelColor;
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const referenceAmplitude = Math.max(maxAbs, 1e-4);
  for (let db = 0; db >= -48; db -= 6) {
    const amplitude = referenceAmplitude * Math.pow(10, db / 20);
    const offset = amplitude * amplitudeScale;
    if (offset > innerHeight / 2) continue;
    const yUpper = centerY - offset;
    const yLower = centerY + offset;

    ctx.beginPath();
    ctx.moveTo(leftMargin, yUpper);
    ctx.lineTo(width - rightMargin, yUpper);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(leftMargin, yLower);
    ctx.lineTo(width - rightMargin, yLower);
    ctx.stroke();

    const label = `${db}dB`;
    ctx.fillText(label, leftMargin - 6, yUpper);
    if (db !== 0) {
      ctx.fillText(label, leftMargin - 6, yLower);
    }
  }

  // Center line
  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.beginPath();
  ctx.moveTo(leftMargin, centerY);
  ctx.lineTo(width - rightMargin, centerY);
  ctx.stroke();

  // Waveform
  ctx.strokeStyle = getColorVariable('--accent-color', '#4caf50');
  ctx.beginPath();
  for (let x = 0; x < innerWidth; x++) {
    const start = x * samplesPerPixel;
    if (start >= channelData.length) {
      break;
    }
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < samplesPerPixel && start + i < channelData.length; i++) {
      const v = channelData[start + i];
      if (v < min) min = v;
      if (v > max) max = v;
    }
    const y1 = centerY - max * amplitudeScale;
    const y2 = centerY - min * amplitudeScale;
    const drawX = leftMargin + x;
    ctx.moveTo(drawX, y1);
    ctx.lineTo(drawX, y2);
  }
  ctx.stroke();

  // Time ticks (dynamic spacing)
  ctx.strokeStyle = getColorVariable('--muted-text', '#6b7280');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const maxLabelCount = Math.max(1, Math.floor(innerWidth / MIN_TICK_SPACING_PX));
  const niceIntervalsSec = [0.1, 0.2, 0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800];
  let intervalSec = 0.5;
  for (const candidate of niceIntervalsSec) {
    if (durationSec / candidate <= maxLabelCount) {
      intervalSec = candidate;
      break;
    }
  }
  const intervalMs = intervalSec * 1000;
  const drawTick = (t: number) => {
    const ratio = Math.min(t / durationMs, 1);
    const x = leftMargin + ratio * innerWidth;
    ctx.beginPath();
    ctx.moveTo(x, height - bottomMargin);
    ctx.lineTo(x, height - bottomMargin + 6);
    ctx.stroke();
    const decimals = intervalSec < 1 ? 1 : 0;
    ctx.fillText(`${(t / 1000).toFixed(decimals)}s`, x, height - bottomMargin + 6);
  };
  for (let t = 0; t <= durationMs + 1e-6; t += intervalMs) {
    drawTick(t);
  }

  // Frequency estimation overlay
  const freqPoints = estimateFrequencySeries(channelData, buffer.sampleRate, innerWidth);
  if (freqPoints.length > 0) {
    const freqMax = Math.max(1, Math.min(buffer.sampleRate / 2, 6000));
    ctx.strokeStyle = getColorVariable('--status-info-text', '#1976d2');
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    freqPoints.forEach((point, index) => {
      const x = leftMargin + Math.min(point.time / durationSec, 1) * innerWidth;
      const clampedFreq = Math.max(0, Math.min(point.freq, freqMax));
      const y = topMargin + innerHeight - (clampedFreq / freqMax) * innerHeight;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    ctx.lineWidth = 1;
  }
}

function drawRealtimeWaveform(values: Float32Array, canvas: HTMLCanvasElement) {
  const { ctx, width, height } = prepareCanvas(canvas);
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  let maxAbs = 0;
  for (let i = 0; i < values.length; i++) {
    const v = Math.abs(values[i]);
    if (Number.isFinite(v) && v > maxAbs) {
      maxAbs = v;
    }
  }
  const amplitudeScale =
    (height * 0.5 * WAVEFORM_TARGET_RATIO) / (maxAbs > 0 ? maxAbs : 1);

  const step = values.length / width;
  ctx.strokeStyle = getColorVariable('--accent-color', '#4caf50');
  ctx.beginPath();
  for (let x = 0; x < width; x++) {
    const index = Math.floor(x * step);
    const v = Number.isFinite(values[index]) ? values[index] : 0;
    const y = height / 2 - v * amplitudeScale;
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

function determineSpectrogramCeiling(values: Float32Array, previousCeiling: number) {
  let maxMagnitude = -Infinity;
  for (let i = 0; i < values.length; i++) {
    const magnitude = Number.isFinite(values[i]) ? values[i] : -120;
    if (magnitude > maxMagnitude) {
      maxMagnitude = magnitude;
    }
  }
  const threshold = maxMagnitude - 40;
  let highestIndex = 1;
  for (let i = 0; i < values.length; i++) {
    const magnitude = Number.isFinite(values[i]) ? values[i] : -120;
    if (magnitude >= threshold) {
      highestIndex = i;
    }
  }
  const target = Math.min(values.length - 1, Math.max(highestIndex, 1));
  const smoothed = Number.isFinite(previousCeiling) && previousCeiling > 0
    ? Math.max(target, Math.floor(previousCeiling * 0.85))
    : target;
  return Math.min(values.length - 1, Math.max(smoothed, 1));
}

function drawSpectrogram(
  values: Float32Array,
  canvas: HTMLCanvasElement,
  progress: number,
  frequencyCeiling: number,
  lastX: number,
  sampleRate: number,
  scale: FrequencyScale,
  shouldReset: boolean
) {
  const { ctx, width, height } = prepareCanvas(canvas);
  if (!ctx || width === 0) return lastX;

  const accent = getColorVariable('--accent-color', '#4caf50');
  const background = getColorVariable('--bg-color', '#ffffff');
  const leftMargin = 56;
  const bottomMargin = 18;
  const drawableWidth = Math.max(1, width - leftMargin);
  const drawableHeight = Math.max(1, height - bottomMargin);
  const cappedCeiling = Math.max(1, Math.min(frequencyCeiling, Math.max(values.length - 1, 1)));
  const maxFreq = Math.max(1, sampleRate / 2);
  const minLogFreq = Math.min(MIN_LOG_FREQUENCY, maxFreq);
  const targetX = Math.max(0, Math.min(drawableWidth - 1, Math.floor(progress * (drawableWidth - 1))));
  const needsReset = shouldReset || targetX < lastX;

  if (needsReset) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
    lastX = -1;
  }

  const startX = Math.max(lastX + 1, 0);
  const cappedTargetX = Math.min(targetX, startX + SPECTROGRAM_MAX_COLUMNS_PER_FRAME - 1);
  if (needsReset) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, leftMargin, height);
    ctx.fillRect(leftMargin, drawableHeight, drawableWidth, bottomMargin);
  }

  const yToBin = (y: number) => {
    const denominator = Math.max(drawableHeight - 1, 1);
    const ratio = Math.min(Math.max(y / denominator, 0), 1);
    if (scale === 'log') {
      const freq = minLogFreq * Math.pow(maxFreq / Math.max(minLogFreq, 1), ratio);
      return Math.min(cappedCeiling, Math.max(0, Math.round((freq / maxFreq) * cappedCeiling)));
    }
    return Math.min(cappedCeiling, Math.floor(ratio * (cappedCeiling + 1)));
  };
  for (let drawX = startX; drawX <= cappedTargetX; drawX++) {
    ctx.fillStyle = background;
    ctx.globalAlpha = 1;
    const canvasX = leftMargin + drawX;
    ctx.fillRect(canvasX, 0, 1, drawableHeight);

    for (let y = 0; y < drawableHeight; y++) {
      const dataIndex = yToBin(y);
      const magnitude = Number.isFinite(values[dataIndex]) ? values[dataIndex] : -120;
      const normalized = Math.max(Math.min((magnitude + 120) / 120, 1), 0);
      ctx.fillStyle = accent;
      ctx.globalAlpha = normalized;
      ctx.fillRect(canvasX, drawableHeight - y - 1, 1, 1);
    }
  }
  ctx.globalAlpha = 1;

  if (needsReset) {
    const axisColor = getColorVariable('--border-color', '#e0e0e0');
    const labelColor = getColorVariable('--muted-text', '#6b7280');
    ctx.strokeStyle = axisColor;
    ctx.beginPath();
    ctx.moveTo(leftMargin, 0);
    ctx.lineTo(leftMargin, drawableHeight);
    ctx.lineTo(width, drawableHeight);
    ctx.stroke();

    ctx.strokeStyle = getColorVariable('--canvas-grid', 'rgba(0,0,0,0.06)');
    ctx.fillStyle = labelColor;
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const logMax = Math.log10(Math.max(maxFreq, minLogFreq));
    const logMin = Math.log10(Math.max(minLogFreq, 1));
    for (let freq = 0; freq <= maxFreq + 1; freq += 500) {
      const normalized = scale === 'log'
        ? (freq <= 0 ? 0 : (Math.log10(Math.max(freq, minLogFreq)) - logMin) / Math.max(logMax - logMin, 1))
        : freq / maxFreq;
      const y = drawableHeight - Math.min(normalized * drawableHeight, drawableHeight);
      ctx.beginPath();
      ctx.moveTo(leftMargin - 4, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      ctx.fillText(`${Math.round(freq)}Hz`, leftMargin - 6, y);
    }
  }

  return cappedTargetX;
}

function initializeVisualizationCanvases() {
  invalidateColorVariableCache();
  ['renderedWaveform', 'realtimeWaveform', 'spectrogram'].forEach((id) => {
    const canvas = document.getElementById(id) as HTMLCanvasElement | null;
    if (!canvas) return;

    const { ctx, width, height } = prepareCanvas(canvas);
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');

    if (id === 'spectrogram') {
      drawSpectrogram(
        new Float32Array([0, 0]),
        canvas,
        0,
        1,
        -1,
        Tone.getContext().sampleRate ?? 48000,
        spectrogramScale,
        true
      );
      spectrogramNeedsReset = false;
      lastSpectrogramScale = spectrogramScale;
    } else {
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    }
  });
}

function updateIntonationTiming(message: string) {
  if (intonationTimingEl) {
    intonationTimingEl.textContent = message;
  }
}

function initializeIntonationCanvas() {
  if (!intonationCanvas) return;
  const { ctx, width, height } = prepareCanvas(intonationCanvas);
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.strokeRect(0, 0, width, height);
}

function buildIntonationPointsFromQuery(query: AudioQuery) {
  const points: IntonationPoint[] = [];
  query.accent_phrases.forEach((phrase, phraseIndex) => {
    phrase.moras.forEach((mora, moraIndex) => {
      points.push({
        phraseIndex,
        moraIndex,
        label: mora.text,
        pitch: mora.pitch,
      });
    });
  });
  return points;
}

function drawIntonationChart(points: IntonationPoint[]) {
  if (!intonationCanvas) return;
  const { ctx, width, height } = prepareCanvas(intonationCanvas);
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
  ctx.fillRect(0, 0, width, height);

  if (points.length === 0) {
    ctx.fillStyle = getColorVariable('--muted-text', '#6b7280');
    ctx.font = '14px sans-serif';
    ctx.fillText('イントネーション未取得', 12, height / 2);
    intonationPointPositions = [];
    intonationChartRange = null;
    return;
  }

  if (intonationSelectedIndex === null) {
    intonationSelectedIndex = 0;
  } else if (intonationSelectedIndex >= points.length) {
    intonationSelectedIndex = points.length - 1;
  }

  const margin = 24;
  const rawMin = points.reduce((min, point) => Math.min(min, point.pitch), points[0].pitch);
  const rawMax = points.reduce((max, point) => Math.max(max, point.pitch), points[0].pitch);
  const padding = Math.max(5, (rawMax - rawMin) * 0.2);
  const minPitch = rawMin - padding;
  const maxPitch = rawMax + padding;
  const innerWidth = Math.max(1, width - margin * 2);
  const innerHeight = Math.max(1, height - margin * 2);
  const step = points.length > 1 ? innerWidth / (points.length - 1) : 0;
  const isFlatPitch = rawMax === rawMin;

  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.beginPath();
  ctx.moveTo(margin, height - margin);
  ctx.lineTo(width - margin, height - margin);
  ctx.stroke();

  intonationPointPositions = [];
  ctx.strokeStyle = getColorVariable('--accent-color', '#4caf50');
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((point, index) => {
    const x = margin + step * index;
    const normalized = (point.pitch - minPitch) / Math.max(maxPitch - minPitch, 1);
    const y = height - margin - normalized * innerHeight;
    intonationPointPositions.push({ x, y });
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  const accent = getColorVariable('--accent-color', '#4caf50');
  points.forEach((_, index) => {
    const pos = intonationPointPositions[index];
    ctx.beginPath();
    const radius = intonationSelectedIndex === index ? 7 : 5;
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.strokeStyle = getColorVariable('--bg-color', '#ffffff');
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  intonationChartRange = {
    min: minPitch,
    max: maxPitch,
    margin,
    height,
    innerHeight,
    width,
  };

  if (isFlatPitch) {
    ctx.fillStyle = getColorVariable('--muted-text', '#6b7280');
    ctx.font = '12px sans-serif';
    ctx.fillText('全モーラ同一ピッチ（フラット）', margin, margin - 6);
  }
}

function pitchFromY(y: number) {
  if (!intonationChartRange) return null;
  const { min, max, margin, height, innerHeight } = intonationChartRange;
  const clampedY = Math.min(height - margin, Math.max(margin, y));
  const ratio = (height - margin - clampedY) / Math.max(innerHeight, 1);
  return min + ratio * (max - min);
}

function findNearestIntonationPoint(x: number, y: number) {
  let nearestIndex = -1;
  let minDistance = 14;
  intonationPointPositions.forEach((pos, index) => {
    const distance = Math.hypot(pos.x - x, pos.y - y);
    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = index;
    }
  });
  return nearestIndex;
}

function applyPitchToQuery(pointIndex: number, pitch: number) {
  if (!currentIntonationQuery) return;
  let cursor = 0;
  for (const phrase of currentIntonationQuery.accent_phrases) {
    for (const mora of phrase.moras) {
      if (cursor === pointIndex) {
        mora.pitch = pitch;
        return;
      }
      cursor += 1;
    }
  }
}

function scheduleIntonationPlayback() {
  if (intonationDebounceTimer !== null) {
    window.clearTimeout(intonationDebounceTimer);
  }
  intonationDebounceTimer = window.setTimeout(() => {
    intonationDebounceTimer = null;
    if (isProcessing) {
      scheduleIntonationPlayback();
      return;
    }
    void playUpdatedIntonation();
  }, INTONATION_DEBOUNCE_MS);
}

async function playUpdatedIntonation() {
  if (!currentIntonationQuery) return;
  if (isProcessing) return;

  const playButton = document.getElementById('playButton') as HTMLButtonElement | null;
  const exportButton = document.getElementById('exportButton') as HTMLButtonElement | null;
  const renderedCanvas = document.getElementById('renderedWaveform') as HTMLCanvasElement | null;
  const realtimeCanvas = document.getElementById('realtimeWaveform') as HTMLCanvasElement | null;
  const spectrogramCanvas = document.getElementById('spectrogram') as HTMLCanvasElement | null;

  isProcessing = true;
  if (playButton) playButton.disabled = true;
  updateExportButtonState(exportButton);
  initializeVisualizationCanvases();

  try {
    showStatus('イントネーションを適用中...', 'info');
    const synthesisStart = performance.now();
    const audioBuffer = await synthesize(currentIntonationQuery, ZUNDAMON_SPEAKER_ID);
    const synthesisElapsed = performance.now() - synthesisStart;
    updateIntonationTiming(`イントネーション反映: ${Math.round(synthesisElapsed)} ms`);

    lastSynthesizedBuffer = audioBuffer;
    const audioContext = Tone.getContext().rawContext as BaseAudioContext;
    const decodedBuffer = await audioContext.decodeAudioData(audioBuffer.slice(0));

    if (renderedCanvas) {
      drawRenderedWaveform(decodedBuffer, renderedCanvas);
    }

    await playAudio(decodedBuffer, realtimeCanvas, spectrogramCanvas);

    showStatus('更新したイントネーションで再生しました', 'success');
    setTimeout(hideStatus, 2500);
  } catch (error) {
    console.error('Intonation playback error:', error);
    showStatus(
      `イントネーション適用中にエラーが発生しました: ${
        error instanceof Error ? error.message : String(error)
      }`,
      'error'
    );
  } finally {
    isProcessing = false;
    if (playButton) playButton.disabled = false;
    updateExportButtonState(exportButton);
  }
}

async function fetchAndRenderIntonation(text: string) {
  if (!intonationCanvas) return;
  updateIntonationTiming('イントネーション取得中...');
  const start = performance.now();
  try {
    const query = await getAudioQuery(text, ZUNDAMON_SPEAKER_ID);
    const elapsed = performance.now() - start;
    currentIntonationQuery = query;
    intonationPoints = buildIntonationPointsFromQuery(query);
    intonationSelectedIndex = intonationPoints.length > 0 ? 0 : null;
    drawIntonationChart(intonationPoints);
    updateIntonationTiming(`イントネーション取得: ${Math.round(elapsed)} ms`);
  } catch (error) {
    console.error('Failed to fetch intonation:', error);
    updateIntonationTiming('イントネーションの取得に失敗しました');
  }
}

function handleIntonationPointerDown(event: MouseEvent | PointerEvent) {
  if (!intonationCanvas || intonationPointPositions.length === 0) return;
  const rect = intonationCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const targetIndex = findNearestIntonationPoint(x, y);
  if (targetIndex !== -1) {
    intonationDragIndex = targetIndex;
    intonationSelectedIndex = targetIndex;
    drawIntonationChart(intonationPoints);
    if ('pointerId' in event) {
      intonationActivePointerId = event.pointerId;
      intonationCanvas.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
  }
}

function handleIntonationPointerMove(event: MouseEvent | PointerEvent) {
  if (intonationDragIndex === null || !intonationCanvas || intonationPointPositions.length === 0) {
    return;
  }
  if ('pointerId' in event && intonationActivePointerId !== null && event.pointerId !== intonationActivePointerId) {
    return;
  }
  const rect = intonationCanvas.getBoundingClientRect();
  const pitch = pitchFromY(event.clientY - rect.top);
  if (pitch === null) return;
  intonationPoints[intonationDragIndex].pitch = pitch;
  applyPitchToQuery(intonationDragIndex, pitch);
  drawIntonationChart(intonationPoints);
  scheduleIntonationPlayback();
  event.preventDefault();
}

function handleIntonationPointerUp() {
  if (intonationActivePointerId !== null && intonationCanvas) {
    intonationCanvas.releasePointerCapture(intonationActivePointerId);
  }
  intonationActivePointerId = null;
  intonationDragIndex = null;
}

function handleIntonationKeyDown(event: KeyboardEvent) {
  if (!intonationCanvas || intonationPoints.length === 0) return;
  if (intonationSelectedIndex === null) {
    intonationSelectedIndex = 0;
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
    drawIntonationChart(intonationPoints);
    scheduleIntonationPlayback();
  }
}

function updateExportButtonState(exportButton?: HTMLButtonElement | null) {
  if (exportButton) {
    exportButton.disabled = isProcessing || !lastSynthesizedBuffer;
  }
}

function downloadLastAudio() {
  if (!lastSynthesizedBuffer) return;

  const blob = new Blob([lastSynthesizedBuffer], { type: 'audio/wav' });
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
    if (isProcessing) {
      autoPlayTimer = window.setTimeout(triggerPlay, AUTO_PLAY_DEBOUNCE_MS);
      return;
    }
    void handlePlay();
  };

  autoPlayTimer = window.setTimeout(triggerPlay, AUTO_PLAY_DEBOUNCE_MS);
}

// VOICEVOX API: Get audio query
async function getAudioQuery(text: string, speakerId: number): Promise<AudioQuery> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  
  try {
    const response = await fetch(
      `${VOICEVOX_API_BASE}/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`,
      {
        method: 'POST',
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`Audio query failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('VOICEVOXサーバーへの接続がタイムアウトしました。サーバーが起動しているか確認してください。');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// VOICEVOX API: Synthesize audio
async function synthesize(audioQuery: AudioQuery, speakerId: number): Promise<ArrayBuffer> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  
  try {
    const response = await fetch(
      `${VOICEVOX_API_BASE}/synthesis?speaker=${speakerId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(audioQuery),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`Synthesis failed: ${response.status} ${response.statusText}`);
    }

    return response.arrayBuffer();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('VOICEVOXサーバーへの接続がタイムアウトしました。サーバーが起動しているか確認してください。');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Play audio using Tone.js with realtime visualizers
async function playAudio(
  decodedBuffer: AudioBuffer,
  realtimeCanvas?: HTMLCanvasElement | null,
  spectrogramCanvas?: HTMLCanvasElement | null
) {
  await Tone.start();

  const player = new Tone.Player(decodedBuffer);
  const waveformAnalyser = realtimeCanvas ? new Tone.Analyser('waveform', 1024) : null;
  const fftAnalyser = spectrogramCanvas ? new Tone.Analyser('fft', 1024) : null;

  if (waveformAnalyser) {
    player.connect(waveformAnalyser);
  }

  if (fftAnalyser) {
    player.connect(fftAnalyser);
  }

  player.toDestination();
  player.start();

  let animationId: number | null = null;
  let spectrogramX = -1;
  let spectrogramCeiling = fftAnalyser ? fftAnalyser.size : 0;
  const playbackDurationMs = Math.max(decodedBuffer.duration * 1000, 1);
  const sampleRate = Math.max(decodedBuffer.sampleRate, 1);
  spectrogramNeedsReset = true;
  const startTime = performance.now();

  const render = () => {
    if (waveformAnalyser && realtimeCanvas) {
      const values = waveformAnalyser.getValue() as Float32Array;
      drawRealtimeWaveform(values, realtimeCanvas);
    }

    if (fftAnalyser && spectrogramCanvas) {
      const values = fftAnalyser.getValue() as Float32Array;
      spectrogramCeiling = determineSpectrogramCeiling(values, spectrogramCeiling || values.length - 1);
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / playbackDurationMs, 1);
      const needsReset = spectrogramNeedsReset || lastSpectrogramScale !== spectrogramScale;
      spectrogramX = drawSpectrogram(
        values,
        spectrogramCanvas,
        progress,
        spectrogramCeiling,
        spectrogramX,
        sampleRate,
        spectrogramScale,
        needsReset
      );
      if (needsReset) {
        spectrogramNeedsReset = false;
        lastSpectrogramScale = spectrogramScale;
      }
    }

    animationId = requestAnimationFrame(render);
  };

  if (waveformAnalyser || fftAnalyser) {
    render();
  }

  return new Promise<void>((resolve) => {
    let resolved = false;

    const cleanup = () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
      waveformAnalyser?.dispose();
      fftAnalyser?.dispose();
      player.dispose();
    };

    player.onstop = () => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve();
      }
    };
    
    // Also resolve after duration to handle cases where onstop doesn't fire
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        if (player.state === 'started') {
          player.stop();
        }
        cleanup();
        resolve();
      }
    }, decodedBuffer.duration * 1000 + 100);
  });
}

// Main play function
async function handlePlay() {
  const textArea = document.getElementById('text') as HTMLTextAreaElement | null;
  const playButton = document.getElementById('playButton') as HTMLButtonElement | null;
  const exportButton = document.getElementById('exportButton') as HTMLButtonElement | null;
  const renderedCanvas = document.getElementById('renderedWaveform') as HTMLCanvasElement | null;
  const realtimeCanvas = document.getElementById('realtimeWaveform') as HTMLCanvasElement | null;
  const spectrogramCanvas = document.getElementById('spectrogram') as HTMLCanvasElement | null;
  const loopCheckbox = document.getElementById('loopCheckbox') as HTMLInputElement | null;
  
  if (!textArea || !playButton) {
    console.error('Required UI elements not found');
    return;
  }
  
  const text = textArea.value.trim();
  
  if (!text) {
    showStatus('テキストを入力してください', 'error');
    return;
  }
  
  if (isProcessing) {
    return;
  }

  isProcessing = true;
  playButton.disabled = true;
  updateExportButtonState(exportButton);
  initializeVisualizationCanvases();
  
  try {
    let audioBuffer: ArrayBuffer;
    let usedCache = false;

    if (audioCache.has(text)) {
      audioBuffer = audioCache.get(text) as ArrayBuffer;
      usedCache = true;
      showStatus('キャッシュから再生します...', 'info');
    } else {
      // Step 1: Get audio query
      showStatus('音声クエリを作成中...', 'info');
      const audioQuery = await getAudioQuery(text, ZUNDAMON_SPEAKER_ID);
      
      // Step 2: Synthesize audio
      showStatus('音声を生成中...', 'info');
      audioBuffer = await synthesize(audioQuery, ZUNDAMON_SPEAKER_ID);
      if (audioCache.size >= AUDIO_CACHE_LIMIT) {
        const oldest = audioCache.keys().next().value;
        if (oldest !== undefined) {
          audioCache.delete(oldest);
        }
      }
      audioCache.set(text, audioBuffer);
    }

    lastSynthesizedBuffer = audioBuffer;
    const audioContext = Tone.getContext().rawContext as BaseAudioContext;
    const decodedBuffer = await audioContext.decodeAudioData(audioBuffer.slice(0));

    if (renderedCanvas) {
      drawRenderedWaveform(decodedBuffer, renderedCanvas);
    }
    
    // Step 3: Play audio
    if (!usedCache) {
      showStatus('音声を再生中...', 'info');
    } else {
      showStatus('音声を再生中（キャッシュ）...', 'info');
    }
    await playAudio(decodedBuffer, realtimeCanvas, spectrogramCanvas);
    await fetchAndRenderIntonation(text);
    
    showStatus('再生完了！', 'success');
    setTimeout(hideStatus, 3000);

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
    playButton.disabled = false;
    isProcessing = false;
    updateExportButtonState(exportButton);
  }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
  const playButton = document.getElementById('playButton') as HTMLButtonElement | null;
  const textArea = document.getElementById('text') as HTMLTextAreaElement | null;
  const exportButton = document.getElementById('exportButton') as HTMLButtonElement | null;
  const usageToggleButton = document.getElementById('usageToggleButton') as HTMLButtonElement | null;
  const usagePanel = document.getElementById('usagePanel');
  const spectrogramScaleToggle = document.getElementById('spectrogramScaleToggle') as HTMLButtonElement | null;
  intonationCanvas = document.getElementById('intonationCanvas') as HTMLCanvasElement | null;
  intonationTimingEl = document.getElementById('intonationTiming');
  
  if (playButton) {
    playButton.addEventListener('click', handlePlay);
    playButton.focus();
  }

  if (textArea) {
    textArea.addEventListener('input', scheduleAutoPlay);
  }

  if (exportButton) {
    exportButton.addEventListener('click', downloadLastAudio);
    updateExportButtonState(exportButton);
  }

  if (usageToggleButton && usagePanel) {
    usageToggleButton.addEventListener('click', () => {
      const isHidden = usagePanel.hasAttribute('hidden');
      if (isHidden) {
        usagePanel.removeAttribute('hidden');
      } else {
        usagePanel.setAttribute('hidden', 'true');
      }
      usageToggleButton.setAttribute('aria-expanded', String(isHidden));
    });
  }

  const updateSpectrogramScaleLabel = () => {
    if (spectrogramScaleToggle) {
      spectrogramScaleToggle.textContent = spectrogramScale === 'linear' ? '対数スケール' : 'リニアスケール';
    }
  };

  if (spectrogramScaleToggle) {
    updateSpectrogramScaleLabel();
    spectrogramScaleToggle.addEventListener('click', () => {
      spectrogramScale = spectrogramScale === 'linear' ? 'log' : 'linear';
      initializeVisualizationCanvases();
      spectrogramNeedsReset = true;
      updateSpectrogramScaleLabel();
    });
  }

  if (intonationCanvas) {
    intonationCanvas.addEventListener('pointerdown', handleIntonationPointerDown);
    intonationCanvas.addEventListener('pointermove', handleIntonationPointerMove);
    intonationCanvas.addEventListener('pointerleave', handleIntonationPointerUp);
    intonationCanvas.addEventListener('keydown', handleIntonationKeyDown);
    intonationCanvas.addEventListener('focus', () => {
      if (intonationPoints.length > 0 && intonationSelectedIndex === null) {
        intonationSelectedIndex = 0;
        drawIntonationChart(intonationPoints);
      }
    });
  }
  window.addEventListener('mouseup', handleIntonationPointerUp);
  window.addEventListener('pointerup', handleIntonationPointerUp);

  initializeVisualizationCanvases();
  initializeIntonationCanvas();
  window.addEventListener('resize', () => {
    initializeVisualizationCanvases();
    initializeIntonationCanvas();
    if (intonationPoints.length > 0) {
      drawIntonationChart(intonationPoints);
    }
  });
});
