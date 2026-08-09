import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { audio_to_article, type ArticleDependencies, type AudioSource } from './audio-to-article'
import type { VideoMetadata } from './inject-talk-frontmatter'

const VIDEO_ID = 'testVideo12'
const INFO_BASENAME = 'My Talk [testVideo12]'
const BROADCAST_DATE = '2025-12-04'
const METADATA: VideoMetadata = {
	video_id: VIDEO_ID,
	// The archive was published on the 5th; the stream itself went out on the 4th JST, and the
	// post is named and dated after the broadcast.
	upload_date: '20251205',
	broadcast_date: BROADCAST_DATE,
	video_title: 'My Talk',
}
const NOW = new Date(2026, 6, 10)
const OUTPUT_PATH = `src/lib/posts/talk-${BROADCAST_DATE}.md`
const OGG_MIME = 'audio/ogg'
const MPEG_MIME = 'audio/mpeg'
const OVERRIDE_SAMPLE_FILE = 'override_sample.mp3'
const TARGET_SAMPLE_FILE = 'joshua_sample.opus'
const EXCLUDED_SAMPLE_FILE = 'longinus_sample.opus'
const TARGET_REFERENCE_NAME = 'reference-target-speaker'
const EXCLUDED_REFERENCE_NAME = 'reference-excluded-speaker'
const AUDIO_SOURCE: AudioSource = {
	audio_path: '.audio/talk.opus',
	mime_type: OGG_MIME,
	display_name: VIDEO_ID,
}
const REFERENCE_SOURCES: ReadonlyArray<AudioSource> = [
	{
		audio_path: `.audio/${TARGET_SAMPLE_FILE}`,
		mime_type: OGG_MIME,
		display_name: TARGET_REFERENCE_NAME,
	},
	{
		audio_path: `.audio/${EXCLUDED_SAMPLE_FILE}`,
		mime_type: OGG_MIME,
		display_name: EXCLUDED_REFERENCE_NAME,
	},
]

afterEach(() => {
	vi.unstubAllEnvs()
})

function make_sample_directory(filenames: ReadonlyArray<string>): string {
	const directory = mkdtempSync(path.join(tmpdir(), 'audio-references-'))

	for (const filename of filenames) writeFileSync(path.join(directory, filename), '')

	return directory
}

