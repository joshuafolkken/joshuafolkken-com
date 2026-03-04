<script lang="ts">
	import { LINK_BASE_CLASS } from '$lib/constants/layout'
	import type { Page } from '$lib/types/page'
	import { link_utilities } from '$lib/utils/link-utilities'
	import ContentCard from './ContentCard.svelte'
	import OptionalLink from './OptionalLink.svelte'

	interface Props {
		page: Page
	}

	const { page }: Props = $props()
	const { title, description, icon } = $derived(page)

	const link_info = $derived(link_utilities.get_link_info(page.link ?? ''))
</script>

<div class="mt-2 w-full">
	<OptionalLink
		{link_info}
		link_class="{LINK_BASE_CLASS} block w-full rounded-lg p-4 hover:bg-slate-800/60"
		non_link_class="w-full p-4"
		non_link_tag="div"
	>
		<ContentCard {icon} {title} {description} class="text-center" />
	</OptionalLink>
</div>
