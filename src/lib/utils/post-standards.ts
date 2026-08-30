import type { Post } from '$lib/types/blog'

/**
 * Floor a post published from this policy onward must reach, measured with
 * `content_length.measure` — CJK characters plus Latin word tokens, counted after code fences,
 * images and URLs are stripped, never file characters.
 *
 * This is a writing standard, not the runtime gate. `MIN_SUBSTANTIAL_CONTENT_LENGTH` in
 * `content-quality.ts` (1,200) is the cutoff below which a post serves no ads and leaves the
 * index; a post that only clears that one is still short. The reasoning behind 2,600 — it is the
 * point where the site-wide median stops falling, and above roughly 2,700 stops improving — is
 * recorded in `docs/blog-writing.md`.
 */
const MIN_NEW_POST_CONTENT_LENGTH = 2600

/** What a new post aims for: the length of `kit-2.md` (3,267), the sequel readers arrive from. */
const TARGET_NEW_POST_CONTENT_LENGTH = 3000

/**
 * Posts published before the standard existed. Every entry is short of
 * `MIN_NEW_POST_CONTENT_LENGTH`; none is missing metadata.
 *
 * This is the remaining backlog from #833, not an escape hatch: a new post that cannot reach the
 * floor needs more writing, not another line here. Removing an entry (by expanding the post) is
 * the intended direction of travel.
 */
const GRANDFATHERED_SLUGS: ReadonlySet<string> = new Set([
	'ai-chat-youtube',
	'automatic-webp-conversion',
	'division-2-tactics-and-ar-future',
	'ecommerce-trust-content-marketing',
	'first-post',
	'fix-ios-speech-recognition',
	'glass-header',
	'growing-blog-prompt',
	'optimize-eslint-performance',
	'roblox-ai-game-creation',
	'simplify-ui',
	'talk-2025-11-25',
	'talk-2025-11-27',
	'talk-2025-12-04',
	'talk-2025-12-11',
	'talk-2025-12-25',
	'talk-2026-01-22',
	'talk-2026-07-28',
	'talk-2026-07-30',
	'talk-2026-08-04',
	'talk-2026-08-11',
	'to-pnpm',
	'update-techstack-icons',
])

// A video-derived post takes its card image from the YouTube still rather than a `cover_image` of
// its own, so either one satisfies the requirement.
function has_card_image(post: Post): boolean {
	return post.cover_image !== undefined || post.youtube !== undefined
}

function to_length_problem(measured_length: number): string {
	return `measures ${String(measured_length)}, below the ${String(MIN_NEW_POST_CONTENT_LENGTH)} floor`
}

function find_problems(post: Post, measured_length: number): Array<string> {
	const problems: Array<string> = []

	if (post.author === undefined) problems.push('has no `author`')
	if (!has_card_image(post)) problems.push('has neither `cover_image` nor `youtube`')

	if (measured_length < MIN_NEW_POST_CONTENT_LENGTH) {
		problems.push(to_length_problem(measured_length))
	}

	return problems
}

// `title`, `date` and `excerpt` are not checked here: a post missing any of them never becomes a
// `Post` at all — `blog_parser.parse_post` drops it, and it disappears from the blog list rather
// than appearing incomplete. The test catches that by comparing the files on disk to the parsed
// posts.
function check_post(post: Post, measured_length: number): Array<string> {
	if (GRANDFATHERED_SLUGS.has(post.slug)) return []

	return find_problems(post, measured_length)
}

function is_grandfathered(slug: string): boolean {
	return GRANDFATHERED_SLUGS.has(slug)
}

export const post_standards = { check_post, is_grandfathered }
export { GRANDFATHERED_SLUGS, MIN_NEW_POST_CONTENT_LENGTH, TARGET_NEW_POST_CONTENT_LENGTH }
