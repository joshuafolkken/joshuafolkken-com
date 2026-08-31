/**
 * The Openverse half of the free stock photo collector: the search request, the shape of a result,
 * and the credit line a result becomes.
 *
 * Openverse (https://api.openverse.org) indexes the CC-licensed and public-domain images of Flickr,
 * StockSnap, Rawpixel, Wikimedia and others. It is the source this repository searches because it
 * needs no key and no account — 20 requests a minute and 200 a day anonymously, one per run — and
 * because it returns a license and an attribution line with every result, so the manifest's
 * `credit` and `license_url` come from the API rather than from a guess.
 *
 * Kept apart from `blog-cover-stock` so the collector reads as what it does with candidates rather
 * than as how one photo index spells its query string.
 */
import { z } from 'zod'
import { blog_cover_assets } from './blog-cover-assets'
import { environment } from './environment'

const OPENVERSE_SEARCH_URL = 'https://api.openverse.org/v1/images/'
// CC0, the Public Domain Mark and CC BY: the set that permits commercial use and modification with
// attribution alone, which is the only obligation a blog cover can carry without changing the terms
// the rest of the site is published under.
const DEFAULT_LICENSES = 'cc0,pdm,by'
const IMAGE_EXTENSIONS = 'jpg,png'
// Asked for wider than the requested count so results dropped for an unusable type still leave
// enough, and capped at the page size the anonymous API allows.
const SEARCH_OVERFETCH = 3
const MAX_PAGE_SIZE = 20
const UNTITLED = '(untitled)'
const UNKNOWN_CREATOR = 'an unknown creator'
// Openverse names a license by its slug — `by`, `cc0`, `pdm` — which is not what the license is
// called. The credit line composed from it is what a person copies into a published post, so `by`
// has to read `CC BY`; the two that are not `CC <slug>` are spelled out here and the rest follow
// the prefix rule, which also covers a slug this table has never seen (`by-sa`, `by-nc`).
const LICENSE_LABELS = new Map<string, string>([
	['cc0', 'CC0'],
	['pdm', 'Public Domain Mark'],
])
const HTTP_PROTOCOL_PATTERN = /^https?$/u

const OPTIONAL_TEXT = z
	.string()
	.nullish()
	.transform((value) => value ?? '')
const OPTIONAL_SIZE = z
	.number()
	.nullish()
	.transform((value) => value ?? 0)

// `url`, `license` and `license_url` are required, which is what keeps a candidate with no usable
// attribution out of the manifest instead of writing an empty credit line into a page someone then
// publishes. Everything else is optional because Openverse leaves it null for some providers.
const RESULT_SCHEMA = z.object({
	url: z.url({ protocol: HTTP_PROTOCOL_PATTERN }),
	license: z.string().min(1),
	license_url: z.url({ protocol: HTTP_PROTOCOL_PATTERN }),
	title: OPTIONAL_TEXT,
	creator: OPTIONAL_TEXT,
	provider: OPTIONAL_TEXT,
	license_version: OPTIONAL_TEXT,
	attribution: OPTIONAL_TEXT,
	foreign_landing_url: OPTIONAL_TEXT,
	width: OPTIONAL_SIZE,
	height: OPTIONAL_SIZE,
})

const SEARCH_SCHEMA = z.object({ results: z.array(z.unknown()) })

type StockResult = z.infer<typeof RESULT_SCHEMA>

interface StockConfig {
	licenses: string
	sources: string
}

function read_config(): StockConfig {
	return {
		licenses: environment.optional_environment('BLOG_STOCK_LICENSES', DEFAULT_LICENSES),
		sources: environment.optional_environment('BLOG_STOCK_SOURCES', ''),
	}
}

function build_search_url(config: StockConfig, query: string, count: number): string {
	const url = new URL(OPENVERSE_SEARCH_URL)
	const page_size = Math.min(count * SEARCH_OVERFETCH, MAX_PAGE_SIZE)

	url.searchParams.set('q', query)
	url.searchParams.set('page_size', String(page_size))
	url.searchParams.set('license', config.licenses)
	url.searchParams.set('extension', IMAGE_EXTENSIONS)

	if (config.sources !== '') url.searchParams.set('source', config.sources)

	return url.href
}

// A single malformed entry is dropped rather than failing the whole search: the index aggregates
// many providers, and one of them omitting a license URL must not cost the other four candidates.
function parse_results(payload: unknown): ReadonlyArray<StockResult> {
	const { results } = SEARCH_SCHEMA.parse(payload)

	return results.flatMap((entry) => {
		const parsed = RESULT_SCHEMA.safeParse(entry)

		return parsed.success ? [parsed.data] : []
	})
}

function license_label(result: StockResult): string {
	const name = LICENSE_LABELS.get(result.license) ?? `CC ${result.license.toUpperCase()}`

	return `${name} ${result.license_version}`.trim()
}

function compose_attribution(result: StockResult): string {
	const creator = [result.creator, result.provider].find((name) => name !== '')
	const title = result.title === '' ? UNTITLED : result.title

	return `"${title}" by ${creator ?? UNKNOWN_CREATOR} is licensed under ${license_label(result)}.`
}

// The API's own `attribution` is the authoritative credit line, so it is used as written; the
// composed fallback only covers a provider that leaves it null. The landing page is appended either
// way — CC attribution asks for a link back to the work, and `attribution` carries none.
function credit_line(result: StockResult): string {
	const attribution = result.attribution === '' ? compose_attribution(result) : result.attribution

	if (result.foreign_landing_url === '') return attribution

	return `${attribution} Source: ${result.foreign_landing_url}`
}

async function search(
	config: StockConfig,
	query: string,
	count: number,
): Promise<ReadonlyArray<StockResult>> {
	const url = build_search_url(config, query, count)
	const response = await fetch(url, {
		headers: { 'user-agent': blog_cover_assets.USER_AGENT },
		signal: AbortSignal.timeout(blog_cover_assets.FETCH_TIMEOUT_MS),
	})

	if (!response.ok) {
		throw new Error(`Openverse search failed: HTTP ${String(response.status)} — ${url}`)
	}

	return parse_results(await response.json())
}

const blog_cover_openverse = {
	DEFAULT_LICENSES,
	license_label,
	read_config,
	build_search_url,
	parse_results,
	credit_line,
	search,
}

export type { StockConfig, StockResult }
export { blog_cover_openverse }
