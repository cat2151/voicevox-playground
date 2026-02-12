import * as Tone from 'tone';
import {
  FrequencyScale,
  MIN_LOG_FREQUENCY,
  MIN_TICK_SPACING_PX,
  SPECTROGRAM_MAX_COLUMNS_PER_FRAME,
  WAVEFORM_TARGET_RATIO,
} from './config';
import { getColorVariable, invalidateColorVariableCache } from './status';

let spectrogramScale: FrequencyScale = 'linear';
let spectrogramNeedsReset = false;
let lastSpectrogramScale: FrequencyScale = 'linear';
let realtimePreviousSegment: Float32Array | null = null;
let realtimeSegmentBuffer: Float32Array | null = null;
let fftMagnitudeBuffer: Float32Array | null = null;
let fftHpsBuffer: Float32Array | null = null;
let activePlaybackStopper: (() => void) | null = null;

export function getSpectrogramScale() {
  return spectrogramScale;
}

export function setSpectrogramScale(scale: FrequencyScale) {
  spectrogramScale = scale;
  spectrogramNeedsReset = true;
}

export function requestSpectrogramReset() {
  spectrogramNeedsReset = true;
}

export function isPlaybackActive() {
  return activePlaybackStopper !== null;
}

export function stopActivePlayback() {
  activePlaybackStopper?.();
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
  const fftSize = 1 << Math.ceil(Math.log2(windowSize));
  const real = new Float32Array(fftSize);
  const imag = new Float32Array(fftSize);
  const frequencies: Array<{ time: number; freq: number }> = [];

  for (let offset = 0; offset + windowSize <= channelData.length; offset += hopSize) {
    real.fill(0);
    imag.fill(0);
    for (let i = 0; i < windowSize; i++) {
      real[i] = channelData[offset + i] * window[i];
    }
    fftRadix2(real, imag);

    let maxMag = 0;
    let maxIndex = 0;
    for (let i = 0; i < fftSize / 2; i++) {
      const mag = real[i] * real[i] + imag[i] * imag[i];
      if (mag > maxMag) {
        maxMag = mag;
        maxIndex = i;
      }
    }

    const freq = (maxIndex * sampleRate) / fftSize;
    frequencies.push({ time: offset / sampleRate, freq });
  }

  const grouped: Array<{ time: number; freq: number }> = [];
  const columns = Math.max(1, Math.min(frequencies.length, SPECTROGRAM_MAX_COLUMNS_PER_FRAME));
  const groupSize = Math.max(1, Math.floor(frequencies.length / columns));

  for (let i = 0; i < frequencies.length; i += groupSize) {
    const group = frequencies.slice(i, i + groupSize);
    if (group.length === 0) continue;
    const avgFreq = group.reduce((sum, item) => sum + item.freq, 0) / group.length;
    const avgTime = group.reduce((sum, item) => sum + item.time, 0) / group.length;
    grouped.push({ time: avgTime, freq: avgFreq });
  }

  return grouped;
}

