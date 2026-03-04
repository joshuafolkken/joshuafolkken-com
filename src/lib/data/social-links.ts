import { AUTHOR, URLS } from '$lib/app'
import GitHubIcon from '$lib/icons/GitHubIcon.svelte'
import MailIcon from '$lib/icons/MailIcon.svelte'
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

const github_link: SocialLink = {
	href: URLS.GITHUB,
	aria_label: 'GitHub',
	icon: GitHubIcon,
	is_external: true,
}

const x_link: SocialLink = {
	href: URLS.X,
	aria_label: 'X',
	icon: XIcon,
	is_external: true,
}

const youtube_link: SocialLink = {
	href: URLS.YOUTUBE,
	aria_label: 'YouTube',
	icon: YouTubeIcon,
	is_external: true,
}

const HEADER_SOCIAL_LINKS: Array<SocialLink> = [github_link, x_link, youtube_link]

const SOCIAL_LINKS_WITH_LABELS: Array<SocialLink> = [
	{ ...github_link, aria_label: 'GitHub - Code & Projects', label: 'Code' },
	{ ...x_link, aria_label: 'X - Latest Updates', label: 'Updates' },
	{ ...youtube_link, aria_label: 'YouTube - Video Content', label: 'Videos' },
	{
		href: `mailto:${AUTHOR.EMAIL}`,
		aria_label: 'Mail - Contact',
		icon: MailIcon,
		is_external: false,
		label: 'Contact',
	},
]

export type { SocialLink }
export { HEADER_SOCIAL_LINKS, SOCIAL_LINKS_WITH_LABELS }
