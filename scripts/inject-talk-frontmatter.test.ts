import { describe, expect, it } from 'vitest'
import { talk_frontmatter } from './inject-talk-frontmatter'

const VIDEO_ID = 'testVideo12'
const WATCH_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`
const UPLOAD_DATE_RAW = '20250514'
const YOUTUBE_DATE = '2025-05-14'
const ARTICLE_DATE = '2026-07-07'
const VIDEO_TITLE = '#Division2'
const TITLE_WITH_QUOTE = "Josh's talk"
const TITLE_WITH_QUOTE_ESCAPED = "Josh''s talk"
const INFO_JSON = JSON.stringify({
	id: VIDEO_ID,
	upload_date: UPLOAD_DATE_RAW,
	title: VIDEO_TITLE,
	uploader: 'Joshua Folkken',
	duration: 7200,
})

const FRONTMATTER = `---
title: 'Sample talk title'
date: '{{PUBLISH_DATE}}'
author: 'Joshua Folkken'
excerpt: 'A faithful summary of the talk.'
tags: ['from-talk', 'Division 2']
youtube: '{{YOUTUBE_URL}}'
youtube_date: '{{YOUTUBE_DATE}}'
youtube_title: '{{YOUTUBE_TITLE}}'
---

Body stays untouched.`

const VALUES = {
	article_date: ARTICLE_DATE,
	youtube_date: YOUTUBE_DATE,
	youtube_url: WATCH_URL,
	youtube_title: VIDEO_TITLE,
}

describe('talk_frontmatter.parse_info_json', () => {
	it('extracts id, upload_date, and title from a yt-dlp info.json payload', () => {
		expect(talk_frontmatter.parse_info_json(INFO_JSON)).toEqual({
			video_id: VIDEO_ID,
			upload_date: UPLOAD_DATE_RAW,
			video_title: VIDEO_TITLE,
		})
	})

	it('throws when id is missing', () => {
		expect(() =>
			talk_frontmatter.parse_info_json(`{"upload_date":"${UPLOAD_DATE_RAW}","title":"x"}`),
		).toThrow()
	})

	it('throws when upload_date is missing', () => {
		expect(() => talk_frontmatter.parse_info_json(`{"id":"${VIDEO_ID}","title":"x"}`)).toThrow()
	})

	it('throws when title is missing', () => {
		expect(() =>
			talk_frontmatter.parse_info_json(`{"id":"${VIDEO_ID}","upload_date":"${UPLOAD_DATE_RAW}"}`),
		).toThrow()
	})
})

describe('talk_frontmatter.escape_yaml_single_quoted', () => {
	it('doubles single quotes so the value stays a valid YAML single-quoted scalar', () => {
		expect(talk_frontmatter.escape_yaml_single_quoted(TITLE_WITH_QUOTE)).toBe(
			TITLE_WITH_QUOTE_ESCAPED,
		)
	})

	it('leaves a quote-free value untouched', () => {
		expect(talk_frontmatter.escape_yaml_single_quoted(VIDEO_TITLE)).toBe(VIDEO_TITLE)
	})
})

describe('talk_frontmatter.format_upload_date', () => {
	it('formats YYYYMMDD as YYYY-MM-DD', () => {
		expect(talk_frontmatter.format_upload_date(UPLOAD_DATE_RAW)).toBe(YOUTUBE_DATE)
	})

	it('throws on an already-formatted or malformed value', () => {
		expect(() => talk_frontmatter.format_upload_date(YOUTUBE_DATE)).toThrow()
		expect(() => talk_frontmatter.format_upload_date('2025051')).toThrow()
	})
})

describe('talk_frontmatter.format_generated_date', () => {
	it('formats a Date as YYYY-MM-DD with zero padding', () => {
		expect(talk_frontmatter.format_generated_date(new Date(2026, 6, 7))).toBe(ARTICLE_DATE)
	})
})

describe('talk_frontmatter.build_youtube_url', () => {
	it('builds a watch URL from a video id', () => {
		expect(talk_frontmatter.build_youtube_url(VIDEO_ID)).toBe(WATCH_URL)
	})

	it('throws on an empty id', () => {
		expect(() => talk_frontmatter.build_youtube_url('')).toThrow()
	})
})

describe('talk_frontmatter.resolve_video_id', () => {
	it('passes through a bare 11-character id', () => {
		expect(talk_frontmatter.resolve_video_id(VIDEO_ID)).toBe(VIDEO_ID)
	})

	it('extracts an id from a watch URL', () => {
		expect(talk_frontmatter.resolve_video_id(WATCH_URL)).toBe(VIDEO_ID)
	})

	it('extracts an id from a youtu.be share URL', () => {
		expect(talk_frontmatter.resolve_video_id(`https://youtu.be/${VIDEO_ID}`)).toBe(VIDEO_ID)
	})

	it('throws on a non-YouTube URL', () => {
		expect(() => talk_frontmatter.resolve_video_id('https://example.com/video')).toThrow()
	})
})

