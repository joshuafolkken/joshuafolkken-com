/**
 * The cover-image facts both cover scripts need: where candidates live, and how an image's MIME
 * type and its filename extension map onto each other.
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

const blog_cover_assets = {
	COVERS_DIR,
	DEFAULT_IMAGE_EXTENSION,
	mime_for_extension,
	extension_for_mime,
	is_supported_mime,
}

export { blog_cover_assets }
