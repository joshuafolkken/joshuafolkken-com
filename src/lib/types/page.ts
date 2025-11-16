import { APP, AUTHOR, URLS } from '$lib/app'
import LinkIcon from '$lib/icons/LinkIcon.svelte'
import OpenCollectiveIcon from '$lib/icons/OpenCollectiveIcon.svelte'
import PrivacyPolicyIcon from '$lib/icons/PrivacyPolicyIcon.svelte'
import ProjectsIcon from '$lib/icons/ProjectsIcon.svelte'
import UserIcon from '$lib/icons/UserIcon.svelte'
import type { Component } from 'svelte'

interface Page {
	icon?: Component
	title: string
	description: string
	link?: string
}

const TOP: Page = {
	title: APP.NAME,
	description: APP.DESCRIPTION,
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
	description: `About ${AUTHOR.NAME}`,
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
	link: URLS.OPEN_COLLECTIVE,
}

export const PAGES = {
	TOP,
	PROJECTS,
	PROFILE,
	SOCIAL_LINKS,
	PRIVACY_POLICY,
	DONATIONS,
}

export type { Page }
