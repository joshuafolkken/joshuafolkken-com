/**
 * The cover-image facts every cover script needs: where candidates live, how a run is stamped, how
 * an image's MIME type and its filename extension map onto each other, and how one is fetched.
 *
 * They are single-sourced because the two scripts sit on opposite ends of one file. `blog-cover-image`
 * names a generated candidate from the MIME type the model returned; `blog-cover-review` reads that
 * filename back and rebuilds the MIME type from its extension. When each kept its own table the two
 * disagreed on every type only one of them listed — an `image/avif` candidate was written as
 * `…-01.png` and then re-declared as `image/png` in a `data:` URI, which renders as a broken frame
 * with no reason attached.
 */

const COVERS_DIR = '.covers'
const DEFAULT_IMAGE_EXTENSION = 'png'
const JPEG_MIME = 'image/jpeg'
const STAMP_PAD_WIDTH = 2
const CONTENT_TYPE_HEADER = 'content-type'
const FETCH_TIMEOUT_MS = 20_000
// Flickr and the other hosts Openverse indexes throttle or refuse a request with no agent string,
// and a refusal there arrives as a candidate that cannot be shown rather than as an error anyone
// reads.
const USER_AGENT = 'joshuafolkken-com cover tooling (+https://joshuafolkken.com)'

interface FetchedImage {
	mime_type: string
	bytes: Uint8Array
}

// Keyed by extension without its leading dot. A Map rather than an object literal because a lookup
// on an object also finds `Object.prototype` members, so a source ending `.constructor` would
// return a function instead of the `undefined` its callers guard against.
const MIME_BY_EXTENSION = new Map<string, string>([
	['png', 'image/png'],
	['jpg', JPEG_MIME],
	['jpeg', JPEG_MIME],
	['webp', 'image/webp'],
	['avif', 'image/avif'],
	['gif', 'image/gif'],
	['svg', 'image/svg+xml'],
])

// The reverse direction. `jpg` wins over `jpeg` for `image/jpeg` because it is the extension the
// blog's existing cover files already use.
const EXTENSION_BY_MIME = new Map<string, string>(
	[...MIME_BY_EXTENSION]
		.map(([extension, mime_type]): [string, string] => [mime_type, extension])
		.toReversed(),
)

const SUPPORTED_MIME_TYPES = new Set(MIME_BY_EXTENSION.values())

function mime_for_extension(extension: string): string | undefined {
	return MIME_BY_EXTENSION.get(extension.toLowerCase())
}

// Falls back to PNG so a model returning a type nobody listed still produces a file rather than
// aborting a run whose images are already billed.
function extension_for_mime(mime_type: string): string {
	return EXTENSION_BY_MIME.get(mime_type) ?? DEFAULT_IMAGE_EXTENSION
}

function is_supported_mime(mime_type: string): boolean {
	return SUPPORTED_MIME_TYPES.has(mime_type)
}

function pad_stamp(value: number): string {
	return String(value).padStart(STAMP_PAD_WIDTH, '0')
}

// Local-time `YYYYMMDD-HHMMSS`, prefixed to every candidate of one run. Numbering by index alone
// would have a second run overwrite the first run's candidates, destroying images the caller is
// still comparing against — billed ones for the generator, and the whole set the reviewer is
// ranking for the stock collector. The stamp keeps every run side by side in one directory, which
// is also the shape the comparison page reads them back in. Both commands write into that one
// directory, so they need the same stamp rather than two spellings of it.
function format_run_stamp(now: Date): string {
	const date = `${String(now.getFullYear())}${pad_stamp(now.getMonth() + 1)}${pad_stamp(now.getDate())}`
	const time = `${pad_stamp(now.getHours())}${pad_stamp(now.getMinutes())}${pad_stamp(now.getSeconds())}`

	return `${date}-${time}`
}

// Both cover scripts pull an image over HTTP — the stock collector to save it, the review page to
// inline it — and both need the type from the response header rather than from the URL. The timeout
// is not optional in either: they fetch sequentially, so one unresponsive photo host would
// otherwise stall a whole run with no output.
async function fetch_image(url: string): Promise<FetchedImage> {
	const response = await fetch(url, {
		headers: { 'user-agent': USER_AGENT },
		signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
	})

	if (!response.ok) throw new Error(`HTTP ${String(response.status)}: ${url}`)

	return {
		mime_type: response.headers.get(CONTENT_TYPE_HEADER)?.split(';', 1)[0]?.trim() ?? '',
		bytes: new Uint8Array(await response.arrayBuffer()),
	}
}

const blog_cover_assets = {
	COVERS_DIR,
	DEFAULT_IMAGE_EXTENSION,
	mime_for_extension,
	extension_for_mime,
	is_supported_mime,
	format_run_stamp,
	fetch_image,
	FETCH_TIMEOUT_MS,
	USER_AGENT,
}

export type { FetchedImage }
export { blog_cover_assets }
