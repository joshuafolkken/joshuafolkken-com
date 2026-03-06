<script lang="ts">
	import BaseIcon from '$lib/icons/BaseIcon.svelte'

	const {
		size = '1.5rem',
		title = 'Film',
		aria_label,
	} = $props<{
		size?: string
		title?: string
		aria_label?: string
	}>()
</script>

<BaseIcon {size} {title} {aria_label}>
	<!-- Film camera -->
	<rect x="2" y="3" width="20" height="18" rx="2"></rect>
	<path d="M7 3v18"></path>
	<path d="M17 3v18"></path>
	<path d="M2 8h5"></path>
	<path d="M2 16h5"></path>
	<path d="M17 8h5"></path>
	<path d="M17 16h5"></path>
</BaseIcon>
