import * as Tone from 'tone';

// VOICEVOX API settings
const VOICEVOX_API_BASE = 'http://localhost:50021';
const ZUNDAMON_SPEAKER_ID = 3; // ずんだもんのスピーカーID
const REQUEST_TIMEOUT_MS = 10000; // 10 second timeout
const AUTO_PLAY_DEBOUNCE_MS = 700;
const WAVEFORM_TARGET_RATIO = 0.8;
const SPECTROGRAM_MAX_COLUMNS_PER_FRAME = 12;
const AUDIO_CACHE_LIMIT = 10;
const INTONATION_DEBOUNCE_MS = 700;
const MIN_LOG_FREQUENCY = 20;
const MIN_TICK_SPACING_PX = 60;
const MONOKAI_COLORS = ['#f92672', '#a6e22e', '#66d9ef', '#fd971f', '#ae81ff', '#e6db74'];
const DELIMITER_STORAGE_KEY = 'voicevox-delimiter-pair';
const FAVORITES_STORAGE_KEY = 'voicevox-favorites';
const HISTORY_STORAGE_KEY = 'voicevox-history';
const INTONATION_FAVORITES_STORAGE_KEY = 'voicevox-intonation-favorites';
const TEXT_LIST_LIMIT = 20;
type FrequencyScale = 'linear' | 'log';

interface VoiceStyleOption {
  id: number;
  name: string;
  speakerName: string;
}

interface VoiceVoxSpeaker {
  name: string;
  styles: Array<{
    id: number;
    name: string;
  }>;
}

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

interface IntonationPoint {
  phraseIndex: number;
  moraIndex: number;
  label: string;
  pitch: number;
}

interface IntonationChartRange {
  min: number;
  max: number;
  margin: number;
  height: number;
  innerHeight: number;
  width: number;
}

interface IntonationFavorite {
  text: string;
  styleId: number;
  query: AudioQuery;
}

// Status display helper
function showStatus(message: string, type: 'info' | 'error' | 'success') {
  const statusDiv = document.getElementById('status');
  if (statusDiv) {
    if (statusHideTimer !== null) {
      clearTimeout(statusHideTimer);
      statusHideTimer = null;
    }
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    statusDiv.style.visibility = 'visible';
    // Use assertive for errors so screen readers interrupt to announce them
    statusDiv.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
  }
}

function hideStatus() {
  const statusDiv = document.getElementById('status');
  if (statusDiv) {
    statusDiv.textContent = '';
    statusDiv.className = 'status';
    statusDiv.style.visibility = 'hidden';
    statusDiv.setAttribute('aria-live', 'polite');
  }
  if (statusHideTimer !== null) {
    clearTimeout(statusHideTimer);
    statusHideTimer = null;
  }
}

function scheduleHideStatus(delayMs: number) {
  if (statusHideTimer !== null) {
    clearTimeout(statusHideTimer);
  }
  statusHideTimer = window.setTimeout(() => {
    statusHideTimer = null;
    hideStatus();
  }, delayMs);
}

let cachedRootComputedStyle: CSSStyleDeclaration | null = null;
const colorVariableCache: Record<string, string> = {};
let statusHideTimer: number | null = null;
let isProcessing = false;
let autoPlayTimer: number | null = null;
let lastSynthesizedBuffer: ArrayBuffer | null = null;
let lastSpectrogramSignature: string | null = null;
const audioCache = new Map<string, ArrayBuffer>();
let availableStyles: VoiceStyleOption[] = [];
let selectedStyleId = ZUNDAMON_SPEAKER_ID;
let delimiterSaveTimer: number | null = null;
let intonationCanvas: HTMLCanvasElement | null = null;
let intonationTimingEl: HTMLElement | null = null;
let intonationLabelsEl: HTMLElement | null = null;
let intonationMaxValueEl: HTMLElement | null = null;
let intonationMinValueEl: HTMLElement | null = null;
let spectrogramScale: FrequencyScale = 'linear';
let spectrogramNeedsReset = false;
let lastSpectrogramScale: FrequencyScale = 'linear';
let realtimePreviousSegment: Float32Array | null = null;
let realtimeSegmentBuffer: Float32Array | null = null;
let fftMagnitudeBuffer: Float32Array | null = null;
let fftHpsBuffer: Float32Array | null = null;
let currentIntonationQuery: AudioQuery | null = null;
let intonationPoints: IntonationPoint[] = [];
let intonationPointPositions: Array<{ x: number; y: number }> = [];
let intonationSelectedIndex: number | null = null;
let intonationDebounceTimer: number | null = null;
let intonationDragIndex: number | null = null;
let intonationActivePointerId: number | null = null;
let intonationChartRange: IntonationChartRange | null = null;
let intonationTopScale = 1;
let intonationBottomScale = 1;
let intonationKeyboardEnabled = false;
let currentIntonationStyleId = ZUNDAMON_SPEAKER_ID;
let favoriteTexts: string[] = [];
let historyTexts: string[] = [];
let favoritesListEl: HTMLUListElement | null = null;
let historyListEl: HTMLUListElement | null = null;
let intonationFavoritesListEl: HTMLUListElement | null = null;
let loopCheckboxEl: HTMLInputElement | null = null;
let intonationDirty = false;
let intonationFavorites: IntonationFavorite[] = [];

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

function getStyleLabel(style: VoiceStyleOption) {
  return `${style.speakerName} - ${style.name} (ID: ${style.id})`;
}

function getStyleById(id: number) {
  return availableStyles.find((style) => style.id === id) ?? null;
}

function resolveStyleMarker(marker: string, currentStyleId: number) {
  const trimmed = marker.trim();
  if (!trimmed) return null;

  const currentStyle = getStyleById(currentStyleId);
  const currentSpeaker = currentStyle?.speakerName ?? null;

  const speakerStyles = availableStyles.filter((style) => style.speakerName === trimmed);
  if (speakerStyles.length > 0) {
    const normalStyle = speakerStyles.find((style) => style.name === 'ノーマル');
    return normalStyle ?? speakerStyles[0];
  }

  if (currentSpeaker) {
    const sameSpeakerStyle = availableStyles.find(
      (style) => style.speakerName === currentSpeaker && style.name === trimmed
    );
    if (sameSpeakerStyle) return sameSpeakerStyle;
  }

  if (/^\d+$/.test(trimmed)) {
    const numericId = Number(trimmed);
    const byId = getStyleById(numericId);
    if (byId) return byId;
  }

  return null;
}

function parseDelimiterConfig(rawValue: string): { start: string; end: string } | null {
  const trimmed = rawValue.trim();
  if (trimmed.length < 2) return null;
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return { start: parts[0], end: parts[1] };
  }
  return { start: trimmed[0], end: trimmed[trimmed.length - 1] };
}

function getAudioCacheKey(text: string, styleId: number) {
  return `${styleId}::${text}`;
}

function loadStoredList(key: string) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string');
    }
  } catch (error) {
    console.warn(`Failed to load ${key}:`, error);
  }
  return [];
}

function persistList(key: string, list: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (error) {
    console.warn(`Failed to save ${key}:`, error);
  }
}

function dedupeAndLimit(list: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of list) {
    const trimmed = item.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
    if (result.length >= TEXT_LIST_LIMIT) break;
  }
  return result;
}

