<script lang="ts">
	import BaseIcon from '$lib/icons/BaseIcon.svelte'

	const {
		size = '1.25rem',
		title = 'Copy',
		aria_label,
	} = $props<{
		size?: string
		title?: string
		aria_label?: string
	}>()
</script>

<BaseIcon {size} {title} {aria_label} fill="none" stroke="currentColor">
	<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
	<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
</BaseIcon>
