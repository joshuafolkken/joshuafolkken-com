import { readFileSync } from 'node:fs'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
	blog_cover_image,
	type CoverDependencies,
	type CoverImage,
	type ImageResponse,
} from './blog-cover-image'

const SLUG = 'my-post'
const TITLE = 'カバー画像を作る話'
const EXCERPT = '画像候補を機械的に用意する'
const BODY = '本文の一行目です。'
const POST = `---\ntitle: ${TITLE}\ndate: '2026-08-30 10:00'\nexcerpt: "${EXCERPT}"\n---\n\n${BODY}\n`
const TEMPLATE = 'テンプレートの指示文'
const PNG_MIME = 'image/png'
const JPEG_MIME = 'image/jpeg'
const PROMPT_PATH = 'prompts/blog-cover-image.md'
const BASE64_PIXEL = 'aGVsbG8='
const DEFAULT_COUNT = 3
const COVERS_DIR = '.covers'
const EXPLICIT_POST_PATH = 'drafts/other.md'
const REFUSAL_TEXT = 'I cannot draw that'
const NOW = new Date(2026, 7, 30, 9, 5, 4)
const RUN_STAMP = '20260830-090504'
const FIRST_CANDIDATE_FILE = `${RUN_STAMP}-01.png`
const SECOND_CANDIDATE_FILE = `${RUN_STAMP}-02.jpg`

afterEach(() => {
	vi.unstubAllEnvs()
})

function make_image(mime_type: string): CoverImage {
	return { mime_type, bytes: Uint8Array.from([1, 2, 3]) }
}

function make_response(parts: ImageResponse['candidates']): ImageResponse {
	return { candidates: parts }
}

function make_dependencies(
	images: ReadonlyArray<CoverImage>,
	written: Array<string>,
): CoverDependencies {
	return {
		read_post: () => POST,
		read_prompt: () => TEMPLATE,
		generate: async (_prompt: string, _count: number, on_image: (image: CoverImage) => void) => {
			for (const image of images) on_image(image)
		},
		write_image(output_path: string): void {
			written.push(output_path)
		},
	}
}

describe('blog_cover_image.read_config', () => {
	it('applies defaults for the optional model and prompt path', () => {
		vi.stubEnv('GEMINI_API_KEY', 'key-1')
		vi.stubEnv('BLOG_COVER_MODEL', '')
		vi.stubEnv('BLOG_COVER_PROMPT', '')

		expect(blog_cover_image.read_config()).toEqual({
			api_key: 'key-1',
			model: 'gemini-3.1-flash-image',
			prompt_path: PROMPT_PATH,
		})
	})

	it('names the missing variable when GEMINI_API_KEY is absent', () => {
		vi.stubEnv('GEMINI_API_KEY', '')

		expect(() => blog_cover_image.read_config()).toThrow('Missing required env: GEMINI_API_KEY')
	})
})

describe('blog_cover_image.resolve_post_path', () => {
	it('resolves a bare slug inside the posts directory', () => {
		expect(blog_cover_image.resolve_post_path(SLUG)).toBe(path.join('src/lib/posts', 'my-post.md'))
	})

	it('keeps an explicit markdown path as given', () => {
		expect(blog_cover_image.resolve_post_path(EXPLICIT_POST_PATH)).toBe(EXPLICIT_POST_PATH)
	})

	it('derives the slug from a post path', () => {
		expect(blog_cover_image.resolve_slug('src/lib/posts/my-post.md')).toBe(SLUG)
	})
})

describe('blog_cover_image.parse_post_summary', () => {
	it('reads the title and excerpt and keeps the body', () => {
		const summary = blog_cover_image.parse_post_summary(SLUG, POST)

		expect(summary).toEqual({ slug: SLUG, title: TITLE, excerpt: EXCERPT, body: BODY })
	})

	it('leaves the excerpt empty when the frontmatter has none', () => {
		const summary = blog_cover_image.parse_post_summary(SLUG, `---\ntitle: ${TITLE}\n---\n\nbody`)

		expect(summary.excerpt).toBe('')
	})

	it('truncates a body longer than the character limit', () => {
		const long_body = 'あ'.repeat(3000)
		const summary = blog_cover_image.parse_post_summary(
			SLUG,
			`---\ntitle: ${TITLE}\n---\n\n${long_body}`,
		)

		expect(summary.body).toHaveLength(2000)
	})

	it('throws when the frontmatter has no title', () => {
		expect(() => blog_cover_image.parse_post_summary(SLUG, `---\nexcerpt: x\n---\n\nbody`)).toThrow(
			'No `title`',
		)
	})

	it('treats a file without frontmatter as all body', () => {
		expect(blog_cover_image.split_frontmatter('just body')).toEqual({
			frontmatter: '',
			body: 'just body',
		})
	})

	it('returns undefined for a field the frontmatter does not carry', () => {
		expect(blog_cover_image.read_frontmatter_field('title: x', 'excerpt')).toBeUndefined()
	})
})

describe('blog_cover_image.build_prompt', () => {
	it('appends the post title, excerpt and body under the template', () => {
		const prompt = blog_cover_image.build_prompt(
			TEMPLATE,
			blog_cover_image.parse_post_summary(SLUG, POST),
		)

		expect(prompt).toContain(TEMPLATE)
		expect(prompt).toContain(TITLE)
		expect(prompt).toContain(EXCERPT)
		expect(prompt).toContain(BODY)
	})
})

