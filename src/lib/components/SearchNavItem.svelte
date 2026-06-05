<script lang="ts">
	import { SEARCH_LABELS } from '$lib/constants/search'
	import { NAV_ICON_SIZE } from '$lib/constants/sticky-header-constants'
	import { search_state } from '$lib/hooks/SearchState.svelte'
	import SearchIcon from '$lib/icons/SearchIcon.svelte'
	import { sticky_header_menu } from '$lib/utils/sticky-header-menu'

	const link_classes = `${sticky_header_menu.get_link_classes('desktop', false)} cursor-pointer`
	const icon_class = sticky_header_menu.get_icon_class('desktop')
</script>

<button
	type="button"
	class={link_classes}
	aria-label={SEARCH_LABELS.OPEN}
	data-testid="search-trigger"
	onclick={() => {
		search_state.open()
	}}
>
	<SearchIcon size={NAV_ICON_SIZE} class={icon_class} aria_label={SEARCH_LABELS.OPEN} />
	<span>{SEARCH_LABELS.TRIGGER}</span>
</button>
