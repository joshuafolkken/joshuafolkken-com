<script lang="ts">
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
	<!-- Play button icon -->
	<polygon points="5 3 19 12 5 21 5 3"></polygon>
</svg>
