<script lang="ts">
	// The raw failure detail (HTTP code + server message) rendered as a muted sub-message beneath the
	// friendly error headline, so it is available for debugging without alarming the reader.
	const { detail }: { detail: string } = $props()
</script>

<p
	class="mt-1 text-xs break-words whitespace-pre-wrap text-white/40"
	data-testid="chat-message-error-detail"
>
	{detail}
</p>
