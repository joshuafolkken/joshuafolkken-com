<script lang="ts">
	/* eslint-disable max-lines, import/no-duplicates */
	import { SvelteSet } from 'svelte/reactivity'
	import { fly } from 'svelte/transition'

	interface Badge {
		name: string
		url: string
	}

	interface Category {
		title: string
		badges: Array<Badge>
	}

	const ANIMATION_DURATION = 500

	const tech_stack: Array<Category> = [
		{
			title: '💻 Programming Languages',
			badges: [
				{
					name: 'TypeScript',
					url: 'https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white',
				},
				{
					name: 'JavaScript',
					url: 'https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black',
				},
				{
					name: 'Rust',
					url: 'https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white',
				},
				{
					name: 'Dart',
					url: 'https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white',
				},
				{
					name: 'Kotlin',
					url: 'https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white',
				},
				{
					name: 'Swift',
					url: 'https://img.shields.io/badge/Swift-FA7343?style=for-the-badge&logo=swift&logoColor=white',
				},
				{
					name: 'Java',
					url: 'https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white',
				},
				{
					name: 'C#',
					url: 'https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white',
				},
				{
					name: 'VB.NET',
					url: 'https://img.shields.io/badge/VB.NET-512BD4?style=for-the-badge&logo=.net&logoColor=white',
				},
				{
					name: 'PHP',
					url: 'https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white',
				},
				{
					name: 'Python',
					url: 'https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white',
				},
				{
					name: 'C',
					url: 'https://img.shields.io/badge/C-A8B9CC?style=for-the-badge&logo=c&logoColor=black',
				},
			],
		},
		{
			title: '🌐 Web Technologies',
			badges: [
				{
					name: 'Svelte',
					url: 'https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white',
				},
				{
					name: 'HTML5',
					url: 'https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white',
				},
				{
					name: 'CSS3',
					url: 'https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white',
				},
				{
					name: 'Tailwind CSS',
					url: 'https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white',
				},
				{
					name: 'Node.js',
					url: 'https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white',
				},
				{
					name: 'Vue.js',
					url: 'https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white',
				},
				{
					name: '.NET',
					url: 'https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=.net&logoColor=white',
				},
				{
					name: 'Angular',
					url: 'https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white',
				},
				{
					name: 'Bootstrap',
					url: 'https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white',
				},
				{
					name: 'Vite',
					url: 'https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white',
				},
			],
		},
		{
			title: '🗄️ Databases & Cloud',
			badges: [
				{
					name: 'TURSO',
					url: 'https://img.shields.io/badge/TURSO-444444?style=for-the-badge&logo=turso&logoColor=white',
				},
				{
					name: 'LibSQL',
					url: 'https://img.shields.io/badge/LibSQL-444444?style=for-the-badge&logo=sqlite&logoColor=white',
				},
				{
					name: 'SQLite',
					url: 'https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white',
				},
				{
					name: 'Drizzle',
					url: 'https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black',
				},
				{
					name: 'PostgreSQL',
					url: 'https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white',
				},
				{
					name: 'MySQL',
					url: 'https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white',
				},
				{
					name: 'Redis',
					url: 'https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white',
				},
				{
					name: 'AWS',
					url: 'https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white',
				},
				{
					name: 'Vercel',
					url: 'https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white',
				},
			],
		},
		{
			title: '🎮 Game Development',
			badges: [
				{
					name: 'Godot',
					url: 'https://img.shields.io/badge/Godot-478CBF?style=for-the-badge&logo=godot-engine&logoColor=white',
				},
				{
					name: 'GDScript',
					url: 'https://img.shields.io/badge/GDScript-478CBF?style=for-the-badge&logo=godot-engine&logoColor=white',
				},
				{
					name: 'Unity',
					url: 'https://img.shields.io/badge/Unity-000000?style=for-the-badge&logo=unity&logoColor=white',
				},
			],
		},
		{
			title: '📱 Mobile Development',
			badges: [
				{
					name: 'Android',
					url: 'https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white',
				},
				{
					name: 'iOS',
					url: 'https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=ios&logoColor=white',
				},
				{
					name: 'Flutter',
					url: 'https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white',
				},
			],
		},
		{
			title: '🖥️ Desktop Development',
			badges: [
				{
					name: 'Windows',
					url: 'https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white',
				},
				{
					name: 'macOS',
					url: 'https://img.shields.io/badge/macOS-000000?style=for-the-badge&logo=macos&logoColor=white',
				},
				{
					name: 'Linux',
					url: 'https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black',
				},
			],
		},
		{
			title: '☁️ Infrastructure & Servers',
			badges: [
				{
					name: 'PM2',
					url: 'https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white',
				},
				{
					name: 'VPS',
					url: 'https://img.shields.io/badge/VPS-0078D6?style=for-the-badge&logo=windows&logoColor=white',
				},
				{
					name: 'Ubuntu',
					url: 'https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white',
				},
				{
					name: 'CentOS',
					url: 'https://img.shields.io/badge/CentOS-262577?style=for-the-badge&logo=centos&logoColor=white',
				},
				{
					name: 'Nginx',
					url: 'https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white',
				},
				{
					name: 'Apache',
					url: 'https://img.shields.io/badge/Apache-D22128?style=for-the-badge&logo=apache&logoColor=white',
				},
				{
					name: 'AWS EC2',
					url: 'https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white',
				},
			],
		},
		{
			title: '📡 Web Servers & Proxies',
			badges: [
				{
					name: 'Caddy',
					url: 'https://img.shields.io/badge/Caddy-000000?style=for-the-badge&logo=caddy&logoColor=white',
				},
				{
					name: 'ngrok',
					url: 'https://img.shields.io/badge/ngrok-1F1E1E?style=for-the-badge&logo=ngrok&logoColor=white',
				},
				{
					name: "Let's Encrypt",
					url: "https://img.shields.io/badge/Let's_Encrypt-003A70?style=for-the-badge&logo=lets-encrypt&logoColor=white",
				},
			],
		},
		{
			title: '🔧 Development Tools',
			badges: [
				{
					name: 'Git',
					url: 'https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white',
				},
				{
					name: 'GitHub',
					url: 'https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white',
				},
				{
					name: 'npm',
					url: 'https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white',
				},
				{
					name: 'Lefthook',
					url: 'https://img.shields.io/badge/Lefthook-FF0000?style=for-the-badge&logo=git&logoColor=white',
				},
				{
					name: 'tsx',
					url: 'https://img.shields.io/badge/tsx-3178C6?style=for-the-badge&logo=typescript&logoColor=white',
				},
				{
					name: 'Sharp',
					url: 'https://img.shields.io/badge/Sharp-99CC00?style=for-the-badge&logo=sharp&logoColor=white',
				},
			],
		},
		{
			title: '🔍 Code Quality & Testing',
			badges: [
				{
					name: 'Prettier',
					url: 'https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black',
				},
				{
					name: 'ESLint',
					url: 'https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white',
				},
				{
					name: 'Vitest',
					url: 'https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white',
				},
				{
					name: 'Playwright',
					url: 'https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white',
				},
				{
					name: 'SonarCloud',
					url: 'https://img.shields.io/badge/SonarCloud-F3702A?style=for-the-badge&logo=sonarcloud&logoColor=white',
				},
			],
		},
		{
			title: '⌨️ IDEs & Editors',
			badges: [
				{
					name: 'Cursor',
					url: 'https://img.shields.io/badge/Cursor-000000?style=for-the-badge&logo=cursor&logoColor=white',
				},
				{
					name: 'VS Code',
					url: 'https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white',
				},
				{
					name: 'Android Studio',
					url: 'https://img.shields.io/badge/Android_Studio-3DDC84?style=for-the-badge&logo=android-studio&logoColor=white',
				},
				{
					name: 'Xcode',
					url: 'https://img.shields.io/badge/Xcode-147EFB?style=for-the-badge&logo=xcode&logoColor=white',
				},
				{
					name: 'Visual Studio',
					url: 'https://img.shields.io/badge/Visual_Studio-5C2D91?style=for-the-badge&logo=visual-studio&logoColor=white',
				},
				{
					name: 'IntelliJ IDEA',
					url: 'https://img.shields.io/badge/IntelliJ_IDEA-000000?style=for-the-badge&logo=intellij-idea&logoColor=white',
				},
				{
					name: 'PhpStorm',
					url: 'https://img.shields.io/badge/PhpStorm-000000?style=for-the-badge&logo=phpstorm&logoColor=white',
				},
				{
					name: 'Eclipse',
					url: 'https://img.shields.io/badge/Eclipse-2C2255?style=for-the-badge&logo=eclipse&logoColor=white',
				},
			],
		},
		{
			title: '📚 Learning & Documentation',
			badges: [
				{
					name: 'Markdown',
					url: 'https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white',
				},
				{
					name: 'mdsvex',
					url: 'https://img.shields.io/badge/mdsvex-000000?style=for-the-badge&logo=markdown&logoColor=white',
				},
			],
		},
	]

	const visible_indices = new SvelteSet<number>()

	function intersect(node: HTMLElement, index: number): { destroy: () => void } {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					visible_indices.add(index)
					observer.disconnect()
				}
			},
			{ threshold: 0 },
		)

		observer.observe(node)

		return {
			destroy() {
				observer.disconnect()
			},
		}
	}
</script>

<section>
	<h2 class="mb-4 text-2xl font-light tracking-tight">🛠️ Tech Stack</h2>
	<div class="space-y-6">
		{#each tech_stack as category, index (category.title)}
			<div use:intersect={index} class="min-h-[50px]">
				{#if visible_indices.has(index)}
					<div in:fly={{ y: 20, duration: ANIMATION_DURATION, delay: 100 }}>
						<h3 class="mb-2 text-xl font-medium">{category.title}</h3>
						<div class="flex flex-wrap gap-2">
							{#each category.badges as badge (badge.name)}
								<img src={badge.url} alt={badge.name} />
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>
