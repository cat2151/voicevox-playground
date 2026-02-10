import * as Tone from 'tone';

// VOICEVOX API settings
const VOICEVOX_API_BASE = 'http://localhost:50021';
const ZUNDAMON_SPEAKER_ID = 3; // ずんだもんのスピーカーID
const REQUEST_TIMEOUT_MS = 10000; // 10 second timeout

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

// Play audio using Tone.js
async function playAudio(audioBuffer: ArrayBuffer) {
  // Start Tone.js audio context (required for user interaction)
  await Tone.start();
  
  // Decode the audio data
  const audioContext = Tone.getContext().rawContext as BaseAudioContext;
  const decodedBuffer = await audioContext.decodeAudioData(audioBuffer);
  
  // Create a Tone.js Player with the decoded buffer
  const player = new Tone.Player(decodedBuffer).toDestination();
  
  // Play the audio
  player.start();
  
  // Return promise that resolves when playback finishes
  return new Promise<void>((resolve) => {
    let resolved = false;
    
    player.onstop = () => {
      if (!resolved) {
        resolved = true;
        player.dispose();
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
        player.dispose();
        resolve();
      }
    }, decodedBuffer.duration * 1000 + 100);
  });
}

// Main play function
async function handlePlay() {
  const textArea = document.getElementById('text') as HTMLTextAreaElement | null;
  const playButton = document.getElementById('playButton') as HTMLButtonElement | null;
  
  if (!textArea || !playButton) {
    console.error('Required UI elements not found');
    return;
  }
  
  const text = textArea.value.trim();
  
  if (!text) {
    showStatus('テキストを入力してください', 'error');
    return;
  }
  
  // Disable button during processing
  playButton.disabled = true;
  
  try {
    // Step 1: Get audio query
    showStatus('音声クエリを作成中...', 'info');
    const audioQuery = await getAudioQuery(text, ZUNDAMON_SPEAKER_ID);
    
    // Step 2: Synthesize audio
    showStatus('音声を生成中...', 'info');
    const audioBuffer = await synthesize(audioQuery, ZUNDAMON_SPEAKER_ID);
    
    // Step 3: Play audio
    showStatus('音声を再生中...', 'info');
    await playAudio(audioBuffer);
    
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
  }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
  const playButton = document.getElementById('playButton');
  
  if (playButton) {
    playButton.addEventListener('click', handlePlay);
  }
});
