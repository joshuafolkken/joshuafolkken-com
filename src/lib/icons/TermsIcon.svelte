<script lang="ts">
	import BaseIcon from '$lib/icons/BaseIcon.svelte'

	const {
		size = '1.5rem',
		title = 'Terms of Service',
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
	<!-- Document with text lines -->
	<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
	<polyline points="14 2 14 8 20 8"></polyline>
	<line x1="16" y1="13" x2="8" y2="13"></line>
	<line x1="16" y1="17" x2="8" y2="17"></line>
	<polyline points="10 9 9 9 8 9"></polyline>
</BaseIcon>
