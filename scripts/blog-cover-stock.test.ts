import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import type { StockResult } from './blog-cover-openverse'
import { blog_cover_review } from './blog-cover-review'
import { blog_cover_stock, type StockDependencies, type StockPlan } from './blog-cover-stock'

const SLUG = 'my-post'
const TITLE = 'Refactoring a build pipeline'
const POST = `---\ntitle: ${TITLE}\n---\n\n本文です。\n`
const COVERS_DIR = '.covers'
const NOW = new Date(2026, 7, 30, 9, 5, 4)
const RUN_STAMP = '20260830-090504'
const MANIFEST_PATH = path.join(COVERS_DIR, SLUG, `${RUN_STAMP}-stock.json`)
const FIRST_IMAGE_PATH = path.join(COVERS_DIR, SLUG, `${RUN_STAMP}-stock-01.jpg`)
const QUERY = 'developer desk'
const PNG_MIME = 'image/png'
const JPEG_MIME = 'image/jpeg'
const WEBP_MIME = 'image/webp'
const LICENSE_URL = 'https://creativecommons.org/licenses/by/2.0/'
const REQUESTED = 5
const BYTES = Uint8Array.from([1, 2, 3])
const PLAN: StockPlan = { slug: SLUG, query: QUERY, count: REQUESTED, run_stamp: RUN_STAMP }
const FULL_REQUEST = { slug_or_path: SLUG, count: REQUESTED, query: QUERY }

type WrittenFiles = Map<string, string | Uint8Array>

function make_result(index: number): StockResult {
	return {
		url: `https://photos.example/${String(index)}.jpg`,
		license: 'by',
		license_url: LICENSE_URL,
		title: `Photo ${String(index)}`,
		creator: 'Someone',
		provider: 'flickr',
		license_version: '2.0',
		attribution: '',
		foreign_landing_url: 'https://www.flickr.com/photos/someone/1',
		width: 1024,
		height: 683,
	}
}

function make_results(count: number): ReadonlyArray<StockResult> {
	return Array.from({ length: count }, (_unused, index) => make_result(index + 1))
}

function make_dependencies(
	results: ReadonlyArray<StockResult>,
	written: WrittenFiles,
	mime_type = JPEG_MIME,
): StockDependencies {
	return {
		read_post: () => POST,
		search: async () => results,
		download: async () => ({ mime_type, bytes: BYTES }),
		write_file(output_path: string, data: string | Uint8Array): void {
			written.set(output_path, data)
		},
	}
}

describe('blog_cover_stock.usable_extension', () => {
	it('accepts the types the blog image glob picks up', () => {
		expect(blog_cover_stock.usable_extension(JPEG_MIME)).toBe('jpg')
		expect(blog_cover_stock.usable_extension(PNG_MIME)).toBe('png')
	})

	// The glob is jpg/jpeg/png only, so a webp candidate would resolve to no image at all once its
	// filename reached a post's frontmatter.
	it('refuses a supported type the blog image glob would not pick up', () => {
		expect(blog_cover_stock.usable_extension(WEBP_MIME)).toBeUndefined()
	})

	// `extension_for_mime` falls back to png, so an unknown type has to be refused before it.
	it('refuses an unknown type rather than saving it under the fallback extension', () => {
		expect(blog_cover_stock.usable_extension('text/html')).toBeUndefined()
	})
})

describe('blog_cover_stock.verify_image', () => {
	it('accepts an image the blog can use and names the extension it is saved under', () => {
		const verdict = blog_cover_stock.verify_image({ mime_type: JPEG_MIME, bytes: BYTES }, PLAN)

		expect(verdict).toEqual({ extension: 'jpg', rejection: '' })
	})

	// The review page inlines every candidate as base64, so one Wikimedia original would blow the
	// Artifact ceiling for the whole set — and only after the page had been built out of it.
	it('refuses an image too large for the review page to inline', () => {
		const budget = Math.floor(blog_cover_stock.PAGE_BYTE_BUDGET / REQUESTED)
		const bytes = new Uint8Array(budget + 1)

		const verdict = blog_cover_stock.verify_image({ mime_type: JPEG_MIME, bytes }, PLAN)

		expect(verdict.rejection).toContain('a candidate may use')
	})

	it('gives one candidate the whole budget when only one was asked for', () => {
		const bytes = new Uint8Array(blog_cover_stock.PAGE_BYTE_BUDGET)
		const plan = { ...PLAN, count: 1 }

		expect(blog_cover_stock.verify_image({ mime_type: JPEG_MIME, bytes }, plan).rejection).toBe('')
	})
})

describe('blog_cover_stock.resolve_image_path', () => {
	it('stamps and numbers each candidate inside the shared covers directory', () => {
		expect(blog_cover_stock.resolve_image_path(PLAN, 1, 'jpg')).toBe(FIRST_IMAGE_PATH)
		expect(blog_cover_stock.resolve_manifest_path(PLAN)).toBe(MANIFEST_PATH)
	})
})

