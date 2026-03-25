import type { Project, ProjectLink } from '$lib/types/project'

const FALLBACK_HREF = '#'

function get_demo_href(project: Project): string | undefined {
	const demo_link = project.links.find((link) => link.type === 'demo')

	return demo_link?.href
}

function get_primary_href(project: Project): string {
	const demo_link = project.links.find((link) => link.type === 'demo')
	if (demo_link?.href) return demo_link.href

	const [first_link] = project.links
	if (first_link?.href) return first_link.href

	return FALLBACK_HREF
}

function get_github_link(project: Project): ProjectLink | undefined {
	return project.links.find((link) => link.type === 'github')
}

const project_utilities = {
	get_demo_href,
	get_github_link,
	get_primary_href,
}

export { project_utilities }
