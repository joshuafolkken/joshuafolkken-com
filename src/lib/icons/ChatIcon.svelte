<script lang="ts">
	const {
		size = '1.5rem',
		title = 'Chat',
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
	<!-- Chat bubble -->
	<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
	<path d="M8 10h.01"></path>
	<path d="M12 10h.01"></path>
	<path d="M16 10h.01"></path>
</svg>
