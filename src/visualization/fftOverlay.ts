import { prepareCanvas } from './canvas';
import { getColorVariable } from '../status';

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
  const valueWithIndex = Array.from(fftValues, (v, i) => ({ v, i }));
  valueWithIndex.sort((a, b) => b.v - a.v);
  const topBin = valueWithIndex[0]?.i;
  let topFreq: number | undefined = undefined;
  if (typeof topBin === 'number') {
    topFreq = (topBin / (binCount - 1)) * nyquist;
  }

  for (let x = 0; x < width; x++) {
    const freq = (x / (width - 1)) * freqLimit;
    const bin = Math.min(binCount - 1, Math.round((freq / nyquist) * (binCount - 1)));
    if (bin === topBin) {
      const value = fftValues[bin] ?? 0;
      const norm = Math.max(0, Math.min(1, 1 + value / 100));
      const y = height - norm * height;
      ctx.save();
      ctx.strokeStyle = getColorVariable('--top-peak-color', '#FD971F');
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.restore();
    }
  }

  ctx.strokeStyle = getColorVariable('--secondary-color', '#2196F3');
  ctx.beginPath();
  for (let x = 0; x < width; x++) {
    const freq = (x / (width - 1)) * freqLimit;
    const bin = Math.min(binCount - 1, Math.round((freq / nyquist) * (binCount - 1)));
    const value = fftValues[bin] ?? 0;
    const norm = Math.max(0, Math.min(1, 1 + value / 100));
    const y = height - norm * height;
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  if (typeof topFreq === 'number' && isFinite(topFreq)) {
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
  ctx.restore();
}
