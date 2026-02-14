import { getColorVariable } from '../status';

export const SPECTROGRAM_LEFT_MARGIN = 40;
export const TIME_TICK_STEP_SECONDS = 0.5;

function formatTimeLabel(seconds: number) {
  const text = seconds.toFixed(3).replace(/\.?0+$/, '');
  return `${text}s`;
}

export function buildTimeTicks(duration: number, stepSeconds = TIME_TICK_STEP_SECONDS) {
  if (duration <= 0 || stepSeconds <= 0) {
    return [];
  }
  const ticks: number[] = [0];
  for (let t = stepSeconds; t < duration - 1e-6; t += stepSeconds) {
    ticks.push(Number(t.toFixed(3)));
  }
  ticks.push(Number(duration.toFixed(3)));
  return ticks;
}

export function drawTimeTicks(
  ctx: CanvasRenderingContext2D,
  duration: number,
  width: number,
  height: number,
  options?: { leftMargin?: number }
) {
  const ticks = buildTimeTicks(duration);
  if (ticks.length === 0) return;

  const leftMargin = options?.leftMargin ?? 0;
  const drawableWidth = Math.max(1, width - leftMargin);
  const safeDuration = Math.max(duration, 1e-6);
  const gridColor = getColorVariable('--grid-color', 'rgba(0,0,0,0.06)');
  const labelColor = getColorVariable('--axis-label', '#666666');

  ctx.save();
  ctx.strokeStyle = gridColor;
  ctx.beginPath();
  ticks.forEach((time) => {
    const x = leftMargin + Math.min(drawableWidth, Math.max(0, (time / safeDuration) * drawableWidth));
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  });
  ctx.stroke();

  ctx.fillStyle = labelColor;
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  const labelY = height - 2;
  ticks.forEach((time) => {
    const x = leftMargin + Math.min(drawableWidth, Math.max(0, (time / safeDuration) * drawableWidth));
    const label = formatTimeLabel(time);
    const labelWidth = ctx.measureText(label).width;
    const halfWidth = labelWidth / 2;
    const minX = leftMargin + halfWidth;
    const maxX = leftMargin + drawableWidth - halfWidth;
    const clampedX = Math.min(maxX, Math.max(minX, x));
    ctx.fillText(label, clampedX, labelY);
  });
  ctx.restore();
}
