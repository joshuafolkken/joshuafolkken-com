import { describe, expect, it } from 'vitest'
import type { FetchedImage } from './blog-cover-assets'
import { blog_cover_review, type ReviewDependencies } from './blog-cover-review'

const POST = 'my-post-slug'
const LOCAL_SOURCE = '.covers/my-post-slug/20260831-120000-01.png'
const REMOTE_SOURCE = 'https://images.example.test/photo-123'
const NOW = new Date('2026-08-31T09:00:00.000Z')
const IMAGE_BYTES = Uint8Array.from([104, 105])
const IMAGE_BASE64 = 'aGk='
const PNG_MIME = 'image/png'
const JPEG_MIME = 'image/jpeg'
const EXPECTED_CANDIDATE_COUNT = 5
const MANIFEST_PATH = 'manifest.json'
const DEFAULT_OUTPUT = `.covers/${POST}/review.html`
const REQUESTED_OUTPUT = 'out/page.html'
const CARD_MARKER = '<li class="candidate">'
const USAGE_FRAGMENT = 'pnpm blog:cover:review'
const UNSUPPORTED_EXTENSION = 'Unsupported image'
const UNSUPPORTED_TYPE = 'Unsupported image type'
const BREAKOUT_MIME = 'image/png" onerror="alert(1)'
// The schema allows http and https only, which is what keeps a `javascript:` value out of the
// rendered `href`. A non-http scheme is checked here instead of that one, because the lint rules
// ban writing a script URL as a source literal and folding one together only hides it.
const NON_HTTP_URL = 'ftp://example.test/license'
const TOP_REASON = '最有力'
const LAST_CREDIT = 'Photo by E'

interface WrittenPage {
	output_path: string
	html: string
}

function make_manifest(candidates: ReadonlyArray<Record<string, unknown>>): string {
	return JSON.stringify({ post: POST, candidates })
}

function make_candidate(overrides: Record<string, unknown> = {}): Record<string, unknown> {
	return { rank: 1, source: LOCAL_SOURCE, reason: '主題と合っている', ...overrides }
}

function make_dependencies(manifest: string, written: Array<WrittenPage>): ReviewDependencies {
	return {
		read_manifest: () => manifest,
		read_local_image: () => IMAGE_BYTES,
		fetch_remote_image: async (): Promise<FetchedImage> => ({
			mime_type: JPEG_MIME,
			bytes: IMAGE_BYTES,
		}),
		write_page(output_path: string, html: string): void {
			written.push({ output_path, html })
		},
	}
}

describe('blog_cover_review.parse_manifest', () => {
	it('defaults the credit, license URL and adopted filename to empty', () => {
		const manifest = blog_cover_review.parse_manifest(make_manifest([make_candidate()]))

		expect(manifest.candidates[0]).toMatchObject({ credit: '', license_url: '', filename: '' })
	})

	it('rejects a candidate with no reason', () => {
		const manifest = make_manifest([{ rank: 1, source: LOCAL_SOURCE }])

		expect(() => blog_cover_review.parse_manifest(manifest)).toThrow()
	})

	it('rejects a manifest with no candidates', () => {
		expect(() => blog_cover_review.parse_manifest(make_manifest([]))).toThrow()
	})

	it('rejects a post that would escape the covers directory', () => {
		const manifest = JSON.stringify({ post: '../../etc', candidates: [make_candidate()] })

		expect(() => blog_cover_review.parse_manifest(manifest)).toThrow()
	})

	it('rejects a license URL whose scheme is not http(s)', () => {
		const manifest = make_manifest([make_candidate({ license_url: NON_HTTP_URL })])

		expect(() => blog_cover_review.parse_manifest(manifest)).toThrow()
	})

	it('rejects a non-positive rank', () => {
		const manifest = make_manifest([make_candidate({ rank: 0 })])

		expect(() => blog_cover_review.parse_manifest(manifest)).toThrow()
	})
})

describe('blog_cover_review.sort_candidates', () => {
	it('orders the candidates by rank whatever order they were written in', () => {
		const manifest = blog_cover_review.parse_manifest(
			make_manifest([make_candidate({ rank: 3 }), make_candidate({ rank: 1 })]),
		)

		expect(blog_cover_review.sort_candidates(manifest.candidates).map((one) => one.rank)).toEqual([
			1, 3,
		])
	})
})

describe('blog_cover_review.is_remote', () => {
	it('treats an http(s) source as remote and a path as local', () => {
		expect(blog_cover_review.is_remote(REMOTE_SOURCE)).toBe(true)
		expect(blog_cover_review.is_remote(LOCAL_SOURCE)).toBe(false)
	})

	it('reads an upper-case scheme as remote, since a scheme is case-insensitive', () => {
		expect(blog_cover_review.is_remote('HTTPS://images.example.test/a.jpg')).toBe(true)
	})
})

describe('blog_cover_review.local_mime_type', () => {
	it('maps the extension to its image type, case-insensitively', () => {
		expect(blog_cover_review.local_mime_type('a/b.PNG')).toBe(PNG_MIME)
		expect(blog_cover_review.local_mime_type('a/b.jpeg')).toBe(JPEG_MIME)
	})

	it('refuses an unknown extension rather than guessing one', () => {
		expect(() => blog_cover_review.local_mime_type('a/b.txt')).toThrow(UNSUPPORTED_EXTENSION)
	})

	it('refuses an extension that names an Object prototype member', () => {
		expect(() => blog_cover_review.local_mime_type('a/b.constructor')).toThrow(
			UNSUPPORTED_EXTENSION,
		)
	})
})

