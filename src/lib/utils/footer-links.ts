import { resolve } from '$app/paths'
import { PAGES } from '$lib/types/page'

interface FooterLink {
	href: string
	title: string
}

const FOOTER_LINKS: ReadonlyArray<FooterLink> = [
	{ href: resolve('/privacy'), title: 'Privacy' },
	{ href: resolve('/terms'), title: 'Terms' },
	{ href: resolve('/about'), title: PAGES.ABOUT.title },
	{ href: resolve('/contact'), title: PAGES.CONTACT.title },
]

export { FOOTER_LINKS }
