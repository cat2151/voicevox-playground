import { intonationState as state } from "./intonationState";
import {
	applyRangeExtra,
	calculateLetterKeyAdjustment,
	clampPitchToDisplayRange,
	drawIntonationChart,
	findNearestIntonationPoint,
	getBaseDisplayRange,
	pitchFromY,
	refreshDisplayRange,
	updateHoveredLabel,
	updateInitialRangeFromPoints,
} from "./intonationDisplay";
import {
	playUpdatedIntonation,
	replayCachedIntonationAudio,
	scheduleIntonationPlayback,
	showPlaybackStatus,
} from "./intonationPlayback";

function disableLoopOnIntonationEdit() {
	if (state.loopCheckboxEl && state.loopCheckboxEl.checked) {
		state.loopCheckboxEl.checked = false;
	}
}

function applyPitchToQuery(pointIndex: number, pitch: number) {
	if (!state.currentIntonationQuery) return;
	if (pointIndex < 0 || pointIndex >= state.intonationPoints.length) return;
	const target = state.intonationPoints[pointIndex];
	const phrase =
		state.currentIntonationQuery.accent_phrases[target.phraseIndex];
	if (!phrase) return;
	if (target.moraIndex < phrase.moras.length) {
		phrase.moras[target.moraIndex].pitch = pitch;
	} else if (phrase.pause_mora) {
		phrase.pause_mora.pitch = pitch;
	}
}

function applyPitchEdit(
	pointIndex: number,
	pitch: number,
	options: { redraw?: boolean; schedulePlayback?: boolean } = {},
) {
	if (pointIndex < 0 || pointIndex >= state.intonationPoints.length) return;
	const redraw = options.redraw !== false;
	const schedulePlayback = options.schedulePlayback !== false;
	state.intonationPoints[pointIndex].pitch = pitch;
	applyPitchToQuery(pointIndex, pitch);
	disableLoopOnIntonationEdit();
	state.intonationDirty = true;
	if (redraw) {
		drawIntonationChart(state.intonationPoints);
	}
	if (schedulePlayback) {
		scheduleIntonationPlayback(playUpdatedIntonation);
	}
}

export function handleIntonationPointerDown(event: MouseEvent | PointerEvent) {
	if (event.button !== 0) return;
	if (!state.intonationCanvas || state.intonationPointPositions.length === 0)
		return;
	const rect = state.intonationCanvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const targetIndex = findNearestIntonationPoint(x);
	if (targetIndex !== -1) {
		state.intonationDragIndex = targetIndex;
		state.intonationSelectedIndex = targetIndex;
		disableLoopOnIntonationEdit();
		state.intonationCanvas.focus();
		if (!state.scrollLocked) {
			state.previousBodyOverflow = document.body.style.overflow;
			document.body.style.overflow = "hidden";
			state.scrollLocked = true;
		}
		if ("pointerId" in event) {
			state.intonationActivePointerId = event.pointerId;
			state.intonationCanvas.setPointerCapture(event.pointerId);
		}
		handleIntonationPointerMove(event);
		event.preventDefault();
	}
}

export function handleIntonationPointerMove(event: MouseEvent | PointerEvent) {
	if (
		state.intonationDragIndex === null ||
		!state.intonationCanvas ||
		state.intonationPointPositions.length === 0
	) {
		return;
	}
	event.preventDefault();
	if (
		"pointerId" in event &&
		state.intonationActivePointerId !== null &&
		event.pointerId !== state.intonationActivePointerId
	) {
		return;
	}
	const rect = state.intonationCanvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const targetIndex = findNearestIntonationPoint(x);
	if (targetIndex === -1) return;
	state.intonationDragIndex = targetIndex;
	const y = event.clientY - rect.top;
	refreshDisplayRange();
	const newPitch = clampPitchToDisplayRange(pitchFromY(y));
	state.intonationSelectedIndex = targetIndex;
	applyPitchEdit(targetIndex, newPitch, { schedulePlayback: false });
	state.intonationPlaybackPending = true;
}

export function handleIntonationPointerUp() {
	if (state.intonationDragIndex !== null) {
		updateInitialRangeFromPoints(state.intonationPoints);
		drawIntonationChart(state.intonationPoints);
		state.intonationDragIndex = null;
	}
	if (state.scrollLocked) {
		document.body.style.overflow = state.previousBodyOverflow ?? "";
		state.scrollLocked = false;
		state.previousBodyOverflow = null;
	}
	if (state.intonationActivePointerId !== null && state.intonationCanvas) {
		state.intonationCanvas.releasePointerCapture(
			state.intonationActivePointerId,
		);
		state.intonationActivePointerId = null;
	}
	if (state.intonationPlaybackPending) {
		state.intonationPlaybackPending = false;
		scheduleIntonationPlayback(playUpdatedIntonation);
	}
}

