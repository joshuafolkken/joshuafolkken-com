<script lang="ts">
	import BaseIcon from '$lib/icons/BaseIcon.svelte'

	const {
		size = '1.5rem',
		title = 'OpenCollective',
		aria_label,
	} = $props<{
		size?: string
		title?: string
		aria_label?: string
	}>()
</script>

<BaseIcon {size} {title} {aria_label} fill="currentColor" stroke="none">
	<path
		d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.14 19.18c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-.14-11.18c-2.31 0-4.18 1.87-4.18 4.18s1.87 4.18 4.18 4.18 4.18-1.87 4.18-4.18-1.87-4.18-4.18-4.18z"
	></path>
</BaseIcon>
