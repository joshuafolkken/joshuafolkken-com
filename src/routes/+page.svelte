<script lang="ts">
	import LinkCard from '$lib/components/LinkCard.svelte'
	import PageHeader from '$lib/components/PageHeader.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import SocialLinks from '$lib/components/SocialLinks.svelte'
	import { PAGES } from '$lib/types/page'
</script>

<PageLayout max_width="sm">
	<PageHeader page={PAGES.TOP} />

	<!-- <Divider />
	<LinkCard page={PAGES.TALK} /> -->

	<LinkCard page={PAGES.PROJECTS} />

	<LinkCard page={PAGES.BLOG} />

	<LinkCard page={PAGES.PROFILE} />

	<LinkCard page={PAGES.SOCIAL_LINKS} />
	<SocialLinks icon_size="1.5rem" justify_content="start" class="mt-2 mb-4" />

	<!-- <Divider />
	<LinkCard page={PAGES.DONATIONS} /> -->
</PageLayout>
