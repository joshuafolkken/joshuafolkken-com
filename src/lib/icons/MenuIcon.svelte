<script lang="ts">
	import StrokeIcon from '$lib/icons/StrokeIcon.svelte'

	const { size = '1.25rem', class: class_name = '' } = $props<{
		size?: string
		class?: string
	}>()

	const MENU_PATHS = ['M4 6h16M4 12h16M12 18h8']
</script>

<StrokeIcon {size} class={class_name} paths={MENU_PATHS} />
