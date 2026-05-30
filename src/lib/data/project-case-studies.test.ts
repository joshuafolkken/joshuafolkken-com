import type { CaseStudy } from '$lib/types/project'
import { content_length } from '$lib/utils/content-length'
import { describe, expect, it } from 'vitest'
import { PROJECT_CASE_STUDIES } from './project-case-studies'
import { PROJECTS } from './projects'

const MIN_WORD_COUNT = 200
const MIN_SECTION_COUNT = 3

function measure_case_study(case_study: CaseStudy): number {
	const body_text = case_study.sections.map((section) => section.body).join(' ')

	return content_length.measure(`${case_study.overview} ${body_text}`)
}

describe('PROJECT_CASE_STUDIES', () => {
	it('has a case study for every project', () => {
		for (const project of PROJECTS) {
			expect(PROJECT_CASE_STUDIES[project.slug]).toBeDefined()
		}
	})

	it('has no case study without a matching project', () => {
		const project_slugs = new Set<string>(PROJECTS.map((project) => project.slug))

		for (const slug of Object.keys(PROJECT_CASE_STUDIES)) {
			expect(project_slugs.has(slug)).toBe(true)
		}
	})

	it('every case study has substantial content (200+ words)', () => {
		for (const [slug, case_study] of Object.entries(PROJECT_CASE_STUDIES)) {
			expect(measure_case_study(case_study), slug).toBeGreaterThanOrEqual(MIN_WORD_COUNT)
		}
	})

	it('every case study has at least three sections with heading and body', () => {
		for (const case_study of Object.values(PROJECT_CASE_STUDIES)) {
			expect(case_study.sections.length).toBeGreaterThanOrEqual(MIN_SECTION_COUNT)

			for (const section of case_study.sections) {
				expect(section.heading.length).toBeGreaterThan(0)
				expect(section.body.length).toBeGreaterThan(0)
			}
		}
	})
})
