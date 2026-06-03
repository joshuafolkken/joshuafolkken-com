import { PROJECT_CASE_STUDIES } from '$lib/data/project-case-studies'
import { PROJECTS } from '$lib/data/projects'
import type { Page } from '$lib/types/page'
import type { CaseStudy, Project } from '$lib/types/project'

const PROJECT_DETAIL_BASE = '/projects'

function get_detail_path(slug: string): string {
	return `${PROJECT_DETAIL_BASE}/${slug}`
}

function get_project_page(project: Project): Page {
	return {
		icon: project.icon,
		title: project.title,
		description: project.subtitle ?? '',
		link: get_detail_path(project.slug),
	}
}

function get_project_by_slug(slug: string): Project | undefined {
	return PROJECTS.find((project) => project.slug === slug)
}

function get_case_study(slug: string): CaseStudy | undefined {
	return PROJECT_CASE_STUDIES[slug]
}

const project_utilities = {
	get_detail_path,
	get_project_page,
	get_project_by_slug,
	get_case_study,
}

export { PROJECT_DETAIL_BASE, project_utilities }
