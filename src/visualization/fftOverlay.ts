import { prepareCanvas } from './canvas';
import { getColorVariable } from '../status';
import { xToFreq, freqToBinF, getInterpolatedValue, fftValueToY } from './fftUtils';

const MIN_FREQ = 100;
const TOP_PERCENT = 0.02; // 0.01はNGだった

export function drawRealtimeFFT(
  fftValues: Float32Array,
  canvas: HTMLCanvasElement,
  sampleRate: number,
  maxFreq: number
) {
  const { ctx, width, height } = prepareCanvas(canvas);
  if (!ctx || fftValues.length === 0) return;

  ctx.save();
  ctx.globalAlpha = 0.7;
  const binCount = fftValues.length;
  const nyquist = sampleRate / 2;
  const freqLimit = Math.max(1, Math.min(maxFreq, nyquist));
  const minBin = Math.ceil((MIN_FREQ / nyquist) * (binCount - 1));
  const { topFreq, minTopBin, topBinSet } = getTopFreqInfo(fftValues, minBin, binCount, nyquist);

  const logMinFreq = Math.log10(MIN_FREQ);
  const logMaxFreq = Math.log10(freqLimit);

  const { peakX, peakY } = findPeakPosition(fftValues, minTopBin, minBin, binCount, width, logMinFreq, logMaxFreq, nyquist, height);
  if (peakX !== undefined && peakY !== undefined) {
    drawPeakLine(ctx, peakX, peakY, height);
  }

  drawFFTLine(ctx, fftValues, width, height, logMinFreq, logMaxFreq, nyquist, binCount);
  drawTopBinLine(ctx, fftValues, width, height, logMinFreq, logMaxFreq, nyquist, binCount, topBinSet);
  if (typeof topFreq === 'number' && isFinite(topFreq)) {
    drawPeakLabel(ctx, topFreq, height);
  }
  ctx.restore();
}

function getTopFreqInfo(
  fftValues: Float32Array,
  minBin: number,
  binCount: number,
  nyquist: number
): { topFreq?: number; minTopBin?: number; topBinSet: Set<number> } {
  const valueWithIndex = Array.from(fftValues, (v, i) => ({ v, i })).filter(({ i }) => i >= minBin);
  valueWithIndex.sort((a, b) => {
    if (b.v !== a.v) return b.v - a.v;
    return a.i - b.i;
  });
  if (valueWithIndex.length > 0) {
    const topCount = Math.max(1, Math.floor(valueWithIndex.length * TOP_PERCENT));
    const topBins = valueWithIndex.slice(0, topCount).map(({ i }) => i);
    const topBinSet: Set<number> = new Set<number>(topBins);
    const minTopBin = Math.min(...Array.from(topBinSet));
    const topFreq = (minTopBin / (binCount - 1)) * nyquist;
    return { topFreq, minTopBin, topBinSet };
  }
  return { topFreq: undefined, minTopBin: undefined, topBinSet: new Set<number>() };
}

function findPeakPosition(
  fftValues: Float32Array,
  minTopBin: number | undefined,
  minBin: number,
  binCount: number,
  width: number,
  logMinFreq: number,
  logMaxFreq: number,
  nyquist: number,
  height: number
): { peakX?: number; peakY?: number } {
  let searchStart = minTopBin !== undefined ? minTopBin : minBin;
  let lastIncreasingBin = searchStart;
  let lastValue = fftValues[searchStart];
  for (let bin = searchStart + 1; bin < binCount - 2; bin++) {
    const value = fftValues[bin];
    if (value >= lastValue) {
      lastIncreasingBin = bin;
      lastValue = value;
    } else {
      break;
    }
  }
  let minDx = Infinity;
  let minX = 0;
  for (let x = 0; x < width; x++) {
    const freq = xToFreq(x, width, logMinFreq, logMaxFreq);
    const binF = freqToBinF(freq, nyquist, binCount);
    const dx = Math.abs(binF - lastIncreasingBin);
    if (dx < minDx) {
      minDx = dx;
      minX = x;
    }
  }
  const freq = xToFreq(minX, width, logMinFreq, logMaxFreq);
  const binF = freqToBinF(freq, nyquist, binCount);
  const value = getInterpolatedValue(fftValues, binF);
  const y = fftValueToY(value, height);
  return { peakX: minX, peakY: y };
}

function drawPeakLine(ctx: CanvasRenderingContext2D, peakX: number, peakY: number, height: number) {
  ctx.save();
  ctx.strokeStyle = getColorVariable('--top-peak-color', '#FD971F');
  ctx.beginPath();
  ctx.moveTo(peakX, peakY);
  ctx.lineTo(peakX, height);
  ctx.stroke();
  ctx.restore();
}

function drawFFTLine(
  ctx: CanvasRenderingContext2D,
  fftValues: Float32Array,
  width: number,
  height: number,
  logMinFreq: number,
  logMaxFreq: number,
  nyquist: number,
  binCount: number
) {
  ctx.strokeStyle = getColorVariable('--secondary-color', '#2196F3');
  ctx.beginPath();
  for (let x = 0; x < width; x++) {
    const freq = xToFreq(x, width, logMinFreq, logMaxFreq);
    const binF = freqToBinF(freq, nyquist, binCount);
    const value = getInterpolatedValue(fftValues, binF);
    const y = fftValueToY(value, height);
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

function drawTopBinLine(
  ctx: CanvasRenderingContext2D,
  fftValues: Float32Array,
  width: number,
  height: number,
  logMinFreq: number,
  logMaxFreq: number,
  nyquist: number,
  binCount: number,
  topBinSet: Set<number>
) {
  ctx.strokeStyle = '#FF69B4';
  ctx.beginPath();
  let drawing = false;
  for (let x = 0; x < width; x++) {
    const freq = xToFreq(x, width, logMinFreq, logMaxFreq);
    const binF = freqToBinF(freq, nyquist, binCount);
    const binIdx = Math.round(binF);
    const value = getInterpolatedValue(fftValues, binF);
    const y = fftValueToY(value, height);
    if (topBinSet.has(binIdx)) {
      if (!drawing) {
        ctx.moveTo(x, y);
        drawing = true;
      } else {
        ctx.lineTo(x, y);
      }
    } else {
      if (drawing) {
        ctx.stroke();
        ctx.beginPath();
        drawing = false;
      }
    }
  }
  if (drawing) ctx.stroke();
}

function drawPeakLabel(ctx: CanvasRenderingContext2D, topFreq: number, height: number) {
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.font = 'bold 12px monospace';
  ctx.fillStyle = getColorVariable('--top-peak-color', '#FD971F');
  const freqStr = String(Math.round(topFreq)).padStart(4, ' ');
  const text = `${freqStr}Hz`;
  const padding = 6;
  ctx.textBaseline = 'bottom';
  ctx.textAlign = 'left';
  ctx.fillText(text, padding, height - padding);
  ctx.restore();
}
