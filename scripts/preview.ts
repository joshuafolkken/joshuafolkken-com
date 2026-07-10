/**
 * Opens a freshly generated talk post in Chrome so it can be reviewed immediately.
 *
 * Maps the written post path (`src/lib/posts/talk-<date>.md`) to its dev-server route
 * (`http://localhost:5173/blog/talk-<date>`) and opens it. Best-effort: the post is already
 * written, so a failure to launch the browser only warns — it never fails the command.
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { environment } from './environment'

// Absolute path (not a bare `open`) so launching never depends on a PATH lookup (Sonar S4036).
const OPEN_COMMAND = '/usr/bin/open'
const CHROME_APP = 'Google Chrome'
const DEFAULT_PREVIEW_BASE_URL = 'http://localhost:5173/blog'
const SLASH = '/'

// Trims trailing slashes with a linear scan (a `/+$` regex is flagged for super-linear backtracking).
function trim_trailing_slashes(value: string): string {
	let end = value.length

	while (end > 0 && value.charAt(end - 1) === SLASH) end -= 1

	return value.slice(0, end)
}

// Derives the blog route from the post path: the slug is the filename without the `.md` extension.
function build_preview_url(output_path: string): string {
	const slug = path.basename(output_path, '.md')
	const base = environment.optional_environment('PREVIEW_BASE_URL', DEFAULT_PREVIEW_BASE_URL)

	return `${trim_trailing_slashes(base)}/${slug}`
}

function open_post_preview(output_path: string): void {
	const url = build_preview_url(output_path)
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
