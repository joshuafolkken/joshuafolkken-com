<script lang="ts">
	const {
		size = '1.5rem',
		title = 'Film',
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
	<!-- Film camera -->
	<rect x="2" y="3" width="20" height="18" rx="2"></rect>
	<path d="M7 3v18"></path>
	<path d="M17 3v18"></path>
	<path d="M2 8h5"></path>
	<path d="M2 16h5"></path>
	<path d="M17 8h5"></path>
	<path d="M17 16h5"></path>
</svg>
