<script lang="ts">
	import BaseIcon from '$lib/icons/BaseIcon.svelte'

	const {
		size = '1rem',
		title = 'Calendar',
		aria_label,
	} = $props<{
		size?: string
		title?: string
		aria_label?: string
	}>()
</script>

<BaseIcon {size} {title} {aria_label}>
	<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
	<line x1="16" y1="2" x2="16" y2="6"></line>
	<line x1="8" y1="2" x2="8" y2="6"></line>
	<line x1="3" y1="10" x2="21" y2="10"></line>
</BaseIcon>
