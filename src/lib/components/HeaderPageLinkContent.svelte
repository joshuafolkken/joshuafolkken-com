<script lang="ts">
	import { MENU_NAV_ICON_DESKTOP, NAV_ICON_SIZE } from '$lib/constants/sticky-header-constants'
	import type { Page } from '$lib/types/page'

	const { page } = $props<{ page: Page }>()
</script>

{#if page.icon}
	<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
	{@const PageIcon = page.icon}
	<PageIcon size={NAV_ICON_SIZE} class={MENU_NAV_ICON_DESKTOP} />
{/if}
{page.title}
