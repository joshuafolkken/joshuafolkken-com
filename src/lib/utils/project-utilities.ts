import type { Project, ProjectLink } from '$lib/types/project'

function get_demo_href(project: Project): string | undefined {
	const demo_link = project.links.find((link) => link.type === 'demo')

	return demo_link?.href
}

function get_secondary_links(project: Project): Array<ProjectLink> {
	return project.links.filter((link) => link.type !== 'demo')
}

const project_utilities = {
	get_demo_href,
	get_secondary_links,
}

export { project_utilities }
