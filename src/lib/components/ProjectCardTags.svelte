<script lang="ts">
	import LiftedTechPill from '$lib/components/LiftedTechPill.svelte'
	import { PROJECT_CARD_TAGS_ROW_CLASS } from '$lib/constants/card-styles'

	const {
		tags,
		class: class_name = '',
	}: {
		tags: ReadonlyArray<string>
		class?: string
	} = $props()

	const row_class = $derived(
		class_name ? `${PROJECT_CARD_TAGS_ROW_CLASS} ${class_name}` : PROJECT_CARD_TAGS_ROW_CLASS,
	)
</script>

{#if tags.length}
	<div class={row_class}>
		{#each tags as tag (tag)}
			<LiftedTechPill name={tag} />
		{/each}
	</div>
{/if}
