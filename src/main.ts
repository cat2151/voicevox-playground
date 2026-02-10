import * as Tone from 'tone';

// VOICEVOX API settings
const VOICEVOX_API_BASE = 'http://localhost:50021';
const ZUNDAMON_SPEAKER_ID = 3; // ずんだもんのスピーカーID
const REQUEST_TIMEOUT_MS = 10000; // 10 second timeout
const AUTO_PLAY_DEBOUNCE_MS = 700;
const WAVEFORM_TARGET_RATIO = 0.8;
const SPECTROGRAM_MAX_COLUMNS_PER_FRAME = 12;
const AUDIO_CACHE_LIMIT = 10;

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

function drawRenderedWaveform(buffer: AudioBuffer, canvas: HTMLCanvasElement) {
  const { ctx, width, height } = prepareCanvas(canvas);
  if (!ctx) return;
  const channelData = buffer.getChannelData(0);
  const maxAbs = channelData.reduce((max, value) => {
    const abs = Math.abs(value);
    return abs > max ? abs : max;
  }, 0);
  const amplitudeScale =
    (height * 0.5 * WAVEFORM_TARGET_RATIO) / (maxAbs > 0 ? maxAbs : 1);
  const samplesPerPixel = Math.max(1, Math.floor(channelData.length / width));

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  ctx.strokeStyle = getColorVariable('--accent-color', '#4caf50');
  ctx.beginPath();
  for (let x = 0; x < width; x++) {
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
    const y1 = height / 2 - max * amplitudeScale;
    const y2 = height / 2 - min * amplitudeScale;
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
  }
  ctx.stroke();
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
  lastX: number
) {
  const { ctx, width, height } = prepareCanvas(canvas);
  if (!ctx || width === 0) return lastX;

  const accent = getColorVariable('--accent-color', '#4caf50');
  const background = getColorVariable('--bg-color', '#ffffff');
  const cappedCeiling = Math.max(1, Math.min(frequencyCeiling, values.length - 1));
  const targetX = Math.max(0, Math.min(width - 1, Math.floor(progress * (width - 1))));

  if (targetX < lastX) {
    ctx.clearRect(0, 0, width, height);
    lastX = -1;
  }

  const startX = Math.max(lastX + 1, 0);
  const cappedTargetX = Math.min(targetX, startX + SPECTROGRAM_MAX_COLUMNS_PER_FRAME - 1);
  for (let drawX = startX; drawX <= cappedTargetX; drawX++) {
    ctx.fillStyle = background;
    ctx.globalAlpha = 1;
    ctx.fillRect(drawX, 0, 1, height);

    for (let y = 0; y < height; y++) {
      const dataIndex = Math.floor((y / height) * (cappedCeiling + 1));
      const magnitude = Number.isFinite(values[dataIndex]) ? values[dataIndex] : -120;
      const normalized = Math.max(Math.min((magnitude + 120) / 120, 1), 0);
      ctx.fillStyle = accent;
      ctx.globalAlpha = normalized;
      ctx.fillRect(drawX, height - y - 1, 1, 1);
    }
  }
  ctx.globalAlpha = 1;

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

    if (id !== 'spectrogram') {
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    }
  });
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
      spectrogramX = drawSpectrogram(values, spectrogramCanvas, progress, spectrogramCeiling, spectrogramX);
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

  initializeVisualizationCanvases();
  window.addEventListener('resize', initializeVisualizationCanvases);
});
