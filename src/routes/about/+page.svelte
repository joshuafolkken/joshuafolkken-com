<script lang="ts">
	import { APP, app, AUTHOR, OPENCOLLECTIVE, URLS } from '$lib/app'
	import AdSenseScript from '$lib/components/AdSenseScript.svelte'
	import EngagementButtons from '$lib/components/EngagementButtons.svelte'
	import ExternalLink from '$lib/components/ExternalLink.svelte'
	import MetaTags from '$lib/components/MetaTags.svelte'
	import PageHeader from '$lib/components/PageHeader.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import PageSection from '$lib/components/PageSection.svelte'
	import SkillsSection from '$lib/components/SkillsSection.svelte'
	import SupportBox from '$lib/components/SupportBox.svelte'
	import TechStack from '$lib/components/TechStack.svelte'
	import {
		BLOCKQUOTE_CLASS,
		LINK_BASE_CLASS,
		LIST_DISC_CLASS,
		LIST_DISC_LINK_CLASS,
		SECTION_HEADING_3_CLASS,
	} from '$lib/constants/layout'
	import { CONTACT_HREF } from '$lib/constants/page-routes'
	import { PAGES } from '$lib/types/page'

	const title = app.page_title(PAGES.ABOUT.title)
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={PAGES.ABOUT.description} />
</svelte:head>

<MetaTags {title} description={PAGES.ABOUT.description} url="{APP.URL}/about" />

<AdSenseScript />

<PageLayout>
	<PageHeader page={PAGES.ABOUT} />

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
				<h3 class={SECTION_HEADING_3_CLASS}>🎮 Game Development</h3>
				<ul class={LIST_DISC_CLASS}>
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
				<h3 class={SECTION_HEADING_3_CLASS}>👨‍🏫 Community & Education</h3>
				<ul class={LIST_DISC_CLASS}>
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

	<PageSection>
		<SkillsSection />
	</PageSection>

	<TechStack />

	<!-- Philosophy -->
	<PageSection title="🌈 Philosophy">
		<blockquote class={BLOCKQUOTE_CLASS}>
			"Small thoughts from each individual support today's children and tomorrow's society."
		</blockquote>
		<p class="mt-4">
			With 25+ years of engineering experience, I'm dedicated to nurturing the next generation of
			developers while creating games that bring joy and learning opportunities for all ages.
		</p>
		<p class="mt-2">
			<ExternalLink href={URLS.GITHUB} testid="about-philosophy-github-link">
				View my engineering work on GitHub →
			</ExternalLink>
		</p>
	</PageSection>

	<!-- Community Support -->
	<PageSection title="💖 Community Support">
		<div class="space-y-4">
			<p>
				I believe in giving back to the community. Through
				<ExternalLink href={OPENCOLLECTIVE.URL} class="font-bold">
					Joshua Studio on Open Collective
				</ExternalLink>
				, we support:
			</p>
			<ul class={LIST_DISC_CLASS}>
				<li>👥 Career consultation sessions for aspiring engineers</li>
				<li>🎓 Job hunting and skill development support</li>
				<li>👶 Programming workshops for children and youth</li>
				<li>🎮 Game explanation sessions for children and elderly</li>
				<li>🏗️ Infrastructure development and new technology research</li>
				<li>🐛 Software bug fixes and manual improvements</li>
			</ul>
			<blockquote class="mt-4 {BLOCKQUOTE_CLASS}">
				<strong>"{APP.DESCRIPTION}"</strong> - 私達はゲームやツールの制作を通して、子どもたちの明るい笑顔を支える社会貢献を行います
			</blockquote>
		</div>
	</PageSection>

	<!-- My Projects -->
	<PageSection title="🛠️ My Projects">
		<ul class={LIST_DISC_LINK_CLASS}>
			<li>
				<ExternalLink href={URLS.GITHUB} testid="about-github-profile-link">
					GitHub Profile
				</ExternalLink>
				— open-source repositories and contributions
			</li>
			<li>
				<ExternalLink href={URLS.GITHUB_PRS} testid="about-github-prs-link">
					Merged Pull Requests — joshuafolkken.com
				</ExternalLink>
				— browse the full development history of this site
			</li>
			<li>
				<ExternalLink href={APP.URL} testid="about-github-page-link">
					joshuafolkken.com
				</ExternalLink>
				— this website, built and maintained publicly
			</li>
		</ul>
	</PageSection>

	<!-- Connect -->
	<PageSection title="🔗 Connect">
		<ul class={LIST_DISC_LINK_CLASS}>
			<li>
				<ExternalLink href={URLS.GITHUB} testid="about-connect-github-link">GitHub</ExternalLink>
				— source code, issues, and open-source work
			</li>
			<li>
				<ExternalLink href={URLS.YOUTUBE} testid="about-connect-youtube-link">YouTube</ExternalLink>
				— game dev tutorials and project showcases
			</li>
			<li>
				<ExternalLink href={URLS.X} testid="about-connect-x-link">X (Twitter)</ExternalLink>
				— dev updates and community discussions
			</li>
			<li>
				<ExternalLink href={OPENCOLLECTIVE.URL} testid="about-connect-opencollective-link">
					Open Collective
				</ExternalLink>
				— support the community mission
			</li>
		</ul>
	</PageSection>

	<!-- Get in touch -->
	<PageSection title="📬 Get in touch">
		<p>
			Questions, collaboration ideas, or just want to say hi? Head over to the
			<a href={CONTACT_HREF} class={LINK_BASE_CLASS}>contact page</a>
			— I read every message.
		</p>
	</PageSection>

	<!-- Footer Message -->
	<PageSection title="⭐️ Thanks for visiting! ⭐️">
		<div>
			<p>
				Consider
				<ExternalLink href={URLS.GITHUB} testid="about-star-repositories-link">
					starring my repositories
				</ExternalLink>
				or supporting our mission through Open Collective!
			</p>
			<p class="mt-4">
				All source code is available for learning purposes. Let's build a brighter future together!
				🌟
			</p>
		</div>
	</PageSection>

	<SupportBox />
	<EngagementButtons slug="page:about" {title} />
</PageLayout>
