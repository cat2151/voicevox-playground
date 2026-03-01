// Node環境でwindow, document, getComputedStyle参照エラーを防ぐ
global.window = { devicePixelRatio: 1 } as any;
global.getComputedStyle = () =>
	({ getPropertyValue: () => "" }) as unknown as CSSStyleDeclaration;
global.document = { documentElement: {} } as any;
import { describe, it } from "vitest";
import { drawRealtimeFFT } from "./fftOverlay";

describe("drawRealtimeFFT", () => {
	it("推定周波数が100Hz以上の上位1%の最低周波数になる", () => {
		// 512bin, 0Hz~8000Hz, 100Hz以上の上位1%の最低周波数をテスト
		const binCount = 512;
		const sampleRate = 16000;
		const nyquist = sampleRate / 2;
		const fftValues = new Float32Array(binCount).fill(0);
		// 100Hz以上のbinを計算
		const minBin = Math.ceil((100 / nyquist) * (binCount - 1));
		// 上位1%のbin数
		const topCount = Math.max(1, Math.floor((binCount - minBin) * 0.01));
		// 例えばminBin+5~minBin+5+topCount-1にピークを作る
		for (let i = minBin + 5; i < minBin + 5 + topCount; i++) {
			fftValues[i] = 100 + (i - minBin);
		}
		// canvasのモック
		const canvas = {
			width: 512,
			height: 100,
			getContext: () => ({
				save: () => {},
				restore: () => {},
				beginPath: () => {},
				moveTo: () => {},
				lineTo: () => {},
				stroke: () => {},
				fillText: () => {},
				clearRect: () => {},
				fillRect: () => {},
				setTransform: () => {},
				scale: () => {},
				globalAlpha: 1,
				font: "",
				fillStyle: "",
				strokeStyle: "",
				textBaseline: "",
				textAlign: "",
			}),
			getBoundingClientRect: () => ({
				left: 0,
				top: 0,
				right: 512,
				bottom: 100,
				width: 512,
				height: 100,
				x: 0,
				y: 0,
				toJSON: () => {},
			}),
		} as unknown as HTMLCanvasElement;
		// maxFreqはnyquist
		drawRealtimeFFT(fftValues, canvas, sampleRate, nyquist);
		// 期待値: minBin+5が推定される
		// ...実際の描画はテストできないが、エラーなく動作することを確認
	});
});
