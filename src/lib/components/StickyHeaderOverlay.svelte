<script lang="ts">
	import { HEADER_HEIGHT } from '$lib/constants/sticky-header-constants'
	import { sticky_header_state } from '$lib/hooks/StickyHeaderState.svelte'

	const is_menu_open = $derived(sticky_header_state.get_is_menu_open())
</script>

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
