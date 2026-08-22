/**
 * Opens a freshly generated talk post in Chrome so it can be reviewed immediately.
 *
 * Maps the written post path (`src/lib/posts/talk-<date>.md`) to its dev-server route
 * (`http://localhost:<dev port>/blog/talk-<date>`) and opens it. Best-effort: the post is already
 * written, so a failure to resolve the URL or launch the browser only warns — it never fails the
 * command.
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { ports } from '@joshuafolkken/kit/ports'
import { environment } from './environment'

// Absolute path (not a bare `open`) so launching never depends on a PATH lookup (Sonar S4036).
const OPEN_COMMAND = '/usr/bin/open'
const CHROME_APP = 'Google Chrome'
const DEFAULT_PREVIEW_PATH = '/blog'
const SLASH = '/'

// The dev server's port follows the personal `PORT_SEED` (see `.env`), so a hardcoded 5173 here
// would open the wrong project's app on a machine that seeded this one. Resolved through kit's own
// loader — the same one `josh port` and `playwright.config.ts` call — so the answer does not depend
// on which package script happened to source `.env` first; a seed already in the environment wins.
function default_preview_base_url(): string {
	ports.load_environment_file()

	return `http://localhost:${String(ports.resolve_development_port())}${DEFAULT_PREVIEW_PATH}`
}

// Trims trailing slashes with a linear scan (a `/+$` regex is flagged for super-linear backtracking).
function trim_trailing_slashes(value: string): string {
	let end = value.length

	while (end > 0 && value.charAt(end - 1) === SLASH) end -= 1

	return value.slice(0, end)
}

// Derives the blog route from the post path: the slug is the filename without the `.md` extension.
// The default is passed lazily so an invalid seed cannot surface while PREVIEW_BASE_URL overrides it.
function build_preview_url(output_path: string): string {
	const slug = path.basename(output_path, '.md')
	const base = environment.optional_environment('PREVIEW_BASE_URL', default_preview_base_url)

	return `${trim_trailing_slashes(base)}/${slug}`
}

function describe_error(error: unknown): string {
	return error instanceof Error ? error.message : String(error)
}

// An invalid `PORT_SEED` is a hard error for the servers, but here the post is already written, so
// it degrades to a warning that names the cause instead of failing a run that fully succeeded.
function try_build_preview_url(output_path: string): string | undefined {
	try {
		return build_preview_url(output_path)
	} catch (error: unknown) {
		console.warn(
			`Could not resolve the preview URL (${describe_error(error)}); open the post manually.`,
		)

		return undefined
	}
}

function open_post_preview(output_path: string): void {
	const url = try_build_preview_url(output_path)

	if (url === undefined) return

	const result = spawnSync(OPEN_COMMAND, ['-a', CHROME_APP, url], { stdio: 'inherit' })

	if (result.error !== undefined || result.status !== 0) {
		console.warn(`Could not open ${url} in Chrome; open it manually.`)

		return
	}

	console.info(`Opened ${url} in Chrome.`)
}

const preview = {
	build_preview_url,
	open_post_preview,
}

export { preview }
