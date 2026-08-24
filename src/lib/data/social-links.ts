import { OPENCOLLECTIVE, URLS } from '$lib/app'
import DiscordIcon from '$lib/icons/DiscordIcon.svelte'
import GitHubIcon from '$lib/icons/GitHubIcon.svelte'
import OpenCollectiveIcon from '$lib/icons/OpenCollectiveIcon.svelte'
import XIcon from '$lib/icons/XIcon.svelte'
import YouTubeIcon from '$lib/icons/YouTubeIcon.svelte'
import type { Component } from 'svelte'

interface SocialLink {
	href: string
	aria_label: string
	icon: Component
	is_external?: boolean
	label?: string
	// What the profile is worth following for. Only the profiles the About page invites people to
	// follow carry one, and that is exactly what puts them in `ABOUT_CONNECT_LINKS` below.
	description?: string
}

interface ConnectLink extends SocialLink {
	testid: string
	description: string
}

// The display order for every surface that lists these profiles: the header, the mobile drawer,
// the author box at the end of an article, the contact page, and the About page's Connect list.
// Reordering this array reorders all of them — there is no second order to keep in step, which is
// what the two arrays that used to live here got wrong. Labels are carried on every entry and the
// icon-only surfaces simply do not ask `SocialLinkItem` to render them.
const SOCIAL_LINKS = [
	{
		href: URLS.YOUTUBE,
		aria_label: 'YouTube',
		icon: YouTubeIcon,
		is_external: true,
		label: 'YouTube',
		description: 'game dev tutorials and project showcases',
	},
	{
		href: URLS.X,
		aria_label: 'X',
		icon: XIcon,
		is_external: true,
		label: 'X (Twitter)',
		description: 'dev updates and community discussions',
	},
	// No description, and so not on the About page: Discord is a chat server to join, not a profile
	// to follow, and that page's list is an invitation to follow.
	{
		href: URLS.DISCORD,
		aria_label: 'Discord',
		icon: DiscordIcon,
		is_external: true,
		label: 'Discord',
	},
	{
		href: URLS.GITHUB,
		aria_label: 'GitHub',
		icon: GitHubIcon,
		is_external: true,
		label: 'GitHub',
		description: 'source code, issues, and open-source work',
	},
] as const satisfies ReadonlyArray<SocialLink>

const OPENCOLLECTIVE_NAME = 'Open Collective'

// Open Collective has no place in the icon rows, so it is appended here rather than added above.
const OPENCOLLECTIVE_LINK = {
	href: OPENCOLLECTIVE.URL,
	aria_label: OPENCOLLECTIVE_NAME,
	icon: OpenCollectiveIcon,
	is_external: true,
	label: OPENCOLLECTIVE_NAME,
	testid: 'about-connect-opencollective-link',
	description: 'support the community mission',
} as const satisfies ConnectLink

function is_connect_link(link: SocialLink): link is SocialLink & { description: string } {
	return link.description !== undefined
}

function to_connect_link(link: SocialLink & { description: string }): ConnectLink {
	return { ...link, testid: `about-connect-${link.aria_label.toLowerCase()}-link` }
}

// Derived rather than listed again, so the order still comes from `SOCIAL_LINKS` alone.
const ABOUT_CONNECT_LINKS: ReadonlyArray<ConnectLink> = [
	...SOCIAL_LINKS.filter((link) => is_connect_link(link)).map((link) => to_connect_link(link)),
	OPENCOLLECTIVE_LINK,
]

export type { ConnectLink, SocialLink }
export { ABOUT_CONNECT_LINKS, SOCIAL_LINKS }
