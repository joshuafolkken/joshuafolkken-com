import { describe, expect, it } from 'vitest'
import { ALL_ICONS } from './si-icons'
import { TECH_LOGO_MAP } from './tech-logo-map'

const AI_WORKFLOW_NAME = 'AI Workflow'

const KIT_PROJECT_TAGS = [
	'TypeScript',
	'Node.js',
	'SvelteKit',
	'pnpm',
	'ESLint',
	'Prettier',
	'CSpell',
	'Vitest',
	'Playwright',
	'Lefthook',
	'GitHub',
	'GitHub Actions',
	'SonarQube Cloud',
	'CodeRabbit',
	'Cloudflare Workers',
	'Claude Code',
	'Cursor',
	'Gemini',
	AI_WORKFLOW_NAME,
]

const SKILL_NAMES = [
	'Teaching & Mentoring',
	'SvelteKit',
	'TypeScript',
	'Cloudflare Workers / D1 / KV / R2',
	'UI / UX Design',
	'Godot / GDScript',
	'Tailwind CSS',
	'Drizzle ORM',
	'WebSocket',
	'Community Building',
	'Rust',
	'Game Design',
]

const AI_WORKFLOW_SLUG = 'claude'

describe('TECH_LOGO_MAP - Kit project tags', () => {
	it.each(KIT_PROJECT_TAGS)('resolves tag %s to a non-empty slug', (tag) => {
		const slug = TECH_LOGO_MAP.get(tag)

		expect(slug, `expected ${tag} to have a logo slug`).toBeDefined()
		expect(slug?.length ?? 0).toBeGreaterThan(0)
	})

	it.each(KIT_PROJECT_TAGS)('resolved slug for %s exists in ALL_ICONS', (tag) => {
		const slug = TECH_LOGO_MAP.get(tag)

		expect(slug).toBeDefined()
		expect(ALL_ICONS.has(slug as string)).toBe(true)
	})

	it(`maps ${AI_WORKFLOW_NAME} to the Claude icon`, () => {
		expect(TECH_LOGO_MAP.get(AI_WORKFLOW_NAME)).toBe(AI_WORKFLOW_SLUG)
	})
})

describe('TECH_LOGO_MAP - legacy name removal', () => {
	it('does not expose the legacy "SonarCloud" key (unified to SonarQube Cloud)', () => {
		expect(TECH_LOGO_MAP.has('SonarCloud')).toBe(false)
	})
})

describe('TECH_LOGO_MAP - Skills section names', () => {
	it.each(SKILL_NAMES)('resolves skill %s to a non-empty slug', (name) => {
		const slug = TECH_LOGO_MAP.get(name)

		expect(slug, `expected ${name} to have a logo slug`).toBeDefined()
		expect(slug?.length ?? 0).toBeGreaterThan(0)
	})
})

describe('ALL_ICONS - newly added icons', () => {
	const NEW_ICON_SLUGS = ['githubactions', 'googlegemini', 'cspell']

	it.each(NEW_ICON_SLUGS)('has icon for slug %s', (slug) => {
		expect(ALL_ICONS.has(slug)).toBe(true)
	})
})
