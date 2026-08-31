import { blog_images } from '$lib/data/blog-images'
import type { Post } from '$lib/types/blog'
import { blog_parser } from '$lib/utils/blog-parser'
import { content_length } from '$lib/utils/content-length'
import { path_utilities } from '$lib/utils/path-utilities'
import {
	GRANDFATHERED_SLUGS,
	MIN_NEW_POST_CONTENT_LENGTH,
	post_standards,
	TARGET_NEW_POST_CONTENT_LENGTH,
	type BlogImageAssets,
} from '$lib/utils/post-standards'
import { describe, expect, it } from 'vitest'

const POST_PATH_PREFIX = '/src/lib/posts/'
const POST_PATH_SUFFIX = '.md'
const YOUTUBE_URL = 'https://youtu.be/abc'
// The same basename written both ways, so the two checks can be shown disagreeing about it: the
// resolution check accepts either, the convention check only the first.
const CONVENTIONAL_COVER_IMAGE = '/images/blog/kit-2.webp'
const API_FORM_COVER_IMAGE = '/api/images/blog/kit-2.webp'
const ABSENT_COVER_IMAGE_TITLE = 'has nothing to say about a post with no cover image'
// The form `docs/blog-writing.md` declares, spelled once here so the expected messages agree.
const DECLARED_FORM = '/images/blog/<name>.webp'

const raw_posts = import.meta.glob<string>('/src/lib/posts/*.md', {
	query: '?raw',
	import: 'default',
	eager: true,
})

// Everything in the blog image directory, not only what `blog-images.ts` can load: the difference
// between the two lists is what tells an unknown name apart from an unreadable extension. The glob
// stays here rather than in `blog-images.ts` so the unloadable files never reach the bundle.
const blog_image_files = import.meta.glob('/src/lib/assets/images/blog/*')

const loadable_filenames = blog_images
	.list_loadable_paths()
	.map((path) => path_utilities.get_last_segment(path))

const blog_image_assets: BlogImageAssets = {
	loadable_basenames: new Set(
		loadable_filenames.map((name) => path_utilities.get_basename_without_extension(name)),
	),
	filenames: Object.keys(blog_image_files).map((path) => path_utilities.get_last_segment(path)),
}

function to_slug(path: string): string {
	return path.slice(POST_PATH_PREFIX.length, -POST_PATH_SUFFIX.length)
}

function measure(slug: string): number {
	return content_length.measure(raw_posts[`${POST_PATH_PREFIX}${slug}${POST_PATH_SUFFIX}`] ?? '')
}

function to_expected_form_problem(cover_image: string): Array<string> {
	return [`has \`cover_image\` \`${cover_image}\`, which is not written as \`${DECLARED_FORM}\``]
}

function to_post(overrides: Partial<Post>): Post {
	return {
		slug: 'a-new-post',
		title: 'title',
		date: '2026-08-30',
		author: 'Joshua Folkken',
		excerpt: 'excerpt',
		cover_image: '/images/blog/a-new-post.webp',
		...overrides,
	}
}

describe('post_standards.check_post length floor', () => {
	it('accepts a post that reaches the floor', () => {
		expect(post_standards.check_post(to_post({}), MIN_NEW_POST_CONTENT_LENGTH)).toEqual([])
	})

	it('rejects a post one below the floor', () => {
		const below = MIN_NEW_POST_CONTENT_LENGTH - 1
		const expected = `measures ${String(below)}, below the ${String(MIN_NEW_POST_CONTENT_LENGTH)} floor`

		expect(post_standards.check_post(to_post({}), below)).toEqual([expected])
	})
})

describe('post_standards.check_post metadata', () => {
	it('rejects a post with no author', () => {
		const post = to_post({ author: undefined })

		expect(post_standards.check_post(post, TARGET_NEW_POST_CONTENT_LENGTH)).toEqual([
			'has no `author`',
		])
	})

	it('rejects a post with no card image source', () => {
		const post = to_post({ cover_image: undefined })

		expect(post_standards.check_post(post, TARGET_NEW_POST_CONTENT_LENGTH)).toEqual([
			'has neither `cover_image` nor `youtube`',
		])
	})

	it('accepts a video-derived post that has no cover image of its own', () => {
		const post = to_post({ cover_image: undefined, youtube: YOUTUBE_URL })

		expect(post_standards.check_post(post, TARGET_NEW_POST_CONTENT_LENGTH)).toEqual([])
	})

	it('reports every problem a post has at once', () => {
		const post = to_post({ author: undefined, cover_image: undefined })

		expect(post_standards.check_post(post, 0)).toHaveLength(3)
	})

	it('exempts a grandfathered post from every check', () => {
		const slug = [...GRANDFATHERED_SLUGS][0] ?? ''
		const post = to_post({ slug, author: undefined, cover_image: undefined })

		expect(post_standards.check_post(post, 0)).toEqual([])
	})
})

