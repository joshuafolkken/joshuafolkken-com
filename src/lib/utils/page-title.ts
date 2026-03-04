import { PAGES, type Page } from '$lib/types/page'

const PATH_TO_PAGE: Record<string, Page> = {
	'/': PAGES.TOP,
	'/projects': PAGES.PROJECTS,
	'/profile': PAGES.PROFILE,
	'/blog': PAGES.BLOG,
	'/privacy-policy': PAGES.PRIVACY_POLICY,
}

function get_page_from_path(pathname: string): Page {
	const page = PATH_TO_PAGE[pathname]

	if (page) return page

	if (pathname.startsWith('/blog/')) {
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