function dedupeIntonationFavorites(list: IntonationFavorite[]) {
  const seen = new Set<string>();
  const result: IntonationFavorite[] = [];
  for (const item of list) {
    if (!item || !item.text || !item.query || typeof item.styleId !== 'number') continue;
    const key = `${item.styleId}::${item.text.trim()}`;
    if (!item.text.trim() || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
    if (result.length >= TEXT_LIST_LIMIT) break;
  }
  return result;
}

function persistLists() {
  persistList(FAVORITES_STORAGE_KEY, favoriteTexts);
  persistList(HISTORY_STORAGE_KEY, historyTexts);
}

function loadIntonationFavorites() {
  try {
    const raw = localStorage.getItem(INTONATION_FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return dedupeIntonationFavorites(
        parsed.map((item) => {
          if (!item || typeof item !== 'object') return null;
          const { text, styleId, query } = item as Partial<IntonationFavorite>;
          if (typeof text !== 'string' || typeof styleId !== 'number' || !isValidAudioQueryShape(query)) return null;
          return { text: text.trim(), styleId, query } as IntonationFavorite;
        }).filter((item): item is IntonationFavorite => item !== null)
      );
    }
  } catch (error) {
    console.warn('Failed to load intonation favorites:', error);
  }
  return [];
}

function persistIntonationFavorites() {
  try {
    localStorage.setItem(INTONATION_FAVORITES_STORAGE_KEY, JSON.stringify(intonationFavorites));
  } catch (error) {
    console.warn('Failed to save intonation favorites:', error);
  }
}

function setTextAndPlay(text: string) {
  const textArea = document.getElementById('text') as HTMLTextAreaElement | null;
  if (!textArea) return;
  textArea.value = text;
  if (autoPlayTimer !== null) {
    window.clearTimeout(autoPlayTimer);
    autoPlayTimer = null;
  }
  scheduleAutoPlay();
}

function renderList(listEl: HTMLUListElement | null, items: string[], type: 'favorites' | 'history') {
  if (!listEl) return;
  listEl.textContent = '';
  items.forEach((text) => {
    const listItem = document.createElement('li');
    listItem.className = 'text-list__item';

    const playButton = document.createElement('button');
    playButton.type = 'button';
    playButton.className = 'text-list__text';
    playButton.textContent = text;
    playButton.addEventListener('click', () => setTextAndPlay(text));

    const actionButton = document.createElement('button');
    actionButton.type = 'button';
    actionButton.className = `text-list__action ${
      type === 'history' ? 'text-list__action--add' : 'text-list__action--remove'
    }`;
    actionButton.textContent = type === 'history' ? '＋' : '－';
    actionButton.setAttribute(
      'aria-label',
      type === 'history' ? 'お気に入りに入れる' : 'お気に入りから削除する'
    );
    actionButton.addEventListener('click', () => {
      if (type === 'history') {
        moveToFavorites(text);
      } else {
        moveToHistory(text);
      }
    });

    listItem.appendChild(playButton);
    listItem.appendChild(actionButton);
    listEl.appendChild(listItem);
  });
}

function renderTextLists() {
  renderList(favoritesListEl, favoriteTexts, 'favorites');
  renderList(historyListEl, historyTexts, 'history');
}

function renderIntonationFavoritesList() {
  const listEl = intonationFavoritesListEl;
  if (!listEl) return;
  listEl.textContent = '';
  intonationFavorites.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'text-list__item';

    const playButton = document.createElement('button');
    playButton.type = 'button';
    playButton.className = 'text-list__text';

    const pill = document.createElement('span');
    pill.className = 'text-list__pill';
    pill.textContent = 'イントネーション付き';
    playButton.appendChild(pill);

    const textSpan = document.createElement('span');
    textSpan.textContent = item.text;
    playButton.appendChild(textSpan);

    playButton.addEventListener('click', () => applyIntonationFavorite(item));

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'text-list__action text-list__action--remove';
    removeButton.textContent = '－';
    removeButton.setAttribute('aria-label', 'イントネーション付きお気に入りから削除する');
    removeButton.addEventListener('click', () => removeIntonationFavorite(index));

    listItem.appendChild(playButton);
    listItem.appendChild(removeButton);
    listEl.appendChild(listItem);
  });
}

function moveToFavorites(text: string) {
  const target = text.trim();
  if (!target) return;
  historyTexts = historyTexts.filter((item) => item !== target);
  favoriteTexts = [target, ...favoriteTexts.filter((item) => item !== target)];
  favoriteTexts = dedupeAndLimit(favoriteTexts);
  historyTexts = dedupeAndLimit(historyTexts);
  persistLists();
  renderTextLists();
}

function moveToHistory(text: string) {
  const target = text.trim();
  if (!target) return;
  favoriteTexts = favoriteTexts.filter((item) => item !== target);
  historyTexts = [target, ...historyTexts.filter((item) => item !== target)];
  favoriteTexts = dedupeAndLimit(favoriteTexts);
  historyTexts = dedupeAndLimit(historyTexts);
  persistLists();
  renderTextLists();
}

function addToHistory(text: string) {
  const target = text.trim();
  if (!target) return;
  if (favoriteTexts.includes(target)) return;
  historyTexts = [target, ...historyTexts.filter((item) => item !== target)];
  historyTexts = dedupeAndLimit(historyTexts);
  persistLists();
  renderTextLists();
}

function initializeTextLists() {
  favoriteTexts = dedupeAndLimit(loadStoredList(FAVORITES_STORAGE_KEY));
  historyTexts = dedupeAndLimit(loadStoredList(HISTORY_STORAGE_KEY));
  intonationFavorites = loadIntonationFavorites();
  persistLists();
  persistIntonationFavorites();
  renderTextLists();
  renderIntonationFavoritesList();
}

function isValidAudioQueryShape(query: unknown): query is AudioQuery {
  return (
    query !== null &&
    typeof query === 'object' &&
    Array.isArray((query as { accent_phrases?: unknown }).accent_phrases)
  );
}

function cloneAudioQuery(query: AudioQuery): AudioQuery {
  return JSON.parse(JSON.stringify(query)) as AudioQuery;
}

function removeIntonationFavorite(index: number) {
  if (index < 0 || index >= intonationFavorites.length) return;
  intonationFavorites = [...intonationFavorites.slice(0, index), ...intonationFavorites.slice(index + 1)];
  persistIntonationFavorites();
  renderIntonationFavoritesList();
}

function applyIntonationFavorite(item: IntonationFavorite) {
  if (!isValidAudioQueryShape(item.query)) {
    showStatus('保存したイントネーションデータが破損しています。削除しました。', 'error');
    const idx = intonationFavorites.findIndex(
      (fav) => fav.text === item.text && fav.styleId === item.styleId
    );
    if (idx !== -1) {
      removeIntonationFavorite(idx);
    }
    return;
  }
  const textArea = document.getElementById('text') as HTMLTextAreaElement | null;
  const styleSelect = document.getElementById('styleSelect') as HTMLSelectElement | null;
  if (textArea) {
    textArea.value = item.text;
  }
  if (styleSelect) {
    styleSelect.value = String(item.styleId);
  }
  selectedStyleId = item.styleId;
  currentIntonationStyleId = item.styleId;
  currentIntonationQuery = cloneAudioQuery(item.query);
  intonationPoints = buildIntonationPointsFromQuery(currentIntonationQuery);
  intonationTopScale = 1;
  intonationBottomScale = 1;
  intonationSelectedIndex = intonationPoints.length > 0 ? 0 : null;
  intonationDirty = false;
  drawIntonationChart(intonationPoints);
  void playUpdatedIntonation();
}

function saveCurrentIntonationFavorite() {
  const textArea = document.getElementById('text') as HTMLTextAreaElement | null;
  if (!textArea) return;
  const text = textArea.value.trim();
  if (!text) {
    showStatus('テキストを入力してください', 'error');
    return;
  }
  if (!currentIntonationQuery) {
    showStatus('イントネーション取得後に登録してください', 'error');
    return;
  }
  const entry: IntonationFavorite = {
    text,
    styleId: currentIntonationStyleId,
    query: cloneAudioQuery(currentIntonationQuery),
  };
  intonationFavorites = dedupeIntonationFavorites([entry, ...intonationFavorites]);
  persistIntonationFavorites();
  renderIntonationFavoritesList();
  showStatus('イントネーション付きのお気に入りを保存しました', 'success');
  scheduleHideStatus(2000);
}

function addSegment(
  segments: Array<{ text: string; styleId: number }>,
  text: string,
  styleId: number
) {
  if (!text) return;
  const last = segments[segments.length - 1];
  if (last && last.styleId === styleId) {
    last.text += text;
  } else {
    segments.push({ text, styleId });
  }
}

