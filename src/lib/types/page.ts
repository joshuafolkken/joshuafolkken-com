import { APP, AUTHOR, OPENCOLLECTIVE, URLS } from '$lib/app'
import BlogIcon from '$lib/icons/BlogIcon.svelte'
import LinkIcon from '$lib/icons/LinkIcon.svelte'
import MailIcon from '$lib/icons/MailIcon.svelte'
import OpenCollectiveIcon from '$lib/icons/OpenCollectiveIcon.svelte'
import PrivacyPolicyIcon from '$lib/icons/PrivacyPolicyIcon.svelte'
import ProjectsIcon from '$lib/icons/ProjectsIcon.svelte'
import TalkIcon from '$lib/icons/TalkIcon.svelte'
import TermsIcon from '$lib/icons/TermsIcon.svelte'
import UserIcon from '$lib/icons/UserIcon.svelte'
import type { Component } from 'svelte'

interface Page {
	icon?: Component
	title: string
	description: string
	link?: string
}

type PageKey =
	| 'TOP'
	| 'TALK'
	| 'PROJECTS'
	| 'ABOUT'
	| 'SOCIAL_LINKS'
	| 'CONTACT'
	| 'PRIVACY_POLICY'
	| 'TERMS_OF_SERVICE'
	| 'DONATIONS'
	| 'BLOG'

const TOP: Page = {
	title: AUTHOR.NAME,
	description: APP.DESCRIPTION,
	link: '/',
}

const TALK: Page = {
	icon: TalkIcon,
	title: 'Talk',
	description: 'Listen and Speak!',
	link: URLS.TALK,
}

const PROJECTS: Page = {
	icon: ProjectsIcon,
	title: 'Projects',
	description: 'Building Games That Matter',
	link: '/projects',
}

const ABOUT: Page = {
	icon: UserIcon,
	title: 'About',
	description: 'Who I am and what I build',
	link: '/about',
}

const SOCIAL_LINKS: Page = {
	icon: LinkIcon,
	title: 'Social Links',
	description: 'Connect with me',
}

const CONTACT: Page = {
	icon: MailIcon,
	title: 'Contact',
	description: 'Get in touch',
	link: '/contact',
}

const PRIVACY_POLICY: Page = {
	icon: PrivacyPolicyIcon,
	title: 'Privacy Policy',
	description: 'Your privacy matters to us',
	link: '/privacy',
}

const TERMS_OF_SERVICE: Page = {
	icon: TermsIcon,
	title: 'Terms of Service',
	description: 'Rules for using this site',
	link: '/terms',
}

const DONATIONS: Page = {
	icon: OpenCollectiveIcon,
	title: 'Support & Donations',
	description: 'Support our mission',
	link: OPENCOLLECTIVE.URL,
}

const BLOG: Page = {
	icon: BlogIcon,
	title: 'Blog',
	description: 'Unwritten Chapters',
	link: '/blog',
}

const PAGES: Record<PageKey, Page> = {
	TOP,
	TALK,
	PROJECTS,
	ABOUT,
	SOCIAL_LINKS,
	CONTACT,
	PRIVACY_POLICY,
	TERMS_OF_SERVICE,
	DONATIONS,
	BLOG,
}

const MAIN_NAV_PAGES = [PAGES.PROJECTS, PAGES.BLOG, PAGES.ABOUT] as const

export { MAIN_NAV_PAGES, PAGES }
export type { Page, PageKey }