const ARTICLE_FILENAME = 'talk-2026-01-22.md'
const POSTS_RELATIVE_PATH = `src/lib/posts/${ARTICLE_FILENAME}`
const ABSOLUTE_PATH = `/home/user/${ARTICLE_FILENAME}`

describe('talk_frontmatter.resolve_article_path', () => {
	it('resolves a bare filename under the posts directory', () => {
		expect(talk_frontmatter.resolve_article_path(ARTICLE_FILENAME)).toBe(POSTS_RELATIVE_PATH)
	})

	it('passes through an explicit relative path unchanged', () => {
		expect(talk_frontmatter.resolve_article_path(POSTS_RELATIVE_PATH)).toBe(POSTS_RELATIVE_PATH)
	})

	it('passes through an absolute path unchanged', () => {
		expect(talk_frontmatter.resolve_article_path(ABSOLUTE_PATH)).toBe(ABSOLUTE_PATH)
	})
})

describe('talk_frontmatter.inject_frontmatter_metadata', () => {
	it('replaces the four {{...}} placeholders with real values', () => {
		const result = talk_frontmatter.inject_frontmatter_metadata(FRONTMATTER, VALUES)

		expect(result).toContain(`date: '${ARTICLE_DATE}'`)
		expect(result).toContain(`youtube: '${WATCH_URL}'`)
		expect(result).toContain(`youtube_date: '${YOUTUBE_DATE}'`)
		expect(result).toContain(`youtube_title: '${VIDEO_TITLE}'`)
	})

	it('leaves title, excerpt, and tags untouched', () => {
		const result = talk_frontmatter.inject_frontmatter_metadata(FRONTMATTER, VALUES)

		expect(result).toContain(`title: 'Sample talk title'`)
		expect(result).toContain(`excerpt: 'A faithful summary of the talk.'`)
		expect(result).toContain(`tags: ['from-talk', 'Division 2']`)
		expect(result).toContain('Body stays untouched.')
	})

	it('resolves the Markdown-bold __X__ and **X** variants a stray conversion emits', () => {
		const mangled = `date: '__PUBLISH_DATE__'\nyoutube_date: '**YOUTUBE_DATE**'\nyoutube: '{{YOUTUBE_URL}}'`
		const result = talk_frontmatter.inject_frontmatter_metadata(mangled, VALUES)

		expect(result).toBe(
			`date: '${ARTICLE_DATE}'\nyoutube_date: '${YOUTUBE_DATE}'\nyoutube: '${WATCH_URL}'`,
		)
	})

	it('leaves no placeholder token unresolved', () => {
		const result = talk_frontmatter.inject_frontmatter_metadata(FRONTMATTER, VALUES)

		expect(result).not.toMatch(/PUBLISH_DATE|YOUTUBE_DATE|YOUTUBE_URL|YOUTUBE_TITLE/u)
	})
})

describe('talk_frontmatter.build_values', () => {
	it('maps the run date to article_date and the upload date to youtube_date', () => {
		const metadata = { video_id: VIDEO_ID, upload_date: UPLOAD_DATE_RAW, video_title: VIDEO_TITLE }

		expect(talk_frontmatter.build_values(metadata, new Date(2026, 6, 7))).toEqual({
			article_date: ARTICLE_DATE,
			youtube_date: YOUTUBE_DATE,
			youtube_url: WATCH_URL,
			youtube_title: VIDEO_TITLE,
		})
	})

	it('escapes single quotes in the video title for the YAML scalar', () => {
		const metadata = {
			video_id: VIDEO_ID,
			upload_date: UPLOAD_DATE_RAW,
			video_title: TITLE_WITH_QUOTE,
		}

		expect(talk_frontmatter.build_values(metadata, new Date(2026, 6, 7)).youtube_title).toBe(
			TITLE_WITH_QUOTE_ESCAPED,
		)
	})
})
