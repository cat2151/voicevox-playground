import { afterEach, describe, expect, it, vi } from 'vitest';
import { ZUNDAMON_SPEAKER_ID } from './config';
import { buildTextSegments, fetchVoiceStyles, parseDelimiterConfig } from './styleManager';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('parseDelimiterConfig', () => {
  it('returns null when the delimiter is too short', () => {
    expect(parseDelimiterConfig(' ')).toBeNull();
    expect(parseDelimiterConfig('x')).toBeNull();
  });

  it('parses paired delimiters separated by whitespace', () => {
    expect(parseDelimiterConfig(' [ ] ')).toEqual({ start: '[', end: ']' });
  });

  it('falls back to the first and last characters when no split is found', () => {
    expect(parseDelimiterConfig('【】')).toEqual({ start: '【', end: '】' });
  });
});

describe('buildTextSegments', () => {
  it('returns the full text as a single segment when no delimiter is provided', () => {
    expect(buildTextSegments('hello', null, ZUNDAMON_SPEAKER_ID)).toEqual([
      { text: 'hello', styleId: ZUNDAMON_SPEAKER_ID },
    ]);
    expect(buildTextSegments('', null, ZUNDAMON_SPEAKER_ID)).toEqual([]);
  });

  it('keeps unknown markers inline when no matching style is found', () => {
    const segments = buildTextSegments('intro <??>outro', { start: '<', end: '>' }, ZUNDAMON_SPEAKER_ID);
    expect(segments).toEqual([{ text: 'intro <??>outro', styleId: ZUNDAMON_SPEAKER_ID }]);
  });

  it('switches styles when a marker matches a known numeric style id', async () => {
    const fakeResponse = [
      {
        name: 'Tester',
        styles: [
          { id: 10, name: 'ノーマル' },
          { id: 11, name: 'ハッピー' },
        ],
      },
    ];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => fakeResponse,
    });
    vi.stubGlobal('fetch', fetchMock);

    await fetchVoiceStyles(null);

    const segments = buildTextSegments('hello <11>world', { start: '<', end: '>' }, 10);

    expect(segments).toEqual([
      { text: 'hello ', styleId: 10 },
      { text: 'world', styleId: 11 },
    ]);
    expect(fetchMock).toHaveBeenCalled();
  });
});
