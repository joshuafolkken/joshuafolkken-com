<script lang="ts">
	import BaseIcon from '$lib/icons/BaseIcon.svelte'

	const {
		size = '1.5rem',
		title = 'Tennis',
		aria_label,
	} = $props<{
		size?: string
		title?: string
		aria_label?: string
	}>()
</script>

<BaseIcon {size} {title} {aria_label}>
	<!-- Tennis ball -->
	<circle cx="12" cy="12" r="10"></circle>
	<path
		d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
	></path>
</BaseIcon>
