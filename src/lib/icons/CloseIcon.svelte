<script lang="ts">
	import StrokeIcon from '$lib/icons/StrokeIcon.svelte'

	const { size = '1.25rem', class: class_name = '' } = $props<{
		size?: string
		class?: string
	}>()

	const CLOSE_PATHS = ['M18 6 6 18', 'm6 6 12 12']
</script>

<StrokeIcon {size} class={class_name} paths={CLOSE_PATHS} />
