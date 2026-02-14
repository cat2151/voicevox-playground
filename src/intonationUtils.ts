import type { AudioQuery } from './config';

export function isValidAudioQueryShape(query: unknown): query is AudioQuery {
  return (
    query !== null &&
    typeof query === 'object' &&
    Array.isArray((query as { accent_phrases?: unknown }).accent_phrases)
  );
}

export function cloneAudioQuery(query: AudioQuery): AudioQuery {
  return JSON.parse(JSON.stringify(query)) as AudioQuery;
}
