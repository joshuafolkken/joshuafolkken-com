import { PAGES, type Page } from '$lib/types/page'

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

function get_page_from_path(pathname: string): Page {
	const fixed_page = PATH_TO_PAGE[pathname]
	if (fixed_page) return fixed_page

	const blog_link = PAGES.BLOG.link

	if (blog_link && pathname.startsWith(`${blog_link}/`)) {
		return PAGES.BLOG
	}

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