export function drawRenderedWaveform(buffer: AudioBuffer, canvas: HTMLCanvasElement) {
  const { ctx, width, height } = prepareCanvas(canvas);
  if (!ctx) return;

  ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  const channelData = buffer.getChannelData(0);
  const totalSamples = channelData.length;
  const samplesPerPixel = Math.max(1, Math.floor(totalSamples / width));
  const halfHeight = (height * WAVEFORM_TARGET_RATIO) / 2;

  ctx.strokeStyle = getColorVariable('--primary-color', '#4CAF50');
  ctx.beginPath();
  for (let x = 0; x < width; x++) {
    const start = x * samplesPerPixel;
    const end = Math.min(start + samplesPerPixel, totalSamples);
    let min = Infinity;
    let max = -Infinity;
    for (let i = start; i < end; i++) {
      const value = channelData[i];
      if (value < min) min = value;
      if (value > max) max = value;
    }
    const yMin = height / 2 - min * halfHeight;
    const yMax = height / 2 - max * halfHeight;
    ctx.moveTo(x, yMin);
    ctx.lineTo(x, yMax);
  }
  ctx.stroke();

  const frequencies = estimateFrequencySeries(channelData, buffer.sampleRate, width / 6);
  ctx.fillStyle = getColorVariable('--accent-color', '#9C27B0');
  for (const freq of frequencies) {
    const x = (freq.time / buffer.duration) * width;
    const y = height - (Math.log10(freq.freq + 1) / Math.log10(buffer.sampleRate / 2 + 1)) * height;
    ctx.fillRect(x - 1, y - 1, 2, 2);
  }

  ctx.strokeStyle = getColorVariable('--grid-color', 'rgba(0,0,0,0.1)');
  ctx.beginPath();
  const maxDuration = buffer.duration;
  const step = 0.5;
  const maxTicks = Math.max(1, Math.ceil(maxDuration / step));
  for (let i = 0; i <= maxTicks; i++) {
    const x = (i * step * width) / maxDuration;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  ctx.stroke();
}

function drawRealtimeWaveform(
  values: Float32Array,
  canvas: HTMLCanvasElement,
  sampleRate: number,
  currentEstimatedFrequency: number | null
) {
  const { ctx, width, height } = prepareCanvas(canvas);
  if (!ctx || values.length === 0) return;

  ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  const channelData = values;
  const windowSize = Math.max(1, Math.min(channelData.length, 2048));
  const start = Math.max(0, channelData.length - windowSize);
  const windowed = channelData.slice(start, start + windowSize);
  const window = getHannWindow(windowSize);

  const fftSize = 1 << Math.ceil(Math.log2(windowSize));
  const real = new Float32Array(fftSize);
  const imag = new Float32Array(fftSize);
  for (let i = 0; i < windowSize; i++) {
    real[i] = windowed[i] * window[i];
  }
  fftRadix2(real, imag);

  let maxMag = 0;
  let maxIndex = 0;
  for (let i = 0; i < fftSize / 2; i++) {
    const mag = real[i] * real[i] + imag[i] * imag[i];
    if (mag > maxMag) {
      maxMag = mag;
      maxIndex = i;
    }
  }

  const freq = (maxIndex * sampleRate) / fftSize;
  const targetFreq = currentEstimatedFrequency ?? freq;
  const cycles = Math.max(1, Math.min(4, Math.floor(sampleRate / Math.max(targetFreq, 1))));
  const targetSamples = Math.floor(cycles * (sampleRate / Math.max(targetFreq, 1)));
  const segmentLength = Math.max(1, Math.min(targetSamples, windowSize));

  const segment = extractAlignedRealtimeSegment(windowed, segmentLength);
  const samplesPerPixel = Math.max(1, segment.length / width);
  const halfHeight = (height * WAVEFORM_TARGET_RATIO) / 2;

  ctx.strokeStyle = getColorVariable('--primary-color', '#4CAF50');
  ctx.beginPath();
  for (let x = 0; x < width; x++) {
    const startIndex = Math.floor(x * samplesPerPixel);
    const endIndex = Math.min(Math.floor((x + 1) * samplesPerPixel), segment.length);
    let min = Infinity;
    let max = -Infinity;
    for (let i = startIndex; i < endIndex; i++) {
      const value = segment[i];
      if (value < min) min = value;
      if (value > max) max = value;
    }
    const yMin = height / 2 - min * halfHeight;
    const yMax = height / 2 - max * halfHeight;
    ctx.moveTo(x, yMin);
    ctx.lineTo(x, yMax);
  }
  ctx.stroke();
}

function determineSpectrogramCeiling(values: Float32Array, previousCeiling: number) {
  if (values.length === 0) {
    return 1;
  }

  let peak = values[0];
  for (let i = 1; i < values.length; i++) {
    if (values[i] > peak) {
      peak = values[i];
    }
  }

  const threshold = peak - 40;
  let highestIndexAboveThreshold = 0;
  for (let i = values.length - 1; i >= 0; i--) {
    if (values[i] >= threshold) {
      highestIndexAboveThreshold = i;
      break;
    }
  }

  const rawCeiling = Math.max(highestIndexAboveThreshold, previousCeiling * 0.98);
  const clampedCeiling = Math.max(1, Math.min(values.length - 1, Math.floor(rawCeiling)));
  return clampedCeiling;
}

function estimateFundamentalFrequency(values: Float32Array, sampleRate: number) {
  const magnitude = values.map((v) => 10 ** (v / 20));
  const downSampled: number[] = [];
  const maxIndex = values.length / 2;
  for (let i = 1; i < maxIndex; i++) {
    downSampled.push(magnitude[i]);
  }

  const maxLag = Math.min(1000, downSampled.length - 1);
  fftMagnitudeBuffer = fftMagnitudeBuffer && fftMagnitudeBuffer.length === maxLag
    ? fftMagnitudeBuffer
    : new Float32Array(maxLag);
  fftHpsBuffer = fftHpsBuffer && fftHpsBuffer.length === maxLag
    ? fftHpsBuffer
    : new Float32Array(maxLag);
  fftMagnitudeBuffer.fill(0);
  fftHpsBuffer.fill(0);

  for (let lag = 1; lag < maxLag; lag++) {
    let sum = 0;
    for (let i = 0; i < downSampled.length - lag; i++) {
      sum += Math.abs(downSampled[i]) * Math.abs(downSampled[i + lag]);
    }
    fftMagnitudeBuffer[lag] = sum;
  }

  for (let harmonic = 1; harmonic <= 4; harmonic++) {
    for (let i = 1; i < maxLag; i++) {
      const index = Math.floor(i / harmonic);
      if (index < fftMagnitudeBuffer.length) {
        fftHpsBuffer[i] += fftMagnitudeBuffer[index];
      }
    }
  }

  let bestLag = 1;
  let bestValue = fftHpsBuffer[1];
  for (let i = 2; i < maxLag; i++) {
    if (fftHpsBuffer[i] > bestValue) {
      bestValue = fftHpsBuffer[i];
      bestLag = i;
    }
  }

  return sampleRate / bestLag;
}

function computeSegmentStats(buffer: Float32Array, offset: number, length: number) {
  let sum = 0;
  let sumSq = 0;
  for (let i = 0; i < length; i++) {
    const value = buffer[offset + i];
    sum += value;
    sumSq += value * value;
  }
  const mean = sum / length;
  const variance = sumSq / length - mean * mean;
  const stdDev = Math.sqrt(Math.max(variance, 0));
  return { mean, stdDev };
}

function computeSegmentCorrelation(
  buffer: Float32Array,
  offsetA: number,
  offsetB: number,
  length: number
) {
  const statsA = computeSegmentStats(buffer, offsetA, length);
  const statsB = computeSegmentStats(buffer, offsetB, length);
  let numerator = 0;
  for (let i = 0; i < length; i++) {
    const a = buffer[offsetA + i] - statsA.mean;
    const b = buffer[offsetB + i] - statsB.mean;
    numerator += a * b;
  }
  const denominator = length * statsA.stdDev * statsB.stdDev;
  return denominator === 0 ? 0 : numerator / denominator;
}

function extractAlignedRealtimeSegment(values: Float32Array, targetLength: number) {
  const length = Math.min(targetLength, values.length);
  if (!realtimeSegmentBuffer || realtimeSegmentBuffer.length !== length) {
    realtimeSegmentBuffer = new Float32Array(length);
  }

  if (!realtimePreviousSegment || realtimePreviousSegment.length < length) {
    realtimePreviousSegment = new Float32Array(length);
    realtimePreviousSegment.set(values.slice(values.length - length));
    return realtimePreviousSegment;
  }

  const searchRange = Math.min(values.length - length, Math.max(1, Math.floor(length * 0.5)));
  let bestOffset = values.length - length;
  let bestCorrelation = -Infinity;
  for (let offset = values.length - length - searchRange; offset <= values.length - length + searchRange; offset++) {
    const correlation = computeSegmentCorrelation(values, offset, values.length - length, length);
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }

  realtimeSegmentBuffer.set(values.slice(bestOffset, bestOffset + length));
  realtimePreviousSegment.set(realtimeSegmentBuffer);
  return realtimeSegmentBuffer;
}

function drawSpectrogram(
  values: Float32Array,
  canvas: HTMLCanvasElement,
  progress: number,
  ceilingIndex: number,
  previousX: number,
  sampleRate: number,
  scale: FrequencyScale,
  reset?: boolean
) {
  const { ctx, width, height } = prepareCanvas(canvas);
  if (!ctx) return previousX;

  const drawableWidth = width - 40;
  const drawableHeight = height;
  const leftMargin = 40;
  const minLogFreq = MIN_LOG_FREQUENCY;
  const maxFreq = Math.max(sampleRate / 2, 1);
  const cappedTargetX = Math.min(drawableWidth, Math.max(0, Math.floor(progress * drawableWidth)));
  const targetX = cappedTargetX;
  const startX = reset || targetX <= previousX ? 0 : previousX;

  const gradient = ctx.createLinearGradient(0, 0, 0, drawableHeight);
  const colorStops = [
    { stop: 0, color: getColorVariable('--spectrogram-high', '#ff2a6d') },
    { stop: 0.25, color: getColorVariable('--spectrogram-mid-high', '#f8c102') },
    { stop: 0.5, color: getColorVariable('--spectrogram-mid', '#7fff7f') },
    { stop: 0.75, color: getColorVariable('--spectrogram-mid-low', '#2a93d5') },
    { stop: 1, color: getColorVariable('--spectrogram-low', '#3e1bdb') },
  ];
  colorStops.forEach(({ stop, color }) => gradient.addColorStop(stop, color));

  const resetX = reset ? 0 : startX;
  if (reset) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  }

  const MIN_DB = -100;
  const MAX_DB = 0;
  ctx.save();
  for (let x = resetX; x <= targetX; x++) {
    const columnX = leftMargin + x;
    for (let bin = 0; bin < values.length; bin++) {
      const magnitudeDb = values[bin];
      const clampedDb = Math.max(MIN_DB, Math.min(MAX_DB, magnitudeDb));
      const intensity = (clampedDb - MIN_DB) / (MAX_DB - MIN_DB);
      if (intensity <= 0) continue;

      const freq = (bin / ceilingIndex) * maxFreq;
      const normalized = scale === 'log'
        ? (freq <= 0
            ? 0
            : (Math.log10(Math.max(freq, minLogFreq)) - Math.log10(minLogFreq)) /
              Math.max(Math.log10(maxFreq) - Math.log10(minLogFreq), 1))
        : freq / maxFreq;

      const nextBin = bin + 1;
      const nextFreq = nextBin > ceilingIndex ? maxFreq : (nextBin / ceilingIndex) * maxFreq;
      const nextNormalized = scale === 'log'
        ? (nextFreq <= 0
            ? 0
            : (Math.log10(Math.max(nextFreq, minLogFreq)) - Math.log10(minLogFreq)) /
              Math.max(Math.log10(maxFreq) - Math.log10(minLogFreq), 1))
        : nextFreq / maxFreq;

      const yTop = drawableHeight - Math.min(normalized * drawableHeight, drawableHeight);
      const yBottom = drawableHeight - Math.min(nextNormalized * drawableHeight, drawableHeight);
      const rectY = Math.min(yTop, yBottom);
      const rectHeight = Math.max(1, Math.abs(yBottom - yTop));

      ctx.globalAlpha = intensity;
      ctx.fillStyle = gradient;
      ctx.fillRect(columnX, rectY, 1, rectHeight);
    }
  }
  ctx.restore();

  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(leftMargin, 0);
  ctx.lineTo(leftMargin, drawableHeight);
  ctx.lineTo(width, drawableHeight);
  ctx.stroke();

  if (reset || targetX <= startX) {
    ctx.strokeStyle = getColorVariable('--grid-color', 'rgba(0,0,0,0.05)');
    ctx.beginPath();
    const tickSpacing = Math.max(MIN_TICK_SPACING_PX, width / 10);
    for (let x = leftMargin; x <= width; x += tickSpacing) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, drawableHeight);
    }
    ctx.stroke();
  }

  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.beginPath();
  ctx.moveTo(leftMargin, 0);
  ctx.lineTo(leftMargin, drawableHeight);
  ctx.lineTo(width, drawableHeight);
  ctx.stroke();

  ctx.strokeStyle = getColorVariable('--canvas-grid', 'rgba(0,0,0,0.06)');
  ctx.fillStyle = getColorVariable('--axis-label', '#666666');
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const labelMetrics = ctx.measureText('0000Hz');
  const calculatedHeight = (labelMetrics.actualBoundingBoxAscent ?? 0) + (labelMetrics.actualBoundingBoxDescent ?? 0);
  const labelHeight = Math.max(1, Math.ceil(calculatedHeight || 11));
  const minLabelGap = labelHeight + 2;
  let lastLabelY: number | null = null;
  const logMax = Math.log10(Math.max(maxFreq, minLogFreq));
  const logMin = Math.log10(Math.max(minLogFreq, 1));
  const ticks: number[] = [];
  for (let freq = 0; freq <= maxFreq; freq += 500) {
    ticks.push(freq);
  }
  if (ticks.length === 0 || ticks[ticks.length - 1] !== maxFreq) {
    ticks.push(maxFreq);
  }
  for (const freq of ticks) {
    const normalized = scale === 'log'
      ? (freq <= 0 ? 0 : (Math.log10(Math.max(freq, minLogFreq)) - logMin) / Math.max(logMax - logMin, 1))
      : freq / maxFreq;
    const y = drawableHeight - Math.min(normalized * drawableHeight, drawableHeight);
    ctx.beginPath();
    ctx.moveTo(leftMargin - 4, y);
    ctx.lineTo(width, y);
    ctx.stroke();
    const shouldDrawLabel = lastLabelY === null
      || Math.abs(y - lastLabelY) >= minLabelGap
      || freq === 0
      || freq === maxFreq;
    if (shouldDrawLabel) {
      ctx.fillText(`${Math.round(freq)}Hz`, leftMargin - 6, y);
      lastLabelY = y;
    }
  }

  return cappedTargetX;
}

