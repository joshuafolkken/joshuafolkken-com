<script lang="ts">
	import BaseIcon from '$lib/icons/BaseIcon.svelte'

	const {
		size = '1.25rem',
		title = 'Check',
		aria_label,
	} = $props<{
		size?: string
		title?: string
		aria_label?: string
	}>()
</script>

<BaseIcon {size} {title} {aria_label} fill="none" stroke="currentColor">
	<polyline points="20 6 9 17 4 12"></polyline>
</BaseIcon>
