import { describe, expect, it } from 'vitest'
import { blog_cover_assets } from './blog-cover-assets'

const PNG_MIME = 'image/png'
const JPEG_MIME = 'image/jpeg'
const AVIF_MIME = 'image/avif'

describe('blog_cover_assets.mime_for_extension', () => {
	it('maps a known extension case-insensitively', () => {
		expect(blog_cover_assets.mime_for_extension('PNG')).toBe(PNG_MIME)
		expect(blog_cover_assets.mime_for_extension('jpeg')).toBe(JPEG_MIME)
	})

	it('answers undefined for an unknown extension', () => {
		expect(blog_cover_assets.mime_for_extension('txt')).toBeUndefined()
	})

	it('answers undefined for an Object prototype member name', () => {
		expect(blog_cover_assets.mime_for_extension('constructor')).toBeUndefined()
	})
})

describe('blog_cover_assets.extension_for_mime', () => {
	it('reverses the mapping, preferring jpg for JPEG', () => {
		expect(blog_cover_assets.extension_for_mime(JPEG_MIME)).toBe('jpg')
		expect(blog_cover_assets.extension_for_mime(PNG_MIME)).toBe('png')
	})

	it('round-trips every type the review side accepts', () => {
		const extension = blog_cover_assets.extension_for_mime(AVIF_MIME)

		expect(blog_cover_assets.mime_for_extension(extension)).toBe(AVIF_MIME)
	})

	it('falls back to PNG rather than aborting on an unlisted type', () => {
		expect(blog_cover_assets.extension_for_mime('image/heic')).toBe(
			blog_cover_assets.DEFAULT_IMAGE_EXTENSION,
		)
	})
})

describe('blog_cover_assets.is_supported_mime', () => {
	it('accepts only an exact type, not a prefix match', () => {
		expect(blog_cover_assets.is_supported_mime(PNG_MIME)).toBe(true)
		expect(blog_cover_assets.is_supported_mime('image/png" onerror="alert(1)')).toBe(false)
		expect(blog_cover_assets.is_supported_mime('text/html')).toBe(false)
	})
})
