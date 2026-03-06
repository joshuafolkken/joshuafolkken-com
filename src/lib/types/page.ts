import { APP, AUTHOR, OPENCOLLECTIVE, URLS } from '$lib/app'
import BlogIcon from '$lib/icons/BlogIcon.svelte'
import LinkIcon from '$lib/icons/LinkIcon.svelte'
import OpenCollectiveIcon from '$lib/icons/OpenCollectiveIcon.svelte'
import PrivacyPolicyIcon from '$lib/icons/PrivacyPolicyIcon.svelte'
import ProjectsIcon from '$lib/icons/ProjectsIcon.svelte'
import TalkIcon from '$lib/icons/TalkIcon.svelte'
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
	| 'PROFILE'
	| 'SOCIAL_LINKS'
	| 'PRIVACY_POLICY'
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

const PROFILE: Page = {
	icon: UserIcon,
	title: 'Profile',
	description: `About me`,
	link: '/profile',
}

const SOCIAL_LINKS: Page = {
	icon: LinkIcon,
	title: 'Social Links',
	description: 'Connect with me',
}

const PRIVACY_POLICY: Page = {
	icon: PrivacyPolicyIcon,
	title: 'Privacy Policy',
	description: 'Your privacy matters to us',
	link: '/privacy-policy',
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
	PROFILE,
	SOCIAL_LINKS,
	PRIVACY_POLICY,
	DONATIONS,
	BLOG,
}

const MAIN_NAV_PAGES = [PAGES.PROJECTS, PAGES.BLOG, PAGES.PROFILE] as const

export { MAIN_NAV_PAGES, PAGES }
export type { Page, PageKey }
