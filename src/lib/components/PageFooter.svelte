<script lang="ts">
	import RevealSection from '$lib/components/RevealSection.svelte'
	import SectionHeading from '$lib/components/SectionHeading.svelte'
	import HeartIcon from '$lib/icons/HeartIcon.svelte'
	import SupportersList from './SupportersList.svelte'
</script>

<footer data-testid="top-supporters" class="space-y-6 text-sm text-white/60">
	<RevealSection py="py-12">
		<SectionHeading icon={HeartIcon} title="Top Supporters" class="mb-12" />
		<SupportersList />
	</RevealSection>
</footer>
