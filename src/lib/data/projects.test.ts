import { describe, expect, it } from 'vitest'
import { PROJECTS } from './projects'

const AI_CHAT_TITLE = 'AI Chat'
const MNEMECHA_TITLE = 'Mnemecha'
const GAME_KIT_TITLE = '@joshuafolkken/game-kit'
const KIT_TITLE = '@joshuafolkken/kit'
const MNEMECHA_DEMO_URL = 'https://mnemecha.joshuafolkken.com'
const MNEMECHA_INDEX = 1
const GAME_KIT_INDEX = 2
const KIT_INDEX = 3
const GAME_KIT_GITHUB_URL = 'https://github.com/joshuafolkken/game-kit'
const GAME_KIT_BLOG_URL = '/blog/mnemecha-2'
const IMAGE_TEST_TITLE = 'has a project image'
const REQUIRED_TAGS_TEST_TITLE = 'tags include all required tools'
const BLOG_GITHUB_LINKS_TEST_TITLE = 'has blog then github links in order'

const PRETTIER_TAG = 'Prettier'
const ESLINT_TAG = 'ESLint'
const AI_WORKFLOW_TAG = 'AI Workflow'
const CLAUDE_CODE_TAG = 'Claude Code'
const CURSOR_TAG = 'Cursor'
const GEMINI_TAG = 'Gemini'
const CLOUDFLARE_WORKERS_TAG = 'Cloudflare Workers'

const REQUIRED_AI_CHAT_TAGS = [
	'SvelteKit',
	'TypeScript',
	CLOUDFLARE_WORKERS_TAG,
	'Cloudflare Workers AI',
	'Cloudflare AI Search',
	'RAG',
	CLAUDE_CODE_TAG,
	GEMINI_TAG,
]

const REQUIRED_GAME_KIT_TAGS = [
	'TypeScript',
	'Node.js',
	'SvelteKit',
	'Three.js',
	'Threlte',
	'pnpm',
	CLOUDFLARE_WORKERS_TAG,
	'CLI',
	CLAUDE_CODE_TAG,
]

const REQUIRED_KIT_TAGS = [
	'TypeScript',
	'Node.js',
	'SvelteKit',
	'pnpm',
	ESLINT_TAG,
	PRETTIER_TAG,
	'CSpell',
	'Vitest',
	'Playwright',
	'Lefthook',
	'GitHub',
	'GitHub Actions',
	'SonarQube Cloud',
	'CodeRabbit',
	CLOUDFLARE_WORKERS_TAG,
	CLAUDE_CODE_TAG,
	CURSOR_TAG,
	GEMINI_TAG,
	AI_WORKFLOW_TAG,
]

describe('PROJECTS - ai-chat entry', () => {
	it('is the first entry (newest project)', () => {
		const [ai_chat] = PROJECTS

		expect(ai_chat.title).toBe(AI_CHAT_TITLE)
	})

	it('has the ai-chat slug', () => {
		const [ai_chat] = PROJECTS

		expect(ai_chat.slug).toBe('ai-chat')
	})

	it('has demo, blog, github links in order', () => {
		const [ai_chat] = PROJECTS
		const types = ai_chat.links.map((link) => link.type)

		expect(types).toEqual(['demo', 'blog', 'github'])
	})

	it('demo link points to the on-site /chat page', () => {
		const [ai_chat] = PROJECTS
		const demo_link = ai_chat.links.find((link) => link.type === 'demo')

		expect(demo_link?.href).toBe('/chat')
	})

	it('blog link points to /blog/ai-chat', () => {
		const [ai_chat] = PROJECTS
		const blog_link = ai_chat.links.find((link) => link.type === 'blog')

		expect(blog_link?.href).toBe('/blog/ai-chat')
	})
})

describe('PROJECTS - ai-chat entry: content', () => {
	it(IMAGE_TEST_TITLE, () => {
		const [ai_chat] = PROJECTS

		expect(ai_chat.image).toBeDefined()
	})

	it('tags include the core RAG stack', () => {
		const [ai_chat] = PROJECTS

		for (const tag of REQUIRED_AI_CHAT_TAGS) {
			expect(ai_chat.tags).toContain(tag)
		}
	})

	it('description mentions retrieval-augmented grounding', () => {
		const [ai_chat] = PROJECTS

		expect(ai_chat.description).toContain('retrieval-augmented')
	})
})

describe('PROJECTS - mnemecha entry', () => {
	it('is the second entry, directly after AI Chat', () => {
		const mnemecha = PROJECTS[MNEMECHA_INDEX]

		expect(mnemecha.title).toBe(MNEMECHA_TITLE)
	})

	it('has play, blog, github links in order', () => {
		const mnemecha = PROJECTS[MNEMECHA_INDEX]
		const types = mnemecha.links.map((link) => link.type)

		expect(types[0]).toBe('play')
		expect(types[1]).toBe('blog')
		expect(types[2]).toBe('github')
	})

	it('play link points to mnemecha.joshuafolkken.com', () => {
		const mnemecha = PROJECTS[MNEMECHA_INDEX]
		const [play_link] = mnemecha.links

		expect(play_link.href).toBe(MNEMECHA_DEMO_URL)
	})

	it('blog link points to /blog/mnemecha', () => {
		const mnemecha = PROJECTS[MNEMECHA_INDEX]
		const blog_link = mnemecha.links.find((link) => link.type === 'blog')

		expect(blog_link?.href).toBe('/blog/mnemecha')
	})
})

