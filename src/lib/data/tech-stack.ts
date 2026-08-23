import type { LogoSlug } from '$lib/data/si-icons'
import { TECH_LOGO_MAP } from '$lib/data/tech-logo-map'
import type { Category } from '$lib/types/tech-stack'

// TECH_STACK is the About page's career inventory: technologies worked with over 25+ years,
// not the stack this site currently runs on. Angular, VB.NET, Unity, Xcode and CentOS sit here
// for the same reason TURSO and LibSQL do -- they were used on past work and stay listed after
// a project moves on. The site's live stack is documented per feature in the blog posts, and
// proficiency is a separate concern owned by SKILLS (see `skills.ts`).

type CategoryInput = readonly [title: string, names: ReadonlyArray<string>]

const CATEGORIES: ReadonlyArray<CategoryInput> = [
	['AI Coding', ['Claude Code', 'CodeRabbit', 'Cursor', 'Antigravity']],
	['Code Quality & Testing', ['SonarQube Cloud', 'Prettier', 'ESLint', 'Vitest', 'Playwright']],
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
	const logo = TECH_LOGO_MAP.get(name)

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
