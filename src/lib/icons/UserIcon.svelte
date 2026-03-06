<script lang="ts">
	import BaseIcon from '$lib/icons/BaseIcon.svelte'

	const {
		size = '1.5rem',
		title = 'User',
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
	<!-- User/Person icon -->
	<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
	<circle cx="12" cy="7" r="4"></circle>
</BaseIcon>
