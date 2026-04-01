<script lang="ts">
	import RevealSection from '$lib/components/RevealSection.svelte'
	import { SECTION_HEADING_PRIMARY_CLASS } from '$lib/constants/typography'
	import SupportersList from './SupportersList.svelte'
</script>

<footer class="space-y-6 text-sm text-white/60">
	<RevealSection py="py-12">
		<h2 class="mb-12 text-center {SECTION_HEADING_PRIMARY_CLASS}">Top Supporters</h2>
		<SupportersList />
	</RevealSection>
</footer>
