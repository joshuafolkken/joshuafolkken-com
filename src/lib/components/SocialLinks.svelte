<script lang="ts">
	import SocialLinkItem from '$lib/components/SocialLinkItem.svelte'
	import { SOCIAL_LINKS_WITH_LABELS } from '$lib/data/social-links'

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

	const classes = $derived(['social-links', class_name].filter(Boolean).join(' '))
</script>

<nav
	class={classes}
	style:--icon-size={icon_size}
	style:--justify-content={justify_content}
	{...rest_properties}
>
	{#each SOCIAL_LINKS_WITH_LABELS as link (link.href)}
		<SocialLinkItem {link} class="social-link-item" has_label />
	{/each}
</nav>

<style>
	.social-links {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		justify-items: var(--justify-content, start);
		margin-left: auto;
		margin-right: auto;
	}

	.social-link-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		min-width: 0;
		color: rgb(255 255 255 / 0.9);
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
