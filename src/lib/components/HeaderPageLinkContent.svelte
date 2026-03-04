<script lang="ts">
	import { NAV_ICON_SIZE } from '$lib/constants/sticky-header-constants'
	import type { Page } from '$lib/types/page'

	const { page } = $props<{ page: Page }>()
</script>

{#if page.icon}
	<!-- eslint-disable-next-line @typescript-eslint/naming-convention -->
	{@const PageIcon = page.icon}
	<PageIcon size={NAV_ICON_SIZE} />
{/if}
{page.title}