describe('blog_cover_review.resolve_output_path', () => {
	it('defaults to the post directory under the covers directory', () => {
		const manifest = blog_cover_review.parse_manifest(make_manifest([make_candidate()]))

		expect(blog_cover_review.resolve_output_path(manifest, undefined)).toBe(DEFAULT_OUTPUT)
	})

	it('uses the requested output path when one is given', () => {
		const manifest = blog_cover_review.parse_manifest(make_manifest([make_candidate()]))

		expect(blog_cover_review.resolve_output_path(manifest, REQUESTED_OUTPUT)).toBe(REQUESTED_OUTPUT)
	})
})

describe('blog_cover_review.resolve_candidates', () => {
	it('embeds a local file and a remote URL alike as data URIs', async () => {
		const manifest = make_manifest([
			make_candidate(),
			make_candidate({ rank: 2, source: REMOTE_SOURCE }),
		])
		const parsed = blog_cover_review.parse_manifest(manifest)
		const resolved = await blog_cover_review.resolve_candidates(
			make_dependencies(manifest, []),
			parsed.candidates,
		)

		expect(resolved[0]?.image_source).toBe(`data:${PNG_MIME};base64,${IMAGE_BASE64}`)
		expect(resolved[1]?.image_source).toBe(`data:${JPEG_MIME};base64,${IMAGE_BASE64}`)
	})
})

describe('blog_cover_review.resolve_candidates failures', () => {
	it('keeps a candidate whose local file cannot be read, recording why', async () => {
		const manifest = make_manifest([make_candidate()])
		const dependencies: ReviewDependencies = {
			...make_dependencies(manifest, []),
			read_local_image: () => {
				throw new Error('ENOENT: no such file')
			},
		}
		const parsed = blog_cover_review.parse_manifest(manifest)
		const resolved = await blog_cover_review.resolve_candidates(dependencies, parsed.candidates)

		expect(resolved).toHaveLength(1)
		expect(resolved[0]?.image_source).toBe('')
		expect(resolved[0]?.load_error).toContain('ENOENT')
	})
})

describe('blog_cover_review.resolve_candidates remote types', () => {
	it('refuses a content-type that would break out of the src attribute', async () => {
		const manifest = make_manifest([make_candidate({ source: REMOTE_SOURCE })])
		const dependencies: ReviewDependencies = {
			...make_dependencies(manifest, []),
			fetch_remote_image: async (): Promise<FetchedImage> => ({
				mime_type: BREAKOUT_MIME,
				bytes: IMAGE_BYTES,
			}),
		}
		const parsed = blog_cover_review.parse_manifest(manifest)
		const resolved = await blog_cover_review.resolve_candidates(dependencies, parsed.candidates)

		expect(resolved[0]?.image_source).toBe('')
		expect(resolved[0]?.load_error).toContain(UNSUPPORTED_TYPE)
	})

	it('records a non-image response instead of embedding it', async () => {
		const manifest = make_manifest([make_candidate({ source: REMOTE_SOURCE })])
		const dependencies: ReviewDependencies = {
			...make_dependencies(manifest, []),
			fetch_remote_image: async (): Promise<FetchedImage> => ({
				mime_type: 'text/html',
				bytes: IMAGE_BYTES,
			}),
		}
		const parsed = blog_cover_review.parse_manifest(manifest)
		const resolved = await blog_cover_review.resolve_candidates(dependencies, parsed.candidates)

		expect(resolved[0]?.load_error).toContain(UNSUPPORTED_TYPE)
	})
})

const FIVE_CANDIDATES = make_manifest([
	make_candidate({ rank: 5, source: REMOTE_SOURCE, credit: LAST_CREDIT }),
	make_candidate({ rank: 4, credit: '' }),
	make_candidate({ rank: 3, source: REMOTE_SOURCE, credit: 'Photo by C' }),
	make_candidate({ rank: 2, filename: 'picked.png' }),
	make_candidate({ rank: 1, reason: TOP_REASON }),
])

async function run_manifest(manifest: string, requested?: string): Promise<WrittenPage> {
	const written: Array<WrittenPage> = []

	await blog_cover_review.run(make_dependencies(manifest, written), MANIFEST_PATH, requested, NOW)

	return written[0] ?? { output_path: '', html: '' }
}

describe('blog_cover_review.run', () => {
	it('writes five candidates to one page, mixing local files and URLs', async () => {
		const page = await run_manifest(FIVE_CANDIDATES)

		expect(page.output_path).toBe(DEFAULT_OUTPUT)
		expect(page.html.split(CARD_MARKER)).toHaveLength(EXPECTED_CANDIDATE_COUNT + 1)
		expect(page.html).toContain(`data:${PNG_MIME};base64,`)
		expect(page.html).toContain(`data:${JPEG_MIME};base64,`)
	})

	it('orders the cards by rank, whatever order the manifest listed them in', async () => {
		const page = await run_manifest(FIVE_CANDIDATES)

		expect(page.html.indexOf(TOP_REASON)).toBeLessThan(page.html.indexOf(LAST_CREDIT))
	})

	it('writes to the requested output path when one is given', async () => {
		const page = await run_manifest(make_manifest([make_candidate()]), REQUESTED_OUTPUT)

		expect(page.output_path).toBe(REQUESTED_OUTPUT)
	})
})

describe('blog_cover_review.main', () => {
	it('answers with the usage line when no manifest is given', async () => {
		await expect(blog_cover_review.main([], NOW)).rejects.toThrow(USAGE_FRAGMENT)
	})

	it('refuses more positional arguments than it reads', async () => {
		await expect(blog_cover_review.main(['a.json', 'b.html', 'c'], NOW)).rejects.toThrow(
			USAGE_FRAGMENT,
		)
	})
})
