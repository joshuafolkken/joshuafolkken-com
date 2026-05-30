import { describe, expect, it } from 'vitest'
import { PROJECT_SLUGS } from './project-slugs'
import { FEATURED_PROJECTS, PROJECTS } from './projects'

const MNEMECHA_TITLE = 'Mnemecha'
const GAME_KIT_TITLE = '@joshuafolkken/game-kit'
const KIT_TITLE = '@joshuafolkken/kit'
const GODOT_2D_TITLE = 'Godot 2D Platformer'
const FEATURED_COUNT = 4
const MNEMECHA_DEMO_URL = 'https://mnemecha.joshuafolkken.com'
const GAME_KIT_INDEX = 1
const KIT_INDEX = 2
const GAME_KIT_GITHUB_URL = 'https://github.com/joshuafolkken/game-kit'
const GAME_KIT_BLOG_URL = '/blog/mnemecha-2'
const HAS_IMAGE_TEST = 'has a project image'
const HAS_REQUIRED_TAGS_TEST = 'tags include all required tools'
const HAS_BLOG_GITHUB_LINKS_TEST = 'has blog then github links in order'

const PRETTIER_TAG = 'Prettier'
const ESLINT_TAG = 'ESLint'
const AI_WORKFLOW_TAG = 'AI Workflow'
const CLAUDE_CODE_TAG = 'Claude Code'
const CURSOR_TAG = 'Cursor'
const GEMINI_TAG = 'Gemini'
const CLOUDFLARE_WORKERS_TAG = 'Cloudflare Workers'

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

describe('PROJECTS - mnemecha entry', () => {
	it('is the first entry', () => {
		const [mnemecha] = PROJECTS

		expect(mnemecha.title).toBe(MNEMECHA_TITLE)
	})

	it('has play, blog, github links in order', () => {
		const [mnemecha] = PROJECTS
		const types = mnemecha.links.map((link) => link.type)

		expect(types[0]).toBe('play')
		expect(types[1]).toBe('blog')
		expect(types[2]).toBe('github')
	})

	it('play link points to mnemecha.joshuafolkken.com', () => {
		const [mnemecha] = PROJECTS
		const [play_link] = mnemecha.links

		expect(play_link.href).toBe(MNEMECHA_DEMO_URL)
	})

	it('blog link points to /blog/mnemecha', () => {
		const [mnemecha] = PROJECTS
		const blog_link = mnemecha.links.find((link) => link.type === 'blog')

		expect(blog_link?.href).toBe('/blog/mnemecha')
	})
})

describe('PROJECTS - mnemecha entry: content', () => {
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

describe('PROJECTS - game-kit entry', () => {
	it('is the second entry (directly after Mnemecha)', () => {
		const game_kit = PROJECTS[GAME_KIT_INDEX]

		expect(game_kit.title).toBe(GAME_KIT_TITLE)
	})

	it(HAS_BLOG_GITHUB_LINKS_TEST, () => {
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
	it(HAS_IMAGE_TEST, () => {
		const game_kit = PROJECTS[GAME_KIT_INDEX]

		expect(game_kit.image).toBeDefined()
	})

	it('uses a dedicated image (not the Mnemecha image)', () => {
		const [mnemecha] = PROJECTS
		const game_kit = PROJECTS[GAME_KIT_INDEX]

		expect(game_kit.image).not.toBe(mnemecha.image)
	})

	it(HAS_REQUIRED_TAGS_TEST, () => {
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
	it('is the third entry', () => {
		const kit = PROJECTS[KIT_INDEX]

		expect(kit.title).toBe(KIT_TITLE)
	})

	it(HAS_BLOG_GITHUB_LINKS_TEST, () => {
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

	it(HAS_REQUIRED_TAGS_TEST, () => {
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

describe('PROJECTS - slugs', () => {
	const KEBAB_CASE_PATTERN = /^[a-z\d]+(?:-[a-z\d]+)*$/u

	it('every project has a non-empty slug', () => {
		for (const project of PROJECTS) {
			expect(project.slug.length).toBeGreaterThan(0)
		}
	})

	it('every slug is kebab-case', () => {
		for (const project of PROJECTS) {
			expect(project.slug).toMatch(KEBAB_CASE_PATTERN)
		}
	})

	it('all slugs are unique', () => {
		const slugs = PROJECTS.map((project) => project.slug)

		expect(new Set(slugs).size).toBe(slugs.length)
	})

	it('matches the shared PROJECT_SLUGS list (single source for tests)', () => {
		expect(PROJECTS.map((project) => project.slug)).toEqual([...PROJECT_SLUGS])
	})
})

function find_project(slug: string): (typeof PROJECTS)[number] {
	const project = PROJECTS.find((candidate) => candidate.slug === slug)
	if (!project) throw new Error(`missing project: ${slug}`)

	return project
}

describe('PROJECTS - playable vs demo link types', () => {
	const PLAY_SLUGS = ['mnemecha', 'talk', 'godot-2d-platformer', 'tic-tac-toe', 'pong']
	const DEMO_SLUGS = ['tasks', 'godot-project-template']

	it('game projects expose a play link, never a demo link', () => {
		for (const slug of PLAY_SLUGS) {
			const types = find_project(slug).links.map((link) => link.type)

			expect(types, slug).toContain('play')
			expect(types, slug).not.toContain('demo')
		}
	})

	it('non-game live links stay as demo (apps and templates)', () => {
		for (const slug of DEMO_SLUGS) {
			const types = find_project(slug).links.map((link) => link.type)

			expect(types, slug).toContain('demo')
			expect(types, slug).not.toContain('play')
		}
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

	it(`has ${GAME_KIT_TITLE} as the second featured project`, () => {
		const [, second] = FEATURED_PROJECTS

		expect(second?.title).toBe(GAME_KIT_TITLE)
	})

	it(`still includes ${KIT_TITLE} in the featured set`, () => {
		const titles = FEATURED_PROJECTS.map((proj) => proj.title)

		expect(titles).toContain(KIT_TITLE)
	})

	it(`does not include ${GODOT_2D_TITLE} (out of first ${String(FEATURED_COUNT)})`, () => {
		const titles = FEATURED_PROJECTS.map((proj) => proj.title)

		expect(titles).not.toContain(GODOT_2D_TITLE)
	})
})
