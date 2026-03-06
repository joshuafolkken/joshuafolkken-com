<script lang="ts">
	import BaseIcon from '$lib/icons/BaseIcon.svelte'

	const {
		size = '1rem',
		title = 'Live Demo',
		aria_label,
	} = $props<{
		size?: string
		title?: string
		aria_label?: string
	}>()
</script>

<BaseIcon {size} {title} {aria_label}>
	<!-- Play button icon -->
	<polygon points="5 3 19 12 5 21 5 3"></polygon>
</BaseIcon>
