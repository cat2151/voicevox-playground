import { FrequencyScale, MIN_LOG_FREQUENCY } from '../config';
import { getColorVariable } from '../status';
import { prepareCanvas } from './canvas';
import { fftRadix2, getHannWindow } from './fft';
import { drawTimeTicks, SPECTROGRAM_LEFT_MARGIN } from './timeAxis';

const SPECTROGRAM_COLOR_STOPS = [
  { stop: 0, color: [0, 0, 0] }, // black
  { stop: 0.25, color: [0, 64, 192] }, // blue
  { stop: 0.5, color: [210, 40, 40] }, // red
  { stop: 0.99, color: [255, 165, 0] }, // orange
  { stop: 1, color: [255, 255, 255] }, // white
];

export type SpectrogramFrame = Float32Array;
export type OfflineSpectrogramData = {
  frames: SpectrogramFrame[];
  ceilingIndex: number;
  duration: number;
  sampleRate: number;
  frequencies: Array<{ time: number; freq: number }>;
  signature: string;
};

function lerpColor(a: number[], b: number[], t: number) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function mapIntensityToSpectrogramColor(intensity: number) {
  const clamped = Math.max(0, Math.min(1, intensity));
  for (let i = 0; i < SPECTROGRAM_COLOR_STOPS.length - 1; i++) {
    const current = SPECTROGRAM_COLOR_STOPS[i];
    const next = SPECTROGRAM_COLOR_STOPS[i + 1];
    if (clamped >= current.stop && clamped <= next.stop) {
      const localT = (clamped - current.stop) / Math.max(next.stop - current.stop, 1e-6);
      const [r, g, b] = lerpColor(current.color, next.color, localT);
      return `rgb(${r},${g},${b})`;
    }
  }
  const [r, g, b] = SPECTROGRAM_COLOR_STOPS[SPECTROGRAM_COLOR_STOPS.length - 1].color;
  return `rgb(${r},${g},${b})`;
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

export function estimateFundamentalFrequency(values: Float32Array, sampleRate: number) {
  const magnitude = values.map((v) => 10 ** (v / 20));
  const downSampled: number[] = [];
  const maxIndex = values.length / 2;
  for (let i = 1; i < maxIndex; i++) {
    downSampled.push(magnitude[i]);
  }

  const maxLag = Math.min(1000, downSampled.length - 1);
  const fftMagnitudeBuffer = new Float32Array(maxLag);
  const fftHpsBuffer = new Float32Array(maxLag);
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

export async function analyzeSpectrogramFrames(buffer: AudioBuffer, columns: number) {
  const frames: SpectrogramFrame[] = [];
  const fftSize = 2048;
  const channelData = buffer.getChannelData(0);
  const binCount = fftSize / 2;
  const peakMagnitudes = new Float32Array(binCount);
  const window = getHannWindow(fftSize);
  const totalSamples = channelData.length;
  const maxStartSample = Math.max(0, totalSamples - fftSize);
  const CHUNK_SIZE = 64;

  const processChunk = async (startColumn: number, endColumn: number) => {
    for (let column = startColumn; column < endColumn; column++) {
      const position = column / columns;
      const startSample = Math.max(0, Math.min(Math.floor(position * maxStartSample), maxStartSample));
      const real = new Float32Array(fftSize);
      const imag = new Float32Array(fftSize);
      for (let i = 0; i < fftSize; i++) {
        const sampleIndex = startSample + i;
        real[i] = (channelData[sampleIndex] ?? 0) * window[i];
      }
      fftRadix2(real, imag);

      const magnitudes = new Float32Array(binCount);
      for (let i = 0; i < binCount; i++) {
        const magnitude = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]);
        const db = 20 * Math.log10(Math.max(magnitude, 1e-12));
        magnitudes[i] = db;
        if (db > peakMagnitudes[i]) {
          peakMagnitudes[i] = db;
        }
      }

      frames.push(magnitudes);
    }
  };

  for (let column = 0; column < columns; column += CHUNK_SIZE) {
    const endColumn = Math.min(column + CHUNK_SIZE, columns);
    processChunk(column, endColumn);
    if (endColumn < columns) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  const ceilingIndex = determineSpectrogramCeiling(peakMagnitudes, binCount - 1);
  const duration = buffer.duration;
  const sampleRate = buffer.sampleRate;
  const frequencies = frames.map((frame, index) => ({
    time: frames.length <= 1 ? 0 : (index / Math.max(frames.length - 1, 1)) * duration,
    freq: estimateFundamentalFrequency(frame, sampleRate),
  }));

  return {
    frames,
    ceilingIndex,
    duration,
    sampleRate,
    frequencies,
  };
}

export function drawSpectrogram(
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

  const drawableWidth = width - SPECTROGRAM_LEFT_MARGIN;
  const drawableHeight = height;
  const leftMargin = SPECTROGRAM_LEFT_MARGIN;
  const minLogFreq = MIN_LOG_FREQUENCY;
  const maxFreq = Math.max(sampleRate / 2, 1);
  const cappedTargetX = Math.min(drawableWidth, Math.max(0, Math.floor(progress * drawableWidth)));
  const targetX = cappedTargetX;
  const drawRange = reset
    ? { start: 0, end: targetX }
    : targetX > previousX
      ? { start: Math.max(previousX + 1, 0), end: targetX }
      : null;
  if (reset) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  }

  const MIN_DB = -100;
  const MAX_DB = 0;
  ctx.save();
  ctx.globalAlpha = 1;
  if (drawRange) {
    for (let x = drawRange.start; x <= drawRange.end; x++) {
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

        ctx.fillStyle = mapIntensityToSpectrogramColor(intensity);
        ctx.fillRect(columnX, rectY, 1, rectHeight);
      }
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
  const labelHeight = Math.max(11, Math.ceil(calculatedHeight || 0));
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
    ctx.lineTo(leftMargin + 6, y);
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

export function drawOfflineSpectrogram(
  data: OfflineSpectrogramData,
  canvas: HTMLCanvasElement,
  scale: FrequencyScale,
  reset?: boolean
) {
  if (data.frames.length === 0) return;
  let previousX = -1;
  const totalFrames = data.frames.length;
  for (let i = 0; i < totalFrames; i++) {
    const progress = totalFrames <= 1 ? 1 : i / (totalFrames - 1);
    previousX = drawSpectrogram(
      data.frames[i],
      canvas,
      progress,
      data.ceilingIndex,
      previousX,
      data.sampleRate,
      scale,
      reset && i === 0
    );
  }
  const { ctx, width, height } = prepareCanvas(canvas);
  if (ctx) {
    drawTimeTicks(ctx, data.duration, width, height, { leftMargin: SPECTROGRAM_LEFT_MARGIN });
  }
}

function computeAudioContentHash(buffer: AudioBuffer, maxSamples = 1000) {
  const channelData = buffer.getChannelData(0);
  const length = channelData.length;
  if (length === 0) {
    return 0;
  }
  const step = Math.max(1, Math.floor(length / maxSamples));
  let hash = 5381;
  for (let i = 0; i < length; i += step) {
    const sample = channelData[i];
    const intSample = Math.floor((sample + 1) * 32767);
    hash = ((hash << 5) + hash) ^ intSample;
    hash |= 0;
  }
  hash ^= buffer.sampleRate;
  hash ^= buffer.numberOfChannels << 16;
  return hash >>> 0;
}

export function buildSpectrogramSignature(buffer: AudioBuffer) {
  const contentHash = computeAudioContentHash(buffer);
  const durationHash = Math.floor(buffer.duration * 1000);
  const sampleRateHash = buffer.sampleRate;
  return `${contentHash}-${durationHash}-${sampleRateHash}-${buffer.numberOfChannels}`;
}
