<script lang="ts">
	import { APP, URLS } from '$lib/app'
	import Divider from '$lib/components/Divider.svelte'
	import LogoProposals from '$lib/components/LogoProposals.svelte'
	import PageFooter from '$lib/components/PageFooter.svelte'
	import SocialLinks from '$lib/components/SocialLinks.svelte'
</script>

<div class="flex justify-center">
	<div class="flex w-full max-w-md flex-col px-4">
		<h1 class="mt-20 text-4xl font-light tracking-tight">{APP.NAME}</h1>

		<p class="mt-6 text-right text-xl text-white/80 italic">{APP.DESCRIPTION}</p>

		<Divider />

		<LogoProposals />

		<Divider />

		<div>
			<a
				href={URLS.TALK}
				target="_blank"
				class="text-white/70 underline-offset-4 transition duration-300 hover:text-white"
			>
				<h2 class="mb-1 text-xl">Talk</h2>
				<p>Language Learning Game - Listen and Repeat</p>
			</a>
		</div>

		<Divider />

		<div>
			<a
				href="/profile"
				class="text-white/70 underline-offset-4 transition duration-300 hover:text-white"
			>
				<h2 class="mb-1 text-xl">Profile</h2>
				<p>About Joshua Folkken</p>
			</a>
		</div>

		<Divider />

		<SocialLinks icon_size="2rem" justify_content="start" />

		<Divider />

		<PageFooter />
	</div>
</div>