export function initializeVisualizationCanvases(options?: { preserveSpectrogram?: boolean }) {
  const preserveSpectrogram = options?.preserveSpectrogram ?? false;
  invalidateColorVariableCache();
  ['renderedWaveform', 'realtimeWaveform', 'spectrogram'].forEach((id) => {
    const canvas = document.getElementById(id) as HTMLCanvasElement | null;
    if (!canvas) return;

    const { ctx, width, height } = prepareCanvas(canvas);
    if (!ctx) return;

    if (id === 'spectrogram' && preserveSpectrogram) {
      return;
    }

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

export async function playAudio(
  decodedBuffer: AudioBuffer,
  realtimeCanvas?: HTMLCanvasElement | null,
  spectrogramCanvas?: HTMLCanvasElement | null,
  options?: { resetSpectrogram?: boolean }
): Promise<{ stopped: boolean }> {
  await Tone.start();

  const player = new Tone.Player(decodedBuffer);
  const waveformAnalyser = realtimeCanvas ? new Tone.Analyser('waveform', 4096) : null;
  const fftAnalyser = spectrogramCanvas ? new Tone.Analyser('fft', 1024) : null;
  const renderedProgress = document.getElementById('renderedWaveformProgress') as HTMLDivElement | null;
  const spectrogramProgress = document.getElementById('spectrogramProgress') as HTMLDivElement | null;
  const updateProgressLines = (ratio: number) => {
    const clamped = Math.min(Math.max(ratio, 0), 1) * 100;
    [renderedProgress, spectrogramProgress].forEach((el) => {
      if (el) {
        el.style.left = `${clamped}%`;
        el.classList.add('is-active');
      }
    });
  };
  const clearProgressLines = () => {
    [renderedProgress, spectrogramProgress].forEach((el) => {
      if (el) {
        el.classList.remove('is-active');
      }
    });
  };

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
  const shouldResetSpectrogram = options?.resetSpectrogram ?? true;
  spectrogramNeedsReset = shouldResetSpectrogram;
  const startTime = performance.now();
  realtimePreviousSegment = null;
  let currentEstimatedFrequency: number | null = null;
  updateProgressLines(0);

  const render = () => {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / playbackDurationMs, 1);

    if (fftAnalyser && spectrogramCanvas) {
      const values = fftAnalyser.getValue() as Float32Array;
      currentEstimatedFrequency = estimateFundamentalFrequency(values, sampleRate);
      spectrogramCeiling = determineSpectrogramCeiling(values, spectrogramCeiling || values.length - 1);
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

    if (waveformAnalyser && realtimeCanvas) {
      const values = waveformAnalyser.getValue() as Float32Array;
      drawRealtimeWaveform(values, realtimeCanvas, sampleRate, currentEstimatedFrequency);
    }

    updateProgressLines(progress);
    animationId = requestAnimationFrame(render);
  };

  if (waveformAnalyser || fftAnalyser) {
    render();
  }

  return new Promise<{ stopped: boolean }>((resolve) => {
    let resolved = false;
    let stoppedByUser = false;

    const cleanup = () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
      clearProgressLines();
      waveformAnalyser?.dispose();
      fftAnalyser?.dispose();
      player.dispose();
    };

    const finalize = () => {
      cleanup();
      if (activePlaybackStopper === stopPlayback) {
        activePlaybackStopper = null;
      }
    };

    const stopPlayback = () => {
      if (resolved) return;
      resolved = true;
      stoppedByUser = true;
      if (player.state === 'started') {
        player.stop();
      }
      finalize();
      resolve({ stopped: stoppedByUser });
    };

    const previousStopper = activePlaybackStopper;
    activePlaybackStopper = stopPlayback;
    if (previousStopper && previousStopper !== stopPlayback) {
      previousStopper();
    }

    player.onstop = () => {
      if (!resolved) {
        resolved = true;
        finalize();
        resolve({ stopped: stoppedByUser });
      }
    };

    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        if (player.state === 'started') {
          player.stop();
        }
        finalize();
        resolve({ stopped: stoppedByUser });
      }
    }, decodedBuffer.duration * 1000 + 100);
  });
}
