import type { Category } from '$lib/types/tech-stack'

type BadgeData = [name: string, logo: string]
type CategoryData = [title: string, badges: Array<BadgeData>]

const tech_stack_data: Array<CategoryData> = [
	[
		'AI Coding',
		[
			['Claude Code', 'claude'],
			['CodeRabbit', 'coderabbit'],
			['Cursor', 'cursor'],
			['Antigravity', 'google'],
		],
	],
	[
		'Code Quality & Testing',
		[
			['SonarCloud', 'sonarqubecloud'],
			['Prettier', 'prettier'],
			['ESLint', 'eslint'],
			['Vitest', 'vitest'],
			['Playwright', 'playwright'],
		],
	],
	[
		'Cloud & Edge',
		[
			['Cloudflare Workers', 'cloudflare'],
			['Cloudflare KV', 'cloudflare'],
			['Cloudflare D1', 'cloudflare'],
			['Cloudflare R2', 'cloudflare'],
			['AWS', 'amazonwebservices'],
			['Vercel', 'vercel'],
		],
	],
	[
		'Web Technologies',
		[
			['Better Auth', 'betterauth'],
			['Svelte', 'svelte'],
			['HTML5', 'html5'],
			['CSS3', 'css'],
			['Tailwind CSS', 'tailwindcss'],
			['Node.js', 'nodedotjs'],
			['Vue.js', 'vuedotjs'],
			['.NET', 'dotnet'],
			['Angular', 'angular'],
			['Bootstrap', 'bootstrap'],
			['Vite', 'vite'],
		],
	],
	[
		'Development Tools',
		[
			['Lefthook', 'lefthook'],
			['pnpm', 'pnpm'],
			['GitHub', 'github'],
			['npm', 'npm'],
			['Git', 'git'],
			['tsx', 'typescript'],
			['Sharp', 'sharp'],
			['Markdown', 'markdown'],
			['mdsvex', 'markdown'],
		],
	],
	[
		'Programming Languages',
		[
			['TypeScript', 'typescript'],
			['JavaScript', 'javascript'],
			['Rust', 'rust'],
			['Dart', 'dart'],
			['Kotlin', 'kotlin'],
			['Swift', 'swift'],
			['Java', 'openjdk'],
			['C#', 'csharp'],
			['VB.NET', 'dotnet'],
			['PHP', 'php'],
			['Python', 'python'],
			['C', 'c'],
		],
	],
	[
		'Databases & ORM',
		[
			['TURSO', 'turso'],
			['Drizzle', 'drizzle'],
			['LibSQL', 'sqlite'],
			['SQLite', 'sqlite'],
			['PostgreSQL', 'postgresql'],
			['MySQL', 'mysql'],
			['Redis', 'redis'],
		],
	],
	[
		'Game Development',
		[
			['Godot', 'godotengine'],
			['GDScript', 'godotengine'],
			['Unity', 'unity'],
		],
	],
	[
		'Mobile Development',
		[
			['Android', 'android'],
			['iOS', 'ios'],
			['Flutter', 'flutter'],
			['Android Studio', 'androidstudio'],
			['Xcode', 'xcode'],
		],
	],
	[
		'Desktop Development',
		[
			['Windows', 'windows'],
			['macOS', 'macos'],
			['Linux', 'linux'],
		],
	],
	[
		'IDEs & Editors',
		[
			['VS Code', 'vscode'],
			['Visual Studio', 'visualstudio'],
			['IntelliJ IDEA', 'intellijidea'],
			['PhpStorm', 'phpstorm'],
			['Eclipse', 'eclipseide'],
		],
	],
	[
		'Infrastructure',
		[
			['PM2', 'pm2'],
			['VPS', 'vps'],
			['Ubuntu', 'ubuntu'],
			['CentOS', 'centos'],
			['Nginx', 'nginx'],
			['Apache', 'apache'],
			['AWS EC2', 'amazonwebservices'],
			['Caddy', 'caddy'],
			['ngrok', 'ngrok'],
			["Let's Encrypt", 'letsencrypt'],
		],
	],
]

function transform_to_categories(data: Array<CategoryData>): Array<Category> {
	return data.map(([title, badges]) => ({
		title,
		badges: badges.map(([name, logo]) => ({ name, logo })),
	}))
}

export const TECH_STACK: Array<Category> = transform_to_categories(tech_stack_data)
