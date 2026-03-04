<script lang="ts">
	import { LAST_UPDATED, URLS } from '$lib/app'
	import ExternalLink from '$lib/components/ExternalLink.svelte'
	import OptionalLink from '$lib/components/OptionalLink.svelte'
	import { ICON_LABEL_ROW_CENTER_CLASS, ICON_SIZE_SM, LINK_BASE_CLASS } from '$lib/constants/layout'
	import { UPDATE_NOTES } from '$lib/data/update-notes'
	import CalendarIcon from '$lib/icons/CalendarIcon.svelte'
	import GitHubIcon from '$lib/icons/GitHubIcon.svelte'
	import ListIcon from '$lib/icons/ListIcon.svelte'
	import { link_utilities } from '$lib/utils/link-utilities'

	const last_updated = LAST_UPDATED.UPDATE_INFO
</script>

<div class="space-y-4 text-center text-sm text-white/60">
	<div class={ICON_LABEL_ROW_CENTER_CLASS}>
		<CalendarIcon size={ICON_SIZE_SM} aria_label="Last updated" />
		<p class="font-medium">{last_updated}</p>
	</div>
	<div class="space-y-1">
		<div class="mb-2 {ICON_LABEL_ROW_CENTER_CLASS}">
			<ListIcon size={ICON_SIZE_SM} aria_label="Latest updates" />
			<p class="font-medium">Latest</p>
		</div>
		<ul class="space-y-1">
			{#each UPDATE_NOTES as note (note.text)}
				{@const link_info = link_utilities.get_link_info(note.link)}
				<li>
					<OptionalLink {link_info} link_class={LINK_BASE_CLASS}>
						• {note.text}
					</OptionalLink>
				</li>
			{/each}
		</ul>
		<div class="mt-2 flex items-center justify-center gap-1.5">
			<ExternalLink
				href={URLS.GITHUB_PRS}
				class="flex items-center gap-1.5"
				aria_label="View all updates on GitHub"
			>
				<span aria-hidden="true">
					<GitHubIcon size={ICON_SIZE_SM} />
				</span>
				<span>More</span>
			</ExternalLink>
		</div>
	</div>
</div>
