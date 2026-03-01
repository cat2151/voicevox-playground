export function getMaxFreqByThreshold(
	buffer: Float32Array,
	sampleRate: number,
	thresholdRatio = 0.01,
): number {
	const n = buffer.length;
	const fftSize = 2 ** Math.floor(Math.log2(n));
	const real = new Float32Array(fftSize);
	const imag = new Float32Array(fftSize);
	real.set(buffer.subarray(0, fftSize));
	fftRadix2(real, imag);
	const mags = new Float32Array(fftSize / 2);
	let max = 0;
	for (let i = 0; i < mags.length; i++) {
		const mag = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]);
		mags[i] = mag;
		if (mag > max) max = mag;
	}
	const threshold = max * thresholdRatio;
	let maxBin = 0;
	for (let i = mags.length - 1; i >= 0; i--) {
		if (mags[i] >= threshold) {
			maxBin = i;
			break;
		}
	}
	return (maxBin / mags.length) * (sampleRate / 2);
}

function fftRadix2(real: Float32Array, imag: Float32Array) {
	const n = real.length;
	if (n <= 1) return;
	for (let i = 1, j = 0; i < n; i++) {
		let bit = n >> 1;
		for (; j & bit; bit >>= 1) {
			j ^= bit;
		}
		j ^= bit;
		if (i < j) {
			[real[i], real[j]] = [real[j], real[i]];
			[imag[i], imag[j]] = [imag[j], imag[i]];
		}
	}
	for (let len = 2; len <= n; len <<= 1) {
		const angle = (-2 * Math.PI) / len;
		const wlenReal = Math.cos(angle);
		const wlenImag = Math.sin(angle);
		for (let i = 0; i < n; i += len) {
			let wReal = 1,
				wImag = 0;
			for (let j = 0; j < len / 2; j++) {
				const uReal = real[i + j];
				const uImag = imag[i + j];
				const vReal =
					real[i + j + len / 2] * wReal - imag[i + j + len / 2] * wImag;
				const vImag =
					real[i + j + len / 2] * wImag + imag[i + j + len / 2] * wReal;
				real[i + j] = uReal + vReal;
				imag[i + j] = uImag + vImag;
				real[i + j + len / 2] = uReal - vReal;
				imag[i + j + len / 2] = uImag - vImag;
				const nextWReal = wReal * wlenReal - wImag * wlenImag;
				wImag = wReal * wlenImag + wImag * wlenReal;
				wReal = nextWReal;
			}
		}
	}
}
