import { describe, expect, it } from 'vitest'
import { FEATURED_PROJECTS, PROJECTS } from './projects'

const MNEMECHA_TITLE = 'Mnemecha'
const KIT_TITLE = '@joshuafolkken/kit'
const GODOT_2D_TITLE = 'Godot 2D Platformer'
const FEATURED_COUNT = 4
const MNEMECHA_DEMO_URL = 'https://mnemecha.joshuafolkken.com'
const KIT_INDEX = 1
const HAS_IMAGE_TEST = 'has a project image'

const PRETTIER_TAG = 'Prettier'
const ESLINT_TAG = 'ESLint'
const AI_WORKFLOW_TAG = 'AI Workflow'
const CLAUDE_CODE_TAG = 'Claude Code'
const CURSOR_TAG = 'Cursor'
const GEMINI_TAG = 'Gemini'

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
	'Cloudflare Workers',
	CLAUDE_CODE_TAG,
	CURSOR_TAG,
	GEMINI_TAG,
	AI_WORKFLOW_TAG,
]

describe('PROJECTS - mnemecha entry', () => {
	it('is the first entry', () => {
		const [mnemecha] = PROJECTS

		expect(mnemecha.title).toBe(MNEMECHA_TITLE)
	})

	it('has demo then github links in order', () => {
		const [mnemecha] = PROJECTS
		const types = mnemecha.links.map((link) => link.type)

		expect(types[0]).toBe('demo')
		expect(types[1]).toBe('github')
	})

	it('demo link points to mnemecha.joshuafolkken.com', () => {
		const [mnemecha] = PROJECTS
		const [demo_link] = mnemecha.links

		expect(demo_link.href).toBe(MNEMECHA_DEMO_URL)
	})

	it(HAS_IMAGE_TEST, () => {
		const [mnemecha] = PROJECTS

		expect(mnemecha.image).toBeDefined()
	})

	it('has SvelteKit and Threlte tags', () => {
		const [mnemecha] = PROJECTS

		expect(mnemecha.tags).toContain('SvelteKit')
		expect(mnemecha.tags).toContain('Threlte')
	})

	it('has Claude Code tag', () => {
		const [mnemecha] = PROJECTS

		expect(mnemecha.tags).toContain(CLAUDE_CODE_TAG)
	})

	it('description references the Simon format, not the unrelated Simon Says verbal game', () => {
		const [mnemecha] = PROJECTS

		expect(mnemecha.description).toContain('Simon format')
		expect(mnemecha.description).not.toContain('Simon Says')
	})
})

describe('PROJECTS - kit entry', () => {
	it('is the second entry', () => {
		const kit = PROJECTS[KIT_INDEX]

		expect(kit.title).toBe(KIT_TITLE)
	})

	it('has blog then github links in order', () => {
		const kit = PROJECTS[KIT_INDEX]
		const types = kit.links.map((link) => link.type)

		expect(types).toEqual(expect.arrayContaining(['blog', 'github']))
		expect(types[0]).toBe('blog')
		expect(types[1]).toBe('github')
	})

	it(HAS_IMAGE_TEST, () => {
		const kit = PROJECTS[KIT_INDEX]

		expect(kit.image).toBeDefined()
	})

	it('blog link points to /blog/kit-package', () => {
		const kit = PROJECTS[KIT_INDEX]
		const [blog_link] = kit.links

		expect(blog_link.href).toBe('/blog/kit-package')
	})

	it('tags include all required tools', () => {
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

describe('PROJECTS - general', () => {
	it(`includes ${GODOT_2D_TITLE}`, () => {
		const titles = PROJECTS.map((proj) => proj.title)

		expect(titles).toContain(GODOT_2D_TITLE)
	})
})

describe('FEATURED_PROJECTS', () => {
	it(`contains exactly ${String(FEATURED_COUNT)} projects`, () => {
		expect(FEATURED_PROJECTS).toHaveLength(FEATURED_COUNT)
	})

	it('has Mnemecha as the first featured project', () => {
		const [first] = FEATURED_PROJECTS

		expect(first?.title).toBe(MNEMECHA_TITLE)
	})

	it('has @joshuafolkken/kit as the second featured project', () => {
		const [, second] = FEATURED_PROJECTS

		expect(second?.title).toBe(KIT_TITLE)
	})

	it(`does not include ${GODOT_2D_TITLE} (out of first ${String(FEATURED_COUNT)})`, () => {
		const titles = FEATURED_PROJECTS.map((proj) => proj.title)

		expect(titles).not.toContain(GODOT_2D_TITLE)
	})
})
