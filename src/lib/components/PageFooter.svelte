<script lang="ts">
	import RevealSection from '$lib/components/RevealSection.svelte'
	import SupportersList from './SupportersList.svelte'
</script>

<footer class="mt-6 space-y-6 text-sm text-white/60">
	<RevealSection py="py-12">
		<h2 class="mb-8 text-center text-3xl font-bold tracking-tight text-white">Top Supporters</h2>
		<SupportersList />
	</RevealSection>
</footer>
