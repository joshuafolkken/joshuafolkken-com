<script lang="ts">
	import { APP, URLS } from '$lib/app'
	import ContentCard from '$lib/components/ContentCard.svelte'
	import Divider from '$lib/components/Divider.svelte'
	import LinkCard from '$lib/components/LinkCard.svelte'
	import PageFooter from '$lib/components/PageFooter.svelte'
	import PageHeader from '$lib/components/PageHeader.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import SocialLinks from '$lib/components/SocialLinks.svelte'
	import LinkIcon from '$lib/icons/LinkIcon.svelte'
	import OpenCollectiveIcon from '$lib/icons/OpenCollectiveIcon.svelte'
	import ProjectsIcon from '$lib/icons/ProjectsIcon.svelte'
	import UserIcon from '$lib/icons/UserIcon.svelte'
</script>

<PageLayout max_width="sm" padding="default">
	<PageHeader title={APP.NAME} subtitle={APP.DESCRIPTION} />

	<Divider />
	<LinkCard
		href="/projects"
		icon={ProjectsIcon}
		title="Projects"
		description="Building Games That Matter"
	/>

	<Divider />
	<LinkCard href="/profile" icon={UserIcon} title="Profile" description="About Joshua Folkken" />

	<Divider />
	<ContentCard icon={LinkIcon} title="Social Links" description="Connect with me" />
	<SocialLinks icon_size="1.5rem" justify_content="start" class="mt-4" />

	<Divider />

	<LinkCard
		href={URLS.OPEN_COLLECTIVE}
		is_external={true}
		icon={OpenCollectiveIcon}
		title="Support & Donations"
		description="Support our mission"
	/>

	<Divider />
	<PageFooter />
</PageLayout>
