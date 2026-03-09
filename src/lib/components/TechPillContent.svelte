<script lang="ts">
	import type { TechIcon } from '$lib/data/si-icons'

	const { name, icon }: { name: string; icon?: TechIcon } = $props()
</script>

{#if icon}
	<svg viewBox={icon.view_box} class="size-3.5 shrink-0" fill="currentColor" aria-hidden="true">
		<path d={icon.path}></path>
	</svg>
{/if}
{name}
