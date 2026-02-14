import { describe, expect, it } from 'vitest';
import { analyzeSpectrogramFrames, buildSpectrogramSignature } from './visualization';

class MockAudioBuffer {
  readonly length: number;
  readonly sampleRate: number;
  readonly numberOfChannels: number;
  readonly duration: number;
  private readonly data: Float32Array;

  constructor(samples: number[], sampleRate = 48000) {
    this.sampleRate = sampleRate;
    this.numberOfChannels = 1;
    this.data = Float32Array.from(samples);
    this.length = this.data.length;
    this.duration = this.length / this.sampleRate;
  }

  getChannelData(_channel?: number): Float32Array {
    return this.data;
  }
}

describe('buildSpectrogramSignature', () => {
  it('changes when audio content differs even with same length', () => {
    const bufferA = new MockAudioBuffer([0, 0, 0, 0]);
    const bufferB = new MockAudioBuffer([0, 0, 0.5, -0.5]);
    const sigA = buildSpectrogramSignature(bufferA as unknown as AudioBuffer);
    const sigB = buildSpectrogramSignature(bufferB as unknown as AudioBuffer);
    expect(sigA).not.toBe(sigB);
  });
});

describe('analyzeSpectrogramFrames', () => {
  it('returns valid frequency timing for a single column', async () => {
    const samples = Array.from({ length: 2048 }, (_, i) => Math.sin((2 * Math.PI * i) / 64));
    const buffer = new MockAudioBuffer(samples);
    const result = await analyzeSpectrogramFrames(buffer as unknown as AudioBuffer, 1);
    expect(result.frames).toHaveLength(1);
    expect(result.frequencies).toHaveLength(1);
    expect(result.frequencies[0].time).toBe(0);
    expect(Number.isFinite(result.frequencies[0].freq)).toBe(true);
  });
});
