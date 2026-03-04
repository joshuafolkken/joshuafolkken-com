<script lang="ts">
	const {
		size = '1.25rem',
		class: class_name = '',
		paths,
	} = $props<{
		size?: string
		class?: string
		paths: Array<string>
	}>()
</script>

<svg
	class={class_name}
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2.5"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{#each paths as path_d (path_d)}
		<path d={path_d}></path>
	{/each}
</svg>