export function handleIntonationMouseMove(event: MouseEvent) {
	if (!state.intonationCanvas || state.intonationPointPositions.length === 0)
		return;
	const rect = state.intonationCanvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const index = findNearestIntonationPoint(x);
	updateHoveredLabel(index === -1 ? null : index);
}

export function handleIntonationMouseLeave() {
	updateHoveredLabel(null);
}

export function handleIntonationKeyDown(event: KeyboardEvent) {
	if (
		!state.intonationCanvas ||
		state.intonationPointPositions.length === 0 ||
		!state.intonationKeyboardEnabled
	) {
		return;
	}
	if (event.key === "Enter" || event.key === " ") {
		event.preventDefault();
		showPlaybackStatus();
		void replayCachedIntonationAudio();
		return;
	}
	if (event.key === "Escape" || event.key === "Esc") {
		event.preventDefault();
		state.intonationSelectedIndex = null;
		drawIntonationChart(state.intonationPoints);
		return;
	}
	if (event.key === "Tab") {
		if (state.intonationSelectedIndex !== null) {
			state.intonationSelectedIndex = null;
			drawIntonationChart(state.intonationPoints);
		}
		return;
	}
	const letterIndex =
		event.key.length === 1
			? event.key.toLowerCase().charCodeAt(0) - "a".charCodeAt(0)
			: -1;
	if (letterIndex >= 0 && letterIndex < 26) {
		const targetIndex = state.intonationPoints.findIndex(
			(_, idx) => idx % 26 === letterIndex,
		);
		if (targetIndex !== -1) {
			state.intonationSelectedIndex = targetIndex;
			if (!state.intonationInitialPitchRange) {
				updateInitialRangeFromPoints(state.intonationPoints);
			}
			const baseRange = getBaseDisplayRange();
			if (baseRange) {
				const isUpperCase =
					event.key.length === 1 &&
					event.key === event.key.toUpperCase() &&
					event.key !== event.key.toLowerCase();
				const { pitch, rangeExtra } = calculateLetterKeyAdjustment({
					currentPitch: state.intonationPoints[targetIndex].pitch,
					baseRange,
					rangeExtra: state.intonationRangeExtra,
					stepSize: state.intonationStepSize,
					direction: isUpperCase ? "down" : "up",
					ctrlModifier: event.ctrlKey,
				});
				applyRangeExtra(rangeExtra);
				const newPitch = clampPitchToDisplayRange(pitch);
				applyPitchEdit(targetIndex, newPitch);
			} else {
				drawIntonationChart(state.intonationPoints);
			}
			event.preventDefault();
		}
		return;
	}
	if (event.key === "ArrowLeft") {
		event.preventDefault();
		state.intonationSelectedIndex = Math.max(
			0,
			(state.intonationSelectedIndex ?? 0) - 1,
		);
		drawIntonationChart(state.intonationPoints);
		return;
	}
	if (event.key === "ArrowRight") {
		event.preventDefault();
		state.intonationSelectedIndex = Math.min(
			state.intonationPoints.length - 1,
			(state.intonationSelectedIndex ?? 0) + 1,
		);
		drawIntonationChart(state.intonationPoints);
		return;
	}
	if (event.key === "ArrowUp" || event.key === "ArrowDown") {
		event.preventDefault();
		if (state.intonationSelectedIndex === null) {
			state.intonationSelectedIndex = 0;
		}
		if (!state.intonationInitialPitchRange) {
			updateInitialRangeFromPoints(state.intonationPoints);
		}
		refreshDisplayRange();
		const step =
			state.intonationStepSize * (event.shiftKey && !event.ctrlKey ? 0.5 : 1);
		if (event.ctrlKey) {
			const rangeDelta = event.key === "ArrowUp" ? step : -step;
			applyRangeExtra({
				top: state.intonationRangeExtra.top + rangeDelta,
				bottom: state.intonationRangeExtra.bottom + rangeDelta,
			});
			drawIntonationChart(state.intonationPoints);
			return;
		}
		const targetIndex = state.intonationSelectedIndex ?? 0;
		const adjustment = event.key === "ArrowUp" ? step : -step;
		const newPitch = clampPitchToDisplayRange(
			state.intonationPoints[targetIndex].pitch + adjustment,
		);
		applyPitchEdit(targetIndex, newPitch);
	}
}
