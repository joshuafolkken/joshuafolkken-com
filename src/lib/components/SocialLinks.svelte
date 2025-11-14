<script lang="ts">
	import GitHubIcon from '$lib/icons/GitHubIcon.svelte'
	import MailIcon from '$lib/icons/MailIcon.svelte'
	import OpenCollectiveIcon from '$lib/icons/OpenCollectiveIcon.svelte'
	import XIcon from '$lib/icons/XIcon.svelte'
	import YouTubeIcon from '$lib/icons/YouTubeIcon.svelte'
	import type { Component } from 'svelte'

	interface SocialLink {
		href: string
		label: string
		aria_label: string
		icon: Component
		is_external?: boolean
	}

	const social_links: Array<SocialLink> = [
		{
			href: 'https://github.com/joshuafolkken',
			label: 'Code & Projects',
			aria_label: 'GitHub - Code & Projects',
			icon: GitHubIcon,
			is_external: true,
		},
		{
			href: 'https://x.com/joshuafolkken',
			label: 'Latest Updates',
			aria_label: 'X - Latest Updates',
			icon: XIcon,
			is_external: true,
		},
		{
			href: 'https://www.youtube.com/@Joshuafolkken-studio',
			label: 'Video Content',
			aria_label: 'YouTube - Video Content',
			icon: YouTubeIcon,
			is_external: true,
		},
		{
			href: 'https://opencollective.com/joshua-studio',
			label: 'Support & Donations',
			aria_label: 'OpenCollective - Support & Donations',
			icon: OpenCollectiveIcon,
			is_external: true,
		},
		{
			href: 'mailto:joshuafolkken@gmail.com',
			label: 'Contact',
			aria_label: 'Mail - Contact',
			icon: MailIcon,
			is_external: false,
		},
	]

	interface Props {
		class?: string
		icon_size?: string
		justify_content?: 'start' | 'center' | 'end'
	}

	const {
		class: class_name = '',
		icon_size = '2.25rem',
		justify_content = 'center',
		...rest_properties
	}: Props = $props()

	const classes = ['social-links', class_name].filter(Boolean).join(' ')
</script>

<div
	class={classes}
	style:--icon-size={icon_size}
	style:--justify-content={justify_content}
	{...rest_properties}
>
	{#each social_links as link (link.href)}
		<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
		{@const Icon = link.icon}
		<!-- eslint-disable svelte/no-navigation-without-resolve -->
		<a
			href={link.href}
			aria-label={link.aria_label}
			target={link.is_external === true ? '_blank' : undefined}
			rel={link.is_external === true ? 'noopener noreferrer' : undefined}
			class="social-link-item"
		>
			<Icon />
			<span class="social-link-label">{link.label}</span>
		</a>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	{/each}
</div>

<style>
	.social-links {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		justify-items: var(--justify-content, start);
		margin-left: auto;
		margin-right: auto;
	}

	.social-link-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		min-width: 0;
		color: white;
		text-decoration: none;
		transition: opacity 300ms ease-in-out;
		opacity: 0.6;
	}

	.social-link-item:hover {
		opacity: 1;
	}

	.social-link-item :global(svg) {
		width: var(--icon-size, 2.25rem);
		height: var(--icon-size, 2.25rem);
		min-width: var(--icon-size, 2.25rem);
		flex-shrink: 0;
	}

	.social-link-label {
		font-size: 0.875rem;
		color: inherit;
		white-space: normal;
		overflow-wrap: break-word;
		word-break: break-word;
		transition: inherit;
	}
</style>
