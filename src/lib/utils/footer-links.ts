import { resolve } from '$app/paths'
import { PAGES } from '$lib/types/page'

interface FooterLink {
	href: string
	title: string
}

const FOOTER_LINKS: ReadonlyArray<FooterLink> = [
	{ href: resolve('/about'), title: PAGES.ABOUT.title },
	{ href: resolve('/contact'), title: PAGES.CONTACT.title },
	{ href: resolve('/privacy'), title: PAGES.PRIVACY_POLICY.title },
	{ href: resolve('/terms'), title: PAGES.TERMS_OF_SERVICE.title },
]

export { FOOTER_LINKS }
