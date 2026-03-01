export function prepareCanvas(canvas: HTMLCanvasElement) {
	const rect = canvas.getBoundingClientRect();
	const dpr = window.devicePixelRatio || 1;
	const displayWidth = Math.max(1, Math.floor(rect.width));
	const displayHeight = Math.max(1, Math.floor(rect.height));
	const width = Math.max(1, Math.floor(displayWidth * dpr));
	const height = Math.max(1, Math.floor(displayHeight * dpr));

	if (canvas.width !== width || canvas.height !== height) {
		canvas.width = width;
		canvas.height = height;
	}

	const ctx = canvas.getContext("2d");
	if (ctx) {
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.scale(dpr, dpr);
	}

	return { ctx, width: displayWidth, height: displayHeight, dpr };
}
