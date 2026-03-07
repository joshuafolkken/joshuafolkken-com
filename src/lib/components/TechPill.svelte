<script lang="ts">
	import { tech_colors } from '$lib/data/tech-colors'

	const { name } = $props<{ name: string }>()

	const color = $derived(tech_colors.get(name))
</script>

<span
	class="rounded-full border px-3 py-1 font-mono text-xs"
	style:border-color="{color}40"
	style:color
	style:background-color="{color}10">{name}</span
>
