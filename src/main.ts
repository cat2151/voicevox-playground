import * as Tone from 'tone';

// VOICEVOX API settings
const VOICEVOX_API_BASE = 'http://localhost:50021';
const ZUNDAMON_SPEAKER_ID = 3; // ずんだもんのスピーカーID
const REQUEST_TIMEOUT_MS = 10000; // 10 second timeout
const AUTO_PLAY_DEBOUNCE_MS = 700;

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
    let min = 1;
    let max = -1;
    for (let i = 0; i < samplesPerPixel && start + i < channelData.length; i++) {
      const v = channelData[start + i];
      if (v < min) min = v;
      if (v > max) max = v;
    }
    const y1 = ((1 - max) * height) / 2;
    const y2 = ((1 - min) * height) / 2;
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

  const step = values.length / width;
  ctx.strokeStyle = getColorVariable('--accent-color', '#4caf50');
  ctx.beginPath();
  for (let x = 0; x < width; x++) {
    const index = Math.floor(x * step);
    const v = values[index] ?? 0;
    const y = (0.5 - v / 2) * height;
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

function drawSpectrogram(values: Float32Array, canvas: HTMLCanvasElement, x: number) {
  const { ctx, width, height, dpr } = prepareCanvas(canvas);
  if (!ctx) return x;
  if (x >= width) {
    if (width > 1) {
      const shift = Math.max(1, Math.round(dpr));
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(canvas, shift, 0, canvas.width - shift, canvas.height, 0, 0, canvas.width - shift, canvas.height);
      ctx.restore();
      x = width - 1;
    } else {
      x = 0;
    }
  }

  const accent = getColorVariable('--accent-color', '#4caf50');
  const background = getColorVariable('--bg-color', '#ffffff');
  ctx.fillStyle = background;
  ctx.fillRect(x, 0, 1, height);

  for (let y = 0; y < height; y++) {
    const dataIndex = Math.floor((y / height) * values.length);
    const magnitude = Number.isFinite(values[dataIndex]) ? values[dataIndex] : -120;
    const normalized = Math.max(Math.min((magnitude + 120) / 120, 1), 0);
    ctx.fillStyle = accent;
    ctx.globalAlpha = normalized;
    ctx.fillRect(x, height - y - 1, 1, 1);
  }
  ctx.globalAlpha = 1;

  return x + 1;
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
  link.click();
  URL.revokeObjectURL(url);
}

function scheduleAutoPlay() {
  if (autoPlayTimer !== null) {
    window.clearTimeout(autoPlayTimer);
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
  let spectrogramX = 0;

  const render = () => {
    if (waveformAnalyser && realtimeCanvas) {
      const values = waveformAnalyser.getValue() as Float32Array;
      drawRealtimeWaveform(values, realtimeCanvas);
    }

    if (fftAnalyser && spectrogramCanvas) {
      const values = fftAnalyser.getValue() as Float32Array;
      spectrogramX = drawSpectrogram(values, spectrogramCanvas, spectrogramX);
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
    // Step 1: Get audio query
    showStatus('音声クエリを作成中...', 'info');
    const audioQuery = await getAudioQuery(text, ZUNDAMON_SPEAKER_ID);
    
    // Step 2: Synthesize audio
    showStatus('音声を生成中...', 'info');
    const audioBuffer = await synthesize(audioQuery, ZUNDAMON_SPEAKER_ID);
    lastSynthesizedBuffer = audioBuffer.slice(0);
    const audioContext = Tone.getContext().rawContext as BaseAudioContext;
    const decodedBuffer = await audioContext.decodeAudioData(audioBuffer.slice(0));

    if (renderedCanvas) {
      drawRenderedWaveform(decodedBuffer, renderedCanvas);
    }
    
    // Step 3: Play audio
    showStatus('音声を再生中...', 'info');
    await playAudio(decodedBuffer, realtimeCanvas, spectrogramCanvas);
    
    showStatus('再生完了！', 'success');
    setTimeout(hideStatus, 3000);
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

  initializeVisualizationCanvases();
  window.addEventListener('resize', initializeVisualizationCanvases);
});
