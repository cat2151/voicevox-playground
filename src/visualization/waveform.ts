import { WAVEFORM_TARGET_RATIO } from '../config';
import { getColorVariable } from '../status';
import { prepareCanvas } from './canvas';
import { getHannWindow, fftRadix2 } from './fft';
import { drawTimeTicks } from './timeAxis';

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
  const columns = Math.max(1, Math.min(frequencies.length, maxPoints));
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

function extractAlignedRealtimeSegment(values: Float32Array, targetLength: number, previous: Float32Array | null) {
  const length = Math.min(targetLength, values.length);
  const realtimeSegmentBuffer = new Float32Array(length);

  if (!previous || previous.length < length) {
    realtimeSegmentBuffer.set(values.slice(values.length - length));
    return { segment: realtimeSegmentBuffer, updatedPrevious: realtimeSegmentBuffer };
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
  return { segment: realtimeSegmentBuffer, updatedPrevious: realtimeSegmentBuffer };
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
  let maxAbs = 0;
  for (let i = 0; i < totalSamples; i++) {
    const abs = Math.abs(channelData[i]);
    if (abs > maxAbs) {
      maxAbs = abs;
    }
  }
  const samplesPerPixel = Math.max(1, Math.floor(totalSamples / width));
  const baseHalfHeight = (height * WAVEFORM_TARGET_RATIO) / 2;
  const amplitudeScale = baseHalfHeight / Math.max(maxAbs, 1e-4);
  const centerY = height / 2;

  ctx.save();
  ctx.strokeStyle = getColorVariable('--grid-color', 'rgba(0,0,0,0.08)');
  ctx.fillStyle = getColorVariable('--axis-label', '#666666');
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const labelMetrics = ctx.measureText('-00 dB');
  const labelHeight = (labelMetrics.actualBoundingBoxAscent ?? 0) + (labelMetrics.actualBoundingBoxDescent ?? 0);
  const minLabelGap = Math.max(11, Math.ceil(labelHeight || 0)) + 2;
  let lastLabelY: number | null = null;
  for (let db = 0; db >= -60; db -= 6) {
    const amplitudeRatio = 10 ** (db / 20);
    const offset = amplitudeRatio * baseHalfHeight;
    if (offset > height) break;
    const positions = [centerY - offset, centerY + offset];
    const label = `${db} dB`;
    for (const y of positions) {
      if (y < 0 || y > height) continue;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      if (lastLabelY === null || Math.abs(y - lastLabelY) >= minLabelGap) {
        ctx.fillText(label, 6, y);
        lastLabelY = y;
      }
    }
  }
  ctx.restore();

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
    const yMin = centerY - min * amplitudeScale;
    const yMax = centerY - max * amplitudeScale;
    ctx.moveTo(x, yMin);
    ctx.lineTo(x, yMax);
  }
  ctx.stroke();

  const frequencies = estimateFrequencySeries(channelData, buffer.sampleRate, width / 6);
  if (frequencies.length > 0) {
    const highlightColor = getColorVariable('--highlight-color', '#ff9800');
    ctx.strokeStyle = highlightColor;
    ctx.fillStyle = highlightColor;
    ctx.beginPath();
    frequencies.forEach((freq, index) => {
      const x = (freq.time / buffer.duration) * width;
      const y = height - (Math.log10(freq.freq + 1) / Math.log10(buffer.sampleRate / 2 + 1)) * height;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      ctx.fillRect(x - 1, y - 1, 2, 2);
    });
    ctx.stroke();
  }

  drawTimeTicks(ctx, buffer.duration, width, height);
}

export function drawRealtimeWaveform(
  values: Float32Array,
  canvas: HTMLCanvasElement,
  sampleRate: number,
  currentEstimatedFrequency: number | null,
  previousSegment: Float32Array | null
) {
  const { ctx, width, height } = prepareCanvas(canvas);
  if (!ctx || values.length === 0) return { previousSegment: null };

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

  const { segment, updatedPrevious } = extractAlignedRealtimeSegment(windowed, segmentLength, previousSegment);
  let segmentMaxAbs = 0;
  for (let i = 0; i < segment.length; i++) {
    const abs = Math.abs(segment[i]);
    if (abs > segmentMaxAbs) {
      segmentMaxAbs = abs;
    }
  }
  const samplesPerPixel = Math.max(1, segment.length / width);
  const baseHalfHeight = (height * WAVEFORM_TARGET_RATIO) / 2;
  const amplitudeScale = baseHalfHeight / Math.max(segmentMaxAbs, 1e-4);

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
    const yMin = height / 2 - min * amplitudeScale;
    const yMax = height / 2 - max * amplitudeScale;
    ctx.moveTo(x, yMin);
    ctx.lineTo(x, yMax);
  }
  ctx.stroke();

  return { previousSegment: updatedPrevious };
}
