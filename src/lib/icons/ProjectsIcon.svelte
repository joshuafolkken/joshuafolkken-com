<script lang="ts">
	import BaseIcon from '$lib/icons/BaseIcon.svelte'

	const {
		size = '1.5rem',
		title = 'Projects',
		aria_label,
		class: class_name = '',
	} = $props<{
		size?: string
		title?: string
		aria_label?: string
		class?: string
	}>()
</script>

<BaseIcon {size} {title} {aria_label} class={class_name}>
	<!-- Package/箱アイコン -->
	<path
		d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
	></path>
	<path d="M3.27 6.96L12 12.01l8.73-5.05"></path>
	<path d="M12 22.08V12"></path>
</BaseIcon>