function buildTextSegments(
  text: string,
  delimiter: { start: string; end: string } | null,
  initialStyleId: number
) {
  if (!delimiter) {
    return text ? [{ text, styleId: initialStyleId }] : [];
  }

  const segments: Array<{ text: string; styleId: number }> = [];
  let cursor = 0;
  let currentStyleId = initialStyleId;

  while (cursor < text.length) {
    const startIndex = text.indexOf(delimiter.start, cursor);
    if (startIndex === -1) {
      addSegment(segments, text.slice(cursor), currentStyleId);
      break;
    }

    if (startIndex > cursor) {
      addSegment(segments, text.slice(cursor, startIndex), currentStyleId);
    }

    const endIndex = text.indexOf(delimiter.end, startIndex + delimiter.start.length);
    if (endIndex === -1) {
      addSegment(segments, text.slice(startIndex), currentStyleId);
      break;
    }

    const markerContent = text.slice(startIndex + delimiter.start.length, endIndex);
    const matchedStyle = resolveStyleMarker(markerContent, currentStyleId);
    if (matchedStyle) {
      currentStyleId = matchedStyle.id;
    } else {
      const fullMarker = text.slice(startIndex, endIndex + delimiter.end.length);
      addSegment(segments, fullMarker, currentStyleId);
    }
    cursor = endIndex + delimiter.end.length;
  }

  return segments;
}

function combineAudioBuffers(buffers: AudioBuffer[], audioContext: BaseAudioContext) {
  if (buffers.length === 0) return null;
  const sampleRate = buffers[0].sampleRate;
  const channelCount = Math.max(...buffers.map((buffer) => buffer.numberOfChannels));
  const totalLength = buffers.reduce((acc, buffer) => acc + buffer.length, 0);
  const combined = audioContext.createBuffer(channelCount, totalLength, sampleRate);

  let offset = 0;
  for (const buffer of buffers) {
    if (buffer.sampleRate !== sampleRate) {
      throw new Error('音声のサンプルレートが一致しませんでした。');
    }
    for (let channel = 0; channel < channelCount; channel += 1) {
      const target = combined.getChannelData(channel);
      const source = buffer.getChannelData(Math.min(channel, buffer.numberOfChannels - 1));
      target.set(source, offset);
    }
    offset += buffer.length;
  }

  return combined;
}

function encodeAudioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const channelCount = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const sampleBits = 16;
  const dataLength = buffer.length * channelCount * (sampleBits / 8);
  const totalLength = 44 + dataLength;
  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i += 1) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channelCount, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channelCount * (sampleBits / 8), true);
  view.setUint16(32, channelCount * (sampleBits / 8), true);
  view.setUint16(34, sampleBits, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  let offset = 44;
  const clamp = (value: number) => Math.max(-1, Math.min(1, value));
  for (let i = 0; i < buffer.length; i += 1) {
    for (let channel = 0; channel < channelCount; channel += 1) {
      const sample = clamp(buffer.getChannelData(channel)[i]);
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return arrayBuffer;
}

function populateStyleSelect(styleSelect: HTMLSelectElement | null) {
  if (!styleSelect) return;
  styleSelect.innerHTML = '';

  if (availableStyles.length === 0) {
    const fallback = document.createElement('option');
    fallback.value = String(ZUNDAMON_SPEAKER_ID);
    fallback.textContent = `ID ${ZUNDAMON_SPEAKER_ID}`;
    styleSelect.appendChild(fallback);
    selectedStyleId = ZUNDAMON_SPEAKER_ID;
    return;
  }

  availableStyles.forEach((style) => {
    const option = document.createElement('option');
    option.value = String(style.id);
    option.textContent = getStyleLabel(style);
    styleSelect.appendChild(option);
  });

  const defaultStyle =
    availableStyles.find((style) => style.id === selectedStyleId) ?? availableStyles[0];
  selectedStyleId = defaultStyle.id;
  styleSelect.value = String(selectedStyleId);
}

async function fetchVoiceStyles(styleSelect: HTMLSelectElement | null) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${VOICEVOX_API_BASE}/speakers`, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Failed to fetch styles: ${response.status} ${response.statusText}`);
    }
    const speakers = (await response.json()) as VoiceVoxSpeaker[];
    availableStyles = speakers.flatMap((speaker) =>
      speaker.styles.map((style) => ({
        id: style.id,
        name: style.name,
        speakerName: speaker.name,
      }))
    );
  } catch (error) {
    console.error('Failed to fetch speaker styles:', error);
    if (availableStyles.length === 0) {
      availableStyles = [{ id: ZUNDAMON_SPEAKER_ID, name: '未取得', speakerName: 'デフォルト' }];
    }
  } finally {
    clearTimeout(timeoutId);
    populateStyleSelect(styleSelect);
  }
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
  const real = new Float32Array(windowSize);
  const imag = new Float32Array(windowSize);
  const result: Array<{ time: number; freq: number }> = [];

  for (let offset = 0; offset + windowSize <= channelData.length; offset += hopSize) {
    for (let i = 0; i < windowSize; i++) {
      real[i] = channelData[offset + i] * window[i];
      imag[i] = 0;
    }
    fftRadix2(real, imag);

    let maxIndex = 1;
    let maxMagnitude = 0;
    for (let i = 1; i < windowSize / 2; i++) {
      const magnitude = real[i] * real[i] + imag[i] * imag[i];
      if (magnitude > maxMagnitude) {
        maxMagnitude = magnitude;
        maxIndex = i;
      }
    }

    const freq = maxMagnitude > 0 ? (maxIndex * sampleRate) / windowSize : 0;
    const time = (offset + windowSize * 0.5) / sampleRate;
    result.push({ time, freq });
  }

  return result;
}

