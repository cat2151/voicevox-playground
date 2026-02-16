import * as Tone from 'tone';
import { FrequencyScale } from './config';
import { getColorVariable, invalidateColorVariableCache } from './status';
import { prepareCanvas } from './visualization/canvas';
import { drawRenderedWaveform, drawRealtimeWaveformBackground, drawRealtimeWaveformOnly } from './visualization/waveform';
import { drawRealtimeFFT } from './visualization/fftOverlay';
import { getMaxFreqByThreshold } from './visualization/fftMaxFreq';
import {
  analyzeSpectrogramFrames,
  buildSpectrogramSignature,
  drawOfflineSpectrogram,
  drawSpectrogram,
  OfflineSpectrogramData,
} from './visualization/spectrogram';
import { SPECTROGRAM_LEFT_MARGIN, buildTimeTicks } from './visualization/timeAxis';

let spectrogramScale: FrequencyScale = 'linear';
let spectrogramNeedsReset = false;
let realtimePreviousSegment: Float32Array | null = null;
let activePlaybackStopper: (() => void) | null = null;
type SpectrogramCache = {
  linear: OfflineSpectrogramData | null;
  log: OfflineSpectrogramData | null;
};
let cachedSpectrogramData: SpectrogramCache = { linear: null, log: null };
type SpectrogramImageCache = {
  linear: ImageBitmap | null;
  log: ImageBitmap | null;
};
let cachedSpectrogramImage: SpectrogramImageCache = { linear: null, log: null };
let pendingSpectrogramSignature: string | null = null;

export function getSpectrogramScale() {
  return spectrogramScale;
}

export function setSpectrogramScale(scale: FrequencyScale) {
  spectrogramScale = scale;
  spectrogramNeedsReset = true;
  const spectrogramCanvas = document.getElementById('spectrogram') as HTMLCanvasElement | null;
  if (spectrogramCanvas) {
    if (cachedSpectrogramImage[spectrogramScale]) {
      const { ctx, width, height } = prepareCanvas(spectrogramCanvas);
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(cachedSpectrogramImage[spectrogramScale]!, 0, 0, width, height);
      }
      spectrogramNeedsReset = false;
      return;
    }
    if (cachedSpectrogramData[spectrogramScale]) {
      drawOfflineSpectrogram(
        cachedSpectrogramData[spectrogramScale]!,
        spectrogramCanvas,
        spectrogramScale,
        true
      );
      createSpectrogramImageCache(spectrogramCanvas, spectrogramScale);
      spectrogramNeedsReset = false;
    } else {
      const { ctx, width, height } = prepareCanvas(spectrogramCanvas);
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }
    }
  }
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

export function initializeVisualizationCanvases(options?: { preserveSpectrogram?: boolean }) {
  const preserveSpectrogram = options?.preserveSpectrogram ?? false;
  if (!preserveSpectrogram) {
    cachedSpectrogramData = { linear: null, log: null };
    cachedSpectrogramImage = { linear: null, log: null };
  }
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
      cachedSpectrogramImage[spectrogramScale] = null;
    }
  });
}

function createSpectrogramImageCache(canvas: HTMLCanvasElement, scale: FrequencyScale) {
  if (!window.createImageBitmap) return;
  window.createImageBitmap(canvas).then((bitmap) => {
    cachedSpectrogramImage[scale] = bitmap;
    const spectrogramCanvas = document.getElementById('spectrogram') as HTMLCanvasElement | null;
    if (spectrogramCanvas && spectrogramScale === scale) {
      const { ctx, width, height } = prepareCanvas(spectrogramCanvas);
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(bitmap, 0, 0, width, height);
      }
      spectrogramNeedsReset = false;
    }
  });
}

function analyzeAndCacheSpectrogram({
  decodedBuffer,
  columnCount,
  analysisSignature,
  requestSpectrogramDraw,
}: {
  decodedBuffer: AudioBuffer;
  columnCount: number;
  analysisSignature: string;
  requestSpectrogramDraw: (forceReset: boolean) => void;
}) {
  spectrogramNeedsReset = true;
  pendingSpectrogramSignature = analysisSignature;
  cachedSpectrogramImage = { linear: null, log: null };
  void Promise.resolve()
    .then(async () => {
      const [linear, log] = await Promise.all([
        analyzeSpectrogramFrames(decodedBuffer, columnCount),
        analyzeSpectrogramFrames(decodedBuffer, columnCount),
      ]);
      if (pendingSpectrogramSignature !== analysisSignature) {
        return;
      }
      cachedSpectrogramData = {
        linear: { ...linear, signature: analysisSignature },
        log: { ...log, signature: analysisSignature },
      };
      pendingSpectrogramSignature = null;
      spectrogramNeedsReset = true;
      requestSpectrogramDraw(true);
    })
    .catch((error) => {
      console.error('Error during spectrogram analysis:', error);
    });
}

