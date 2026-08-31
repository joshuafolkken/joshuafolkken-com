import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const ROOT_PATH = fileURLToPath(new URL('..', import.meta.url))
const DOC_PATH = fileURLToPath(new URL('../docs/blog-writing.md', import.meta.url))
const SKILL_PATH = fileURLToPath(new URL('../.claude/skills/blog-post/SKILL.md', import.meta.url))
const PACKAGE_PATH = fileURLToPath(new URL('../package.json', import.meta.url))

const DOCUMENTS: ReadonlyArray<readonly [string, string]> = [
	['docs/blog-writing.md', DOC_PATH],
	['.claude/skills/blog-post/SKILL.md', SKILL_PATH],
]

// A `pnpm <name>` in these documents reaches a script in package.json unless <name> is one of
// pnpm's own subcommands, or a binary rather than a script (`josh`, `josh-app`).
const NON_SCRIPT_INVOCATIONS: ReadonlySet<string> = new Set([
	'add',
	'audit',
	'create',
	'dlx',
	'exec',
	'install',
	'josh',
	'josh-app',
	'licenses',
	'link',
	'outdated',
	'remove',
	'test',
	'up',
	'update',
	'why',
])

// Only code spans and fenced blocks are read for commands: prose mentions pnpm in sentences that
// name no script at all, and treating those as commands would fail the suite on a wording change.
const CODE_SEGMENT_PATTERN = /```[\S\s]*?```|`[^`]+`/gu
// `pnpm run <script>` names the same script `pnpm <script>` does, and an option between the two
// is not a script name at all — so both are stepped over rather than captured.
const PNPM_COMMAND_PATTERN = /\bpnpm (?:run )?(?:-{1,2}[\w-]+ )*([\w.:][\w.:-]*)/gu
const RELATIVE_LINK_PATTERN = /\]\((\.[^)]+)\)/gu
// A segment preceded by `/` belongs to something else — a URL, or a path under `node_modules/`
// — so the lookbehind rejects it. A repository path is written bare or as `./…`.
const REPOSITORY_PATH_PATTERN = /(?<![\w/-])\.?\/?((?:docs|prompts|scripts|src)\/[\w./-]+)/gu
// A path written in prose picks up the sentence's punctuation and a directory keeps its slash.
const PATH_TAIL_CHARACTERS = './'
// A markdown target may carry a `#fragment` or a "title" after the path; neither is part of it.
const LINK_SUFFIX_PATTERN = /[\s#]/u

// The two steps the cover-image tooling exists for. Pinning them keeps the workflow from losing
// the step in an edit that nothing else would notice.
const REQUIRED_COVER_SCRIPTS: ReadonlyArray<string> = ['blog:cover', 'blog:cover:review']

function trim_path_tail(target: string): string {
	let trimmed = target

	while (trimmed !== '' && PATH_TAIL_CHARACTERS.includes(trimmed.at(-1) ?? '')) {
		trimmed = trimmed.slice(0, -1)
	}

	return trimmed
}

function to_link_path(target: string): string {
	const suffix_at = target.search(LINK_SUFFIX_PATTERN)

	return suffix_at === -1 ? target : target.slice(0, suffix_at)
}

function read_script_names(): ReadonlyArray<string> {
	const parsed = JSON.parse(readFileSync(PACKAGE_PATH, 'utf8')) as {
		scripts: Record<string, string>
	}

	return Object.keys(parsed.scripts)
}

function to_named_scripts(markdown: string): ReadonlyArray<string> {
	const code = markdown.match(CODE_SEGMENT_PATTERN)?.join('\n') ?? ''
	const named = code.matchAll(PNPM_COMMAND_PATTERN).map((match) => match[1] ?? '')

	return [...new Set(named).difference(NON_SCRIPT_INVOCATIONS)]
}

function to_script_cases(): ReadonlyArray<readonly [string, string]> {
	return DOCUMENTS.flatMap(([label, file_path]) =>
		to_named_scripts(readFileSync(file_path, 'utf8')).map(
			(name) => [label, name] as readonly [string, string],
		),
	)
}

function to_linked_paths(file_path: string): ReadonlyArray<string> {
	const markdown = readFileSync(file_path, 'utf8')
	const targets = markdown
		.matchAll(RELATIVE_LINK_PATTERN)
		.map((match) => to_link_path(match[1] ?? ''))

	return targets.map((target) => path.resolve(path.dirname(file_path), target)).toArray()
}

// Every concrete repository path a document names, placeholders such as `.covers/<slug>/` aside.
// The measurement one-liner in the workflow points at a module by path, and nothing else would
// notice if that module moved.
function to_repository_paths(file_path: string): ReadonlyArray<string> {
	const markdown = readFileSync(file_path, 'utf8')
	const targets = markdown
		.matchAll(REPOSITORY_PATH_PATTERN)
		.map((match) => trim_path_tail(match[1] ?? ''))

	return [...new Set(targets)].map((target) => path.resolve(ROOT_PATH, target))
}

function to_missing(paths: ReadonlyArray<string>): ReadonlyArray<string> {
	return paths.filter((target) => !existsSync(target))
}

describe('the pnpm commands the blog documents name', () => {
	it.each(to_script_cases())('%s names %s, which package.json defines', (_label, name) => {
		expect(read_script_names()).toContain(name)
	})

	it.each(REQUIRED_COVER_SCRIPTS)('keeps %s in the workflow', (name) => {
		expect(to_named_scripts(readFileSync(DOC_PATH, 'utf8'))).toContain(name)
	})

	// A parametrized suite over an empty table registers no tests and reports success, so the check
	// above can be voided by the very edit it exists to catch.
	it('reads at least one command out of the documents', () => {
		expect(to_script_cases().length).toBeGreaterThan(0)
	})
})

describe('the paths the blog documents name', () => {
	it.each(DOCUMENTS)('%s links only to files that exist', (_label, file_path) => {
		expect(to_missing(to_linked_paths(file_path))).toEqual([])
	})

	it.each(DOCUMENTS)('%s names only repository paths that exist', (_label, file_path) => {
		expect(to_missing(to_repository_paths(file_path))).toEqual([])
	})

	// Both checks above pass on an empty list, so an edit that stops naming any path would turn
	// them into no-ops that still report success.
	it.each(DOCUMENTS)('%s names at least one repository path', (_label, file_path) => {
		expect(to_repository_paths(file_path).length).toBeGreaterThan(0)
	})
})

describe('the blog-post skill as a pointer to the canon', () => {
	it('links to docs/blog-writing.md', () => {
		expect(to_linked_paths(SKILL_PATH)).toContain(DOC_PATH)
	})
})
