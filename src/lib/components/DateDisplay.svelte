<script lang="ts">
	import { ICON_SIZE_SM } from '$lib/constants/layout'
	import CalendarIcon from '$lib/icons/CalendarIcon.svelte'
	import RefreshIcon from '$lib/icons/RefreshIcon.svelte'
	import UserIcon from '$lib/icons/UserIcon.svelte'
	import YouTubeIcon from '$lib/icons/YouTubeIcon.svelte'
	import { date_utilities } from '$lib/utils/date-utilities'

	const {
		date,
		updated,
		author,
		youtube_date,
		align = 'end',
		class: class_name = '',
	}: {
		date: string
		updated?: string | undefined
		author?: string | undefined
		youtube_date?: string | undefined
		align?: 'end' | 'sidebar'
		class?: string
	} = $props()

	// 'sidebar' right-aligns on mobile and left-aligns from the lg breakpoint (talk-article meta panel).
	const justify_class = $derived(
		align === 'sidebar' ? 'justify-end lg:justify-start' : 'justify-end',
	)
</script>

<div
	class="flex flex-wrap items-center gap-4 text-sm text-white/50 {justify_class} {class_name}"
	data-testid="date-display"
>
	{#if author}
		<span class="flex items-center gap-1">
			<UserIcon size={ICON_SIZE_SM} />
			<span class="sr-only">Author: </span>{author}
		</span>
	{/if}
	<time datetime={date} class="flex items-center gap-1" title="Published">
		<CalendarIcon size={ICON_SIZE_SM} />
		{date_utilities.format_date_only(date)}
	</time>
	{#if updated}
		<time datetime={updated} class="flex items-center gap-1" title="Updated">
			<RefreshIcon size={ICON_SIZE_SM} />
			{date_utilities.format_date_only(updated)}
		</time>
	{/if}
	{#if youtube_date}
		<time
			datetime={youtube_date}
			class="flex items-center gap-1"
			title="YouTube"
			data-testid="youtube-date"
		>
			<YouTubeIcon size={ICON_SIZE_SM} />
			<span class="sr-only">YouTube: </span>{date_utilities.format_date_only(youtube_date)}
		</time>
	{/if}
</div>
