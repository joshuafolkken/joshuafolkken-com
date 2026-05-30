import { PROJECTS } from '$lib/data/projects'
import { describe, expect, it } from 'vitest'
import { PROJECT_DETAIL_BASE, project_utilities } from './project-utilities'

const KNOWN_SLUG = 'mnemecha'
const UNKNOWN_SLUG = 'does-not-exist'
const UNKNOWN_SLUG_TEST = 'returns undefined for an unknown slug'

describe('project_utilities.get_detail_path', () => {
	it('builds the detail path under the projects base', () => {
		expect(project_utilities.get_detail_path(KNOWN_SLUG)).toBe(
			`${PROJECT_DETAIL_BASE}/${KNOWN_SLUG}`,
		)
	})

	it('returns a path for every project slug', () => {
		for (const project of PROJECTS) {
			expect(project_utilities.get_detail_path(project.slug)).toBe(
				`${PROJECT_DETAIL_BASE}/${project.slug}`,
			)
		}
	})
})

describe('project_utilities.get_project_by_slug', () => {
	it('returns the matching project for a known slug', () => {
		const project = project_utilities.get_project_by_slug(KNOWN_SLUG)

		expect(project?.slug).toBe(KNOWN_SLUG)
	})

	it(UNKNOWN_SLUG_TEST, () => {
		expect(project_utilities.get_project_by_slug(UNKNOWN_SLUG)).toBeUndefined()
	})
})

describe('project_utilities.get_case_study', () => {
	it('returns a case study for every project slug', () => {
		for (const project of PROJECTS) {
			expect(project_utilities.get_case_study(project.slug)).toBeDefined()
		}
	})

	it(UNKNOWN_SLUG_TEST, () => {
		expect(project_utilities.get_case_study(UNKNOWN_SLUG)).toBeUndefined()
	})
})
