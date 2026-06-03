import { PAGES, type Page } from '$lib/types/page'
import { PROJECT_DETAIL_BASE, project_utilities } from '$lib/utils/project-utilities'

const PROJECT_DETAIL_PREFIX = `${PROJECT_DETAIL_BASE}/`

function build_path_to_page(): Record<string, Page> {
	const mapping: Record<string, Page> = {}

	for (const page of Object.values(PAGES)) {
		if (page.link?.startsWith('/')) {
			mapping[page.link] = page
		}
	}

	return mapping
}

const PATH_TO_PAGE: Record<string, Page> = build_path_to_page()

function get_project_page_from_path(pathname: string): Page | undefined {
	if (!pathname.startsWith(PROJECT_DETAIL_PREFIX)) return undefined

	const slug = pathname.slice(PROJECT_DETAIL_PREFIX.length)
	const project = project_utilities.get_project_by_slug(slug)

	return project ? project_utilities.get_project_page(project) : undefined
}

function get_page_from_path(pathname: string): Page {
	const fixed_page = PATH_TO_PAGE[pathname]
	if (fixed_page) return fixed_page

	const project_page = get_project_page_from_path(pathname)
	if (project_page) return project_page

	const blog_link = PAGES.BLOG.link
	if (blog_link && pathname.startsWith(`${blog_link}/`)) return PAGES.BLOG

	return PAGES.TOP
}

function get_page_title_from_path(pathname: string): string {
	return get_page_from_path(pathname).title
}

const page_title = {
	get_page_from_path,
	get_page_title_from_path,
}

export { page_title }