function handleSpectrogramInitialization({
  decodedBuffer,
  spectrogramCanvas,
  shouldResetSpectrogram,
  spectrogramSignature,
  requestSpectrogramDraw,
}: {
  decodedBuffer: AudioBuffer;
  spectrogramCanvas: HTMLCanvasElement;
  shouldResetSpectrogram: boolean;
  spectrogramSignature: string;
  requestSpectrogramDraw: (forceReset: boolean) => void;
}) {
  const { width } = prepareCanvas(spectrogramCanvas);
  const columnCount = Math.max(1, width - SPECTROGRAM_LEFT_MARGIN);
  const shouldAnalyze = shouldResetSpectrogram
    || !cachedSpectrogramData.linear
    || !cachedSpectrogramData.log
    || cachedSpectrogramData.linear.signature !== spectrogramSignature
    || cachedSpectrogramData.log.signature !== spectrogramSignature;
  if (shouldAnalyze) {
    analyzeAndCacheSpectrogram({
      decodedBuffer,
      columnCount,
      analysisSignature: spectrogramSignature,
      requestSpectrogramDraw,
    });
  } else if (spectrogramNeedsReset && (cachedSpectrogramData.linear || cachedSpectrogramData.log)) {
    requestSpectrogramDraw(true);
  }
}

