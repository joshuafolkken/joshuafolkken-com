<script lang="ts">
	import BaseIcon from '$lib/icons/BaseIcon.svelte'

	const {
		size = '1.5rem',
		title = 'Search',
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
	<!-- Magnifying glass / 虫眼鏡 -->
	<circle cx="10" cy="10" r="8"></circle>
	<line x1="22" y1="22" x2="16" y2="16"></line>
</BaseIcon>
