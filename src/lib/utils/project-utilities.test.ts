import type { Project, ProjectLink } from '$lib/types/project'
import { describe, expect, it } from 'vitest'
import { project_utilities } from './project-utilities'

const GITHUB_HREF = 'https://github.com/example'
const DEMO_HREF = 'https://example.com/demo'
const DEMO_HREF_SHORT = 'https://example.com'
const NPM_HREF = 'https://npmjs.com/example'

function make_link(type: ProjectLink['type'], href: string): ProjectLink {
	return { type, href }
}

function make_project(links: Array<ProjectLink>): Project {
	return { title: 'Test', description: 'Test', links } as unknown as Project
}

describe('project_utilities.get_demo_href', () => {
	it('returns the href of the demo link when one exists', () => {
		const project = make_project([make_link('demo', DEMO_HREF), make_link('github', GITHUB_HREF)])

		expect(project_utilities.get_demo_href(project)).toBe(DEMO_HREF)
	})

	it('returns undefined when no demo link exists', () => {
		const project = make_project([make_link('github', GITHUB_HREF)])

		expect(project_utilities.get_demo_href(project)).toBeUndefined()
	})

	it('returns undefined when links array is empty', () => {
		expect(project_utilities.get_demo_href(make_project([]))).toBeUndefined()
	})
})

describe('project_utilities.get_secondary_links', () => {
	it('returns all non-demo links', () => {
		const github = make_link('github', GITHUB_HREF)
		const npm = make_link('npm', NPM_HREF)
		const project = make_project([make_link('demo', DEMO_HREF_SHORT), github, npm])

		expect(project_utilities.get_secondary_links(project)).toEqual([github, npm])
	})

	it('returns all links when there is no demo link', () => {
		const github = make_link('github', GITHUB_HREF)
		const project = make_project([github])

		expect(project_utilities.get_secondary_links(project)).toEqual([github])
	})

	it('returns an empty array when all links are demo links', () => {
		const project = make_project([make_link('demo', DEMO_HREF_SHORT)])

		expect(project_utilities.get_secondary_links(project)).toEqual([])
	})

	it('returns an empty array when links array is empty', () => {
		expect(project_utilities.get_secondary_links(make_project([]))).toEqual([])
	})
})
