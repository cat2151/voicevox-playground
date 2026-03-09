export async function confirmResetIntonationBeforePlay(): Promise<boolean> {
	const dialog = document.getElementById("playConfirmDialog");
	const resetButton = document.getElementById("playConfirmReset");
	const cancelButton = document.getElementById("playConfirmCancel");
	if (!dialog || !resetButton || !cancelButton) {
		return window.confirm(
			"イントネーションの編集内容が破棄されます。再生してよろしいですか？",
		);
	}
	const previousActiveElement = document.activeElement as HTMLElement | null;
	dialog.removeAttribute("hidden");
	let settled = false;
	(resetButton as HTMLElement).focus();
	return new Promise<boolean>((resolve) => {
		let keydownHandler: ((event: KeyboardEvent) => void) | null = null;
		const cleanup = () => {
			if (settled) return;
			settled = true;
			dialog.setAttribute("hidden", "true");
			if (keydownHandler) {
				dialog.removeEventListener("keydown", keydownHandler);
			}
			resetButton.removeEventListener("click", handleReset);
			cancelButton.removeEventListener("click", handleCancel);
			if (
				previousActiveElement &&
				typeof previousActiveElement.focus === "function"
			) {
				previousActiveElement.focus();
			}
		};
		const handleReset = () => {
			cleanup();
			resolve(true);
		};
		const handleCancel = () => {
			cleanup();
			resolve(false);
		};
		keydownHandler = (event: KeyboardEvent) => {
			if (event.key === "Escape" || event.key === "Esc") {
				event.preventDefault();
				handleCancel();
			}
		};
		dialog.addEventListener("keydown", keydownHandler);
		resetButton.addEventListener("click", handleReset, { once: true });
		cancelButton.addEventListener("click", handleCancel, { once: true });
	});
}