function drawRenderedWaveform(buffer: AudioBuffer, canvas: HTMLCanvasElement) {
  const { ctx, width, height } = prepareCanvas(canvas);
  if (!ctx) return;
  const channelData = buffer.getChannelData(0);
  const maxAbs = channelData.reduce((max, value) => {
    const abs = Math.abs(value);
    return abs > max ? abs : max;
  }, 0);
  const leftMargin = 52;
  const rightMargin = 8;
  const topMargin = 8;
  const bottomMargin = 28;
  const innerWidth = Math.max(1, width - leftMargin - rightMargin);
  const innerHeight = Math.max(1, height - topMargin - bottomMargin);
  const centerY = topMargin + innerHeight / 2;
  const amplitudeScale =
    (innerHeight * 0.5 * WAVEFORM_TARGET_RATIO) / (maxAbs > 0 ? maxAbs : 1);
  const samplesPerPixel = Math.max(1, Math.floor(channelData.length / innerWidth));
  const durationMs = Math.max(buffer.duration * 1000, 1);
  const durationSec = Math.max(buffer.duration, 0.001);
  const labelColor = getColorVariable('--muted-text', '#6b7280');

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

  // dB ticks
  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.fillStyle = labelColor;
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const referenceAmplitude = Math.max(maxAbs, 1e-4);
  for (let db = 0; db >= -48; db -= 6) {
    const amplitude = referenceAmplitude * Math.pow(10, db / 20);
    const offset = amplitude * amplitudeScale;
    if (offset > innerHeight / 2) continue;
    const yUpper = centerY - offset;
    const yLower = centerY + offset;

    ctx.beginPath();
    ctx.moveTo(leftMargin, yUpper);
    ctx.lineTo(width - rightMargin, yUpper);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(leftMargin, yLower);
    ctx.lineTo(width - rightMargin, yLower);
    ctx.stroke();

    const label = `${db}dB`;
    ctx.fillText(label, leftMargin - 6, yUpper);
    if (db !== 0) {
      ctx.fillText(label, leftMargin - 6, yLower);
    }
  }

  // Center line
  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.beginPath();
  ctx.moveTo(leftMargin, centerY);
  ctx.lineTo(width - rightMargin, centerY);
  ctx.stroke();

  // Waveform
  ctx.strokeStyle = getColorVariable('--accent-color', '#4caf50');
  ctx.beginPath();
  for (let x = 0; x < innerWidth; x++) {
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
    const y1 = centerY - max * amplitudeScale;
    const y2 = centerY - min * amplitudeScale;
    const drawX = leftMargin + x;
    ctx.moveTo(drawX, y1);
    ctx.lineTo(drawX, y2);
  }
  ctx.stroke();

  // Time ticks (dynamic spacing)
  ctx.strokeStyle = getColorVariable('--muted-text', '#6b7280');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const maxLabelCount = Math.max(1, Math.floor(innerWidth / MIN_TICK_SPACING_PX));
  const niceIntervalsSec = [0.1, 0.2, 0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800];
  let intervalSec = 0.5;
  for (const candidate of niceIntervalsSec) {
    if (durationSec / candidate <= maxLabelCount) {
      intervalSec = candidate;
      break;
    }
  }
  const intervalMs = intervalSec * 1000;
  const drawTick = (t: number) => {
    const ratio = Math.min(t / durationMs, 1);
    const x = leftMargin + ratio * innerWidth;
    ctx.beginPath();
    ctx.moveTo(x, height - bottomMargin);
    ctx.lineTo(x, height - bottomMargin + 6);
    ctx.stroke();
    const decimals = intervalSec < 1 ? 1 : 0;
    ctx.fillText(`${(t / 1000).toFixed(decimals)}s`, x, height - bottomMargin + 6);
  };
  for (let t = 0; t <= durationMs + 1e-6; t += intervalMs) {
    drawTick(t);
  }

  // Frequency estimation overlay
  const freqPoints = estimateFrequencySeries(channelData, buffer.sampleRate, innerWidth);
  if (freqPoints.length > 0) {
    const freqMax = Math.max(1, Math.min(buffer.sampleRate / 2, 6000));
    ctx.strokeStyle = getColorVariable('--status-info-text', '#1976d2');
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    freqPoints.forEach((point, index) => {
      const x = leftMargin + Math.min(point.time / durationSec, 1) * innerWidth;
      const clampedFreq = Math.max(0, Math.min(point.freq, freqMax));
      const y = topMargin + innerHeight - (clampedFreq / freqMax) * innerHeight;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    ctx.lineWidth = 1;
  }
}

function drawRealtimeWaveform(
  values: Float32Array,
  canvas: HTMLCanvasElement,
  sampleRate: number,
  estimatedFrequency: number | null
) {
  const { ctx, width, height } = prepareCanvas(canvas);
  if (!ctx) return;
  const shouldAlign =
    estimatedFrequency !== null &&
    Number.isFinite(estimatedFrequency) &&
    estimatedFrequency > 0 &&
    sampleRate > 0;
  const segment = shouldAlign
    ? extractAlignedRealtimeSegment(values, sampleRate, estimatedFrequency, width)
    : values;
  if (!shouldAlign) {
    realtimePreviousSegment = null;
  }

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  let maxAbs = 0;
  for (let i = 0; i < segment.length; i++) {
    const v = Math.abs(segment[i]);
    if (Number.isFinite(v) && v > maxAbs) {
      maxAbs = v;
    }
  }
  const amplitudeScale =
    (height * 0.5 * WAVEFORM_TARGET_RATIO) / (maxAbs > 0 ? maxAbs : 1);

  const step = segment.length / width;
  ctx.strokeStyle = getColorVariable('--accent-color', '#4caf50');
  ctx.beginPath();
  for (let x = 0; x < width; x++) {
    const index = Math.floor(x * step);
    const v = Number.isFinite(segment[index]) ? segment[index] : 0;
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

function estimateFundamentalFrequency(values: Float32Array, sampleRate: number) {
  if (values.length === 0 || sampleRate <= 0) {
    return null;
  }
  const binWidth = (sampleRate / 2) / Math.max(values.length - 1, 1);
  fftMagnitudeBuffer =
    fftMagnitudeBuffer && fftMagnitudeBuffer.length === values.length
      ? fftMagnitudeBuffer
      : new Float32Array(values.length);
  fftHpsBuffer =
    fftHpsBuffer && fftHpsBuffer.length === values.length
      ? fftHpsBuffer
      : new Float32Array(values.length);

  let peakLinear = 0;
  for (let i = 1; i < values.length; i++) {
    const db = Number.isFinite(values[i]) ? values[i] : -120;
    const linear = Math.pow(10, db / 20);
    fftMagnitudeBuffer[i] = linear;
    if (linear > peakLinear) {
      peakLinear = linear;
    }
  }
  if (peakLinear <= 0) {
    return null;
  }

  fftHpsBuffer.fill(0);
  for (let i = 1; i < values.length; i++) {
    fftHpsBuffer[i] = fftMagnitudeBuffer[i];
  }
  const maxHarmonic = 4;
  for (let harmonic = 2; harmonic <= maxHarmonic; harmonic++) {
    for (let bin = 1; bin * harmonic < values.length; bin++) {
      fftHpsBuffer[bin] *= fftMagnitudeBuffer[bin * harmonic];
    }
  }

  let bestBin = 1;
  let bestScore = -Infinity;
  for (let bin = 1; bin < values.length; bin++) {
    if (fftMagnitudeBuffer[bin] < peakLinear * 0.1) continue;
    const score = fftHpsBuffer[bin];
    if (score > bestScore) {
      bestScore = score;
      bestBin = bin;
    }
  }

  const frequency = bestScore > 0 ? bestBin * binWidth : 0;
  return Number.isFinite(frequency) && frequency > 0 ? frequency : null;
}

function computeSegmentStats(buffer: Float32Array, offset: number, length: number) {
  let sum = 0;
  for (let i = 0; i < length; i++) {
    sum += buffer[offset + i];
  }
  const mean = sum / length;
  let power = 0;
  for (let i = 0; i < length; i++) {
    const centered = buffer[offset + i] - mean;
    power += centered * centered;
  }
  return { mean, power };
}

function computeSegmentCorrelation(
  template: Float32Array,
  templateMean: number,
  templatePower: number,
  target: Float32Array,
  offset: number,
  length: number
) {
  let targetSum = 0;
  for (let i = 0; i < length; i++) {
    targetSum += target[offset + i];
  }
  const targetMean = targetSum / length;

  let numerator = 0;
  let targetPower = 0;
  for (let i = 0; i < length; i++) {
    const templateCentered = template[i] - templateMean;
    const targetCentered = target[offset + i] - targetMean;
    numerator += templateCentered * targetCentered;
    targetPower += targetCentered * targetCentered;
  }
  const denominator = Math.sqrt(templatePower * targetPower);
  if (!Number.isFinite(denominator) || denominator === 0) {
    return -Infinity;
  }
  return numerator / denominator;
}

function extractAlignedRealtimeSegment(
  values: Float32Array,
  sampleRate: number,
  frequency: number,
  displayWidth: number
) {
  const samplesPerPeriod = sampleRate / Math.max(frequency, 1e-6);
  const targetLength = Math.max(1, Math.round(samplesPerPeriod * 4));
  const segmentLength = Math.min(targetLength, values.length);
  if (segmentLength <= 1) {
    realtimePreviousSegment = null;
    return values;
  }

  const workingSegment =
    realtimeSegmentBuffer && realtimeSegmentBuffer.length === segmentLength
      ? realtimeSegmentBuffer
      : new Float32Array(segmentLength);
  realtimeSegmentBuffer = workingSegment;
  const previousSegment =
    realtimePreviousSegment && realtimePreviousSegment.length === segmentLength
      ? realtimePreviousSegment
      : new Float32Array(segmentLength);
  const previousWasNew = realtimePreviousSegment !== previousSegment;
  realtimePreviousSegment = previousSegment;

  if (previousWasNew) {
    const start = Math.max(0, values.length - segmentLength);
    workingSegment.set(values.subarray(start, start + segmentLength));
    realtimePreviousSegment.set(workingSegment);
    return workingSegment;
  }

  const slideStep = Math.max(1, Math.floor(segmentLength / Math.max(displayWidth, 1)));
  const stride = Math.max(1, slideStep * 2);
  const searchSpan = Math.min(segmentLength, values.length - segmentLength);
  const baseStart = Math.max(0, values.length - segmentLength);
  const minOffset = Math.max(0, baseStart - Math.floor(searchSpan / 2));
  const maxOffset = Math.min(values.length - segmentLength, minOffset + searchSpan);

  let bestOffset = baseStart;
  let bestScore = -Infinity;
  const templateStats = computeSegmentStats(realtimePreviousSegment, 0, segmentLength);
  for (let offset = minOffset; offset <= maxOffset; offset += stride) {
    const score = computeSegmentCorrelation(
      realtimePreviousSegment,
      templateStats.mean,
      templateStats.power,
      values,
      offset,
      segmentLength
    );
    if (score > bestScore) {
      bestScore = score;
      bestOffset = offset;
    }
  }

  workingSegment.set(values.subarray(bestOffset, bestOffset + segmentLength));
  realtimePreviousSegment.set(workingSegment);
  return workingSegment;
}

function drawSpectrogram(
  values: Float32Array,
  canvas: HTMLCanvasElement,
  progress: number,
  frequencyCeiling: number,
  lastX: number,
  sampleRate: number,
  scale: FrequencyScale,
  shouldReset: boolean
) {
  const { ctx, width, height } = prepareCanvas(canvas);
  if (!ctx || width === 0) return lastX;

  const accent = getColorVariable('--accent-color', '#4caf50');
  const background = getColorVariable('--bg-color', '#ffffff');
  const leftMargin = 56;
  const bottomMargin = 18;
  const drawableWidth = Math.max(1, width - leftMargin);
  const drawableHeight = Math.max(1, height - bottomMargin);
  const cappedCeiling = Math.max(1, Math.min(frequencyCeiling, Math.max(values.length - 1, 1)));
  const maxFreq = Math.max(1, sampleRate / 2);
  const minLogFreq = Math.min(MIN_LOG_FREQUENCY, maxFreq);
  const targetX = Math.max(0, Math.min(drawableWidth - 1, Math.floor(progress * (drawableWidth - 1))));
  const needsReset = shouldReset || targetX < lastX;

  if (needsReset) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
    lastX = -1;
  }

  const startX = Math.max(lastX + 1, 0);
  const cappedTargetX = Math.min(targetX, startX + SPECTROGRAM_MAX_COLUMNS_PER_FRAME - 1);
  if (needsReset) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, leftMargin, height);
    ctx.fillRect(leftMargin, drawableHeight, drawableWidth, bottomMargin);
  }

  const yToBin = (y: number) => {
    const denominator = Math.max(drawableHeight - 1, 1);
    const ratio = Math.min(Math.max(y / denominator, 0), 1);
    if (scale === 'log') {
      const freq = minLogFreq * Math.pow(maxFreq / Math.max(minLogFreq, 1), ratio);
      return Math.min(cappedCeiling, Math.max(0, Math.round((freq / maxFreq) * cappedCeiling)));
    }
    return Math.min(cappedCeiling, Math.floor(ratio * (cappedCeiling + 1)));
  };
  for (let drawX = startX; drawX <= cappedTargetX; drawX++) {
    ctx.fillStyle = background;
    ctx.globalAlpha = 1;
    const canvasX = leftMargin + drawX;
    ctx.fillRect(canvasX, 0, 1, drawableHeight);

    for (let y = 0; y < drawableHeight; y++) {
      const dataIndex = yToBin(y);
      const magnitude = Number.isFinite(values[dataIndex]) ? values[dataIndex] : -120;
      const normalized = Math.max(Math.min((magnitude + 120) / 120, 1), 0);
      ctx.fillStyle = accent;
      ctx.globalAlpha = normalized;
      ctx.fillRect(canvasX, drawableHeight - y - 1, 1, 1);
    }
  }
  ctx.globalAlpha = 1;

  if (needsReset) {
    const axisColor = getColorVariable('--border-color', '#e0e0e0');
    const labelColor = getColorVariable('--muted-text', '#6b7280');
    ctx.strokeStyle = axisColor;
    ctx.beginPath();
    ctx.moveTo(leftMargin, 0);
    ctx.lineTo(leftMargin, drawableHeight);
    ctx.lineTo(width, drawableHeight);
    ctx.stroke();

    ctx.strokeStyle = getColorVariable('--canvas-grid', 'rgba(0,0,0,0.06)');
    ctx.fillStyle = labelColor;
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
  }

  return cappedTargetX;
}

function initializeVisualizationCanvases(options?: { preserveSpectrogram?: boolean }) {
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

function updateIntonationTiming(message: string) {
  if (intonationTimingEl) {
    intonationTimingEl.textContent = message;
  }
}

function disableLoopOnIntonationEdit() {
  if (loopCheckboxEl && loopCheckboxEl.checked) {
    loopCheckboxEl.checked = false;
  }
}

function resetIntonationState() {
  currentIntonationQuery = null;
  intonationPoints = [];
  intonationPointPositions = [];
  intonationSelectedIndex = null;
  intonationTopScale = 1;
  intonationBottomScale = 1;
  intonationDirty = false;
  drawIntonationChart(intonationPoints);
}

function initializeIntonationCanvas() {
  if (!intonationCanvas) return;
  const { ctx, width, height } = prepareCanvas(intonationCanvas);
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.strokeRect(0, 0, width, height);
}

function buildIntonationPointsFromQuery(query: AudioQuery) {
  const points: IntonationPoint[] = [];
  query.accent_phrases.forEach((phrase, phraseIndex) => {
    phrase.moras.forEach((mora, moraIndex) => {
      points.push({
        phraseIndex,
        moraIndex,
        label: mora.text,
        pitch: mora.pitch,
      });
    });
  });
  return points;
}

function renderIntonationLabels(points: IntonationPoint[]) {
  if (!intonationLabelsEl) return;
  const labelsEl = intonationLabelsEl;
  if (!intonationCanvas || points.length === 0 || intonationPointPositions.length === 0) {
    labelsEl.textContent = '';
    return;
  }

  const rect = intonationCanvas.getBoundingClientRect();
  labelsEl.style.width = `${rect.width}px`;

  const seen = new Set<number>();
  points.forEach((point, index) => {
    if (!point.label) return;
    const pos = intonationPointPositions[index];
    if (!pos) return;
    let labelEl = labelsEl.querySelector(`.intonation-label[data-idx="${index}"]`) as HTMLSpanElement | null;
    if (!labelEl) {
      labelEl = document.createElement('span');
      labelEl.className = 'intonation-label';
      labelEl.dataset.idx = String(index);
      const keySpan = document.createElement('span');
      keySpan.className = 'intonation-label__key';
      const textSpan = document.createElement('span');
      textSpan.className = 'intonation-label__text';
      labelEl.appendChild(keySpan);
      labelEl.appendChild(textSpan);
      labelsEl.appendChild(labelEl);
    }
    const keySpan = labelEl.querySelector('.intonation-label__key') as HTMLSpanElement;
    const textSpan = labelEl.querySelector('.intonation-label__text') as HTMLSpanElement;
    const shortcut =
      intonationKeyboardEnabled && index < 26 ? String.fromCharCode(65 + index) : '';
    if (keySpan) {
      keySpan.textContent = shortcut;
      keySpan.style.display = shortcut ? 'inline-block' : 'none';
    }
    if (textSpan && textSpan.textContent !== point.label) {
      textSpan.textContent = point.label;
    }
    labelEl.style.left = `${pos.x}px`;
    seen.add(index);
  });

  Array.from(labelsEl.querySelectorAll('.intonation-label')).forEach((el) => {
    const idx = (el as HTMLElement).dataset.idx;
    if (!idx || !seen.has(Number(idx))) {
      el.remove();
    }
  });
}

function drawIntonationChart(points: IntonationPoint[]) {
  if (!intonationCanvas) return;
  const { ctx, width, height } = prepareCanvas(intonationCanvas);
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = getColorVariable('--bg-color', '#ffffff');
  ctx.fillRect(0, 0, width, height);

  if (points.length === 0) {
    ctx.fillStyle = getColorVariable('--muted-text', '#6b7280');
    ctx.font = '14px sans-serif';
    ctx.fillText('イントネーション未取得', 12, height / 2);
    intonationPointPositions = [];
    intonationChartRange = null;
    if (intonationMaxValueEl) intonationMaxValueEl.textContent = '';
    if (intonationMinValueEl) intonationMinValueEl.textContent = '';
    if (intonationLabelsEl) {
      intonationLabelsEl.textContent = '';
    }
    return;
  }

  if (intonationSelectedIndex === null) {
    intonationSelectedIndex = 0;
  } else if (intonationSelectedIndex >= points.length) {
    intonationSelectedIndex = points.length - 1;
  }

  const margin = 24;
  const rawMin = points.reduce((min, point) => Math.min(min, point.pitch), points[0].pitch);
  const rawMax = points.reduce((max, point) => Math.max(max, point.pitch), points[0].pitch);
  const isFlatPitch = rawMax === rawMin;
  const range = rawMax - rawMin;
  const paddingBase = range > 0 ? range : Math.max(5, Math.abs(rawMax) * 0.1 || 5);
  const topPadding = intonationTopScale > 1 ? paddingBase * (intonationTopScale - 1) : 0;
  const bottomPadding = intonationBottomScale > 1 ? paddingBase * (intonationBottomScale - 1) : 0;
  const minPitch = isFlatPitch ? rawMin - (paddingBase + bottomPadding) : rawMin - bottomPadding;
  const maxPitch = isFlatPitch ? rawMax + (paddingBase + topPadding) : rawMax + topPadding;
  const innerWidth = Math.max(1, width - margin * 2);
  const innerHeight = Math.max(1, height - margin * 2);
  const step = points.length > 1 ? innerWidth / (points.length - 1) : 0;
  const pitchRange = Math.max(maxPitch - minPitch, 1);

  if (intonationMaxValueEl) {
    intonationMaxValueEl.textContent = `max ${rawMax.toFixed(1)}`;
  }
  if (intonationMinValueEl) {
    intonationMinValueEl.textContent = `min ${rawMin.toFixed(1)}`;
  }

  ctx.strokeStyle = getColorVariable('--border-color', '#e0e0e0');
  ctx.beginPath();
  ctx.moveTo(margin, height - margin);
  ctx.lineTo(width - margin, height - margin);
  ctx.stroke();

  intonationPointPositions = points.map((point, index) => {
    const x = margin + step * index;
    const normalized = (point.pitch - minPitch) / pitchRange;
    const y = height - margin - normalized * innerHeight;
    return { x, y };
  });

  ctx.lineWidth = 1;
  intonationPointPositions.forEach((pos, index) => {
    ctx.strokeStyle = MONOKAI_COLORS[index % MONOKAI_COLORS.length];
    ctx.beginPath();
    ctx.moveTo(margin, pos.y);
    ctx.lineTo(width - margin, pos.y);
    ctx.stroke();
  });

  ctx.strokeStyle = getColorVariable('--accent-color', '#4caf50');
  ctx.lineWidth = 2;
  ctx.beginPath();
  intonationPointPositions.forEach((pos, index) => {
    if (index === 0) {
      ctx.moveTo(pos.x, pos.y);
    } else {
      ctx.lineTo(pos.x, pos.y);
    }
  });
  ctx.stroke();

  const accent = getColorVariable('--accent-color', '#4caf50');
  points.forEach((_, index) => {
    const pos = intonationPointPositions[index];
    ctx.beginPath();
    const radius = intonationSelectedIndex === index ? 7 : 5;
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.strokeStyle = getColorVariable('--bg-color', '#ffffff');
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  intonationChartRange = {
    min: minPitch,
    max: maxPitch,
    margin,
    height,
    innerHeight,
    width,
  };

  if (isFlatPitch) {
    ctx.fillStyle = getColorVariable('--muted-text', '#6b7280');
    ctx.font = '12px sans-serif';
    ctx.fillText('全モーラ同一ピッチ（フラット）', margin, margin - 6);
  }

  renderIntonationLabels(points);
}

function adjustIntonationScale(direction: 'top' | 'bottom', factor: number) {
  if (intonationPoints.length === 0) return;
  const minScale = 1;
  if (direction === 'top') {
    intonationTopScale = Math.max(minScale, intonationTopScale * factor);
  } else {
    intonationBottomScale = Math.max(minScale, intonationBottomScale * factor);
  }
  drawIntonationChart(intonationPoints);

  if (intonationChartRange) {
    const { min, max } = intonationChartRange;
    let changed = false;
    intonationPoints.forEach((point, index) => {
      const clampedPitch = Math.min(max, Math.max(min, point.pitch));
      if (clampedPitch !== point.pitch) {
        point.pitch = clampedPitch;
        applyPitchToQuery(index, clampedPitch);
        changed = true;
      }
    });
    if (changed) {
      drawIntonationChart(intonationPoints);
    }
  }
}

function pitchFromY(y: number) {
  if (!intonationChartRange) return null;
  const { min, max, margin, height, innerHeight } = intonationChartRange;
  const ratio = (height - margin - y) / Math.max(innerHeight, 1);
  const extraRange = 1;
  const extendedRatio = Math.min(1 + extraRange, Math.max(-extraRange, ratio));
  return min + extendedRatio * (max - min);
}

function findNearestIntonationPoint(x: number, y: number) {
  let nearestIndex = -1;
  let minDistance = 14;
  intonationPointPositions.forEach((pos, index) => {
    const distance = Math.hypot(pos.x - x, pos.y - y);
    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = index;
    }
  });
  return nearestIndex;
}

function applyPitchToQuery(pointIndex: number, pitch: number) {
  if (!currentIntonationQuery) return;
  let cursor = 0;
  for (const phrase of currentIntonationQuery.accent_phrases) {
    for (const mora of phrase.moras) {
      if (cursor === pointIndex) {
        mora.pitch = pitch;
        return;
      }
      cursor += 1;
    }
  }
}

function scheduleIntonationPlayback() {
  if (intonationDebounceTimer !== null) {
    window.clearTimeout(intonationDebounceTimer);
  }
  intonationDebounceTimer = window.setTimeout(() => {
    intonationDebounceTimer = null;
    if (isProcessing) {
      scheduleIntonationPlayback();
      return;
    }
    void playUpdatedIntonation();
  }, INTONATION_DEBOUNCE_MS);
}

async function playUpdatedIntonation() {
  if (!currentIntonationQuery) return;
  if (isProcessing) return;

  const playButton = document.getElementById('playButton') as HTMLButtonElement | null;
  const exportButton = document.getElementById('exportButton') as HTMLButtonElement | null;
  const renderedCanvas = document.getElementById('renderedWaveform') as HTMLCanvasElement | null;
  const realtimeCanvas = document.getElementById('realtimeWaveform') as HTMLCanvasElement | null;
  const spectrogramCanvas = document.getElementById('spectrogram') as HTMLCanvasElement | null;

  isProcessing = true;
  if (playButton) playButton.disabled = true;
  updateExportButtonState(exportButton);
  initializeVisualizationCanvases();

  try {
    showStatus('イントネーションを適用中...', 'info');
    const synthesisStart = performance.now();
    const audioBuffer = await synthesize(currentIntonationQuery, currentIntonationStyleId);
    const synthesisElapsed = performance.now() - synthesisStart;
    updateIntonationTiming(`イントネーション反映: ${Math.round(synthesisElapsed)} ms`);

    lastSynthesizedBuffer = audioBuffer;
    const audioContext = Tone.getContext().rawContext as BaseAudioContext;
    const decodedBuffer = await audioContext.decodeAudioData(audioBuffer.slice(0));

    if (renderedCanvas) {
      drawRenderedWaveform(decodedBuffer, renderedCanvas);
    }

    await playAudio(decodedBuffer, realtimeCanvas, spectrogramCanvas);

    showStatus('更新したイントネーションで再生しました', 'success');
    scheduleHideStatus(2500);
  } catch (error) {
    console.error('Intonation playback error:', error);
    showStatus(
      `イントネーション適用中にエラーが発生しました: ${
        error instanceof Error ? error.message : String(error)
      }`,
      'error'
    );
  } finally {
    isProcessing = false;
    if (playButton) playButton.disabled = false;
    updateExportButtonState(exportButton);
  }
}

async function fetchAndRenderIntonation(text: string, styleId: number) {
  if (!intonationCanvas) return;
  const start = performance.now();
  try {
    const query = await getAudioQuery(text, styleId);
    const elapsed = performance.now() - start;
    currentIntonationQuery = query;
    currentIntonationStyleId = styleId;
    intonationPoints = buildIntonationPointsFromQuery(query);
    intonationTopScale = 1;
    intonationBottomScale = 1;
    intonationSelectedIndex = intonationPoints.length > 0 ? 0 : null;
    drawIntonationChart(intonationPoints);
    intonationDirty = false;
    updateIntonationTiming(`イントネーション取得: ${Math.round(elapsed)} ms`);
  } catch (error) {
    console.error('Failed to fetch intonation:', error);
    updateIntonationTiming('イントネーションの取得に失敗しました');
    showStatus('イントネーションの取得に失敗しました', 'error');
  }
}

function handleIntonationPointerDown(event: MouseEvent | PointerEvent) {
  if (!intonationCanvas || intonationPointPositions.length === 0) return;
  const rect = intonationCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const targetIndex = findNearestIntonationPoint(x, y);
  if (targetIndex !== -1) {
    intonationDragIndex = targetIndex;
    intonationSelectedIndex = targetIndex;
    disableLoopOnIntonationEdit();
    intonationCanvas.focus();
    drawIntonationChart(intonationPoints);
    if ('pointerId' in event) {
      intonationActivePointerId = event.pointerId;
      intonationCanvas.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
  }
}

function handleIntonationPointerMove(event: MouseEvent | PointerEvent) {
  if (intonationDragIndex === null || !intonationCanvas || intonationPointPositions.length === 0) {
    return;
  }
  if ('pointerId' in event && intonationActivePointerId !== null && event.pointerId !== intonationActivePointerId) {
    return;
  }
  const rect = intonationCanvas.getBoundingClientRect();
  const pitch = pitchFromY(event.clientY - rect.top);
  if (pitch === null) return;
  intonationPoints[intonationDragIndex].pitch = pitch;
  applyPitchToQuery(intonationDragIndex, pitch);
  disableLoopOnIntonationEdit();
  intonationDirty = true;
  drawIntonationChart(intonationPoints);
  scheduleIntonationPlayback();
  event.preventDefault();
}

function handleIntonationPointerUp() {
  if (intonationActivePointerId !== null && intonationCanvas) {
    intonationCanvas.releasePointerCapture(intonationActivePointerId);
  }
  intonationActivePointerId = null;
  intonationDragIndex = null;
}

function handleIntonationKeyDown(event: KeyboardEvent) {
  if (!intonationCanvas || intonationPoints.length === 0) return;
  if (intonationKeyboardEnabled && (event.key === ' ' || event.key === 'Enter')) {
    event.preventDefault();
    disableLoopOnIntonationEdit();
    void playUpdatedIntonation();
    return;
  }
  if (intonationSelectedIndex === null) {
    intonationSelectedIndex = 0;
  }
  if (intonationKeyboardEnabled && event.key.length === 1) {
    const key = event.key.toUpperCase();
    if (key >= 'A' && key <= 'Z') {
      const targetIndex = key.charCodeAt(0) - 65;
      if (targetIndex < intonationPoints.length) {
        let rangeSpan: number;
        if (intonationChartRange && intonationChartRange.max !== undefined && intonationChartRange.min !== undefined) {
          rangeSpan = intonationChartRange.max - intonationChartRange.min;
        } else {
          let min = intonationPoints[0].pitch;
          let max = intonationPoints[0].pitch;
          for (let i = 1; i < intonationPoints.length; i += 1) {
            const pitch = intonationPoints[i].pitch;
            if (pitch < min) min = pitch;
            if (pitch > max) max = pitch;
          }
          rangeSpan = max - min;
        }
        const step = rangeSpan > 0 ? rangeSpan / 10 : 10;
        event.preventDefault();
        const adjustment = event.shiftKey ? -step : step;
        const newPitch = intonationPoints[targetIndex].pitch + adjustment;
        intonationPoints[targetIndex].pitch = newPitch;
        intonationSelectedIndex = targetIndex;
        applyPitchToQuery(targetIndex, newPitch);
        disableLoopOnIntonationEdit();
        intonationDirty = true;
        drawIntonationChart(intonationPoints);
        scheduleIntonationPlayback();
        return;
      }
    }
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    intonationSelectedIndex = Math.max(0, (intonationSelectedIndex ?? 0) - 1);
    drawIntonationChart(intonationPoints);
    return;
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    intonationSelectedIndex = Math.min(intonationPoints.length - 1, (intonationSelectedIndex ?? 0) + 1);
    drawIntonationChart(intonationPoints);
    return;
  }
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
    const range = intonationChartRange ? intonationChartRange.max - intonationChartRange.min : 0;
    const delta = Math.max(range * 0.02, 1);
    const targetIndex = intonationSelectedIndex ?? 0;
    const adjustment = event.key === 'ArrowUp' ? delta : -delta;
    const newPitch = intonationPoints[targetIndex].pitch + adjustment;
    intonationPoints[targetIndex].pitch = newPitch;
    applyPitchToQuery(targetIndex, newPitch);
    disableLoopOnIntonationEdit();
    intonationDirty = true;
    drawIntonationChart(intonationPoints);
    scheduleIntonationPlayback();
  }
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
  spectrogramCanvas?: HTMLCanvasElement | null,
  options?: { resetSpectrogram?: boolean }
) {
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

  return new Promise<void>((resolve) => {
    let resolved = false;

    const cleanup = () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
      clearProgressLines();
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

async function confirmResetIntonationBeforePlay() {
  const dialog = document.getElementById('playConfirmDialog');
  const resetButton = document.getElementById('playConfirmReset');
  const cancelButton = document.getElementById('playConfirmCancel');
  if (!dialog || !resetButton || !cancelButton) {
    return window.confirm('イントネーションの編集内容が破棄されます。再生してよろしいですか？');
  }
  const previousActiveElement = document.activeElement as HTMLElement | null;
  dialog.removeAttribute('hidden');
  let settled = false;
  let keydownHandler: ((event: KeyboardEvent) => void) | null = null;
  const cleanup = () => {
    if (settled) return;
    settled = true;
    dialog.setAttribute('hidden', 'true');
    if (keydownHandler) {
      dialog.removeEventListener('keydown', keydownHandler);
    }
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  };
  (resetButton as HTMLElement).focus();
  return new Promise<boolean>((resolve) => {
    const handleReset = () => {
      cleanup();
      resolve(true);
    };
    const handleCancel = () => {
      cleanup();
      resolve(false);
    };
    keydownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        event.preventDefault();
        handleCancel();
      }
    };
    dialog.addEventListener('keydown', keydownHandler);
    resetButton.addEventListener('click', handleReset, { once: true });
    cancelButton.addEventListener('click', handleCancel, { once: true });
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
  const styleSelect = document.getElementById('styleSelect') as HTMLSelectElement | null;
  const delimiterInput = document.getElementById('delimiterInput') as HTMLInputElement | null;
  
  if (!textArea || !playButton) {
    console.error('Required UI elements not found');
    return;
  }
  
  const text = textArea.value.trim();
  
  if (!text) {
    showStatus('テキストを入力してください', 'error');
    return;
  }

  if (styleSelect && styleSelect.value) {
    const parsed = Number(styleSelect.value);
    if (!Number.isNaN(parsed)) {
      selectedStyleId = parsed;
    }
  }

  const delimiter = parseDelimiterConfig(delimiterInput?.value ?? '');
  const segments = buildTextSegments(text, delimiter, selectedStyleId);
  if (segments.length === 0) {
    showStatus('テキストを入力してください', 'error');
    return;
  }

  if (isProcessing) {
    return;
  }

  if (intonationDirty) {
    const shouldReset = await confirmResetIntonationBeforePlay();
    if (!shouldReset) {
      return;
    }
    resetIntonationState();
  }
  
  isProcessing = true;
  playButton.disabled = true;
  updateExportButtonState(exportButton);
  
  try {
    const audioContext = Tone.getContext().rawContext as BaseAudioContext;
    const decodedBuffers: AudioBuffer[] = [];
    let usedCache = false;
    let allSegmentsCached = true;
    const currentSignature = segments.map((segment) => getAudioCacheKey(segment.text, segment.styleId)).join('|');
    for (const segment of segments) {
      const cacheKey = getAudioCacheKey(segment.text, segment.styleId);
      let audioBuffer = audioCache.get(cacheKey) ?? null;
      if (audioBuffer) {
        usedCache = true;
      } else {
        allSegmentsCached = false;
        showStatus('音声クエリを作成中...', 'info');
        const audioQuery = await getAudioQuery(segment.text, segment.styleId);
        showStatus('音声を生成中...', 'info');
        audioBuffer = await synthesize(audioQuery, segment.styleId);
        if (audioCache.size >= AUDIO_CACHE_LIMIT) {
          const oldest = audioCache.keys().next().value;
          if (oldest !== undefined) {
            audioCache.delete(oldest);
          }
        }
        audioCache.set(cacheKey, audioBuffer);
      }
      const decodedBuffer = await audioContext.decodeAudioData(audioBuffer.slice(0));
      decodedBuffers.push(decodedBuffer);
    }

    const combinedBuffer = combineAudioBuffers(decodedBuffers, audioContext);
    if (!combinedBuffer) {
      throw new Error('音声の結合に失敗しました。');
    }

    lastSynthesizedBuffer = encodeAudioBufferToWav(combinedBuffer);

    const shouldPreserveSpectrogram = allSegmentsCached && lastSpectrogramSignature === currentSignature;
    initializeVisualizationCanvases({ preserveSpectrogram: shouldPreserveSpectrogram });
    if (renderedCanvas) {
      drawRenderedWaveform(combinedBuffer, renderedCanvas);
    }
    
    // Step 3: Play audio
    if (!usedCache) {
      showStatus('音声を再生中...', 'info');
    } else {
      showStatus('音声を再生中（キャッシュ）...', 'info');
    }
    await playAudio(combinedBuffer, realtimeCanvas, spectrogramCanvas, {
      resetSpectrogram: !shouldPreserveSpectrogram,
    });
    lastSpectrogramSignature = currentSignature;
    const spokenText = segments.map((segment) => segment.text).join('');
    const intonationStyleId = segments[0]?.styleId ?? selectedStyleId;
    await fetchAndRenderIntonation(spokenText, intonationStyleId);
    addToHistory(text);
    
    showStatus('再生完了！', 'success');
    scheduleHideStatus(3000);

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
  const spectrogramScaleToggle = document.getElementById('spectrogramScaleToggle') as HTMLButtonElement | null;
  const styleSelect = document.getElementById('styleSelect') as HTMLSelectElement | null;
  const delimiterInput = document.getElementById('delimiterInput') as HTMLInputElement | null;
  const favoritesToggleButton = document.getElementById('favoritesToggleButton') as HTMLButtonElement | null;
  const favoritesPanel = document.getElementById('favoritesPanel');
  favoritesListEl = document.getElementById('favoritesList') as HTMLUListElement | null;
  historyListEl = document.getElementById('historyList') as HTMLUListElement | null;
  intonationFavoritesListEl = document.getElementById('intonationFavoritesList') as HTMLUListElement | null;
  intonationCanvas = document.getElementById('intonationCanvas') as HTMLCanvasElement | null;
  intonationTimingEl = null;
  intonationLabelsEl = document.getElementById('intonationLabels');
  intonationMaxValueEl = document.getElementById('intonationMaxValue');
  intonationMinValueEl = document.getElementById('intonationMinValue');
  const intonationExpandTop = document.getElementById('intonationExpandTop') as HTMLButtonElement | null;
  const intonationShrinkTop = document.getElementById('intonationShrinkTop') as HTMLButtonElement | null;
  const intonationShrinkBottom = document.getElementById('intonationShrinkBottom') as HTMLButtonElement | null;
  const intonationExpandBottom = document.getElementById('intonationExpandBottom') as HTMLButtonElement | null;
  const intonationKeyboardToggle = document.getElementById('intonationKeyboardToggle') as HTMLButtonElement | null;
  const intonationFavoriteButton = document.getElementById('intonationFavoriteButton') as HTMLButtonElement | null;
  loopCheckboxEl = document.getElementById('loopCheckbox') as HTMLInputElement | null;
  
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

  if (styleSelect) {
    populateStyleSelect(styleSelect);
    styleSelect.addEventListener('change', () => {
      const parsed = Number(styleSelect.value);
      if (!Number.isNaN(parsed)) {
        selectedStyleId = parsed;
      }
    });
  }
  void fetchVoiceStyles(styleSelect ?? null);

  if (delimiterInput) {
    try {
      const savedDelimiter = localStorage.getItem(DELIMITER_STORAGE_KEY);
      if (savedDelimiter !== null) {
        delimiterInput.value = savedDelimiter;
      }
    } catch (error) {
      console.warn('Failed to restore delimiter config:', error);
    }

    const saveDelimiter = () => {
      try {
        localStorage.setItem(DELIMITER_STORAGE_KEY, delimiterInput.value);
      } catch (error) {
        console.warn('Failed to save delimiter config:', error);
      }
    };
    const scheduleSaveDelimiter = () => {
      if (delimiterSaveTimer !== null) {
        window.clearTimeout(delimiterSaveTimer);
      }
      delimiterSaveTimer = window.setTimeout(saveDelimiter, AUTO_PLAY_DEBOUNCE_MS);
    };
    delimiterInput.addEventListener('input', scheduleSaveDelimiter);
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

  if (favoritesToggleButton && favoritesPanel) {
    favoritesToggleButton.addEventListener('click', () => {
      const isHidden = favoritesPanel.hasAttribute('hidden');
      if (isHidden) {
        favoritesPanel.removeAttribute('hidden');
      } else {
        favoritesPanel.setAttribute('hidden', 'true');
      }
      favoritesToggleButton.setAttribute('aria-expanded', String(isHidden));
    });
  }

  initializeTextLists();

  const updateSpectrogramScaleLabel = () => {
    if (spectrogramScaleToggle) {
      const isLogScale = spectrogramScale === 'log';
      const nextLabel = isLogScale ? 'リニアにする' : '対数にする';
      spectrogramScaleToggle.textContent = nextLabel;
      spectrogramScaleToggle.setAttribute('aria-pressed', String(isLogScale));
      spectrogramScaleToggle.setAttribute('aria-label', `スペクトログラムのスケールを${nextLabel}`);
    }
  };

  if (spectrogramScaleToggle) {
    updateSpectrogramScaleLabel();
    spectrogramScaleToggle.addEventListener('click', () => {
      spectrogramScale = spectrogramScale === 'linear' ? 'log' : 'linear';
      initializeVisualizationCanvases();
      spectrogramNeedsReset = true;
      updateSpectrogramScaleLabel();
    });
  }

  const updateIntonationKeyboardToggle = () => {
    if (intonationKeyboardToggle) {
      intonationKeyboardToggle.textContent = intonationKeyboardEnabled ? 'キーボード操作: ON' : 'キーボード操作: OFF';
      intonationKeyboardToggle.setAttribute('aria-pressed', String(intonationKeyboardEnabled));
      intonationKeyboardToggle.setAttribute(
        'aria-label',
        intonationKeyboardEnabled ? 'キーボード操作を無効にする' : 'キーボード操作を有効にする'
      );
    }
  };

  if (intonationKeyboardToggle) {
    updateIntonationKeyboardToggle();
    intonationKeyboardToggle.addEventListener('click', () => {
      intonationKeyboardEnabled = !intonationKeyboardEnabled;
      updateIntonationKeyboardToggle();
      if (intonationKeyboardEnabled && intonationCanvas) {
        intonationCanvas.focus();
      }
      if (intonationPoints.length > 0) {
        drawIntonationChart(intonationPoints);
      }
    });
  }

  if (intonationFavoriteButton) {
    intonationFavoriteButton.addEventListener('click', saveCurrentIntonationFavorite);
  }

  if (intonationExpandTop) {
    intonationExpandTop.addEventListener('click', () => adjustIntonationScale('top', 2));
  }
  if (intonationShrinkTop) {
    intonationShrinkTop.addEventListener('click', () => adjustIntonationScale('top', 0.5));
  }
  if (intonationShrinkBottom) {
    intonationShrinkBottom.addEventListener('click', () => adjustIntonationScale('bottom', 0.5));
  }
  if (intonationExpandBottom) {
    intonationExpandBottom.addEventListener('click', () => adjustIntonationScale('bottom', 2));
  }

  if (intonationCanvas) {
    intonationCanvas.addEventListener('pointerdown', handleIntonationPointerDown);
    intonationCanvas.addEventListener('pointermove', handleIntonationPointerMove);
    intonationCanvas.addEventListener('pointerleave', handleIntonationPointerUp);
    intonationCanvas.addEventListener('keydown', handleIntonationKeyDown);
    intonationCanvas.addEventListener('focus', () => {
      if (intonationPoints.length > 0 && intonationSelectedIndex === null) {
        intonationSelectedIndex = 0;
        drawIntonationChart(intonationPoints);
      }
    });
  }
  window.addEventListener('mouseup', handleIntonationPointerUp);
  window.addEventListener('pointerup', handleIntonationPointerUp);

  initializeVisualizationCanvases();
  initializeIntonationCanvas();
  window.addEventListener('resize', () => {
    initializeVisualizationCanvases();
    initializeIntonationCanvas();
    if (intonationPoints.length > 0) {
      drawIntonationChart(intonationPoints);
    }
  });
});
