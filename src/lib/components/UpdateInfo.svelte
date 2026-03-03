<script lang="ts">
	import { LAST_UPDATED, LINK_REL, LINK_TARGET, URLS } from '$lib/app'
	import ExternalLink from '$lib/components/ExternalLink.svelte'
	import CalendarIcon from '$lib/icons/CalendarIcon.svelte'
	import GitHubIcon from '$lib/icons/GitHubIcon.svelte'
	import ListIcon from '$lib/icons/ListIcon.svelte'
	import { link_utilities } from '$lib/utils/link-utilities'

	const last_updated = LAST_UPDATED.UPDATE_INFO

	interface UpdateNote {
		text: string
		link?: string
	}

	const update_notes: Array<UpdateNote> = [
		{ text: 'Adjusted AdSense tags' },
		{ text: 'Created sitemap' },
		{ text: 'Improved SEO' },
	]
</script>

<div class="space-y-4 text-center text-sm text-white/60">
	<div class="flex items-center justify-center gap-2 text-white/80">
		<CalendarIcon size="1rem" aria_label="Last updated" />
		<p class="font-medium">{last_updated}</p>
	</div>
	<div class="space-y-1">
		<div class="mb-2 flex items-center justify-center gap-2 text-white/80">
			<ListIcon size="1rem" aria_label="Latest updates" />
			<p class="font-medium">Latest</p>
		</div>
		<ul class="space-y-1">
			{#each update_notes as note (note.text)}
				{@const href = link_utilities.get_href(note.link)}
				<li>
					{#if href}
						{@const is_external = link_utilities.is_external_link(note.link)}
						<a
							{href}
							target={is_external ? LINK_TARGET : undefined}
							rel={is_external ? LINK_REL : undefined}
							class="link-base"
						>
							• {note.text}
						</a>
					{:else}
						• {note.text}
					{/if}
				</li>
			{/each}
		</ul>
		<div class="mt-2 flex items-center justify-center gap-1.5">
			<ExternalLink
				href={URLS.GITHUB_PRS}
				class="flex items-center gap-1.5"
				aria_label="View all updates on GitHub"
			>
				<GitHubIcon size="1rem" aria_label="" />
				<span>More</span>
			</ExternalLink>
		</div>
	</div>
</div>
