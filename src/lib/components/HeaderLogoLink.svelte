<script lang="ts">
	import { resolve } from '$app/paths'
	import { AUTHOR } from '$lib/app'
	import LogoWithGlow from '$lib/components/LogoWithGlow.svelte'
	import { HEADER_ICON_SIZE, HEADER_LOGO_GLOW_CLASS } from '$lib/constants/sticky-header-constants'
</script>

<a
	href={resolve('/')}
	class="cyber-glow-hover group flex shrink-0 items-center gap-3 rounded-lg px-2 py-1 hover:scale-105 active:scale-95"
	aria-label="ホーム"
>
	<LogoWithGlow size={HEADER_ICON_SIZE} />
	<span
		class="text-xl font-medium tracking-tight text-white/90 {HEADER_LOGO_GLOW_CLASS} group-hover:text-white"
	>
		{AUTHOR.NAME}
	</span>
</a>
