<script lang="ts">
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

<svg
	viewBox="0 0 24 24"
	width={size}
	height={size}
	role="img"
	aria-label={aria_label}
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<title>{title}</title>
	<!-- Running person -->
	<circle cx="12" cy="5" r="2"></circle>
	<path d="M12 7v6"></path>
	<path d="M8 13l-2-2"></path>
	<path d="M16 13l2-2"></path>
	<path d="M10 19l-2-2"></path>
	<path d="M14 19l2-2"></path>
</svg>