describe('blog_cover_stock.candidate_reason', () => {
	// The rank is the search's own order, so the reason has to say so — the person re-ranks on the
	// review page and needs to know what they are editing.
	it('names the query, the position, the provider and the license', () => {
		const reason = blog_cover_stock.candidate_reason(make_result(1), PLAN, 2)

		expect(reason).toContain(QUERY)
		expect(reason).toContain('flickr')
		expect(reason).toContain('1024×683')
		expect(reason).toContain('CC BY 2.0')
	})
})

describe('blog_cover_stock.collect_candidates', () => {
	it('stops once it has the requested count and downloads no spares', async () => {
		const written: WrittenFiles = new Map()
		const download = vi.fn(async () => ({ mime_type: JPEG_MIME, bytes: BYTES }))
		const dependencies: StockDependencies = { ...make_dependencies([], written), download }
		const results = make_results(REQUESTED * 2)

		const candidates = await blog_cover_stock.collect_candidates(dependencies, results, PLAN)

		expect(candidates).toHaveLength(REQUESTED)
		expect(download).toHaveBeenCalledTimes(REQUESTED)
		expect(candidates.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5])
	})
})

describe('blog_cover_stock.collect_candidates when a result cannot be saved', () => {
	// One refusing host costs its own candidate; the spare behind it fills the gap.
	it('skips a download that fails and takes the next result instead', async () => {
		const written: WrittenFiles = new Map()
		let call = 0
		const dependencies: StockDependencies = {
			...make_dependencies([], written),
			download: async () => {
				call += 1

				if (call === 1) throw new Error('HTTP 403')

				return { mime_type: JPEG_MIME, bytes: BYTES }
			},
		}

		const results = make_results(3)
		const candidates = await blog_cover_stock.collect_candidates(dependencies, results, PLAN)

		expect(candidates.map((candidate) => candidate.rank)).toEqual([1, 2])
		expect(written.size).toBe(2)
	})

	it('skips a result whose downloaded type the blog cannot use', async () => {
		const written: WrittenFiles = new Map()
		const dependencies = make_dependencies([], written, WEBP_MIME)
		const results = make_results(3)

		const candidates = await blog_cover_stock.collect_candidates(dependencies, results, PLAN)

		expect(candidates).toHaveLength(0)
		expect(written.size).toBe(0)
	})
})

describe('blog_cover_stock.run', () => {
	it('downloads the requested count and writes a manifest naming the saved files', async () => {
		const written: WrittenFiles = new Map()
		const dependencies = make_dependencies(make_results(REQUESTED), written)

		const summary = await blog_cover_stock.run(dependencies, FULL_REQUEST, NOW)

		expect(summary).toEqual({ manifest_path: MANIFEST_PATH, count: REQUESTED })
		expect(written.get(FIRST_IMAGE_PATH)).toBe(BYTES)
	})

	it('falls back to the post title when no keywords are given', async () => {
		const written: WrittenFiles = new Map()
		const search = vi.fn(async () => make_results(REQUESTED))
		const dependencies: StockDependencies = { ...make_dependencies([], written), search }
		const request = { slug_or_path: SLUG, count: REQUESTED, query: '' }

		await blog_cover_stock.run(dependencies, request, NOW)

		expect(search).toHaveBeenCalledWith(TITLE, REQUESTED)
	})

	// The usual cause is a Japanese title reaching an index whose metadata is English, so the
	// failure has to name the keywords and say how to pass better ones.
	it('refuses a thin search before downloading anything', async () => {
		const written: WrittenFiles = new Map()
		const dependencies = make_dependencies(make_results(2), written)

		await expect(blog_cover_stock.run(dependencies, FULL_REQUEST, NOW)).rejects.toThrow(
			`Openverse returned 2 usable result(s) for "${QUERY}"`,
		)
		expect(written.size).toBe(0)
	})

	// `blog:cover:review` requires at least one candidate, so an empty manifest would fail the
	// moment it was opened — after this command had printed the command to open it with.
	it('writes no manifest when every result turned out to be unusable', async () => {
		const written: WrittenFiles = new Map()
		const dependencies = make_dependencies(make_results(REQUESTED), written, WEBP_MIME)

		await expect(blog_cover_stock.run(dependencies, FULL_REQUEST, NOW)).rejects.toThrow(
			`No candidate could be saved for "${QUERY}"`,
		)
		expect(written.size).toBe(0)
	})
})

describe('the manifest the collector writes', () => {
	// The whole point of the manifest is that the review page opens it untouched, so the schema that
	// page parses with is what checks it here rather than a restatement of the same shape.
	it('parses under the review script without hand editing', async () => {
		const written: WrittenFiles = new Map()
		const dependencies = make_dependencies(make_results(REQUESTED), written)

		await blog_cover_stock.run(dependencies, FULL_REQUEST, NOW)
		const manifest = blog_cover_review.parse_manifest(String(written.get(MANIFEST_PATH)))

		expect(manifest.post).toBe(SLUG)
		expect(manifest.candidates).toHaveLength(REQUESTED)
		expect(manifest.candidates.map((candidate) => candidate.license_url)).not.toContain('')
		expect(manifest.candidates.map((candidate) => candidate.credit)).not.toContain('')
		expect(manifest.candidates.map((candidate) => candidate.filename)).not.toContain('')
	})
})
