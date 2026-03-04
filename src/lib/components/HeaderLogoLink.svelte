<script lang="ts">
	import { resolve } from '$app/paths'
	import { AUTHOR } from '$lib/app'
	import { HEADER_ICON_SIZE, HEADER_LOGO_GLOW_CLASS } from '$lib/constants/sticky-header-constants'
	import LogoIcon from '$lib/icons/LogoIcon.svelte'
</script>

<a
	href={resolve('/')}
	class="group flex shrink-0 items-center gap-3 transition-transform hover:scale-105 active:scale-95"
	aria-label="ホーム"
>
	<div class="relative">
		<div
			class="absolute inset-0 scale-110 bg-sky-500/20 opacity-0 blur-lg transition-opacity group-hover:opacity-100"
		></div>
		<LogoIcon size={HEADER_ICON_SIZE} class="relative z-10 {HEADER_LOGO_GLOW_CLASS}" />
	</div>
	<span
		class="text-xl font-medium tracking-tight text-white/90 {HEADER_LOGO_GLOW_CLASS} group-hover:text-white"
	>
		{AUTHOR.NAME}
	</span>
</a>
