<script lang="ts">
	import TechPill from '$lib/components/TechPill.svelte'
	import { TECH_PILL_LIFT_CLASS } from '$lib/constants/hover-styles'

	const { name, logo = '' }: { name: string; logo?: string } = $props()
</script>

<div class={TECH_PILL_LIFT_CLASS}>
	<TechPill {name} {logo} />
</div>
