import { readFileSync } from 'node:fs'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
	blog_cover_image,
	type CoverDependencies,
	type CoverImage,
	type ImageResponse,
} from './blog-cover-image'
import { blog_post_source } from './blog-post-source'

const SLUG = 'my-post'
const POST_PATH = 'src/lib/posts/my-post.md'
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
const BODY_LIMIT = 2000
const REFUSAL_TEXT = 'I cannot draw that'
const ESCAPED_TITLE_POST = `---\ntitle: 'Josh''s kit'\n---\n\n${BODY}`
const APOSTROPHE_TITLE = "Josh's kit"
const SEQUENTIAL_COUNT = 4
const RATE_LIMIT_ERROR = '429 RESOURCE_EXHAUSTED'
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

function collect(received: Array<CoverImage>): (image: CoverImage) => void {
	return (image: CoverImage): void => {
		received.push(image)
	}
}

// Records the order the loop asks for candidates in, and how many requests were ever open at once.
// `Promise.all` over the same generator would leave the peak at the requested count instead of 1.
function make_sequence_recorder(): {
	generate_candidate: (index: number) => Promise<CoverImage>
	indexes: Array<number>
	read_peak_in_flight: () => number
} {
	const indexes: Array<number> = []
	let in_flight = 0
	let peak_in_flight = 0

	return {
		indexes,
		read_peak_in_flight: () => peak_in_flight,
		async generate_candidate(index: number): Promise<CoverImage> {
			indexes.push(index)
			in_flight += 1
			peak_in_flight = Math.max(peak_in_flight, in_flight)
			await Promise.resolve()
			in_flight -= 1

			return make_image(PNG_MIME)
		},
	}
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

describe('blog_cover_image.build_prompt', () => {
	it('appends the post title, excerpt and body under the template', () => {
		const prompt = blog_cover_image.build_prompt(
			TEMPLATE,
			blog_post_source.read_summary(POST_PATH, POST, BODY_LIMIT),
		)

		expect(prompt).toContain(TEMPLATE)
		expect(prompt).toContain(TITLE)
		expect(prompt).toContain(EXCERPT)
		expect(prompt).toContain(BODY)
	})

	// The prompt is what the model is billed to read, so the escaping the frontmatter writer adds
	// has to be gone by the time the title reaches it — not merely unescaped somewhere upstream.
	it('carries an escaped apostrophe through exactly as the post spells it', () => {
		const prompt = blog_cover_image.build_prompt(
			TEMPLATE,
			blog_post_source.read_summary(POST_PATH, ESCAPED_TITLE_POST, BODY_LIMIT),
		)

		expect(prompt).toContain(APOSTROPHE_TITLE)
		expect(prompt).not.toContain("Josh''s kit")
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
		expect(blog_cover_image.extension_for_image('image/heic')).toBe('png')
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

				throw new Error(RATE_LIMIT_ERROR)
			},
		}

		await expect(blog_cover_image.run(dependencies, SLUG, 2, NOW)).rejects.toThrow('429')
		expect(written).toEqual([path.join(COVERS_DIR, SLUG, FIRST_CANDIDATE_FILE)])
	})
})

describe('blog_cover_image.generate_sequentially', () => {
	// Every turn of this loop is one billed image, so two properties are load-bearing and neither
	// was checked before: exactly `count` requests, and one request at a time. A regression to
	// `index < count - 1` or a rewrite to `Promise.all` would otherwise stay green.
	it('issues exactly the requested number of requests, one at a time', async () => {
		const recorder = make_sequence_recorder()
		const received: Array<CoverImage> = []

		await blog_cover_image.generate_sequentially(
			recorder.generate_candidate,
			SEQUENTIAL_COUNT,
			collect(received),
		)

		expect(recorder.indexes).toEqual(Array.from({ length: SEQUENTIAL_COUNT }, (_, index) => index))
		expect(received).toHaveLength(SEQUENTIAL_COUNT)
		expect(recorder.read_peak_in_flight()).toBe(1)
	})

	// The images are handed over as they arrive, so a rejection stops the run with the earlier ones
	// already delivered rather than discarding what has been paid for.
	it('stops at the first rejection and keeps what it already handed over', async () => {
		const received: Array<CoverImage> = []

		await expect(
			blog_cover_image.generate_sequentially(
				async (index: number): Promise<CoverImage> => {
					if (index > 0) throw new Error(RATE_LIMIT_ERROR)

					return make_image(PNG_MIME)
				},
				SEQUENTIAL_COUNT,
				collect(received),
			),
		).rejects.toThrow('429')
		expect(received).toHaveLength(1)
	})
})
