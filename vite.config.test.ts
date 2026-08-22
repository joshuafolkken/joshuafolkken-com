import { afterEach, describe, expect, it, vi } from 'vitest'
import { make_visualizer_options } from './vite.config.js'

const CLIENT_STATS_FILENAME = 'stats-client.html'
const SERVER_STATS_FILENAME = 'stats-server.html'

// The bundle-stats HTML is written on every build; only opening it in a browser is opt-in via
// ANALYZE. The flag vocabulary itself is owned and tested by `@joshuafolkken/kit/env` (kit#828);
// what belongs here is the options object the visualizer is handed — a change that stops deriving
// `open` from the flag would pop two tabs on every `pnpm build` (SvelteKit builds client and
// server separately).
//
// Scope limit, deliberate: `visualizer()` keeps its options in a closure and returns only `name`
// and `generateBundle`, so the `open` value of the plugin instances the config actually ships
// cannot be read back. These cases pin the options builder, not the one line that calls it —
// inlining a literal at that call site would pass here.
describe('make_visualizer_options', () => {
	afterEach(() => {
		vi.unstubAllEnvs()
	})

	it('hands the visualizer open: false while ANALYZE is unset', () => {
		vi.stubEnv('ANALYZE', undefined)

		expect(make_visualizer_options(CLIENT_STATS_FILENAME)).toStrictEqual({
			open: false,
			filename: CLIENT_STATS_FILENAME,
		})
	})

	it('hands the visualizer open: false for explicit off values', () => {
		vi.stubEnv('ANALYZE', '0')

		expect(make_visualizer_options(CLIENT_STATS_FILENAME)).toStrictEqual({
			open: false,
			filename: CLIENT_STATS_FILENAME,
		})
	})

	it('hands the visualizer open: true while ANALYZE=1', () => {
		vi.stubEnv('ANALYZE', '1')

		expect(make_visualizer_options(SERVER_STATS_FILENAME)).toStrictEqual({
			open: true,
			filename: SERVER_STATS_FILENAME,
		})
	})

	// `yes` failing here would mean the config regressed to a local vocabulary narrower than the
	// kit-wide one — the exact drift kit#828 was filed to prevent.
	it('accepts the shared kit vocabulary, not a local subset', () => {
		vi.stubEnv('ANALYZE', 'yes')

		expect(make_visualizer_options(SERVER_STATS_FILENAME)).toStrictEqual({
			open: true,
			filename: SERVER_STATS_FILENAME,
		})
	})
})
