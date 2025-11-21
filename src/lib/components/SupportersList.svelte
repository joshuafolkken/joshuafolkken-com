<script lang="ts">
	import { page } from '$app/state'
	import type { OpenCollectiveMember } from '$lib/types/opencollective'

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
	<div class="mt-6 flex flex-col items-center gap-2">
		{#each supporters as supporter, index (supporter.MemberId)}
			<div
				class="flex max-w-[240px] min-w-[240px] items-center gap-3 rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10"
			>
				<!-- Rank -->
				<span class="w-4 text-center text-sm font-bold text-white/40">{index + 1}</span>

				<!-- Avatar -->
				<a
					href={supporter.profile}
					target="_blank"
					rel="noopener noreferrer"
					class="shrink-0 transition-opacity hover:opacity-80"
				>
					<img
						src={get_avatar_url(supporter)}
						alt={supporter.name}
						class="h-10 w-10 rounded-full border border-gray-200 bg-gray-50 object-cover"
						loading="lazy"
					/>
				</a>

				<!-- Details -->
				<div class="flex min-w-0 flex-1 flex-col text-start">
					<a
						href={supporter.profile}
						target="_blank"
						rel="noopener noreferrer"
						class="line-clamp-2 text-sm font-medium"
					>
						{supporter.name}
					</a>
					<!-- <p class="text-xs text-white/60">
						¥{supporter.totalAmountDonated.toLocaleString()}
						<span class="ml-1 text-white/40">JPY</span>
					</p> -->
				</div>
			</div>
		{/each}
	</div>
{/if}