describe('PROJECTS - mnemecha entry: content', () => {
	it(IMAGE_TEST_TITLE, () => {
		const mnemecha = PROJECTS[MNEMECHA_INDEX]

		expect(mnemecha.image).toBeDefined()
	})

	it('has SvelteKit and Threlte tags', () => {
		const mnemecha = PROJECTS[MNEMECHA_INDEX]

		expect(mnemecha.tags).toContain('SvelteKit')
		expect(mnemecha.tags).toContain('Threlte')
	})

	it('has Claude Code tag', () => {
		const mnemecha = PROJECTS[MNEMECHA_INDEX]

		expect(mnemecha.tags).toContain(CLAUDE_CODE_TAG)
	})

	it('description references the Simon format, not the unrelated Simon Says verbal game', () => {
		const mnemecha = PROJECTS[MNEMECHA_INDEX]

		expect(mnemecha.description).toContain('Simon format')
		expect(mnemecha.description).not.toContain('Simon Says')
	})
})

describe('PROJECTS - game-kit entry', () => {
	it('is the third entry (after AI Chat and Mnemecha)', () => {
		const game_kit = PROJECTS[GAME_KIT_INDEX]

		expect(game_kit.title).toBe(GAME_KIT_TITLE)
	})

	it(BLOG_GITHUB_LINKS_TEST_TITLE, () => {
		const game_kit = PROJECTS[GAME_KIT_INDEX]
		const types = game_kit.links.map((link) => link.type)

		expect(types).toEqual(['blog', 'github'])
	})

	it(`blog link points to ${GAME_KIT_BLOG_URL}`, () => {
		const game_kit = PROJECTS[GAME_KIT_INDEX]
		const blog_link = game_kit.links.find((link) => link.type === 'blog')

		expect(blog_link?.href).toBe(GAME_KIT_BLOG_URL)
	})

	it(`github link points to ${GAME_KIT_GITHUB_URL}`, () => {
		const game_kit = PROJECTS[GAME_KIT_INDEX]
		const github_link = game_kit.links.find((link) => link.type === 'github')

		expect(github_link?.href).toBe(GAME_KIT_GITHUB_URL)
	})
})

describe('PROJECTS - game-kit entry: content', () => {
	it(IMAGE_TEST_TITLE, () => {
		const game_kit = PROJECTS[GAME_KIT_INDEX]

		expect(game_kit.image).toBeDefined()
	})

	it('uses a dedicated image (not the Mnemecha image)', () => {
		const mnemecha = PROJECTS[MNEMECHA_INDEX]
		const game_kit = PROJECTS[GAME_KIT_INDEX]

		expect(game_kit.image).not.toBe(mnemecha.image)
	})

	it(REQUIRED_TAGS_TEST_TITLE, () => {
		const game_kit = PROJECTS[GAME_KIT_INDEX]

		for (const tag of REQUIRED_GAME_KIT_TAGS) {
			expect(game_kit.tags).toContain(tag)
		}
	})

	it('description mentions the jgame CLI', () => {
		const game_kit = PROJECTS[GAME_KIT_INDEX]

		expect(game_kit.description).toContain('jgame')
	})
})

describe('PROJECTS - kit entry', () => {
	it('is the fourth entry (after AI Chat, Mnemecha, and game-kit)', () => {
		const kit = PROJECTS[KIT_INDEX]

		expect(kit.title).toBe(KIT_TITLE)
	})

	it(BLOG_GITHUB_LINKS_TEST_TITLE, () => {
		const kit = PROJECTS[KIT_INDEX]
		const types = kit.links.map((link) => link.type)

		expect(types).toEqual(expect.arrayContaining(['blog', 'github']))
		expect(types[0]).toBe('blog')
		expect(types[1]).toBe('github')
	})

	it(IMAGE_TEST_TITLE, () => {
		const kit = PROJECTS[KIT_INDEX]

		expect(kit.image).toBeDefined()
	})

	it('blog link points to /blog/kit-package', () => {
		const kit = PROJECTS[KIT_INDEX]
		const [blog_link] = kit.links

		expect(blog_link.href).toBe('/blog/kit-package')
	})

	it(REQUIRED_TAGS_TEST_TITLE, () => {
		const kit = PROJECTS[KIT_INDEX]

		for (const tag of REQUIRED_KIT_TAGS) {
			expect(kit.tags).toContain(tag)
		}
	})
})

describe('PROJECTS - kit tag ordering', () => {
	it('orders Prettier before ESLint (format → lint convention)', () => {
		const kit = PROJECTS[KIT_INDEX]
		const tags = [...kit.tags]

		expect(tags.indexOf(PRETTIER_TAG)).toBeLessThan(tags.indexOf(ESLINT_TAG))
	})

	it('orders AI Workflow before the individual AI tools', () => {
		const kit = PROJECTS[KIT_INDEX]
		const tags = [...kit.tags]
		const ai_workflow_index = tags.indexOf(AI_WORKFLOW_TAG)

		expect(ai_workflow_index).toBeLessThan(tags.indexOf(CLAUDE_CODE_TAG))
		expect(ai_workflow_index).toBeLessThan(tags.indexOf(CURSOR_TAG))
		expect(ai_workflow_index).toBeLessThan(tags.indexOf(GEMINI_TAG))
	})
})
