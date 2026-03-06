<script lang="ts">
	import BaseIcon from '$lib/icons/BaseIcon.svelte'

	const {
		size = '1.5rem',
		title = 'Running',
		aria_label,
	} = $props<{
		size?: string
		title?: string
		aria_label?: string
	}>()
</script>

<BaseIcon {size} {title} {aria_label}>
	<!-- Running person -->
	<circle cx="12" cy="5" r="2"></circle>
	<path d="M12 7v6"></path>
	<path d="M8 13l-2-2"></path>
	<path d="M16 13l2-2"></path>
	<path d="M10 19l-2-2"></path>
	<path d="M14 19l2-2"></path>
</BaseIcon>
