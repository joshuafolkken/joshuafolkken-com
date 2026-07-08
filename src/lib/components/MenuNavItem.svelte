<script lang="ts">
	import { NAV_ICON_SIZE, type StickyHeaderVariant } from '$lib/constants/sticky-header-constants'
	import type { Page } from '$lib/types/page'
	import { link_utilities } from '$lib/utils/link-utilities'
	import { sticky_header_menu } from '$lib/utils/sticky-header-menu'

	const {
		page: menu_page,
		is_active,
		variant = 'desktop',
		on_click,
	}: {
		page: Page
		is_active: boolean
		variant?: StickyHeaderVariant
		on_click?: () => void
	} = $props()

	const link_info = $derived(link_utilities.get_link_info(menu_page.link))

	const is_desktop = $derived(variant === 'desktop')
	const link_classes = $derived(sticky_header_menu.get_link_classes(variant, is_active))
	const icon_class = $derived(sticky_header_menu.get_icon_class(variant))
</script>

{#if link_info.is_link && link_info.href}
	<a href={link_info.href} class={link_classes} onclick={on_click}>
		{#if menu_page.icon}
			<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
			{@const Icon = menu_page.icon}
			<Icon size={NAV_ICON_SIZE} class={icon_class} />
		{/if}
		<span class="whitespace-nowrap">{menu_page.title}</span>
		{#if is_desktop && is_active}
			<span class="absolute right-1.5 bottom-1 left-1.5 h-px bg-sky-400/50"></span>
		{/if}
	</a>
{/if}
