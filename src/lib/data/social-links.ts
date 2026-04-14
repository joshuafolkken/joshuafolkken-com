import { URLS } from '$lib/app'
import GitHubIcon from '$lib/icons/GitHubIcon.svelte'
import XIcon from '$lib/icons/XIcon.svelte'
import YouTubeIcon from '$lib/icons/YouTubeIcon.svelte'
import type { Component } from 'svelte'

interface SocialLink {
	href: string
	aria_label: string
	icon: Component
	is_external?: boolean
	label?: string
}

const HEADER_SOCIAL_LINKS: Array<SocialLink> = [
	{ href: URLS.GITHUB, aria_label: 'GitHub', icon: GitHubIcon, is_external: true },
	{ href: URLS.X, aria_label: 'X', icon: XIcon, is_external: true },
	{ href: URLS.YOUTUBE, aria_label: 'YouTube', icon: YouTubeIcon, is_external: true },
]

const CONTACT_SOCIAL_LINKS: Array<SocialLink> = [
	{ href: URLS.X, aria_label: 'X', icon: XIcon, is_external: true, label: 'X (Twitter)' },
	{ href: URLS.GITHUB, aria_label: 'GitHub', icon: GitHubIcon, is_external: true, label: 'GitHub' },
	{
		href: URLS.YOUTUBE,
		aria_label: 'YouTube',
		icon: YouTubeIcon,
		is_external: true,
		label: 'YouTube',
	},
]

export type { SocialLink }
export { CONTACT_SOCIAL_LINKS, HEADER_SOCIAL_LINKS }
