<script lang="ts">
	import { page } from '$app/state'
	import { LINK_REL, LINK_TARGET } from '$lib/app'
	import { CARD_BASE_CLASS } from '$lib/constants/card-styles'
	import { opencollective_utilities } from '$lib/opencollective-utilities'
	import type { OpenCollectiveMember } from '$lib/types/opencollective'
	import { PAGES } from '$lib/types/page'

	const { supporters = [] }: { supporters?: Array<OpenCollectiveMember> } = page.data
</script>

{#if supporters.length}
	<div class="grid gap-4 lg:grid-cols-3">
		{#each supporters as supporter, index (supporter.MemberId)}
			<a
				href={PAGES.DONATIONS.link}
				target={LINK_TARGET}
				rel={LINK_REL}
				class="flex items-center gap-4 p-5 {CARD_BASE_CLASS}"
			>
				<img
					src={opencollective_utilities.get_avatar_url(supporter)}
					alt={supporter.name}
					class="h-10 w-10 shrink-0 rounded-full border border-slate-500/50 object-cover opacity-80 transition duration-300 group-hover:opacity-100"
					loading="lazy"
				/>
				<div class="flex min-w-0 flex-col items-start gap-0.5">
					<span
						class="shrink-0 text-sm font-bold text-white/70 transition duration-300 group-hover:text-white"
					>
						{index + 1}.
					</span>
					<span
						class="min-w-0 text-sm font-medium wrap-break-word text-white/50 transition duration-300 group-hover:text-white/80"
					>
						{supporter.name}
					</span>
				</div>
			</a>
		{/each}
	</div>
{/if}
