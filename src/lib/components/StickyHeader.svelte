<script lang="ts">
	import { resolve } from '$app/paths'
	import { page } from '$app/state'
	import { AUTHOR, LINK_REL, LINK_TARGET, URLS } from '$lib/app'
	import GitHubIcon from '$lib/icons/GitHubIcon.svelte'
	import LogoIcon from '$lib/icons/LogoIcon.svelte'
	import XIcon from '$lib/icons/XIcon.svelte'
	import YouTubeIcon from '$lib/icons/YouTubeIcon.svelte'
	import { PAGES } from '$lib/types/page'
	import { link_utilities } from '$lib/utils/link-utilities'
	import { page_title } from '$lib/utils/page-title'
	import type { Component } from 'svelte'

	const MENU_WIDTH = 280
	const MENU_CLOSE_DELAY_MS = 400
	const HEADER_ICON_SIZE = 24
	const HEADER_HEIGHT = '4rem'
	const TRANSITION_DURATION = 'duration-300'

	interface SocialLink {
		href: string
		aria_label: string
		icon: Component
		is_external?: boolean
	}

	const social_links: Array<SocialLink> = [
		{
			href: URLS.GITHUB,
			aria_label: 'GitHub',
			icon: GitHubIcon,
			is_external: true,
		},
		{
			href: URLS.X,
			aria_label: 'X',
			icon: XIcon,
			is_external: true,
		},
		{
			href: URLS.YOUTUBE,
			aria_label: 'YouTube',
			icon: YouTubeIcon,
			is_external: true,
		},
	]

	const menu_items = [
		{ page: PAGES.PROJECTS },
		{ page: PAGES.BLOG },
		{ page: PAGES.PROFILE },
		{ page: PAGES.PRIVACY_POLICY },
	] as const

	const current_page = $derived(page_title.get_page_from_path(page.url.pathname))
	const current_title = $derived(current_page.title)
	const is_top_page = $derived(page.url.pathname === '/')

	function is_menu_item_active(link: string | undefined): boolean {
		if (!link || link_utilities.is_external_link(link)) return false

		const { pathname } = page.url

		return pathname === link || (link === '/blog' && pathname.startsWith('/blog/'))
	}

	let is_menu_open = $state(false)
	let close_timer: ReturnType<typeof setTimeout> | undefined = $state()
	let is_hovering_button = $state(false)
	let is_hovering_menu = $state(false)

	function clear_close_timer(): void {
		if (close_timer !== undefined) {
			clearTimeout(close_timer)
			close_timer = undefined
		}
	}

	function open_menu(): void {
		clear_close_timer()
		is_menu_open = true
	}

	function close_menu(): void {
		is_menu_open = false
	}

	function schedule_close(): void {
		clear_close_timer()
		close_timer = setTimeout(() => {
			close_menu()
			close_timer = undefined
		}, MENU_CLOSE_DELAY_MS)
	}

	function handle_button_enter(): void {
		is_hovering_button = true

		open_menu()
	}

	function handle_button_leave(): void {
		is_hovering_button = false

		if (!is_hovering_menu) {
			schedule_close()
		}
	}

	function handle_menu_enter(): void {
		is_hovering_menu = true

		clear_close_timer()
	}

	function handle_menu_leave(): void {
		is_hovering_menu = false

		if (!is_hovering_button) {
			schedule_close()
		}
	}

	function handle_toggle_click(): void {
		if (is_menu_open) {
			close_menu()
		} else {
			open_menu()
		}
	}
</script>

<header
	class="fixed top-0 right-0 left-0 z-50 flex h-16 min-h-16 items-center justify-between border-b border-white/10 bg-slate-900/95 px-4 py-3 shadow-lg backdrop-blur"
