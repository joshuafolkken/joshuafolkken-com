<script lang="ts">
	import { LINK_REL, LINK_TARGET } from '$lib/app'
	import { LINK_BASE_DEFAULT_CLASS } from '$lib/constants/layout'
	import type { Snippet } from 'svelte'

	interface Props {
		href: string
		class?: string
		aria_label?: string
		testid?: string
		children?: Snippet
	}

	const { href, class: class_name = '', aria_label, testid, children }: Props = $props()

	const link_class = $derived(class_name ? `link-base ${class_name}` : LINK_BASE_DEFAULT_CLASS)
</script>

<a
	{href}
	target={LINK_TARGET}
	rel={LINK_REL}
	class={link_class}
	aria-label={aria_label}
	data-testid={testid}
>
	{#if children}
		{@render children()}
	{/if}
</a>
