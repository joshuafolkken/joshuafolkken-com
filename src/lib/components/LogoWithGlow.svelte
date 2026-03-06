<script lang="ts">
	import { HEADER_LOGO_GLOW_CLASS } from '$lib/constants/sticky-header-constants'
	import LogoIcon from '$lib/icons/LogoIcon.svelte'

	const { size }: { size?: number } = $props()

	const size_property = $derived(size === undefined ? {} : { size })
</script>

<div class="relative">
	<div
		class="absolute inset-0 scale-110 bg-sky-500/20 opacity-0 blur-lg transition-opacity group-hover:opacity-100"
	></div>
	<LogoIcon {...size_property} class="relative z-10 {HEADER_LOGO_GLOW_CLASS}" />
</div>
