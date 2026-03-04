<script lang="ts">
	import { LINK_REL, LINK_TARGET } from '$lib/app'
	import type { Page } from '$lib/types/page'
	import { link_utilities } from '$lib/utils/link-utilities'
	import ContentCard from './ContentCard.svelte'

	interface Props {
		page: Page
	}

	const { page }: Props = $props()
	const { title, description, icon } = $derived(page)

	const link = $derived(page.link ?? '')
	const is_external = $derived(link_utilities.is_external_link(link))
	const href = $derived(link_utilities.get_href(link))
</script>

<div class="mt-2 w-full">
	{#if href}
		<a
			{href}
			target={is_external ? LINK_TARGET : undefined}
			rel={is_external ? LINK_REL : undefined}
			class="link-base block w-full rounded-lg p-4 hover:bg-slate-800/60"
		>
			<ContentCard {icon} {title} {description} class="text-center" />
		</a>
	{:else}
		<div class="w-full p-4">
			<ContentCard {icon} {title} {description} class="text-center" />
		</div>
	{/if}
</div>
