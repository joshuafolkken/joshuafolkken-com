import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { scheduling } from './scheduling'

const DELAY_MS = 100

type Debounced = ReturnType<typeof scheduling.debounce>
type Throttled = ReturnType<typeof scheduling.raf_throttle>

const frames: Array<FrameRequestCallback> = []

function spy_debounce(): { debounced: Debounced; calls: () => number } {
	let count = 0
	const debounced = scheduling.debounce(() => {
		count += 1
	}, DELAY_MS)

	return { debounced, calls: () => count }
}

function spy_throttle(): { throttled: Throttled; calls: () => number } {
	let count = 0
	const throttled = scheduling.raf_throttle(() => {
		count += 1
	})

	return { throttled, calls: () => count }
}

function flush_frame(): void {
	const pending = [...frames]

	frames.length = 0

	for (const frame_task of pending) frame_task(0)
}

describe('scheduling.debounce timing', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('collapses rapid calls into a single trailing invocation', () => {
		const { debounced, calls } = spy_debounce()

		debounced.schedule()
		debounced.schedule()
		debounced.schedule()
		expect(calls()).toBe(0)

		vi.advanceTimersByTime(DELAY_MS)
		expect(calls()).toBe(1)
	})

	it('cancel prevents a scheduled call from firing', () => {
		const { debounced, calls } = spy_debounce()

		debounced.schedule()
		debounced.cancel()

		vi.advanceTimersByTime(DELAY_MS)
		expect(calls()).toBe(0)
	})
})

describe('scheduling.debounce flush', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('runs the pending call immediately and does not fire again', () => {
		const { debounced, calls } = spy_debounce()

		debounced.schedule()
		debounced.flush()
		expect(calls()).toBe(1)

		vi.advanceTimersByTime(DELAY_MS)
		expect(calls()).toBe(1)
	})

	it('does nothing when no call is scheduled', () => {
		const { debounced, calls } = spy_debounce()

		debounced.flush()
		expect(calls()).toBe(0)
	})
})

describe('scheduling.raf_throttle', () => {
	beforeEach(() => {
		frames.length = 0
		vi.stubGlobal('requestAnimationFrame', (frame_task: FrameRequestCallback): number => {
			frames.push(frame_task)

			return frames.length
		})
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('coalesces multiple calls within a frame into one invocation', () => {
		const { throttled, calls } = spy_throttle()

		throttled.schedule()
		throttled.schedule()
		throttled.schedule()
		expect(frames).toHaveLength(1)

		flush_frame()
		expect(calls()).toBe(1)
	})

	it('schedules a fresh frame after the previous one has run', () => {
		const { throttled, calls } = spy_throttle()

		throttled.schedule()
		flush_frame()
		throttled.schedule()
		flush_frame()

		expect(calls()).toBe(2)
	})
})
