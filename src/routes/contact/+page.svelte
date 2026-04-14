<script lang="ts">
	import { AUTHOR } from '$lib/app'
	import PageHeader from '$lib/components/PageHeader.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import PageSection from '$lib/components/PageSection.svelte'
	import SocialLinkItem from '$lib/components/SocialLinkItem.svelte'
	import { ICON_SIZE_MD } from '$lib/constants/layout'
	import { CONTACT_SOCIAL_LINKS } from '$lib/data/social-links'
	import { PAGES } from '$lib/types/page'
	import EmailReveal from './EmailReveal.svelte'

	const SOCIAL_LINK_CLASS =
		'inline-flex items-center gap-3 rounded-lg border border-white/10 bg-slate-800/30 px-4 py-2 text-white/80 transition hover:border-white/30 hover:bg-slate-800/70 hover:text-white'
</script>

<svelte:head>
	<title>{PAGES.CONTACT.title} - {AUTHOR.NAME}</title>
	<meta name="description" content={PAGES.CONTACT.description} />
</svelte:head>

<PageLayout>
	<PageHeader page={PAGES.CONTACT} />

	<PageSection title="Connect on social">
		<p class="mb-4">
			The quickest way to reach out is through social channels — DM, comment, or subscribe.
		</p>
		<ul class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
			{#each CONTACT_SOCIAL_LINKS as link (link.href)}
				<li>
					<SocialLinkItem {link} has_label icon_size={ICON_SIZE_MD} class={SOCIAL_LINK_CLASS} />
				</li>
			{/each}
		</ul>
	</PageSection>

	<PageSection title="Email">
		<p class="mb-4">
			Prefer email? Click below to reveal the address — we keep it hidden from the page source to
			reduce spam.
		</p>
		<EmailReveal />
	</PageSection>
</PageLayout>