describe('the distributed prompt template', () => {
	// The whole point of the generated candidates is that they carry no lettering: generated text
	// comes out malformed. A template that lost the rule would produce unusable covers silently.
	it('forbids drawing text inside the image', () => {
		const template = readFileSync(PROMPT_PATH, 'utf8')

		expect(template).toContain('画像に文字を入れない')
	})
})

describe('blog_cover_image.parse_count', () => {
	it('defaults to a small count when no argument is given', () => {
		expect(blog_cover_image.parse_count(undefined)).toBe(DEFAULT_COUNT)
		expect(blog_cover_image.DEFAULT_IMAGE_COUNT).toBe(DEFAULT_COUNT)
	})

	it('accepts an integer inside the allowed range', () => {
		expect(blog_cover_image.parse_count('5')).toBe(5)
	})

	it.each(['0', '-1', '2.5', 'many', String(blog_cover_image.MAX_IMAGE_COUNT + 1)])(
		'rejects %s',
		(raw) => {
			expect(() => blog_cover_image.parse_count(raw)).toThrow('count must be an integer')
		},
	)
})

describe('blog_cover_image.resolve_output_path', () => {
	it('numbers candidates from one and pads the index', () => {
		expect(blog_cover_image.resolve_output_path(SLUG, RUN_STAMP, 0, PNG_MIME)).toBe(
			path.join(COVERS_DIR, SLUG, FIRST_CANDIDATE_FILE),
		)
	})

	it('uses the extension of the returned MIME type', () => {
		expect(blog_cover_image.resolve_output_path(SLUG, RUN_STAMP, 1, JPEG_MIME)).toBe(
			path.join(COVERS_DIR, SLUG, SECOND_CANDIDATE_FILE),
		)
	})

	it('falls back to png for a MIME type it does not know', () => {
		expect(blog_cover_image.extension_for_image('image/avif')).toBe('png')
	})

	// Without the run stamp a second run would overwrite the first run's billed candidates.
	it('stamps each run so a later run cannot overwrite an earlier one', () => {
		const later = new Date(2026, 7, 30, 9, 5, 5)

		expect(blog_cover_image.format_run_stamp(NOW)).toBe(RUN_STAMP)
		expect(blog_cover_image.format_run_stamp(later)).not.toBe(RUN_STAMP)
	})
})

describe('blog_cover_image.first_image', () => {
	it('decodes the first inline image part', () => {
		const response = make_response([
			{
				content: {
					parts: [
						{ text: 'here you go' },
						{ inlineData: { data: BASE64_PIXEL, mimeType: PNG_MIME } },
					],
				},
			},
		])

		const image = blog_cover_image.first_image(response)

		expect(image.mime_type).toBe(PNG_MIME)
		expect(Buffer.from(image.bytes).toString('utf8')).toBe('hello')
	})

	it('throws with the model text when the response carries no image', () => {
		const response = make_response([{ content: { parts: [{ text: REFUSAL_TEXT }] } }])

		expect(() => blog_cover_image.first_image(response)).toThrow(REFUSAL_TEXT)
	})

	it('throws when the response is empty', () => {
		expect(() => blog_cover_image.first_image({})).toThrow('Gemini returned no image')
	})

	// A safety block arrives with no parts at all, so the reason is the only thing to report.
	it('reports the block reason when the response carries no parts', () => {
		const response: ImageResponse = {
			candidates: [{ finishReason: 'SAFETY' }],
			promptFeedback: { blockReason: 'PROHIBITED_CONTENT' },
		}

		expect(() => blog_cover_image.first_image(response)).toThrow('PROHIBITED_CONTENT, SAFETY')
	})
})

describe('blog_cover_image.run', () => {
	it('writes one file per generated candidate under the covers directory', async () => {
		const written: Array<string> = []
		const images = [make_image(PNG_MIME), make_image(JPEG_MIME)]

		const result = await blog_cover_image.run(make_dependencies(images, written), SLUG, 2, NOW)

		expect(result).toEqual([
			path.join(COVERS_DIR, SLUG, FIRST_CANDIDATE_FILE),
			path.join(COVERS_DIR, SLUG, SECOND_CANDIDATE_FILE),
		])
		expect(written).toEqual(result)
	})

	it('passes the prompt built from the post to the generator', async () => {
		const generate = vi.fn(
			async (_prompt: string, _count: number, on_image: (image: CoverImage) => void) => {
				on_image(make_image(PNG_MIME))
			},
		)
		const dependencies: CoverDependencies = {
			...make_dependencies([], []),
			generate,
		}

		await blog_cover_image.run(dependencies, SLUG, 1, NOW)

		expect(generate).toHaveBeenCalledWith(expect.stringContaining(TITLE), 1, expect.any(Function))
	})
})

describe('blog_cover_image.run partway through a batch', () => {
	// A rejection partway through a batch must leave the candidates already billed for on disk.
	it('keeps the candidates written before the failure', async () => {
		const written: Array<string> = []
		const dependencies: CoverDependencies = {
			...make_dependencies([], written),
			generate: async (_prompt, _count, on_image) => {
				on_image(make_image(PNG_MIME))

				throw new Error('429 RESOURCE_EXHAUSTED')
			},
		}

		await expect(blog_cover_image.run(dependencies, SLUG, 2, NOW)).rejects.toThrow('429')
		expect(written).toEqual([path.join(COVERS_DIR, SLUG, FIRST_CANDIDATE_FILE)])
	})
})
