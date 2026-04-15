<script lang="ts">
	import { ICON_SIZE_SM } from '$lib/constants/layout'
	import CalendarIcon from '$lib/icons/CalendarIcon.svelte'
	import RefreshIcon from '$lib/icons/RefreshIcon.svelte'
	import UserIcon from '$lib/icons/UserIcon.svelte'

	const {
		date,
		updated,
		author,
		class: class_name = '',
	}: {
		date: string
		updated?: string | undefined
		author?: string | undefined
		class?: string
	} = $props()

	const format_date = (date_string: string): string => date_string.split(' ')[0] ?? ''
</script>

<div class="flex items-center justify-end gap-4 text-sm text-white/50 {class_name}">
	{#if author}
		<span class="flex items-center gap-1">
			<UserIcon size={ICON_SIZE_SM} />
			{author}
		</span>
	{/if}
	<time datetime={date} class="flex items-center gap-1" title="Published">
		<CalendarIcon size={ICON_SIZE_SM} />
		{format_date(date)}
	</time>
	{#if updated}
		<time datetime={updated} class="flex items-center gap-1" title="Updated">
			<RefreshIcon size={ICON_SIZE_SM} />
			{format_date(updated)}
		</time>
	{/if}
</div>
