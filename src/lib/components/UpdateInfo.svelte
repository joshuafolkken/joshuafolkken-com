<script lang="ts">
	import { resolve } from '$app/paths'
	import { LINK_REL, LINK_TARGET } from '$lib/app'
	import CalendarIcon from '$lib/icons/CalendarIcon.svelte'
	import GitHubIcon from '$lib/icons/GitHubIcon.svelte'
	import ListIcon from '$lib/icons/ListIcon.svelte'

	const last_updated = '2025-11-19'

	interface UpdateNote {
		text: string
		link?: string
	}

	const update_notes: Array<UpdateNote> = [
		{ text: 'Adjusted AdSense tags' },
		{ text: 'Created sitemap' },
		{ text: 'Improved SEO' },
	]

	function get_href(link: string | undefined): string | undefined {
		if (link === undefined || link === '') {
			return undefined
		}
		if (link.startsWith('http')) {
			return link
		}
		return resolve(link as '/projects' | '/profile' | '/privacy-policy')
	}
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
				<li>
					{#if get_href(note.link)}
						{@const href = get_href(note.link)}
						{@const is_external = note.link?.startsWith('http') ?? false}
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
			<a
				href="https://github.com/joshuafolkken/joshuafolkken-com/pulls?q=is%3Apr+is%3Aclosed"
				target={LINK_TARGET}
				rel={LINK_REL}
				class="link-base flex items-center gap-1.5"
				aria-label="View all updates on GitHub"
			>
				<GitHubIcon size="1rem" aria_label="" />
				<span>More</span>
			</a>
		</div>
	</div>
</div>