>
	<div class="flex min-w-0 flex-1 items-center gap-3">
		<a
			href={resolve('/')}
			class="flex shrink-0 items-center transition-all {TRANSITION_DURATION} hover:brightness-125"
			aria-label="ホーム"
		>
			<LogoIcon size={HEADER_ICON_SIZE} class="drop-shadow" />
		</a>

		<div class="flex min-w-0 flex-1 items-center gap-2 truncate">
			<a
				href={resolve('/')}
				class="shrink-0 text-lg font-light tracking-tight text-white drop-shadow transition-colors {TRANSITION_DURATION} hover:text-sky-300"
				aria-label="ホーム"
			>
				{AUTHOR.NAME}
			</a>
			{#if !is_top_page}
				{@const page_href = link_utilities.get_href(current_page.link)}
				<span class="shrink-0 text-white/40 md:hidden" aria-hidden="true">|</span>
				{#if page_href && !link_utilities.is_external_link(current_page.link)}
					<a
						href={page_href}
						class="flex shrink-0 items-center gap-2 truncate text-base font-light text-white/80 drop-shadow transition-colors {TRANSITION_DURATION} hover:text-white md:hidden [&_svg]:text-inherit hover:[&_svg]:text-white"
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
						class="flex shrink-0 items-center gap-2 truncate text-base font-light text-white/80 drop-shadow md:hidden [&_svg]:text-inherit"
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
		</div>

		<nav class="hidden items-center gap-1 md:flex" aria-label="ページナビゲーション">
			{#each menu_items as { page: menu_page } (menu_page.link ?? menu_page.title)}
				{@const href = link_utilities.get_href(menu_page.link)}
				{@const is_active = is_menu_item_active(menu_page.link)}
				{#if href && !link_utilities.is_external_link(menu_page.link)}
					<a
						{href}
						class="flex items-center gap-2 px-3 py-2 text-base font-light transition-colors {TRANSITION_DURATION} hover:bg-white/10 {is_active
							? 'relative text-sky-400 after:absolute after:right-0 after:bottom-[-12px] after:left-0 after:h-0.5 after:bg-sky-400 after:content-[""] hover:text-sky-400 [&_svg]:text-sky-400 hover:[&_svg]:text-sky-400'
							: 'rounded text-white/70 hover:text-white [&_svg]:text-inherit'}"
					>
						{#if menu_page.icon}
							<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
							{@const Icon = menu_page.icon}
							<Icon size="1rem" />
						{/if}
						{menu_page.title}
					</a>
				{/if}
			{/each}
		</nav>
	</div>

	<div class="flex shrink-0 items-center gap-1">
		<nav class="hidden items-center gap-1 md:flex" aria-label="ソーシャルリンク">
			{#each social_links as link (link.href)}
				<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
				{@const Icon = link.icon}
				<a
					href={link.href}
					aria-label={link.aria_label}
					target={link.is_external ? LINK_TARGET : undefined}
					rel={link.is_external ? LINK_REL : undefined}
					class="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors {TRANSITION_DURATION} hover:bg-white/10 hover:text-white"
				>
					<Icon size="1.25rem" />
				</a>
			{/each}
		</nav>
		<button
			type="button"
			aria-label={is_menu_open ? 'メニューを閉じる' : 'メニューを開く'}
			aria-expanded={is_menu_open}
			class="flex shrink-0 items-center justify-center rounded-full p-2 text-white/70 transition-colors {TRANSITION_DURATION} hover:bg-white/10 hover:text-white md:hidden"
			onclick={handle_toggle_click}
			onmouseenter={handle_button_enter}
			onmouseleave={handle_button_leave}
		>
			{#if is_menu_open}
				<svg
					class="h-6 w-6"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M18 6 6 18"></path>
					<path d="m6 6 12 12"></path>
				</svg>
			{:else}
				<svg
					class="h-6 w-6"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M4 5h16"></path>
					<path d="M4 12h16"></path>
					<path d="M4 19h16"></path>
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
	onclick={close_menu}
></div>

<aside
	class="fixed right-0 z-50 h-full overflow-y-auto border-l border-white/10 bg-slate-900/98 shadow-xl backdrop-blur transition-transform duration-200 ease-out"
	style="width: {MENU_WIDTH}px; top: {HEADER_HEIGHT}"
	class:translate-x-0={is_menu_open}
	class:translate-x-full={!is_menu_open}
	aria-label="ナビゲーションメニュー"
	onmouseenter={handle_menu_enter}
	onmouseleave={handle_menu_leave}
>
	<nav class="flex flex-col gap-0 p-4 pt-0" aria-label="ページリンク">
		{#each menu_items as { page: menu_page } (menu_page.link ?? menu_page.title)}
			{@const href = link_utilities.get_href(menu_page.link)}
			{@const is_active = is_menu_item_active(menu_page.link)}
			{#if href && !link_utilities.is_external_link(menu_page.link)}
				<a
					{href}
					class="-mx-4 flex items-center gap-3 rounded-none border-l-2 px-4 py-3 text-base transition-colors {TRANSITION_DURATION} hover:bg-white/10 {is_active
						? 'border-sky-400 text-sky-400 hover:text-sky-400 [&_svg]:text-sky-400 hover:[&_svg]:text-sky-400'
						: 'border-transparent text-white/70 hover:text-white [&_svg]:text-inherit'}"
					onclick={close_menu}
				>
					{#if menu_page.icon}
						<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
						{@const Icon = menu_page.icon}
						<Icon size="1.25rem" />
					{/if}
					<span>{menu_page.title}</span>
				</a>
			{/if}
		{/each}
	</nav>

	<div class="mt-4 flex gap-2 p-4 pt-0 md:hidden" aria-label="ソーシャルリンク（モバイル）">
		{#each social_links as link (link.href)}
			<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
			{@const Icon = link.icon}
			<a
				href={link.href}
				aria-label={link.aria_label}
				target={link.is_external ? LINK_TARGET : undefined}
				rel={link.is_external ? LINK_REL : undefined}
				class="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors {TRANSITION_DURATION} hover:bg-white/10 hover:text-white"
				onclick={close_menu}
			>
				<Icon size="1.25rem" />
			</a>
		{/each}
	</div>
</aside>
