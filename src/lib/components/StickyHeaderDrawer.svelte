<script lang="ts">
	import HeaderSocialLinks from '$lib/components/HeaderSocialLinks.svelte'
	import MenuNavList from '$lib/components/MenuNavList.svelte'
	import SearchNavItem from '$lib/components/SearchNavItem.svelte'
	import {
		HEADER_HEIGHT,
		MENU_DRAWER_CLASSES,
		MENU_WIDTH,
	} from '$lib/constants/sticky-header-constants'
	import { sticky_header_state } from '$lib/hooks/StickyHeaderState.svelte'
	import { PAGES } from '$lib/types/page'
	import { sticky_header_menu } from '$lib/utils/sticky-header-menu'

	const is_menu_open = $derived(sticky_header_state.get_is_menu_open())
	// AI Chat lives in the mobile header bar, so it is dropped from the drawer; search moves in here.
	const drawer_items = sticky_header_menu.menu_items.filter(
		(item) => item.page.link !== PAGES.CHAT.link,
	)
</script>

<svelte:window onkeydown={sticky_header_state.handle_keydown} />

<div
	class={MENU_DRAWER_CLASSES}
	style="width: {MENU_WIDTH}px; top: {HEADER_HEIGHT}"
	class:translate-x-0={is_menu_open}
	class:translate-x-full={!is_menu_open}
	role="dialog"
	aria-modal="true"
	aria-label="Navigation menu"
	data-testid="nav-drawer"
	tabindex="-1"
	onmouseenter={sticky_header_state.handle_menu_enter}
	onmouseleave={sticky_header_state.handle_menu_leave}
>
	<nav class="flex flex-col gap-0 p-4 pt-4" aria-label="Page links">
		<MenuNavList
			menu_items={drawer_items}
			variant="mobile"
			on_click={sticky_header_state.close_menu}
		/>
		<SearchNavItem variant="mobile" on_click={sticky_header_state.close_menu} />
	</nav>

	<HeaderSocialLinks variant="mobile" on_click={sticky_header_state.close_menu} />
</div>
