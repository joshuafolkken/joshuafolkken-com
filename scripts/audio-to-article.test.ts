import { afterEach, describe, expect, it, vi } from 'vitest'
import { audio_to_article, type ArticleDependencies, type AudioSource } from './audio-to-article'
import type { VideoMetadata } from './inject-talk-frontmatter'

const VIDEO_ID = 'testVideo12'
const INFO_BASENAME = 'My Talk [testVideo12]'
const METADATA: VideoMetadata = {
	video_id: VIDEO_ID,
	upload_date: '20251204',
	video_title: 'My Talk',
}
const NOW = new Date(2026, 6, 10)
const OUTPUT_PATH = 'src/lib/posts/talk-2025-12-04.md'
const AUDIO_SOURCE: AudioSource = {
	audio_path: '.audio/talk.opus',
	mime_type: 'audio/ogg',
	display_name: VIDEO_ID,
}

afterEach(() => {
	vi.unstubAllEnvs()
})

describe('audio_to_article.read_config', () => {
	it('applies defaults for the optional model and prompt path', () => {
		vi.stubEnv('GEMINI_API_KEY', 'key-1')
		vi.stubEnv('GEMINI_MODEL', '')
		vi.stubEnv('AUDIO_ARTICLE_PROMPT', '')

		const config = audio_to_article.read_config()

		expect(config).toEqual({
			api_key: 'key-1',
			model: 'gemini-3.5-flash',
			prompt_path: 'prompts/audio-to-article-3.md',
		})
	})

	it('throws when GEMINI_API_KEY is missing', () => {
		vi.stubEnv('GEMINI_API_KEY', '')

		expect(() => audio_to_article.read_config()).toThrow('Missing required env')
	})
})

describe('audio_to_article.mime_for_audio', () => {
	it('maps an .opus file to audio/ogg', () => {
		expect(audio_to_article.mime_for_audio('talk.opus')).toBe('audio/ogg')
	})

	it('maps an .mp3 file to audio/mpeg', () => {
		expect(audio_to_article.mime_for_audio('talk.mp3')).toBe('audio/mpeg')
	})

	it('falls back to audio/ogg for an unknown extension', () => {
		expect(audio_to_article.mime_for_audio('talk.unknown')).toBe('audio/ogg')
	})
})

describe('audio_to_article.select_audio_file', () => {
	it('picks the audio sibling that shares the info.json base name', () => {
		const files = [`${INFO_BASENAME}.info.json`, `${INFO_BASENAME}.opus`, 'other.opus']

		expect(audio_to_article.select_audio_file(files, INFO_BASENAME)).toBe(`${INFO_BASENAME}.opus`)
	})

	it('throws when no audio sibling exists', () => {
		const files = [`${INFO_BASENAME}.info.json`]

		expect(() => audio_to_article.select_audio_file(files, INFO_BASENAME)).toThrow('No audio file')
	})
})

describe('audio_to_article.resolve_output_path', () => {
	it('builds the posts path from a youtube date', () => {
		expect(audio_to_article.resolve_output_path('2025-12-04')).toBe(OUTPUT_PATH)
	})
})

describe('audio_to_article.strip_code_fences', () => {
	it('unwraps a whole-output ```markdown fence', () => {
		const fenced = '```markdown\n---\ntitle: x\n---\nBody\n```'

		expect(audio_to_article.strip_code_fences(fenced)).toBe('---\ntitle: x\n---\nBody')
	})

	it('leaves frontmatter and inner content untouched when not fenced', () => {
		const article = '---\ntitle: x\n---\n\nBody with `inline` code.'

		expect(audio_to_article.strip_code_fences(article)).toBe(article)
	})
})

describe('audio_to_article.build_upload_request', () => {
	it('uploads a Blob (never the non-ASCII path string) so the SDK omits the filename header', () => {
		const source: AudioSource = {
			audio_path: '.audio/#51 [ゲーム制作] 雑談 [I9x2NzAQCmY].opus',
			mime_type: 'audio/ogg',
			display_name: 'I9x2NzAQCmY',
		}

		const request = audio_to_article.build_upload_request(source, new Uint8Array([1, 2, 3]))

		expect(request.file).toBeInstanceOf(Blob)
		expect(request.file.type).toBe('audio/ogg')
		expect(request.file.size).toBe(3)
		expect(request.config).toEqual({ mimeType: 'audio/ogg', displayName: 'I9x2NzAQCmY' })
	})
})

describe('audio_to_article.assemble_article', () => {
	it('strips a wrapping fence and injects the frontmatter placeholders', () => {
		const raw =
			"```markdown\n---\ndate: '{{PUBLISH_DATE}}'\nyoutube: '{{YOUTUBE_URL}}'\nyoutube_date: '{{YOUTUBE_DATE}}'\n---\nBody\n```"

		const result = audio_to_article.assemble_article(raw, METADATA, NOW)

		expect(result).toContain(`date: '2026-07-10'`)
		expect(result).toContain(`youtube: 'https://www.youtube.com/watch?v=${VIDEO_ID}'`)
		expect(result).toContain(`youtube_date: '2025-12-04'`)
		expect(result).not.toMatch(/```|PUBLISH_DATE|YOUTUBE_URL|YOUTUBE_DATE/u)
	})
})

interface RunFakes {
	dependencies: ArticleDependencies
	generate: ReturnType<typeof vi.fn>
	write_article: ReturnType<typeof vi.fn>
}

function build_run_fakes(): RunFakes {
	const raw = "---\ndate: '{{PUBLISH_DATE}}'\nyoutube_date: '{{YOUTUBE_DATE}}'\n---\nBody"
	const generate = vi.fn().mockResolvedValue(raw)
	const write_article = vi.fn()
	const dependencies: ArticleDependencies = {
		find_metadata: vi.fn().mockReturnValue(METADATA),
		find_audio: vi.fn().mockReturnValue(AUDIO_SOURCE),
		read_prompt: vi.fn().mockReturnValue('PROMPT'),
		generate,
		write_article,
	}

	return { dependencies, generate, write_article }
}

describe('audio_to_article.run', () => {
	it('writes the assembled article to the youtube-date path', async () => {
		const { dependencies, generate, write_article } = build_run_fakes()

		const output_path = await audio_to_article.run(
			dependencies,
			`https://www.youtube.com/watch?v=${VIDEO_ID}`,
			NOW,
		)

		expect(output_path).toBe(OUTPUT_PATH)
		expect(generate).toHaveBeenCalledWith(AUDIO_SOURCE, 'PROMPT')

		const [written_path, written_content] = write_article.mock.calls[0] as [string, string]

		expect(written_path).toBe(OUTPUT_PATH)
		expect(written_content).toContain(`date: '2026-07-10'`)
		expect(written_content).toContain(`youtube_date: '2025-12-04'`)
	})
})

describe('audio_to_article.read_cli_argument', () => {
	it('returns the first argument', () => {
		expect(audio_to_article.read_cli_argument(['abc'])).toBe('abc')
	})

	it('throws when no argument is given', () => {
		expect(() => audio_to_article.read_cli_argument([])).toThrow('Usage')
	})
})
