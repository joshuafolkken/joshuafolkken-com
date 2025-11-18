<script lang="ts">
	const {
		size = '1.5rem',
		title = 'Talk',
		aria_label,
	} = $props<{
		size?: string
		title?: string
		aria_label?: string
		class?: string
	}>()
</script>

<svg
	viewBox="0 0 24 24"
	width={size}
	height={size}
	class="text-white"
	role="img"
	aria-label={aria_label}
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<title>{title}</title>
	<!-- Microphone body -->
	<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
	<path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
	<!-- Microphone stand -->
	<line x1="12" y1="19" x2="12" y2="23"></line>
	<line x1="8" y1="23" x2="16" y2="23"></line>
</svg>
