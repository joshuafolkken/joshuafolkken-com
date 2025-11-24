<script lang="ts">
	import { APP, AUTHOR, LINK_REL, LINK_TARGET, OPENCOLLECTIVE } from '$lib/app'
	import AdSenseScript from '$lib/components/AdSenseScript.svelte'
	import LikeContainer from '$lib/components/LikeContainer.svelte'
	import PageHeader from '$lib/components/PageHeader.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import PageSection from '$lib/components/PageSection.svelte'
	import SupportBox from '$lib/components/SupportBox.svelte'
	import TechStack from '$lib/components/TechStack.svelte'
	import { PAGES } from '$lib/types/page'
</script>

<svelte:head>
	<title>{PAGES.PROFILE.title} - {AUTHOR.NAME}</title>
	<meta name="description" content={PAGES.PROFILE.description} />
</svelte:head>

<AdSenseScript />

<PageLayout>
	<PageHeader page={PAGES.PROFILE} />

	<PageSection title="Hi there! 👋 I'm {AUTHOR.NAME}">
		<p class="mt-4 text-lg text-white/80">
			<strong>Indie Game Developer & Educator</strong> | Japan 🇯🇵
		</p>
		<p class="mt-2">
			Creating games that bring smiles to children's faces and contribute to society through
			technology.
		</p>
	</PageSection>

	<!-- What I Do -->
	<PageSection title="🌟 What I Do">
		<div class="space-y-6">
			<div>
				<h3 class="mb-2 text-xl font-medium">🎮 Game Development</h3>
				<ul class="ml-4 list-disc space-y-1">
					<li>
						<strong>Technologies</strong>: TypeScript + SvelteKit (Web Apps), Godot 4 with Typed
						GDScript
					</li>
					<li>
						<strong>Focus</strong>: Language Learning Games, 2D Platformers, Multiplayer Games,
						Classic Game Recreation
					</li>
					<li><strong>Future</strong>: VR/AR Game Development</li>
				</ul>
			</div>

			<div>
				<h3 class="mb-2 text-xl font-medium">👨‍🏫 Community & Education</h3>
				<ul class="ml-4 list-disc space-y-1">
					<li>
						<strong>Career Counseling</strong>: Supporting young people aspiring to become engineers
					</li>
					<li>
						<strong>Programming Workshops</strong>: Teaching programming to children and young
						adults
					</li>
					<li>
						<strong>Gaming Sessions</strong>: Organizing game explanation sessions for children and
						elderly
					</li>
					<li>
						<strong>Community Building</strong>: Running communities for aspiring engineers
					</li>
				</ul>
			</div>
		</div>
	</PageSection>

	<TechStack />

	<!-- GitHub Stats -->
	<PageSection title="📊 GitHub Stats">
		<div class="space-y-4">
			<img
				src="https://github-readme-stats.vercel.app/api?username=joshuafolkken&show_icons=true&theme=tokyonight&count_private=true"
				alt="Joshua's GitHub stats"
				class="w-full rounded"
			/>
			<img
				src="https://github-readme-stats.vercel.app/api/top-langs/?username=joshuafolkken&layout=compact&theme=tokyonight"
				alt="Top Languages"
				class="w-full rounded"
			/>
		</div>
	</PageSection>

	<!-- Philosophy -->
	<PageSection title="🌈 Philosophy">
		<blockquote class="border-l-4 border-white/30 pl-4 italic">
			"Small thoughts from each individual support today's children and tomorrow's society."
		</blockquote>
		<p class="mt-4">
			With 25+ years of engineering experience, I'm dedicated to nurturing the next generation of
			developers while creating games that bring joy and learning opportunities to people of all
			ages.
		</p>
	</PageSection>

	<!-- Community Support -->
	<PageSection title="💖 Community Support">
		<div class="space-y-4">
			<p>
				I believe in giving back to the community. Through
				<a
					href={OPENCOLLECTIVE.URL}
					target={LINK_TARGET}
					rel={LINK_REL}
					class="link-base text-white/80"
				>
					<strong>Joshua Studio on Open Collective</strong>
				</a>
				, we support:
			</p>
			<ul class="ml-4 list-disc space-y-1">
				<li>👥 Career consultation sessions for aspiring engineers</li>
				<li>🎓 Job hunting and skill development support</li>
				<li>👶 Programming workshops for children and youth</li>
				<li>🎮 Game explanation sessions for children and elderly</li>
				<li>🏗️ Infrastructure development and new technology research</li>
				<li>🐛 Software bug fixes and manual improvements</li>
			</ul>
			<blockquote class="mt-4 border-l-4 border-white/30 pl-4 italic">
				<strong>"{APP.DESCRIPTION}"</strong> - 私達はゲームやツールの制作を通して、子どもたちの明るい笑顔を支える社会貢献を行います
			</blockquote>
		</div>
	</PageSection>

	<!-- Footer Message -->
	<PageSection title="⭐️ Thanks for visiting! ⭐️">
		<div>
			<p>Consider starring my repositories or supporting our mission through Open Collective!</p>
			<p class="mt-4">
				All source code is available for learning purposes. Let's build a brighter future together!
				🌟
			</p>
		</div>
	</PageSection>

	<SupportBox />
	<LikeContainer slug="page:profile" />
</PageLayout>
