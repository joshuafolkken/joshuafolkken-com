<script lang="ts">
	import { SEARCH_LABELS } from '$lib/constants/search'
	import { NAV_ICON_SIZE, type StickyHeaderVariant } from '$lib/constants/sticky-header-constants'
	import { search_state } from '$lib/hooks/SearchState.svelte'
	import SearchIcon from '$lib/icons/SearchIcon.svelte'
	import { sticky_header_menu } from '$lib/utils/sticky-header-menu'

	const {
		variant = 'desktop',
		on_click,
	}: { variant?: StickyHeaderVariant; on_click?: () => void } = $props()

	const link_classes = $derived(
		`${sticky_header_menu.get_link_classes(variant, false)} cursor-pointer`,
	)
	const icon_class = $derived(sticky_header_menu.get_icon_class(variant))

	function handle_click(): void {
		search_state.open()
		on_click?.()
	}
</script>

<button
	type="button"
	class={link_classes}
	aria-label={SEARCH_LABELS.OPEN}
	data-testid="search-trigger"
	onclick={handle_click}
>
	<SearchIcon size={NAV_ICON_SIZE} class={icon_class} aria_label={SEARCH_LABELS.OPEN} />
	<span>{SEARCH_LABELS.TRIGGER}</span>
</button>
