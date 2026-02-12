export const VOICEVOX_API_BASE = 'http://localhost:50021';
export const ZUNDAMON_SPEAKER_ID = 3; // ずんだもんのスピーカーID
export const REQUEST_TIMEOUT_MS = 10000; // 10 second timeout
export const AUTO_PLAY_DEBOUNCE_MS = 700;
export const WAVEFORM_TARGET_RATIO = 1;
export const SPECTROGRAM_MAX_COLUMNS_PER_FRAME = 12;
export const AUDIO_CACHE_LIMIT = 10;
export const INTONATION_DEBOUNCE_MS = 700;
export const MIN_LOG_FREQUENCY = 20;
export const MIN_TICK_SPACING_PX = 60;
export const MONOKAI_COLORS = ['#f92672', '#a6e22e', '#66d9ef', '#fd971f', '#ae81ff', '#e6db74'];
export const DELIMITER_STORAGE_KEY = 'voicevox-delimiter-pair';
export const FAVORITES_STORAGE_KEY = 'voicevox-favorites';
export const HISTORY_STORAGE_KEY = 'voicevox-history';
export const INTONATION_FAVORITES_STORAGE_KEY = 'voicevox-intonation-favorites';
export const TEXT_LIST_LIMIT = 20;

export type FrequencyScale = 'linear' | 'log';

export interface VoiceStyleOption {
  id: number;
  name: string;
  speakerName: string;
}

export interface VoiceVoxSpeaker {
  name: string;
  styles: Array<{
    id: number;
    name: string;
  }>;
}

export interface AudioQuery {
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

export interface IntonationPoint {
  phraseIndex: number;
  moraIndex: number;
  label: string;
  pitch: number;
}

export interface IntonationChartRange {
  min: number;
  max: number;
  margin: number;
  height: number;
  innerHeight: number;
  width: number;
}

export interface IntonationFavorite {
  text: string;
  styleId: number;
  query: AudioQuery;
}
