/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAudioCacheKey, handlePlay, handlePlayButtonClick, isPlayRequestPending, setPlayButtonAppearance } from './playback';
import { stopActivePlayback } from './visualization';

const dummyAudioBuffer = {
  length: 1,
  numberOfChannels: 1,
  sampleRate: 48000,
  duration: 0.01,
  getChannelData: () => new Float32Array(1),
} as unknown as AudioBuffer;

vi.mock('tone', () => ({
  getContext: () => ({
    rawContext: {
      decodeAudioData: vi.fn(async () => dummyAudioBuffer),
    },
  }),
}));

vi.mock('./status', () => ({
  showStatus: vi.fn(),
  scheduleHideStatus: vi.fn(),
}));

vi.mock('./textLists', () => ({
  addToHistory: vi.fn(),
}));

vi.mock('./intonation', () => ({
  fetchAndRenderIntonation: vi.fn(),
  isIntonationDirty: vi.fn(() => false),
  resetIntonationState: vi.fn(),
}));

vi.mock('./uiControls', () => ({
  updateExportButtonState: vi.fn(),
}));

vi.mock('./styleManager', () => ({
  buildTextSegments: vi.fn(() => [{ text: 'hello', styleId: 1 }]),
  getSelectedStyleId: vi.fn(() => 1),
  parseDelimiterConfig: vi.fn(() => ({})),
  setSelectedStyleId: vi.fn(),
}));

vi.mock('./audio', () => ({
  combineAudioBuffers: vi.fn(() => dummyAudioBuffer),
  encodeAudioBufferToWav: vi.fn(() => new ArrayBuffer(4)),
  getAudioQuery: vi.fn(async () => ({})),
  synthesize: vi.fn(async () => new ArrayBuffer(8)),
}));

vi.mock('./visualization', () => {
  let active = false;
  let resolvePlayback: ((result: { stopped: boolean }) => void) | null = null;
  const stopActivePlayback = vi.fn(() => {
    active = false;
    resolvePlayback?.({ stopped: true });
    resolvePlayback = null;
  });
  const playAudio = vi.fn(async () => {
    active = true;
    return new Promise<{ stopped: boolean }>((resolve) => {
      resolvePlayback = resolve;
    });
  });
  return {
    drawRenderedWaveform: vi.fn(),
    initializeVisualizationCanvases: vi.fn(),
    isPlaybackActive: vi.fn(() => active),
    playAudio,
    stopActivePlayback,
  };
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

describe('getAudioCacheKey', () => {
  it('combines style id and text', () => {
    expect(getAudioCacheKey('hello', 42)).toBe('42::hello');
  });
});

describe('setPlayButtonAppearance', () => {
  it('sets play and stop button states', () => {
    const button = document.createElement('button');
    button.id = 'playButton';
    document.body.appendChild(button);

    setPlayButtonAppearance('play');
    expect(button.getAttribute('aria-label')).toBe('Play');
    expect(button.title).toBe('Play');
    expect(button.dataset.icon).toBe('play');
    expect(button.querySelector('svg.icon--play')).not.toBeNull();

    setPlayButtonAppearance('stop');
    expect(button.getAttribute('aria-label')).toBe('Stop');
    expect(button.title).toBe('Stop');
    expect(button.dataset.icon).toBe('stop');
    expect(button.querySelector('svg.icon--stop')).not.toBeNull();
  });
});

describe('handlePlayButtonClick', () => {
  it('stops playback even when a play request is pending', async () => {
    document.body.innerHTML = `
      <textarea id="text">hello</textarea>
      <button id="playButton"></button>
      <button id="exportButton"></button>
      <canvas id="renderedWaveform"></canvas>
      <canvas id="realtimeWaveform"></canvas>
      <canvas id="spectrogram"></canvas>
      <input id="loopCheckbox" type="checkbox" />
      <select id="styleSelect"></select>
      <input id="delimiterInput" />
    `;

    const playPromise = handlePlay();
    expect(isPlayRequestPending()).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 0));
    handlePlayButtonClick();

    expect(stopActivePlayback).toHaveBeenCalledTimes(1);

    await playPromise;
  });
});
