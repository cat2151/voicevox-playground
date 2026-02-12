import { AudioQuery, REQUEST_TIMEOUT_MS, VOICEVOX_API_BASE } from './config';

export async function getAudioQuery(text: string, speakerId: number): Promise<AudioQuery> {
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

export async function synthesize(audioQuery: AudioQuery, speakerId: number): Promise<ArrayBuffer> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${VOICEVOX_API_BASE}/synthesis?speaker=${speakerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(audioQuery),
      signal: controller.signal,
    });

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

export function combineAudioBuffers(buffers: AudioBuffer[], audioContext: BaseAudioContext) {
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

export function encodeAudioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
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
