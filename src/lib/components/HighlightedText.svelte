<script lang="ts">
	import type { HighlightSegment } from '$lib/utils/text-highlight'

	const { segments } = $props<{ segments: Array<HighlightSegment> }>()
</script>

<!-- The each stays on one line: inter-node whitespace would inject spaces into
the rendered text and break space-less Japanese. -->
<!-- eslint-disable max-len -->
<!-- prettier-ignore -->
{#each segments as segment, index (index)}{#if segment.is_match}<mark>{segment.text}</mark>{:else}{segment.text}{/if}{/each}

<!-- eslint-enable max-len -->

<style>
	mark {
		border-radius: 0.125rem;
		background-color: rgb(56 189 248 / 0.3);
		color: rgb(186 230 253);
	}
</style>
