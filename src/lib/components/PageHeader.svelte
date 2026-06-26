<script lang="ts">
	import { ICON_SIZE_XL } from '$lib/constants/layout'
	import { HEADER_HEIGHT_PX } from '$lib/constants/sticky-header-constants'
	import { page_title_visibility_state } from '$lib/hooks/PageTitleVisibilityState.svelte'
	import LogoIcon from '$lib/icons/LogoIcon.svelte'
	import { PAGES, type Page } from '$lib/types/page'

	const { page } = $props<{ page: Page }>()
	const { icon, title, description } = $derived(page)
	const is_top_page = $derived(page === PAGES.TOP)

	function observe_visibility(element: HTMLElement): { destroy: () => void } {
		// eslint-disable-next-line unicorn/no-useless-undefined -- explicit "no previous reading yet" sentinel; init-declarations requires an initializer
		let is_previous_visible: boolean | undefined = undefined

		function update(): void {
			const is_visible = element.getBoundingClientRect().bottom > HEADER_HEIGHT_PX
			if (is_visible === is_previous_visible) return
			is_previous_visible = is_visible
			page_title_visibility_state.set_visible(is_visible)
		}

		update()
		// eslint-disable-next-line unicorn/prefer-observer-apis -- custom HEADER_HEIGHT_PX threshold against the header; scroll-based check, IntersectionObserver migration deferred
		window.addEventListener('scroll', update, { passive: true })

		return {
			destroy() {
				window.removeEventListener('scroll', update)
			},
		}
	}
</script>

<header
	use:observe_visibility
	class="mb-4 flex flex-col items-center justify-center {is_top_page ? '' : 'mt-6'}"
>
	{#if is_top_page}
		<div class="my-4">
			<LogoIcon />
		</div>
	{/if}
	<h1 class="flex items-center justify-center gap-2 text-4xl font-light tracking-tight">
		{#if icon}
			<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
			{@const Icon = icon}
			<Icon size={ICON_SIZE_XL} />
		{/if}
		{title}
	</h1>
	{#if description}
		<p class="mt-3 text-right text-white/80 italic">{description}</p>
	{/if}
</header>
