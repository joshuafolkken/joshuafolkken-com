<script lang="ts">
	const { title = 'Mail', aria_label } = $props<{
		title?: string
		aria_label?: string
	}>()
</script>

<svg viewBox="0 0 24 24" width="100%" height="100%" role="img" aria-label={aria_label}>
	<title>{title}</title>
	<path
		fill="currentColor"
		d="M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v.217l10 6.25 10-6.25V6H2Zm0 12h20V8.533l-9.538 5.958a1 1 0 0 1-1.008 0L2 8.533V18Z"
	></path>
</svg>
