import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FAVORITES_STORAGE_KEY, HISTORY_STORAGE_KEY, TEXT_LIST_LIMIT } from './config';
import { addToHistory, initializeTextLists } from './textLists';

const storageState: Record<string, string> = {};

const fakeLocalStorage = {
  getItem: (key: string) => storageState[key] ?? null,
  setItem: (key: string, value: string) => {
    storageState[key] = value;
  },
  removeItem: (key: string) => {
    delete storageState[key];
  },
  clear: () => {
    for (const key of Object.keys(storageState)) delete storageState[key];
  },
};

beforeEach(() => {
  fakeLocalStorage.clear();
  vi.stubGlobal('localStorage', fakeLocalStorage);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('initializeTextLists', () => {
  it('deduplicates and trims favorites and history before persisting', () => {
    fakeLocalStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([' foo', 'foo', '']));
    fakeLocalStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(['bar', 'bar', ' ']));

    initializeTextLists({ favoritesList: null, historyList: null, onSelectText: () => {} });

    expect(JSON.parse(storageState[FAVORITES_STORAGE_KEY])).toEqual(['foo']);
    expect(JSON.parse(storageState[HISTORY_STORAGE_KEY])).toEqual(['bar']);
  });

  it('enforces the text list limit when loading stored history', () => {
    const overLimit = Array.from({ length: TEXT_LIST_LIMIT + 5 }, (_, i) => `item${i}`);
    fakeLocalStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(overLimit));

    initializeTextLists({ favoritesList: null, historyList: null, onSelectText: () => {} });

    const storedHistory = JSON.parse(storageState[HISTORY_STORAGE_KEY]);
    expect(storedHistory).toHaveLength(TEXT_LIST_LIMIT);
    expect(storedHistory[0]).toBe('item0');
    expect(storedHistory.at(-1)).toBe(`item${TEXT_LIST_LIMIT - 1}`);
  });
});

describe('addToHistory', () => {
  it('skips entries already in favorites and adds new trimmed entries to history', () => {
    fakeLocalStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(['keep']));
    fakeLocalStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([]));

    initializeTextLists({ favoritesList: null, historyList: null, onSelectText: () => {} });
    addToHistory(' keep ');
    addToHistory(' new ');

    expect(JSON.parse(storageState[FAVORITES_STORAGE_KEY])).toEqual(['keep']);
    expect(JSON.parse(storageState[HISTORY_STORAGE_KEY])).toEqual(['new']);
  });
});
