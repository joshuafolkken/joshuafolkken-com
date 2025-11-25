<script lang="ts">
	import { page } from '$app/state'
	import type { OpenCollectiveMember } from '$lib/types/opencollective'
	import { PAGES } from '$lib/types/page'

	const { supporters = [] }: { supporters?: Array<OpenCollectiveMember> } = page.data

	// const supporters = $derived.by(() => {
	// 	if (raw_supporters.length === 0) return []
	// 	// ダミーで20件に増幅
	// 	const [base] = raw_supporters
	// 	if (base === undefined) return []

	// 	const DUMMY_ID_OFFSET = 10_000

	// 	return Array.from({ length: 5 }).map((_, index) => ({
	// 		...base,
	// 		MemberId: base.MemberId + DUMMY_ID_OFFSET + index, // ID重複回避
	// 		// name: `${base.name} #${i + 1}`,
	// 	}))
	// })

	function get_avatar_url(supporter: OpenCollectiveMember): string {
		if (supporter.image !== null) return supporter.image
		const slug = supporter.profile.split('/').pop() ?? 'guest'
		return `https://images.opencollective.com/${slug}/avatar.png`
	}
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
						src={get_avatar_url(supporter)}
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
