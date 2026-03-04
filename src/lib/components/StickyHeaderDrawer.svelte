<script lang="ts">
	import HeaderSocialLinks from '$lib/components/HeaderSocialLinks.svelte'
	import MenuNavList from '$lib/components/MenuNavList.svelte'
	import {
		HEADER_HEIGHT,
		MENU_DRAWER_CLASSES,
		MENU_WIDTH,
	} from '$lib/constants/sticky-header-constants'
	import { sticky_header_state } from '$lib/hooks/StickyHeaderState.svelte'
	import { sticky_header_menu } from '$lib/utils/sticky-header-menu'

	const is_menu_open = $derived(sticky_header_state.get_is_menu_open())
	const { menu_items } = sticky_header_menu
</script>

<aside
	class={MENU_DRAWER_CLASSES}
	style="width: {MENU_WIDTH}px; top: {HEADER_HEIGHT}"
	class:translate-x-0={is_menu_open}
	class:translate-x-full={!is_menu_open}
	aria-label="ナビゲーションメニュー"
	onmouseenter={sticky_header_state.handle_menu_enter}
	onmouseleave={sticky_header_state.handle_menu_leave}
>
	<nav class="flex flex-col gap-0 p-4 pt-4" aria-label="ページリンク">
		<MenuNavList {menu_items} variant="mobile" on_click={sticky_header_state.close_menu} />
	</nav>

	<HeaderSocialLinks variant="mobile" on_click={sticky_header_state.close_menu} />
</aside>
