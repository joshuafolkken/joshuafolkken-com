<script lang="ts">
	import type { LinkInfo } from '$lib/utils/link-utilities'
	import type { Snippet } from 'svelte'

	interface Props {
		link_info: LinkInfo
		link_class?: string
		non_link_class?: string
		non_link_tag?: 'span' | 'div'
		children: Snippet
	}

	const {
		link_info,
		link_class = '',
		non_link_class = '',
		non_link_tag = 'span',
		children,
	}: Props = $props()
</script>

{#if link_info.href}
	<a href={link_info.href} target={link_info.target} rel={link_info.rel} class={link_class}>
		{@render children()}
	</a>
{:else if non_link_tag === 'div'}
	<div class={non_link_class}>
		{@render children()}
	</div>
{:else}
	<span class={non_link_class}>
		{@render children()}
	</span>
{/if}
