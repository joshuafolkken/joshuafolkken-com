<script lang="ts">
	import { page } from '$app/state'
	import HeaderLogoLink from '$lib/components/HeaderLogoLink.svelte'
	import HeaderPageLink from '$lib/components/HeaderPageLink.svelte'
	import HeaderSocialLinks from '$lib/components/HeaderSocialLinks.svelte'
	import MenuNavList from '$lib/components/MenuNavList.svelte'
	import SearchNavItem from '$lib/components/SearchNavItem.svelte'
	import StickyHeaderDrawer from '$lib/components/StickyHeaderDrawer.svelte'
	import StickyHeaderOverlay from '$lib/components/StickyHeaderOverlay.svelte'
	import { SEARCH_LABELS } from '$lib/constants/search'
	import {
		HEADER_CONTAINER_CLASSES,
		HEADER_FADE_DURATION_MS,
		HEADER_LEFT_SECTION_CLASSES,
		HEADER_RIGHT_SECTION_CLASSES,
		MENU_TOGGLE_BUTTON_CLASSES,
		NAV_ICON_SIZE,
		SEARCH_BUTTON_CLASSES,
	} from '$lib/constants/sticky-header-constants'
	import { page_title_visibility_state } from '$lib/hooks/PageTitleVisibilityState.svelte'
	import { search_state } from '$lib/hooks/SearchState.svelte'
	import { sticky_header_state } from '$lib/hooks/StickyHeaderState.svelte'
	import CloseIcon from '$lib/icons/CloseIcon.svelte'
	import MenuIcon from '$lib/icons/MenuIcon.svelte'
	import SearchIcon from '$lib/icons/SearchIcon.svelte'
	import { link_utilities } from '$lib/utils/link-utilities'
	import { page_title } from '$lib/utils/page-title'
	import { sticky_header_menu } from '$lib/utils/sticky-header-menu'
	import { fade } from 'svelte/transition'

	const is_menu_open = $derived(sticky_header_state.get_is_menu_open())
	const is_search_open = $derived(search_state.get_is_open())

	const current_page = $derived(page_title.get_page_from_path(page.url.pathname))
	const is_top_page = $derived(page.url.pathname === '/')
	const is_page_title_visible = $derived(page_title_visibility_state.get_is_visible())
	const is_showing_page_link = $derived(!is_top_page && !is_page_title_visible)

	const link_info = $derived(link_utilities.get_link_info(current_page.link))

	const { menu_items } = sticky_header_menu
</script>

<header class={HEADER_CONTAINER_CLASSES} inert={is_search_open} data-testid="site-header">
	<div class={HEADER_LEFT_SECTION_CLASSES}>
		<HeaderLogoLink is_text_hidden={is_showing_page_link} />

		{#if is_showing_page_link}
			<div
				class="absolute left-1/2 -translate-x-1/2 desktop:hidden"
				transition:fade={{ duration: HEADER_FADE_DURATION_MS }}
			>
				<HeaderPageLink page={current_page} href={link_info.href} is_link={link_info.is_link} />
			</div>
		{/if}

		<nav class="hidden items-center gap-2 desktop:flex" aria-label="ページナビゲーション">
			<MenuNavList {menu_items} variant="desktop" />
			<SearchNavItem />
		</nav>
	</div>

	<div class={HEADER_RIGHT_SECTION_CLASSES}>
		<button
			type="button"
			aria-label={SEARCH_LABELS.OPEN}
			class={`${SEARCH_BUTTON_CLASSES} desktop:hidden`}
			data-testid="search-trigger-mobile"
			onclick={() => {
				search_state.open()
			}}
		>
			<SearchIcon size={NAV_ICON_SIZE} aria_label={SEARCH_LABELS.OPEN} />
		</button>
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
