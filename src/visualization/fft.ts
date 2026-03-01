const hannWindowCache = new Map<number, Float32Array>();

export function getHannWindow(size: number) {
	const cached = hannWindowCache.get(size);
	if (cached) {
		return cached;
	}
	const window = new Float32Array(size);
	for (let i = 0; i < size; i++) {
		window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (size - 1)));
	}
	hannWindowCache.set(size, window);
	return window;
}

export function fftRadix2(real: Float32Array, imag: Float32Array) {
	const n = real.length;
	if (n <= 1) return;

	for (let i = 1, j = 0; i < n; i++) {
		let bit = n >> 1;
		for (; j & bit; bit >>= 1) {
			j ^= bit;
		}
		j ^= bit;
		if (i < j) {
			const tempReal = real[i];
			real[i] = real[j];
			real[j] = tempReal;
			const tempImag = imag[i];
			imag[i] = imag[j];
			imag[j] = tempImag;
		}
	}

	for (let len = 2; len <= n; len <<= 1) {
		const angle = (-2 * Math.PI) / len;
		const wlenReal = Math.cos(angle);
		const wlenImag = Math.sin(angle);
		for (let i = 0; i < n; i += len) {
			let wReal = 1;
			let wImag = 0;
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
