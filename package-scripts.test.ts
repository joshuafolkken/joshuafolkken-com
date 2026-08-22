import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const OWN_MANIFEST_URL = new URL('package.json', import.meta.url)
// app-kit's `exports` map has no `./package.json` entry, so the installed copy is reached by path.
const APP_KIT_MANIFEST_URL = new URL(
	'node_modules/@joshuafolkken/app-kit/package.json',
	import.meta.url,
)

const DEV_SCRIPT = 'dev'
const PREVIEW_SCRIPT = 'preview'
const PREVIEW_NORMAL_SCRIPT = 'preview:normal'
const PREVIEW_STOP_SCRIPT = 'preview:stop'
const DEV_PORT_VARIABLE = 'DEV_PORT'
const PREVIEW_PORT_VARIABLE = 'PREVIEW_PORT'
const DEV_PORT_COMMAND = 'josh port dev'
const PREVIEW_PORT_COMMAND = 'josh port preview'

function read_scripts(manifest_url: URL): Record<string, string> {
	return (JSON.parse(readFileSync(manifest_url, 'utf8')) as { scripts: Record<string, string> })
		.scripts
}

const scripts = read_scripts(OWN_MANIFEST_URL)
const app_kit_scripts = read_scripts(APP_KIT_MANIFEST_URL)

// Every script that starts or stops a server on a seeded port. `dev:remote` is absent because it
// delegates to `dev` (`pnpm dev`) instead of repeating the wiring.
const PORT_SCRIPTS = [
	{ key: DEV_SCRIPT, variable: DEV_PORT_VARIABLE, command: DEV_PORT_COMMAND },
	{ key: PREVIEW_SCRIPT, variable: PREVIEW_PORT_VARIABLE, command: PREVIEW_PORT_COMMAND },
	{ key: PREVIEW_NORMAL_SCRIPT, variable: PREVIEW_PORT_VARIABLE, command: PREVIEW_PORT_COMMAND },
	{ key: PREVIEW_STOP_SCRIPT, variable: PREVIEW_PORT_VARIABLE, command: PREVIEW_PORT_COMMAND },
]

// kit#825: `$(pnpm josh port …)` substitutes pnpm's own stdout — `[ELIFECYCLE] …` on a bad seed, the
// install log when node_modules is stale — into `--port`. The bare binary keeps the stream pure,
// and assigning first (`VAR=$(…) && cmd`) turns a failed resolution into the script's exit status
// instead of starting the server on whatever `--port` then parses as.
describe('package.json port wiring', () => {
	it.each(PORT_SCRIPTS)('$key resolves its port through the guarded form', (script) => {
		const value = scripts[script.key]

		expect(value).toContain(`${script.variable}=$(${script.command}) && `)
		expect(value).toContain(`$${script.variable}`)
		expect(value).not.toContain('pnpm josh port')
	})

	it.each([DEV_SCRIPT, PREVIEW_NORMAL_SCRIPT])(
		'%s holds vite to the seeded port instead of drifting',
		(key) => {
			expect(scripts[key]).toContain('--port $')
			expect(scripts[key]).toContain('--strictPort')
		},
	)

	it('dev:remote reuses dev instead of repeating the wiring', () => {
		expect(scripts['dev:remote']).toContain('pnpm dev')
		expect(scripts['dev:remote']).not.toContain('josh port')
	})

	// A trailing `|| true` outside the braces would forgive an unresolved port along with an absent
	// server, which is the failure-hiding shape the guard exists to remove.
	it('preview:stop tolerates an absent server only inside the braces', () => {
		expect(scripts[PREVIEW_STOP_SCRIPT]).toContain(
			`&& { kill-port $${PREVIEW_PORT_VARIABLE} || true; }`,
		)
	})

	// `preview` is distributed: app-kit's `josh-app sync` overwrites it with app-kit's own value on
	// every sync, so the only stable state is byte-equality with what app-kit ships. The guarded
	// shape is asserted above as well, so a regression on app-kit's side fails here, not in CI.
	it('preview matches the app-kit-distributed script verbatim', () => {
		expect(scripts[PREVIEW_SCRIPT]).toBe(app_kit_scripts[PREVIEW_SCRIPT])
	})
})
