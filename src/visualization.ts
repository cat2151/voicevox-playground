import * as Tone from 'tone';
import { FrequencyScale } from './config';
import { getColorVariable, invalidateColorVariableCache } from './status';
import { prepareCanvas } from './visualization/canvas';
import { drawRenderedWaveform, drawRealtimeWaveform } from './visualization/waveform';
import {
  analyzeSpectrogramFrames,
  buildSpectrogramSignature,
  drawOfflineSpectrogram,
  drawSpectrogram,
  estimateFundamentalFrequency,
  OfflineSpectrogramData,
} from './visualization/spectrogram';
import { SPECTROGRAM_LEFT_MARGIN, buildTimeTicks } from './visualization/timeAxis';

let spectrogramScale: FrequencyScale = 'linear';
let spectrogramNeedsReset = false;
let realtimePreviousSegment: Float32Array | null = null;
let activePlaybackStopper: (() => void) | null = null;
let cachedSpectrogramData: OfflineSpectrogramData | null = null;
let pendingSpectrogramSignature: string | null = null;

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

export function initializeVisualizationCanvases(options?: { preserveSpectrogram?: boolean }) {
  const preserveSpectrogram = options?.preserveSpectrogram ?? false;
  if (!preserveSpectrogram) {
    cachedSpectrogramData = null;
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
  const waveformAnalyser = realtimeCanvas ? new Tone.Analyser('waveform', 1024) : null;
  const fftAnalyser = spectrogramCanvas ? new Tone.Analyser('fft', 1024) : null;
  const renderedProgress = document.getElementById('renderedWaveformProgress') as HTMLDivElement | null;
  const spectrogramProgress = document.getElementById('spectrogramProgress') as HTMLDivElement | null;
  const setProgressPosition = (element: HTMLDivElement, ratio: number, leftMargin: number) => {
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
  };
  const updateProgressLines = (ratio: number) => {
    if (renderedProgress) {
      setProgressPosition(renderedProgress, ratio, 0);
    }
    if (spectrogramProgress) {
      setProgressPosition(spectrogramProgress, ratio, SPECTROGRAM_LEFT_MARGIN);
    }
  };
  const clearProgressLines = () => {
    [renderedProgress, spectrogramProgress].forEach((el) => {
      if (el) {
        el.classList.remove('is-active');
      }
    });
  };

  const playbackDurationMs = Math.max(decodedBuffer.duration * 1000, 1);
  const sampleRate = Math.max(decodedBuffer.sampleRate, 1);
  const shouldResetSpectrogram = options?.resetSpectrogram ?? true;
  spectrogramNeedsReset = shouldResetSpectrogram;
  const spectrogramSignature = buildSpectrogramSignature(decodedBuffer);
  let animationId: number | null = null;
  realtimePreviousSegment = null;
  let currentEstimatedFrequency: number | null = null;
  let playbackStarted = false;
  let spectrogramDrawPending = false;
  const requestSpectrogramDraw = (forceReset: boolean) => {
    if (!spectrogramCanvas || !cachedSpectrogramData) {
      return;
    }
    if (cachedSpectrogramData.signature !== spectrogramSignature) {
      return;
    }
    if (!playbackStarted) {
      spectrogramDrawPending = true;
      return;
    }
    drawOfflineSpectrogram(cachedSpectrogramData, spectrogramCanvas, spectrogramScale, forceReset);
    spectrogramNeedsReset = false;
    spectrogramDrawPending = false;
  };

  if (spectrogramCanvas) {
    const { width } = prepareCanvas(spectrogramCanvas);
    const columnCount = Math.max(1, width - SPECTROGRAM_LEFT_MARGIN);
    const shouldAnalyze = shouldResetSpectrogram
      || !cachedSpectrogramData
      || cachedSpectrogramData.signature !== spectrogramSignature;
    if (shouldAnalyze) {
      spectrogramNeedsReset = true;
      const analysisSignature = spectrogramSignature;
      pendingSpectrogramSignature = analysisSignature;
      void Promise.resolve()
        .then(async () => {
          const analysis = await analyzeSpectrogramFrames(decodedBuffer, columnCount);
          if (pendingSpectrogramSignature !== analysisSignature) {
            return;
          }
          cachedSpectrogramData = {
            ...analysis,
            signature: analysisSignature,
          };
          pendingSpectrogramSignature = null;
          spectrogramNeedsReset = true;
          requestSpectrogramDraw(true);
        })
        .catch((error) => {
          console.error('Error during spectrogram analysis:', error);
        });
    } else if (spectrogramNeedsReset && cachedSpectrogramData) {
      requestSpectrogramDraw(true);
    }
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

  const render = () => {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / playbackDurationMs, 1);

    if (fftAnalyser) {
      const values = fftAnalyser.getValue() as Float32Array;
      currentEstimatedFrequency = estimateFundamentalFrequency(values, sampleRate);
    }

    if (spectrogramNeedsReset) {
      requestSpectrogramDraw(true);
    }

    if (waveformAnalyser && realtimeCanvas) {
      const values = waveformAnalyser.getValue() as Float32Array;
      const result = drawRealtimeWaveform(values, realtimeCanvas, sampleRate, currentEstimatedFrequency, realtimePreviousSegment);
      realtimePreviousSegment = result.previousSegment;
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

export {
  analyzeSpectrogramFrames,
  buildSpectrogramSignature,
  drawRenderedWaveform,
  buildTimeTicks,
};
