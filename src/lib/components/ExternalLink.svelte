<script lang="ts">
	import { LINK_REL, LINK_TARGET } from '$lib/app'
	import type { Snippet } from 'svelte'

	interface Props {
		href: string
		class?: string
		aria_label?: string
		children?: Snippet
	}

	const { href, class: class_name = '', aria_label, children }: Props = $props()

	const link_class = $derived(class_name ? `link-base ${class_name}` : 'link-base text-white/80')
</script>

<a {href} target={LINK_TARGET} rel={LINK_REL} class={link_class} aria-label={aria_label}>
	{#if children}
		{@render children()}
	{/if}
</a>
