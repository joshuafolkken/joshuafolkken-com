<script lang="ts">
	import { LINK_REL, LINK_TARGET } from '$lib/app'
	import SupportIcon from '$lib/icons/SupportIcon.svelte'
	import { PAGES } from '$lib/types/page'
</script>

<div
	class="mt-6 mb-6 flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/5 bg-slate-900/50 p-8 text-center"
>
	<h3 class="mt-0! text-lg font-medium text-white/90">いいなと思ったら応援しよう！</h3>
	<a
		href={PAGES.DONATIONS.link}
		target={LINK_TARGET}
		rel={LINK_REL}
		class="cyber-glow-hover flex w-full max-w-md items-center justify-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-8 py-3 font-semibold text-sky-400 no-underline transition-all duration-300 hover:scale-105 hover:border-sky-400/60 hover:bg-sky-500/20 hover:text-sky-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] active:scale-95"
	>
		<SupportIcon size="1.3rem" />
		<span>チップで応援する</span>
	</a>
	<p class="my-0! text-sm text-white/50">応援してもらえると最高に嬉しいです！</p>
</div>
