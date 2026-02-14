/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from 'vitest';
import { getAudioCacheKey, setPlayButtonAppearance } from './playback';

afterEach(() => {
  document.body.innerHTML = '';
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
