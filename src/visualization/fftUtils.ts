// FFTユーティリティ関数群

/**
 * 対数スケールでx座標から周波数を計算
 */
export function xToFreq(x: number, width: number, logMinFreq: number, logMaxFreq: number): number {
  const logFreq = logMinFreq + (x / (width - 1)) * (logMaxFreq - logMinFreq);
  return Math.pow(10, logFreq);
}

/**
 * 周波数からbinの小数インデックスを計算
 */
export function freqToBinF(freq: number, nyquist: number, binCount: number): number {
  return (freq / nyquist) * (binCount - 1);
}

/**
 * FFT配列から小数bin位置の値を線形補間で取得
 */
export function getInterpolatedValue(fftValues: Float32Array, binF: number): number {
  const bin0 = Math.floor(binF);
  const bin1 = Math.min(fftValues.length - 1, bin0 + 1);
  const t = binF - bin0;
  const v0 = fftValues[bin0] ?? 0;
  const v1 = fftValues[bin1] ?? 0;
  return v0 * (1 - t) + v1 * t;
}

/**
 * FFT値を正規化してy座標に変換
 */
export function fftValueToY(value: number, height: number): number {
  const norm = Math.max(0, Math.min(1, 1 + value / 100));
  return height - norm * height;
}