export async function playAudio(
  decodedBuffer: AudioBuffer,
  realtimeCanvas?: HTMLCanvasElement | null,
  spectrogramCanvas?: HTMLCanvasElement | null,
  options?: { resetSpectrogram?: boolean }
): Promise<{ stopped: boolean }> {
  await Tone.start();

  const sampleRate = Math.max(decodedBuffer.sampleRate, 1);
  const player = new Tone.Player(decodedBuffer);
  const channelData = decodedBuffer.getChannelData(0);
  const maxFreq = getMaxFreqByThreshold(channelData, sampleRate, 0.01);
  const waveformAnalyser = realtimeCanvas ? new Tone.Analyser('waveform', 1024) : null;
  const fftAnalyser = realtimeCanvas ? new Tone.Analyser('fft', 1024) : null;
  const renderedProgress = document.getElementById('renderedWaveformProgress') as HTMLDivElement | null;
  const spectrogramProgress = document.getElementById('spectrogramProgress') as HTMLDivElement | null;
  function setProgressPosition(element: HTMLDivElement, ratio: number, leftMargin: number) {
    const parent = element.parentElement;
    const width = parent?.clientWidth ?? 0;
    const clamped = Math.min(Math.max(ratio, 0), 1);
    if (width > 0) {
      const usableWidth = Math.max(width - leftMargin, 1);
      const leftPx = leftMargin + clamped * usableWidth;
      const leftPercent = (leftPx / width) * 100;
      element.style.left = `${leftPercent}%`;
    } else {
      element.style.left = `${clamped * 100}%`;
    }
    element.classList.add('is-active');
  }

  function updateProgressLines(ratio: number) {
    if (renderedProgress) {
      setProgressPosition(renderedProgress, ratio, 0);
    }
    if (spectrogramProgress) {
      setProgressPosition(spectrogramProgress, ratio, SPECTROGRAM_LEFT_MARGIN);
    }
  }

  function clearProgressLines() {
    [renderedProgress, spectrogramProgress].forEach((el) => {
      if (el) {
        el.classList.remove('is-active');
      }
    });
  }

  function drawRealtimeVisuals({
    waveformAnalyser,
    fftAnalyser,
    realtimeCanvas,
    sampleRate,
    maxFreq,
  }: {
    waveformAnalyser: Tone.Analyser | null;
    fftAnalyser: Tone.Analyser | null;
    realtimeCanvas: HTMLCanvasElement | null | undefined;
    sampleRate: number;
    maxFreq: number;
  }): number | undefined {
    if (realtimeCanvas) {
      drawRealtimeWaveformBackground(realtimeCanvas);
    }
    let fftTopFreq: number | undefined = undefined;
    if (fftAnalyser && realtimeCanvas) {
      const fftValues = fftAnalyser.getValue() as Float32Array;
      drawRealtimeFFT(fftValues, realtimeCanvas, sampleRate, maxFreq);
      const binCount = fftValues.length;
      const nyquist = sampleRate / 2;
      const valueWithIndex = Array.from(fftValues, (v, i) => ({ v, i }));
      valueWithIndex.sort((a, b) => b.v - a.v);
      const topBin = valueWithIndex[0]?.i;
      if (typeof topBin === 'number') {
        fftTopFreq = (topBin / (binCount - 1)) * nyquist;
      }
    }
    if (waveformAnalyser && realtimeCanvas) {
      const values = waveformAnalyser.getValue() as Float32Array;
      const targetFreq = (typeof fftTopFreq === 'number' && isFinite(fftTopFreq) && fftTopFreq > 0) ? fftTopFreq : 440;
      const result = drawRealtimeWaveformOnly(values, realtimeCanvas, sampleRate, realtimePreviousSegment, targetFreq);
      realtimePreviousSegment = result.previousSegment;
    }
    return fftTopFreq;
  }

  function handleSpectrogramDraw({
    spectrogramCanvas,
    cache,
    scale,
    forceReset,
  }: {
    spectrogramCanvas: HTMLCanvasElement;
    cache: OfflineSpectrogramData;
    scale: FrequencyScale;
    forceReset: boolean;
  }) {
    drawOfflineSpectrogram(cache, spectrogramCanvas, scale, forceReset);
    createSpectrogramImageCache(spectrogramCanvas, scale);
    spectrogramNeedsReset = false;
    spectrogramDrawPending = false;
  }

  function cleanupPlayback({
    animationId,
    waveformAnalyser,
    fftAnalyser,
    player,
  }: {
    animationId: number | null;
    waveformAnalyser: Tone.Analyser | null;
    fftAnalyser: Tone.Analyser | null;
    player: Tone.Player;
  }) {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
    }
    clearProgressLines();
    waveformAnalyser?.dispose();
    fftAnalyser?.dispose();
    player.dispose();
  }

  const playbackDurationMs = Math.max(decodedBuffer.duration * 1000, 1);
  const shouldResetSpectrogram = options?.resetSpectrogram ?? true;
  spectrogramNeedsReset = shouldResetSpectrogram;
  const spectrogramSignature = buildSpectrogramSignature(decodedBuffer);
  let animationId: number | null = null;
  realtimePreviousSegment = null;
  let playbackStarted = false;
  let spectrogramDrawPending = false;
  function requestSpectrogramDraw(forceReset: boolean) {
    if (!spectrogramCanvas) return;
    const cache = cachedSpectrogramData[spectrogramScale];
    if (!cache || cache.signature !== spectrogramSignature) return;
    if (!playbackStarted) {
      spectrogramDrawPending = true;
      return;
    }
    handleSpectrogramDraw({
      spectrogramCanvas,
      cache,
      scale: spectrogramScale,
      forceReset,
    });
  }

  if (spectrogramCanvas) {
    handleSpectrogramInitialization({
      decodedBuffer,
      spectrogramCanvas,
      shouldResetSpectrogram,
      spectrogramSignature,
      requestSpectrogramDraw,
    });
  }

  if (waveformAnalyser) {
    player.connect(waveformAnalyser);
  }

  if (fftAnalyser) {
    player.connect(fftAnalyser);
  }

  player.toDestination();
  player.start();
  const startTime = performance.now();
  playbackStarted = true;
  updateProgressLines(0);
  if (spectrogramDrawPending) {
    requestSpectrogramDraw(true);
  }

  function render() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / playbackDurationMs, 1);
    drawRealtimeVisuals({
      waveformAnalyser,
      fftAnalyser,
      realtimeCanvas,
      sampleRate,
      maxFreq,
    });
    if (spectrogramNeedsReset) {
      requestSpectrogramDraw(true);
    }
    updateProgressLines(progress);
    animationId = requestAnimationFrame(render);
  }

  if (waveformAnalyser || fftAnalyser) {
    render();
  }

  return new Promise<{ stopped: boolean }>((resolve) => {
    let resolved = false;
    let stoppedByUser = false;

    function finalize() {
      cleanupPlayback({
        animationId,
        waveformAnalyser,
        fftAnalyser,
        player,
      });
      if (activePlaybackStopper === stopPlayback) {
        activePlaybackStopper = null;
      }
    }

    function stopPlayback() {
      if (resolved) return;
      resolved = true;
      stoppedByUser = true;
      if (player.state === 'started') {
        player.stop();
      }
      finalize();
      resolve({ stopped: stoppedByUser });
    }

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

export {
  analyzeSpectrogramFrames,
  buildSpectrogramSignature,
  drawRenderedWaveform,
  buildTimeTicks,
};
