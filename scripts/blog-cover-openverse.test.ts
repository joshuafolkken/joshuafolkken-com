import { afterEach, describe, expect, it, vi } from 'vitest'
import { blog_cover_openverse, type StockResult } from './blog-cover-openverse'

const QUERY = 'developer desk'
const LICENSE_URL = 'https://creativecommons.org/licenses/by/2.0/'
const LANDING_URL = 'https://www.flickr.com/photos/someone/1'
const FIRST_PHOTO_URL = 'https://photos.example/1.jpg'
const SECOND_PHOTO_URL = 'https://photos.example/2.jpg'
const STOCKSNAP = 'stocksnap'
const CC0_ONLY = { licenses: 'cc0', sources: '' }
const ATTRIBUTION = '"Photo 1" by Someone is licensed under CC BY 2.0.'
const REQUESTED = 5
const MAX_COUNT = 10
const PHOTO_TITLE = 'Photo 1'
const DEFAULT_LICENSES = 'cc0,pdm,by'

afterEach(() => {
	vi.unstubAllEnvs()
})

function make_result(overrides: Partial<StockResult> = {}): StockResult {
	return {
		url: FIRST_PHOTO_URL,
		license: 'by',
		license_url: LICENSE_URL,
		title: PHOTO_TITLE,
		creator: 'Someone',
		provider: 'flickr',
		license_version: '2.0',
		attribution: '',
		foreign_landing_url: LANDING_URL,
		width: 1024,
		height: 683,
		...overrides,
	}
}

describe('blog_cover_openverse.read_config', () => {
	it('defaults to the licenses that allow commercial use and modification', () => {
		vi.stubEnv('BLOG_STOCK_LICENSES', '')
		vi.stubEnv('BLOG_STOCK_SOURCES', '')

		expect(blog_cover_openverse.read_config()).toEqual({ licenses: DEFAULT_LICENSES, sources: '' })
		expect(blog_cover_openverse.DEFAULT_LICENSES).toBe(DEFAULT_LICENSES)
	})

	it('takes an override for the license and source filters', () => {
		vi.stubEnv('BLOG_STOCK_LICENSES', 'cc0')
		vi.stubEnv('BLOG_STOCK_SOURCES', STOCKSNAP)

		expect(blog_cover_openverse.read_config()).toEqual({ licenses: 'cc0', sources: STOCKSNAP })
	})
})

describe('blog_cover_openverse.build_search_url', () => {
	it('asks for more results than requested so unusable ones still leave enough', () => {
		const url = new URL(blog_cover_openverse.build_search_url(CC0_ONLY, QUERY, REQUESTED))

		expect(url.searchParams.get('q')).toBe(QUERY)
		expect(url.searchParams.get('page_size')).toBe('15')
		expect(url.searchParams.get('license')).toBe('cc0')
		expect(url.searchParams.get('extension')).toBe('jpg,png')
		expect(url.searchParams.get('source')).toBeNull()
	})

	// The anonymous API refuses a larger page, so the over-fetch has to stop rather than the search.
	it('caps the page size and adds the source filter only when one is configured', () => {
		const config = { licenses: 'cc0', sources: STOCKSNAP }
		const url = new URL(blog_cover_openverse.build_search_url(config, QUERY, MAX_COUNT))

		expect(url.searchParams.get('page_size')).toBe('20')
		expect(url.searchParams.get('source')).toBe(STOCKSNAP)
	})
})

describe('blog_cover_openverse.parse_results', () => {
	// A result with no license URL cannot be credited, and the manifest must never carry a blank
	// one — so it is dropped here rather than written out and noticed on the published page.
	it('drops a result that carries no license URL and keeps the rest', () => {
		const payload = {
			results: [
				{ url: FIRST_PHOTO_URL, license: 'by' },
				{ url: SECOND_PHOTO_URL, license: 'by', license_url: LICENSE_URL },
			],
		}

		const parsed = blog_cover_openverse.parse_results(payload)

		expect(parsed).toHaveLength(1)
		expect(parsed[0]?.url).toBe(SECOND_PHOTO_URL)
	})

	// The API sends JSON null for a field a provider does not supply, which every reader downstream
	// would otherwise have to test for separately.
	it('reads a null optional field as an empty value', () => {
		const payload: unknown = JSON.parse(
			`{"results":[{"url":"${FIRST_PHOTO_URL}","license":"by","license_url":"${LICENSE_URL}","creator":null,"width":null}]}`,
		)

		expect(blog_cover_openverse.parse_results(payload)[0]).toMatchObject({ creator: '', width: 0 })
	})
})

describe('blog_cover_openverse.credit_line', () => {
	it("uses the API's own attribution and appends the landing page", () => {
		const credit = blog_cover_openverse.credit_line(make_result({ attribution: ATTRIBUTION }))

		expect(credit).toBe(`${ATTRIBUTION} Source: ${LANDING_URL}`)
	})

	it('composes a credit line when the provider supplies no attribution', () => {
		const credit = blog_cover_openverse.credit_line(make_result())

		expect(credit).toContain(`"${PHOTO_TITLE}" by Someone is licensed under CC BY 2.0.`)
		expect(credit).toContain(LANDING_URL)
	})

	it('names the provider when the creator is missing, and never leaves the line empty', () => {
		const credit = blog_cover_openverse.credit_line(
			make_result({ creator: '', title: '', foreign_landing_url: '' }),
		)

		expect(credit).toBe('"(untitled)" by flickr is licensed under CC BY 2.0.')
	})
})

describe('blog_cover_openverse.license_label', () => {
	// The API names a license by its slug, which is not what the license is called. The composed
	// credit line is what a person copies into a published post, so `by` must not ship as `BY`.
	it('spells the license out rather than shouting its slug', () => {
		expect(blog_cover_openverse.license_label(make_result())).toBe('CC BY 2.0')
		expect(
			blog_cover_openverse.license_label(make_result({ license: 'cc0', license_version: '1.0' })),
		).toBe('CC0 1.0')
		expect(
			blog_cover_openverse.license_label(make_result({ license: 'pdm', license_version: '1.0' })),
		).toBe('Public Domain Mark 1.0')
	})

	it('keeps the CC prefix rule for a slug the table has never seen', () => {
		expect(
			blog_cover_openverse.license_label(make_result({ license: 'by-sa', license_version: '4.0' })),
		).toBe('CC BY-SA 4.0')
	})
})
