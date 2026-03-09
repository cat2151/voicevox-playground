import { AUDIO_CACHE_LIMIT } from "../config";

const audioCache = new Map<string, ArrayBuffer>();

export function clearAudioCache(): void {
	audioCache.clear();
}

export function getAudioCacheKey(text: string, styleId: number): string {
	return `${styleId}::${text}`;
}

export function getCachedAudio(key: string): ArrayBuffer | null {
	return audioCache.get(key) ?? null;
}

export function setCachedAudio(key: string, buffer: ArrayBuffer): void {
	if (audioCache.size >= AUDIO_CACHE_LIMIT) {
		const oldest = audioCache.keys().next().value;
		if (oldest !== undefined) {
			audioCache.delete(oldest);
		}
	}
	audioCache.set(key, buffer);
}
