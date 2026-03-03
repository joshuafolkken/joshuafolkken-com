<script lang="ts">
	import { page } from '$app/state'
	import { opencollective_utilities } from '$lib/opencollective-utilities'
	import type { OpenCollectiveMember } from '$lib/types/opencollective'
	import { PAGES } from '$lib/types/page'

	const { supporters = [] }: { supporters?: Array<OpenCollectiveMember> } = page.data
</script>

{#if supporters.length > 0}
	<div class="mt-0 flex flex-col items-center gap-2">
		{#each supporters as supporter, index (supporter.MemberId)}
			<a
				href={PAGES.DONATIONS.link}
				target="_blank"
				rel="noopener noreferrer"
				class="group flex w-auto items-center gap-3 rounded-lg px-6 py-3 text-white/60 transition duration-300 hover:bg-slate-800/60 hover:text-white/80"
			>
				<!-- Rank -->
				<span class="w-4 text-center text-sm font-bold">{index + 1}</span>

				<!-- Avatar -->
				<div class="shrink-0 opacity-80 transition-opacity group-hover:opacity-100">
					<img
						src={opencollective_utilities.get_avatar_url(supporter)}
						alt={supporter.name}
						class="h-10 w-10 rounded-full border border-gray-200 bg-gray-50 object-cover"
						loading="lazy"
					/>
				</div>

				<!-- Details -->
				<div class="flex min-w-0 flex-1 flex-col text-start">
					<span class="line-clamp-2 text-sm font-medium">
						{supporter.name}
					</span>
				</div>
			</a>
		{/each}
	</div>
{/if}
