import type { LogoSlug } from '$lib/data/si-icons'
import { TECH_STACK_LOGO } from '$lib/data/tech-stack-logos'
import type { Category } from '$lib/types/tech-stack'

type CategoryInput = readonly [title: string, names: ReadonlyArray<string>]

const CATEGORIES: ReadonlyArray<CategoryInput> = [
	['AI Coding', ['Claude Code', 'CodeRabbit', 'Cursor', 'Antigravity']],
	['Code Quality & Testing', ['SonarCloud', 'Prettier', 'ESLint', 'Vitest', 'Playwright']],
	[
		'Cloud & Edge',
		['Cloudflare Workers', 'Cloudflare KV', 'Cloudflare D1', 'Cloudflare R2', 'AWS', 'Vercel'],
	],
	[
		'Web Technologies',
		[
			'Better Auth',
			'Svelte',
			'HTML5',
			'CSS3',
			'Tailwind CSS',
			'Node.js',
			'Vue.js',
			'.NET',
			'Angular',
			'Bootstrap',
			'Vite',
		],
	],
	[
		'Development Tools',
		['Lefthook', 'pnpm', 'GitHub', 'npm', 'Git', 'tsx', 'Sharp', 'Markdown', 'mdsvex'],
	],
	[
		'Programming Languages',
		[
			'TypeScript',
			'JavaScript',
			'Rust',
			'Dart',
			'Kotlin',
			'Swift',
			'Java',
			'C#',
			'VB.NET',
			'PHP',
			'Python',
			'C',
		],
	],
	['Databases & ORM', ['TURSO', 'Drizzle', 'LibSQL', 'SQLite', 'PostgreSQL', 'MySQL', 'Redis']],
	['Game Development', ['Godot', 'GDScript', 'Unity']],
	['Mobile Development', ['Android', 'iOS', 'Flutter', 'Android Studio', 'Xcode']],
	['Desktop Development', ['Windows', 'macOS', 'Linux']],
	['IDEs & Editors', ['VS Code', 'Visual Studio', 'IntelliJ IDEA', 'PhpStorm', 'Eclipse']],
	[
		'Infrastructure',
		[
			'PM2',
			'VPS',
			'Ubuntu',
			'CentOS',
			'Nginx',
			'Apache',
			'AWS EC2',
			'Caddy',
			'ngrok',
			"Let's Encrypt",
		],
	],
]

function to_badge(name: string): { name: string; logo: LogoSlug } {
	const logo = TECH_STACK_LOGO.get(name)

	if (logo === undefined) {
		throw new Error(`Missing logo mapping for tech: ${name}`)
	}

	return { name, logo }
}

function build_tech_stack(categories: ReadonlyArray<CategoryInput>): Array<Category> {
	return categories.map(([title, names]) => ({
		title,
		badges: names.map((name) => to_badge(name)),
	}))
}

export const TECH_STACK: Array<Category> = build_tech_stack(CATEGORIES)
