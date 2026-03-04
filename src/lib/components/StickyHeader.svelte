<script lang="ts">
	import { resolve } from '$app/paths'
	import { page } from '$app/state'
	import { AUTHOR } from '$lib/app'
	import HeaderSocialLinks from '$lib/components/HeaderSocialLinks.svelte'
	import MenuNavItem from '$lib/components/MenuNavItem.svelte'
	import { sticky_header_state } from '$lib/hooks/StickyHeaderState.svelte'
	import LogoIcon from '$lib/icons/LogoIcon.svelte'
	import { PAGES } from '$lib/types/page'
	import { link_utilities } from '$lib/utils/link-utilities'
	import { page_title } from '$lib/utils/page-title'

	const is_menu_open = $derived(sticky_header_state.get_is_menu_open())

	const current_page = $derived(page_title.get_page_from_path(page.url.pathname))
	const current_title = $derived(current_page.title)
	const is_top_page = $derived(page.url.pathname === '/')

	const MENU_WIDTH = 280
	const HEADER_ICON_SIZE = 24
	const HEADER_HEIGHT = '4rem'

	const menu_items = [
		{ page: PAGES.PROJECTS },
		{ page: PAGES.BLOG },
		{ page: PAGES.PROFILE },
		// { page: PAGES.PRIVACY_POLICY },
	] as const

	function is_menu_item_active(link: string | undefined): boolean {
		if (!link || link_utilities.is_external_link(link)) return false

		const { pathname } = page.url

		return pathname === link || (link !== '/' && pathname.startsWith(`${link}/`))
	}
</script>

<header
	class="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-slate-950/70 px-6 backdrop-blur-md transition-all duration-500"
>
	<div class="flex min-w-0 flex-1 items-center gap-4 md:gap-6">
		<a
			href={resolve('/')}
			class="group flex shrink-0 items-center gap-3 transition-transform hover:scale-105 active:scale-95"
			aria-label="ホーム"
		>
			<div class="relative">
				<div
					class="absolute inset-0 scale-110 bg-sky-500/20 opacity-0 blur-lg transition-opacity group-hover:opacity-100"
				></div>
				<LogoIcon
					size={HEADER_ICON_SIZE}
					class="relative z-10 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)] transition-all group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]"
				/>
			</div>
			<span
				class="text-xl font-medium tracking-tight text-white/90 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)] transition-all group-hover:text-white group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]"
			>
				{AUTHOR.NAME}
			</span>
		</a>

		{#if !is_top_page}
			{@const page_href = link_utilities.get_href(current_page.link)}
			<span class="invisible shrink-0 text-white/40 md:hidden" aria-hidden="true">|</span>
			{#if page_href && !link_utilities.is_external_link(current_page.link)}
				<a
					href={page_href}
					class="flex shrink-0 items-center gap-2 truncate text-base font-medium text-white/80 transition-colors hover:text-white md:hidden [&_svg]:text-inherit hover:[&_svg]:text-white"
				>
					{#if current_page.icon}
						<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
						{@const PageIcon = current_page.icon}
						<PageIcon size="1.25rem" />
					{/if}
					{current_title}
				</a>
			{:else}
				<span
					class="flex shrink-0 items-center gap-2 truncate text-base font-medium text-white/80 md:hidden [&_svg]:text-inherit"
				>
					{#if current_page.icon}
						<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
						{@const PageIcon = current_page.icon}
						<PageIcon size="1.25rem" />
					{/if}
					{current_title}
				</span>
			{/if}
		{/if}

		<nav class="hidden items-center gap-2 md:flex" aria-label="ページナビゲーション">
			{#each menu_items as { page: menu_page } (menu_page.link ?? menu_page.title)}
				<MenuNavItem
					page={menu_page}
					is_active={is_menu_item_active(menu_page.link)}
					variant="desktop"
				/>
			{/each}
		</nav>
	</div>

	<div class="flex shrink-0 items-center gap-2">
		<HeaderSocialLinks variant="desktop" />
		<button
			type="button"
			aria-label={is_menu_open ? 'メニューを閉じる' : 'メニューを開く'}
			aria-expanded={is_menu_open}
			class="flex h-9 w-9 items-center justify-center rounded-xl bg-white/0 text-white/50 transition-all hover:bg-white/5 hover:text-white md:hidden"
			onclick={sticky_header_state.handle_toggle_click}
			onmouseenter={sticky_header_state.handle_button_enter}
			onmouseleave={sticky_header_state.handle_button_leave}
		>
			{#if is_menu_open}
				<svg
					class="h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M18 6 6 18"></path>
					<path d="m6 6 12 12"></path>
				</svg>
			{:else}
				<svg
					class="h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M4 6h16M4 12h16M12 18h8"></path>
				</svg>
			{/if}
		</button>
	</div>
</header>

<div
	class="fixed left-0 z-40 h-full w-full bg-black/20 transition-opacity duration-200"
	style="top: {HEADER_HEIGHT}"
	class:invisible={!is_menu_open}
	class:pointer-events-none={!is_menu_open}
	class:opacity-0={!is_menu_open}
	aria-hidden="true"
	role="presentation"
	onclick={sticky_header_state.close_menu}
></div>

<aside
	class="fixed right-0 z-50 h-full overflow-y-auto border-l border-white/5 bg-slate-950/70 shadow-2xl backdrop-blur-md transition-transform duration-300 ease-in-out"
	style="width: {MENU_WIDTH}px; top: {HEADER_HEIGHT}"
	class:translate-x-0={is_menu_open}
	class:translate-x-full={!is_menu_open}
	aria-label="ナビゲーションメニュー"
	onmouseenter={sticky_header_state.handle_menu_enter}
	onmouseleave={sticky_header_state.handle_menu_leave}
>
	<nav class="flex flex-col gap-0 p-4 pt-0" aria-label="ページリンク">
		{#each menu_items as { page: menu_page } (menu_page.link ?? menu_page.title)}
			<MenuNavItem
				page={menu_page}
				is_active={is_menu_item_active(menu_page.link)}
				variant="mobile"
				on_click={sticky_header_state.close_menu}
			/>
		{/each}
	</nav>

	<HeaderSocialLinks variant="mobile" on_click={sticky_header_state.close_menu} />
</aside>