describe('audio_to_article.read_config', () => {
	it('applies defaults for the optional model and prompt path', () => {
		vi.stubEnv('GEMINI_API_KEY', 'key-1')
		vi.stubEnv('GEMINI_MODEL', '')
		vi.stubEnv('AUDIO_ARTICLE_PROMPT', '')

		const config = audio_to_article.read_config()

		expect(config).toEqual({
			api_key: 'key-1',
			model: 'gemini-3.5-flash',
			prompt_path: 'prompts/audio-to-article-4.md',
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
		expect(audio_to_article.mime_for_audio('talk.mp3')).toBe(MPEG_MIME)
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

describe('audio_to_article.find_reference_samples', () => {
	it('returns the target-speaker sample before the excluded-speaker sample', () => {
		const directory = make_sample_directory([TARGET_SAMPLE_FILE, EXCLUDED_SAMPLE_FILE])

		const samples = audio_to_article.find_reference_samples(directory)

		expect(samples).toEqual([
			{
				audio_path: path.join(directory, TARGET_SAMPLE_FILE),
				mime_type: OGG_MIME,
				display_name: TARGET_REFERENCE_NAME,
			},
			{
				audio_path: path.join(directory, EXCLUDED_SAMPLE_FILE),
				mime_type: OGG_MIME,
				display_name: EXCLUDED_REFERENCE_NAME,
			},
		])

		rmSync(directory, { recursive: true })
	})

	it('throws instead of silently falling back when a reference sample is missing', () => {
		const directory = make_sample_directory([TARGET_SAMPLE_FILE])

		expect(() => audio_to_article.find_reference_samples(directory)).toThrow(
			'Missing reference sample',
		)

		rmSync(directory, { recursive: true })
	})
})

function find_with_first_override(directory: string): ReadonlyArray<AudioSource> {
	return audio_to_article.find_reference_samples(directory, [
		path.join(directory, OVERRIDE_SAMPLE_FILE),
	])
}

function make_override_directory(): string {
	return make_sample_directory([TARGET_SAMPLE_FILE, EXCLUDED_SAMPLE_FILE, OVERRIDE_SAMPLE_FILE])
}

describe('audio_to_article.find_reference_samples overrides', () => {
	it('prefers an override path and reads its MIME type from that extension', () => {
		const directory = make_override_directory()

		expect(find_with_first_override(directory)[0]).toEqual({
			audio_path: path.join(directory, OVERRIDE_SAMPLE_FILE),
			mime_type: MPEG_MIME,
			display_name: TARGET_REFERENCE_NAME,
		})

		rmSync(directory, { recursive: true })
	})

	it('falls back to the default path for each position left unspecified', () => {
		const directory = make_override_directory()

		expect(find_with_first_override(directory)[1]?.audio_path).toBe(
			path.join(directory, EXCLUDED_SAMPLE_FILE),
		)

		rmSync(directory, { recursive: true })
	})
})

describe('audio_to_article.resolve_output_path', () => {
	it('builds the posts path from a youtube date', () => {
		expect(audio_to_article.resolve_output_path(BROADCAST_DATE)).toBe(OUTPUT_PATH)
	})
})

async function* stream_chunks(
	texts: ReadonlyArray<string | undefined>,
): AsyncGenerator<{ text?: string | undefined }> {
	for (const text of texts) yield { text }
}

async function collect_chunks(
	texts: ReadonlyArray<string | undefined>,
	progress: Array<number>,
): Promise<string> {
	function record(characters: number): void {
		progress.push(characters)
	}

	return await audio_to_article.collect_stream_text(stream_chunks(texts), record)
}

describe('audio_to_article.collect_stream_text', () => {
	it('joins the chunk texts in arrival order and skips the empty ones', async () => {
		const progress: Array<number> = []

		const text = await collect_chunks(
			['---\ntitle', ": 'x'\n---\n", '', undefined, 'Body'],
			progress,
		)

		expect(text).toBe("---\ntitle: 'x'\n---\nBody")
		expect(progress).toEqual([9, 19, 23])
	})

	it('returns an empty string when the stream yields nothing, so the caller can fail', async () => {
		expect(await collect_chunks([], [])).toBe('')
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
		find_references: vi.fn().mockReturnValue(REFERENCE_SOURCES),
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
		// Both references must lead, in order, so the model anchors each voice before the talk audio.
		expect(generate).toHaveBeenCalledWith([...REFERENCE_SOURCES, AUDIO_SOURCE], 'PROMPT')

		const [written_path, written_content] = write_article.mock.calls[0] as [string, string]

		expect(written_path).toBe(OUTPUT_PATH)
		expect(written_content).toContain(`date: '2026-07-10'`)
		expect(written_content).toContain(`youtube_date: '2025-12-04'`)
	})
})

describe('audio_to_article.read_cli_input', () => {
	it('reads the video argument with no sample overrides', () => {
		expect(audio_to_article.read_cli_input(['abc'])).toEqual({ value: 'abc', rest: [] })
	})

	it('reads the sample overrides that follow the video, target speaker first', () => {
		expect(audio_to_article.read_cli_input(['abc', 'a.opus', 'b.opus'])).toEqual({
			value: 'abc',
			rest: ['a.opus', 'b.opus'],
		})
	})

	it('throws when no argument is given', () => {
		expect(() => audio_to_article.read_cli_input([])).toThrow('Usage')
	})

	it('rejects a third sample path instead of silently dropping it', () => {
		expect(() => audio_to_article.read_cli_input(['abc', 'a.opus', 'b.opus', 'c.opus'])).toThrow(
			'Usage',
		)
	})
})
