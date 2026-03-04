<script lang="ts">
	import { page } from '$app/state'
	import HeaderLogoLink from '$lib/components/HeaderLogoLink.svelte'
	import HeaderPageLink from '$lib/components/HeaderPageLink.svelte'
	import HeaderSocialLinks from '$lib/components/HeaderSocialLinks.svelte'
	import MenuNavList from '$lib/components/MenuNavList.svelte'
	import StickyHeaderDrawer from '$lib/components/StickyHeaderDrawer.svelte'
	import StickyHeaderOverlay from '$lib/components/StickyHeaderOverlay.svelte'
	import {
		HEADER_CONTAINER_CLASSES,
		HEADER_LEFT_SECTION_CLASSES,
		HEADER_RIGHT_SECTION_CLASSES,
		MENU_TOGGLE_BUTTON_CLASSES,
		NAV_ICON_SIZE,
	} from '$lib/constants/sticky-header-constants'
	import { sticky_header_state } from '$lib/hooks/StickyHeaderState.svelte'
	import CloseIcon from '$lib/icons/CloseIcon.svelte'
	import MenuIcon from '$lib/icons/MenuIcon.svelte'
	import { link_utilities } from '$lib/utils/link-utilities'
	import { page_title } from '$lib/utils/page-title'
	import { sticky_header_menu } from '$lib/utils/sticky-header-menu'

	const is_menu_open = $derived(sticky_header_state.get_is_menu_open())

	const current_page = $derived(page_title.get_page_from_path(page.url.pathname))
	const is_top_page = $derived(page.url.pathname === '/')

	const link_info = $derived(link_utilities.get_link_info(current_page.link))

	const { menu_items } = sticky_header_menu
</script>

<header class={HEADER_CONTAINER_CLASSES}>
	<div class={HEADER_LEFT_SECTION_CLASSES}>
		<HeaderLogoLink />

		{#if !is_top_page}
			<span class="invisible shrink-0 text-white/40 md:hidden" aria-hidden="true">|</span>
			<HeaderPageLink page={current_page} href={link_info.href} is_link={link_info.is_link} />
		{/if}

		<nav class="hidden items-center gap-2 md:flex" aria-label="ページナビゲーション">
			<MenuNavList {menu_items} variant="desktop" />
		</nav>
	</div>

	<div class={HEADER_RIGHT_SECTION_CLASSES}>
		<HeaderSocialLinks variant="desktop" />
		<button
			type="button"
			aria-label={is_menu_open ? 'メニューを閉じる' : 'メニューを開く'}
			aria-expanded={is_menu_open}
			class={MENU_TOGGLE_BUTTON_CLASSES}
			onclick={sticky_header_state.handle_toggle_click}
		>
			{#if is_menu_open}
				<CloseIcon size={NAV_ICON_SIZE} />
			{:else}
				<MenuIcon size={NAV_ICON_SIZE} />
			{/if}
		</button>
	</div>
</header>

<StickyHeaderOverlay />
<StickyHeaderDrawer />
