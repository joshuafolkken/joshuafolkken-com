<script lang="ts">
	const {
		size = '1.5rem',
		title = 'Link',
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
	<!-- Link icon -->
	<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
	<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
</svg>
