import { describe, expect, it } from 'vitest'
import { PROJECT_SLUGS } from './project-slugs'
import { FEATURED_PROJECTS, PROJECTS } from './projects'

const AI_CHAT_TITLE = 'AI Chat'
const MNEMECHA_TITLE = 'Mnemecha'
const KIT_TITLE = '@joshuafolkken/kit'
const GODOT_2D_TITLE = 'Godot 2D Platformer'
const FEATURED_COUNT = 4

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

	it('has AI Chat as the first featured project', () => {
		const [first] = FEATURED_PROJECTS

		expect(first?.title).toBe(AI_CHAT_TITLE)
	})

	it('has Mnemecha as the second featured project', () => {
		const [, second] = FEATURED_PROJECTS

		expect(second?.title).toBe(MNEMECHA_TITLE)
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
