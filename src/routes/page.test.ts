import { PAGES } from '$lib/types/page'
import { page_title } from '$lib/utils/page-title'
import { describe, expect, it } from 'vitest'

const MNEMECHA_DETAIL_PATH = '/projects/mnemecha'

describe('page_title.get_page_from_path', () => {
	it('returns TOP page for root path', () => {
		expect(page_title.get_page_from_path('/')).toBe(PAGES.TOP)
	})

	it('returns ABOUT page for /about', () => {
		expect(page_title.get_page_from_path('/about')).toBe(PAGES.ABOUT)
	})

	it('returns BLOG page for /blog', () => {
		expect(page_title.get_page_from_path('/blog')).toBe(PAGES.BLOG)
	})

	it('returns BLOG page for /blog/:slug paths', () => {
		expect(page_title.get_page_from_path('/blog/some-post')).toBe(PAGES.BLOG)
		expect(page_title.get_page_from_path('/blog/kit-package')).toBe(PAGES.BLOG)
	})

	it('returns TOP page for unknown paths', () => {
		expect(page_title.get_page_from_path('/unknown-route')).toBe(PAGES.TOP)
	})

	it('returns the projects index page for /projects', () => {
		expect(page_title.get_page_from_path('/projects')).toBe(PAGES.PROJECTS)
	})

	it('returns the project own title for a project detail path', () => {
		const page = page_title.get_page_from_path(MNEMECHA_DETAIL_PATH)

		expect(page.title).toBe('Mnemecha')
		expect(page.link).toBe(MNEMECHA_DETAIL_PATH)
	})

	it('returns TOP page for an unknown project slug', () => {
		expect(page_title.get_page_from_path('/projects/does-not-exist')).toBe(PAGES.TOP)
	})
})

describe('page_title.get_page_title_from_path', () => {
	it('returns the title for known paths', () => {
		expect(page_title.get_page_title_from_path('/about')).toBe(PAGES.ABOUT.title)
		expect(page_title.get_page_title_from_path('/projects')).toBe(PAGES.PROJECTS.title)
	})

	it('returns TOP title for unknown paths', () => {
		expect(page_title.get_page_title_from_path('/not-a-page')).toBe(PAGES.TOP.title)
	})
})
