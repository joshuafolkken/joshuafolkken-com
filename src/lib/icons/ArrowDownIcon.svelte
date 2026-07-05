<script lang="ts">
	import StrokeIcon from '$lib/icons/StrokeIcon.svelte'

	const { size = '1.25rem', class: class_name = '' } = $props<{
		size?: string
		class?: string
	}>()

	const ARROW_DOWN_PATHS = ['M12 5v14', 'm19 12-7 7-7-7']
</script>

<StrokeIcon {size} class={class_name} paths={ARROW_DOWN_PATHS} />
