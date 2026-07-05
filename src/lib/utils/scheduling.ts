// Rate-limiting primitives for streaming side-effects: collapse the storm of per-token work (Markdown
// parsing, scrolling, persistence) into a bounded number of runs so a fast token stream cannot thrash
// the main thread. See #691.

interface Debounced {
	schedule: () => void
	flush: () => void
	cancel: () => void
}

interface Throttled {
	schedule: () => void
}

// Trailing debounce: runs task once, delay_ms after the last schedule() in a burst. flush() forces the
// pending run immediately (e.g. on unload); cancel() drops it.
function debounce(task: () => void, delay_ms: number): Debounced {
	// Held on an object rather than a bare `let` so it can stay uninitialized without tripping the
	// init-declarations / no-useless-undefined rule pair.
	const handle: { timer?: ReturnType<typeof setTimeout> } = {}

	function cancel(): void {
		if (handle.timer === undefined) return

		clearTimeout(handle.timer)
		delete handle.timer
	}

	function schedule(): void {
		cancel()
		handle.timer = setTimeout(() => {
			delete handle.timer
			task()
		}, delay_ms)
	}

	function flush(): void {
		if (handle.timer === undefined) return

		cancel()
		task()
	}

	return { schedule, flush, cancel }
}

// Frame throttle: coalesces every schedule() before the next animation frame into a single task() run
// on that frame. schedule() is only ever called from browser effects, so the bare global is safe.
function raf_throttle(task: () => void): Throttled {
	let is_frame_pending = false

	function run(): void {
		is_frame_pending = false
		task()
	}

	function schedule(): void {
		if (is_frame_pending) return

		is_frame_pending = true
		requestAnimationFrame(run)
	}

	return { schedule }
}

const scheduling = { debounce, raf_throttle }

export { scheduling }
