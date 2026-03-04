<script lang="ts">
	import { LINK_REL, LINK_TARGET } from '$lib/app'
	import type { SocialLink } from '$lib/data/social-links'

	const {
		link,
		class: class_name = '',
		icon_size,
		has_label = false,
		on_click,
	}: {
		link: SocialLink
		class?: string
		icon_size?: string
		has_label?: boolean
		on_click?: () => void
	} = $props()
</script>

<a
	href={link.href}
	aria-label={link.aria_label}
	target={link.is_external ? LINK_TARGET : undefined}
	rel={link.is_external ? LINK_REL : undefined}
	class={class_name}
	onclick={on_click}
>
	{#if link.icon}
		<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
		{@const Icon = link.icon}
		<Icon size={icon_size} />
	{/if}
	{#if has_label && link.label}
		<span class="social-link-label">{link.label}</span>
	{/if}
</a>

<style>
	.social-link-label {
		font-size: 0.875rem;
		color: inherit;
		white-space: normal;
		overflow-wrap: break-word;
		word-break: break-word;
		transition: inherit;
	}
</style>
