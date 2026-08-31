/**
 * Read the `---` frontmatter block a blog post opens with.
 *
 * The site itself reads this block through mdsvex, which parses it as YAML; a script that scanned
 * the lines by hand answered differently from the page for the same post, which is how a doubled
 * `''` and a nested `title:` both reached the cover prompt (#892). This module parses the block as
 * YAML too, so the two agree on YAML's own rules rather than on one hand-written approximation of
 * them.
 *
 * It is not the *same* parser: mdsvex vendors js-yaml and does not export it, so exact agreement is
 * not on offer from either side. The two schemas differ in one place — js-yaml resolves an unquoted
 * date-shaped scalar to a `Date`, where this one leaves it a string — which is only reachable by a
 * `title` or `excerpt` written as a bare date, and errs toward reading a post the site would drop
 * rather than dropping one it renders. Booleans, the other usual 1.1-vs-1.2 divergence, already
 * agree: neither reads `yes` / `no` / `on` / `off` as one.
 *
 * `src/lib/utils/search-index.ts` also strips frontmatter, but that module is SvelteKit build code
 * reached through `$lib` aliases and `import.meta.glob`; it is not importable from a tsx script,
 * and it discards the block this one exists to read.
 */
import { parseDocument } from 'yaml'

const FRONTMATTER_FENCE = '---'

// The parsed frontmatter block. Named after what it is here so the reading functions never have to
// spell out the library's own generic parameters.
type FrontmatterDocument = ReturnType<typeof parseDocument>

interface SplitMarkdown {
	frontmatter: string
	body: string
}

function find_closing_fence(lines: ReadonlyArray<string>): number {
	return lines.findIndex((line, index) => index > 0 && line.trim() === FRONTMATTER_FENCE)
}

// Splits the leading `---` block from the body in one pass, so a caller that needs both never has
// to walk the file twice.
function split_frontmatter(markdown: string): SplitMarkdown {
	const lines = markdown.split('\n')
	const closing = lines[0]?.trim() === FRONTMATTER_FENCE ? find_closing_fence(lines) : -1

	if (closing === -1) return { frontmatter: '', body: markdown.trim() }

	return {
		frontmatter: lines.slice(1, closing).join('\n'),
		body: lines
			.slice(closing + 1)
			.join('\n')
			.trim(),
	}
}

// A malformed block is reported rather than half-read: the alternative is a caller proceeding on
// whatever happened to parse, which for the cover generator means a billed request built from a
// prompt nobody wrote. `source` names the file in that report, because a caller that resolves a
// slug to a path can read a different post than the one that was typed.
function parse_frontmatter(frontmatter: string, source: string): FrontmatterDocument {
	const document = parseDocument(frontmatter)
	const [failure] = document.errors

	if (failure !== undefined) {
		throw new Error(`Invalid frontmatter YAML in ${source}: ${failure.message}`)
	}

	return document
}

// Reads one top-level scalar. A key nested under another mapping is not reachable from here, which
// is the point: `seo.title` must never stand in for the post's own `title`. A non-string value is
// read as absent, matching what `blog_parser.parse_post` does with the same frontmatter.
function read_field(document: FrontmatterDocument, key: string): string | undefined {
	const value: unknown = document.get(key)

	return typeof value === 'string' ? value : undefined
}

const blog_frontmatter = {
	split_frontmatter,
	parse_frontmatter,
	read_field,
}

export type { FrontmatterDocument, SplitMarkdown }
export { blog_frontmatter }
