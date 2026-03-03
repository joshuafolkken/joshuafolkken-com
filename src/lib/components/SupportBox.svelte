<script lang="ts">
	import { LINK_REL, LINK_TARGET } from '$lib/app'
	import SupportIcon from '$lib/icons/SupportIcon.svelte'
	import { PAGES } from '$lib/types/page'
</script>

<div
	class="mt-6 mb-6 flex flex-col items-center justify-center gap-4 rounded-xl border border-white/10 bg-slate-800/50 p-6 text-center backdrop-blur-sm"
>
	<h3 class="mt-0! text-lg font-medium text-white/90">いいなと思ったら応援しよう！</h3>
	<a
		href={PAGES.DONATIONS.link}
		target={LINK_TARGET}
		rel={LINK_REL}
		class="flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-emerald-700 px-8 py-3 font-bold text-white no-underline shadow-lg transition-all duration-300 hover:scale-105 hover:bg-emerald-600 hover:shadow-emerald-900/50 active:scale-95"
	>
		<SupportIcon size="1.3rem" />
		<span>チップで応援する</span>
	</a>
	<p class="my-0! text-sm text-white/60">応援してもらえると最高に嬉しいです！</p>
</div>
