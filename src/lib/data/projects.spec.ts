import { describe, expect, it } from 'vitest'
import { FEATURED_PROJECTS, PROJECTS } from './projects'

const KIT_TITLE = '@joshuafolkken/kit'
const GODOT_2D_TITLE = 'Godot 2D Platformer'
const FEATURED_COUNT = 4

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

describe('PROJECTS - kit entry', () => {
	it('is the first entry', () => {
		const [first] = PROJECTS

		expect(first?.title).toBe(KIT_TITLE)
	})

	it('has blog then github links in order', () => {
		const [kit] = PROJECTS
		const types = kit?.links.map((link) => link.type)

		expect(types).toEqual(expect.arrayContaining(['blog', 'github']))
		expect(types?.[0]).toBe('blog')
		expect(types?.[1]).toBe('github')
	})

	it('has a project image', () => {
		const [kit] = PROJECTS

		expect(kit?.image).toBeDefined()
	})

	it('blog link points to /blog/kit-package', () => {
		const [kit] = PROJECTS
		const blog_link = kit?.links.find((link) => link.type === 'blog')

		expect(blog_link?.href).toBe('/blog/kit-package')
	})

	it('tags include all required tools', () => {
		const [kit] = PROJECTS
		const tags = kit?.tags ?? []

		for (const tag of REQUIRED_KIT_TAGS) {
			expect(tags).toContain(tag)
		}
	})
})

describe('PROJECTS - kit tag ordering', () => {
	it('orders Prettier before ESLint (format → lint convention)', () => {
		const [kit] = PROJECTS
		const tags = kit?.tags ?? []

		expect(tags.indexOf(PRETTIER_TAG)).toBeLessThan(tags.indexOf(ESLINT_TAG))
	})

	it('orders AI Workflow before the individual AI tools', () => {
		const [kit] = PROJECTS
		const tags = kit?.tags ?? []
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

	it('has @joshuafolkken/kit as the first featured project', () => {
		const [first] = FEATURED_PROJECTS

		expect(first?.title).toBe(KIT_TITLE)
	})

	it(`does not include ${GODOT_2D_TITLE} (out of first ${String(FEATURED_COUNT)})`, () => {
		const titles = FEATURED_PROJECTS.map((proj) => proj.title)

		expect(titles).not.toContain(GODOT_2D_TITLE)
	})
})
