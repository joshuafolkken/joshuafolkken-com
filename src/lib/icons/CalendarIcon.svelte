<script lang="ts">
	const {
		size = '1rem',
		title = 'Calendar',
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
	<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
	<line x1="16" y1="2" x2="16" y2="6"></line>
	<line x1="8" y1="2" x2="8" y2="6"></line>
	<line x1="3" y1="10" x2="21" y2="10"></line>
</svg>