describe('post_standards.check_cover_image', () => {
	const assets: BlogImageAssets = {
		loadable_basenames: new Set(['kit-2']),
		filenames: ['kit-2.jpg', 'only-webp.webp'],
	}

	it('accepts a value whose basename names a loadable file', () => {
		expect(post_standards.check_cover_image(CONVENTIONAL_COVER_IMAGE, assets)).toEqual([])
	})

	// The convention is a separate check. This one is about what renders, and the directory plays no
	// part in that — folding the two together would report a post that renders perfectly as broken.
	it('accepts a value outside the conventional directory, since the directory part is ignored', () => {
		expect(post_standards.check_cover_image(API_FORM_COVER_IMAGE, assets)).toEqual([])
	})

	it('reports a basename no file in the directory carries', () => {
		expect(post_standards.check_cover_image('/images/blog/absent.webp', assets)).toEqual([
			'has `cover_image` `/images/blog/absent.webp`, which resolves to no image: nothing named `absent.*` is in `src/lib/assets/images/blog/`',
		])
	})

	it('reports a basename whose only file has an extension outside the glob', () => {
		expect(post_standards.check_cover_image('/images/blog/only-webp.webp', assets)).toEqual([
			'has `cover_image` `/images/blog/only-webp.webp`, which resolves to no image: `src/lib/assets/images/blog/only-webp.webp` exists, but its extension is outside the glob in `src/lib/data/blog-images.ts`',
		])
	})

	// The basename resolves, so a check reading the parsed `Post` would pass — but `parse_post`
	// throws the value away before that, and the page renders with no cover at all.
	it('reports a value the parser discards for having no leading slash', () => {
		expect(post_standards.check_cover_image('images/blog/kit-2.webp', assets)).toEqual([
			'has `cover_image` `images/blog/kit-2.webp`, which the parser discards: the path has to start with `/` and hold no `//`',
		])
	})

	it('reports a value the parser discards for holding a doubled slash', () => {
		expect(post_standards.check_cover_image('//images/blog/kit-2.webp', assets)).toEqual([
			'has `cover_image` `//images/blog/kit-2.webp`, which the parser discards: the path has to start with `/` and hold no `//`',
		])
	})

	it(ABSENT_COVER_IMAGE_TITLE, () => {
		expect(post_standards.check_cover_image(undefined, assets)).toEqual([])
	})
})

describe('post_standards.check_cover_image_form', () => {
	it('accepts the declared form', () => {
		expect(post_standards.check_cover_image_form(CONVENTIONAL_COVER_IMAGE)).toEqual([])
	})

	it('rejects the API-route form the corpus used to mix in', () => {
		expect(post_standards.check_cover_image_form(API_FORM_COVER_IMAGE)).toEqual(
			to_expected_form_problem(API_FORM_COVER_IMAGE),
		)
	})

	it('rejects a deeper directory under the conventional one', () => {
		const nested = '/images/blog/2026/kit-2.webp'

		expect(post_standards.check_cover_image_form(nested)).toEqual(to_expected_form_problem(nested))
	})

	it('rejects a bare basename carrying no directory at all', () => {
		const bare = 'kit-2.webp'

		expect(post_standards.check_cover_image_form(bare)).toEqual(to_expected_form_problem(bare))
	})

	// The resolver strips the extension too, so this renders exactly as the `.webp` spelling does —
	// which is why only a convention check can catch it.
	it('rejects the right directory carrying the wrong extension', () => {
		const jpg = '/images/blog/kit-2.jpg'

		expect(post_standards.check_cover_image_form(jpg)).toEqual(to_expected_form_problem(jpg))
	})

	it(ABSENT_COVER_IMAGE_TITLE, () => {
		expect(post_standards.check_cover_image_form(undefined)).toEqual([])
	})
})

const posts = blog_parser.get_all_posts()
// The frontmatter as written, not the parsed `Post`: `parse_post` discards a `cover_image` that is
// not a safe path, which is exactly one of the slips the check is for.
const frontmatter_cover_images = blog_parser.list_frontmatter_cover_images()
const parsed_slugs = new Set(posts.map((post) => post.slug))
const checked_posts = posts.filter((post) => !post_standards.is_grandfathered(post.slug))

describe('published posts', () => {
	// A post missing `title`, `date` or `excerpt` is dropped by the parser and vanishes from the blog
	// list, so a file with no parsed post is one no reader can reach.
	it('parses every markdown file into a listed post', () => {
		const on_disk = new Set(Object.keys(raw_posts).map((path) => to_slug(path)))

		expect([...on_disk.difference(parsed_slugs)]).toEqual([])
	})

	it.each(checked_posts)('$slug meets the standards in docs/blog-writing.md', (post) => {
		expect(post_standards.check_post(post, measure(post.slug))).toEqual([])
	})

	// Grandfathered posts are included: the exemption is about length, and a cover image that
	// renders nothing is a broken card whatever the post's age.
	it.each(frontmatter_cover_images)(
		'$slug has a cover_image that resolves to a real asset',
		({ cover_image }) => {
			expect(post_standards.check_cover_image(cover_image, blog_image_assets)).toEqual([])
		},
	)

	// The corpus carried two spellings of a directory nothing resolves through, against a doc that
	// declared one of them. Settled in #902; this is what keeps it settled.
	it.each(frontmatter_cover_images)(
		'$slug writes its cover_image in the single declared form',
		({ cover_image }) => {
			expect(post_standards.check_cover_image_form(cover_image)).toEqual([])
		},
	)

	// Resolution discards the extension, so two *loadable* files sharing a basename resolve by glob
	// order and a post silently serves whichever one sorts first. A `.webp` sibling is not a
	// collision: the glob never loads one, so it can never win the race.
	it('has no two loadable blog images sharing a basename', () => {
		const seen = new Set<string>()
		const collisions = loadable_filenames.filter((name) => {
			const basename = path_utilities.get_basename_without_extension(name)
			const is_duplicate = seen.has(basename)

			seen.add(basename)

			return is_duplicate
		})

		expect(collisions).toEqual([])
	})
})

describe('grandfathered list', () => {
	it('holds no post that no longer exists', () => {
		expect([...GRANDFATHERED_SLUGS.difference(parsed_slugs)]).toEqual([])
	})

	it('holds no post that already reaches the floor', () => {
		const passing = [...GRANDFATHERED_SLUGS].filter(
			(slug) => measure(slug) >= MIN_NEW_POST_CONTENT_LENGTH,
		)

		expect(passing).toEqual([])
	})
})
