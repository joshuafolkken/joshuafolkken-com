<script lang="ts">
	import SocialLinks from '$lib/components/SocialLinks.svelte'
</script>

<div class="flex justify-center">
	<div class="flex w-full max-w-md flex-col px-4">
		<h1 class="mt-20 text-4xl font-light tracking-tight">joshuafolkken.com</h1>

		<p class="mt-6 text-right text-xl text-white/80 italic">Creating the future</p>

		<div class="my-6 h-px bg-white/30"></div>

		<div>
			<a
				href="https://talk.joshuafolkken.com"
				target="_blank"
				class="text-white/70 underline-offset-4 transition duration-300 hover:text-white"
			>
				<h2 class="mb-1 text-xl">Talk</h2>
				<p>Language Learning Game - Listen and Repeat</p>
			</a>
		</div>

		<div class="my-6 h-px bg-white/30"></div>

		<div>
			<!-- eslint-disable svelte/no-navigation-without-resolve -->
			<a
				href="/profile"
				class="text-white/70 underline-offset-4 transition duration-300 hover:text-white"
			>
				<h2 class="mb-1 text-xl">Profile</h2>
				<p>About Joshua Folkken</p>
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
		</div>

		<div class="my-6 h-px bg-white/30"></div>

		<SocialLinks icon_size="2rem" justify_content="start" />

		<div class="my-6 h-px bg-white/30"></div>

		<footer class="mt space-y-1 text-center text-sm text-white/60">
			<p>Privacy Policy</p>
			<p>&copy; {new Date().getFullYear()} Joshua Folkken</p>
		</footer>
	</div>
</div>
