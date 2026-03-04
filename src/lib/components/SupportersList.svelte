<script lang="ts">
	import { page } from '$app/state'
	import { LINK_REL, LINK_TARGET } from '$lib/app'
	import { opencollective_utilities } from '$lib/opencollective-utilities'
	import type { OpenCollectiveMember } from '$lib/types/opencollective'
	import { PAGES } from '$lib/types/page'

	const { supporters = [] }: { supporters?: Array<OpenCollectiveMember> } = page.data
</script>

{#if supporters.length}
	<div class="grid gap-4 sm:grid-cols-3">
		{#each supporters as supporter, index (supporter.MemberId)}
			<a
				href={PAGES.DONATIONS.link}
				target={LINK_TARGET}
				rel={LINK_REL}
				class="group flex items-center gap-4 rounded-2xl border border-white/5 bg-slate-900/40 p-5 transition-all duration-300 hover:border-white/10 hover:bg-slate-800/60"
			>
				<img
					src={opencollective_utilities.get_avatar_url(supporter)}
					alt={supporter.name}
					class="h-10 w-10 shrink-0 rounded-full border border-slate-500/50 object-cover opacity-80 transition duration-300 group-hover:opacity-100"
					loading="lazy"
				/>
				<div class="flex min-w-0 flex-col items-start gap-0.5">
					<span
						class="shrink-0 text-sm font-bold text-white/80 transition duration-300 group-hover:text-white"
					>
						{index + 1}.
					</span>
					<span
						class="min-w-0 text-sm font-medium wrap-break-word text-white/50 transition duration-300 group-hover:text-white"
					>
						{supporter.name}
					</span>
				</div>
			</a>
		{/each}
	</div>
{/if}
