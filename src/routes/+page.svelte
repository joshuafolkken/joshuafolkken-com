<script lang="ts">
	import Divider from '$lib/components/Divider.svelte'
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

	<Divider />
	<LinkCard page={PAGES.PROJECTS} />

	<Divider />
	<LinkCard page={PAGES.BLOG} />

	<Divider />
	<LinkCard page={PAGES.PROFILE} />

	<Divider />
	<LinkCard page={PAGES.SOCIAL_LINKS} />
	<SocialLinks icon_size="1.5rem" justify_content="start" class="mt-4" />
</PageLayout>
