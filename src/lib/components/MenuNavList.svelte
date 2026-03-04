<script lang="ts">
	import { page } from '$app/state'
	import MenuNavItem from '$lib/components/MenuNavItem.svelte'
	import type { StickyHeaderVariant } from '$lib/constants/sticky-header-constants'
	import type { Page } from '$lib/types/page'
	import { property_utilities } from '$lib/utils/property-utilities'
	import { sticky_header_menu } from '$lib/utils/sticky-header-menu'

	const {
		menu_items,
		variant,
		on_click,
	}: {
		menu_items: ReadonlyArray<{ page: Page }>
		variant: StickyHeaderVariant
		on_click?: () => void
	} = $props()
</script>

{#each menu_items as { page: menu_page } (menu_page.link ?? menu_page.title)}
	<MenuNavItem
		page={menu_page}
		is_active={sticky_header_menu.is_menu_item_active(menu_page.link, page.url.pathname)}
		{variant}
		{...property_utilities.with_optional_on_click(on_click)}
	/>
{/each}
