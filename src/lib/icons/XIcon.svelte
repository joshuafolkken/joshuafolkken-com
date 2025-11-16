<script lang="ts">
	const {
		size = '1.5rem',
		title = 'X',
		aria_label,
	} = $props<{
		size?: string
		title?: string
		aria_label?: string
	}>()
</script>

<svg viewBox="0 0 24 24" width={size} height={size} role="img" aria-label={aria_label}>
	<title>{title}</title>
	<path
		fill="currentColor"
		d="M18.244 2.25h3.308l-7.227 8.26 8.507 11.24H16.41l-5.21-6.843-5.97 6.843H1.922l7.688-8.804L1.5 2.25h6.047l4.713 6.234 6-6.234Z"
	></path>
</svg>
