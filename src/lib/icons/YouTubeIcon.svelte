<script lang="ts">
	const { title = 'YouTube', aria_label } = $props<{
		title?: string
		aria_label?: string
	}>()
</script>

<svg viewBox="0 0 24 24" width="100%" height="100%" role="img" aria-label={aria_label}>
	<title>{title}</title>
	<path
		fill="currentColor"
		d="M23.498 6.186a2.966 2.966 0 0 0-2.086-2.1C19.692 3.5 12 3.5 12 3.5s-7.692 0-9.412.586a2.966 2.966 0 0 0-2.086 2.1A31.327 31.327 0 0 0 0 12a31.327 31.327 0 0 0 .502 5.814 2.966 2.966 0 0 0 2.086 2.1C4.308 20.5 12 20.5 12 20.5s7.692 0 9.412-.586a2.966 2.966 0 0 0 2.086-2.1A31.327 31.327 0 0 0 24 12a31.327 31.327 0 0 0-.502-5.814ZM9.75 15.5v-7l6 3.5-6 3.5Z"
	></path>
</svg>
