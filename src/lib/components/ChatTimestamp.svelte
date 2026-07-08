<script lang="ts">
	import { CHAT_LABELS } from '$lib/constants/chat'
	import { date_utilities } from '$lib/utils/date-utilities'

	const { iso }: { iso: string } = $props()

	// '' for an unparseable timestamp; the {#if} then renders nothing rather than an empty <time>.
	const formatted = $derived(date_utilities.format_chat_time(iso))
</script>

{#if formatted}
	<time datetime={iso} class="mt-1 block text-xs text-white/40" data-testid="chat-message-time">
		<span class="sr-only">{CHAT_LABELS.ANSWERED_AT} </span>{formatted}
	</time>
{/if}
