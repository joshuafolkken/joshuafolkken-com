/** z-index for @prgm/sveltekit-progress-bar; must stay above StickyHeader (z-50). */
const PROGRESS_BAR_Z_INDEX = 100

/**
 * Passed to ProgressBar `displayThresholdMs`. 0 = show on every client navigation
 * (no minimum delay before the bar appears).
 */
const PROGRESS_BAR_THRESHOLD_MS = 0

const PROGRESS_BAR_SETTLE_MS = 200

export { PROGRESS_BAR_SETTLE_MS, PROGRESS_BAR_THRESHOLD_MS, PROGRESS_BAR_Z_INDEX }
