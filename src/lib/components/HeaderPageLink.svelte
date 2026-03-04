<script lang="ts">
	import HeaderPageLinkContent from '$lib/components/HeaderPageLinkContent.svelte'
	import {
		HEADER_PAGE_LINK_ACTIVE,
		HEADER_PAGE_LINK_BASE,
	} from '$lib/constants/sticky-header-constants'
	import type { Page } from '$lib/types/page'

	const {
		page,
		href,
		is_link,
	}: {
		page: Page
		href: string | undefined
		is_link: boolean
	} = $props()
</script>

{#if is_link && href}
	<a {href} class={HEADER_PAGE_LINK_ACTIVE}>
		<HeaderPageLinkContent {page} />
	</a>
{:else}
	<span class={HEADER_PAGE_LINK_BASE}>
		<HeaderPageLinkContent {page} />
	</span>
{/if}
