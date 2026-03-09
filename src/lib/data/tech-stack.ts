import type { LogoSlug } from '$lib/data/si-icons'
import type { Category } from '$lib/types/tech-stack'

type BadgeData = [name: string, logo: LogoSlug]
type CategoryData = [title: string, badges: Array<BadgeData>]

function badge(name: string, logo: LogoSlug): BadgeData {
	return [name, logo]
}

function category(title: string, badges: Array<BadgeData>): CategoryData {
	return [title, badges]
}

const tech_stack_data: Array<CategoryData> = [
	category('AI Coding', [
		badge('Claude Code', 'claude'),
		badge('CodeRabbit', 'coderabbit'),
		badge('Cursor', 'cursor'),
		badge('Antigravity', 'google'),
	]),
	category('Code Quality & Testing', [
		badge('SonarCloud', 'sonarqubecloud'),
		badge('Prettier', 'prettier'),
		badge('ESLint', 'eslint'),
		badge('Vitest', 'vitest'),
		badge('Playwright', 'playwright'),
	]),
	category('Cloud & Edge', [
		badge('Cloudflare Workers', 'cloudflare'),
		badge('Cloudflare KV', 'cloudflare'),
		badge('Cloudflare D1', 'cloudflare'),
		badge('Cloudflare R2', 'cloudflare'),
		badge('AWS', 'amazonwebservices'),
		badge('Vercel', 'vercel'),
	]),
	category('Web Technologies', [
		badge('Better Auth', 'betterauth'),
		badge('Svelte', 'svelte'),
		badge('HTML5', 'html5'),
		badge('CSS3', 'css'),
		badge('Tailwind CSS', 'tailwindcss'),
		badge('Node.js', 'nodedotjs'),
		badge('Vue.js', 'vuedotjs'),
		badge('.NET', 'dotnet'),
		badge('Angular', 'angular'),
		badge('Bootstrap', 'bootstrap'),
		badge('Vite', 'vite'),
	]),
	category('Development Tools', [
		badge('Lefthook', 'lefthook'),
		badge('pnpm', 'pnpm'),
		badge('GitHub', 'github'),
		badge('npm', 'npm'),
		badge('Git', 'git'),
		badge('tsx', 'typescript'),
		badge('Sharp', 'sharp'),
		badge('Markdown', 'markdown'),
		badge('mdsvex', 'markdown'),
	]),
	category('Programming Languages', [
		badge('TypeScript', 'typescript'),
		badge('JavaScript', 'javascript'),
		badge('Rust', 'rust'),
		badge('Dart', 'dart'),
		badge('Kotlin', 'kotlin'),
		badge('Swift', 'swift'),
		badge('Java', 'openjdk'),
		badge('C#', 'csharp'),
		badge('VB.NET', 'dotnet'),
		badge('PHP', 'php'),
		badge('Python', 'python'),
		badge('C', 'c'),
	]),
	category('Databases & ORM', [
		badge('TURSO', 'turso'),
		badge('Drizzle', 'drizzle'),
		badge('LibSQL', 'sqlite'),
		badge('SQLite', 'sqlite'),
		badge('PostgreSQL', 'postgresql'),
		badge('MySQL', 'mysql'),
		badge('Redis', 'redis'),
	]),
	category('Game Development', [
		badge('Godot', 'godotengine'),
		badge('GDScript', 'godotengine'),
		badge('Unity', 'unity'),
	]),
	category('Mobile Development', [
		badge('Android', 'android'),
		badge('iOS', 'ios'),
		badge('Flutter', 'flutter'),
		badge('Android Studio', 'androidstudio'),
		badge('Xcode', 'xcode'),
	]),
	category('Desktop Development', [
		badge('Windows', 'windows'),
		badge('macOS', 'macos'),
		badge('Linux', 'linux'),
	]),
	category('IDEs & Editors', [
		badge('VS Code', 'vscode'),
		badge('Visual Studio', 'visualstudio'),
		badge('IntelliJ IDEA', 'intellijidea'),
		badge('PhpStorm', 'phpstorm'),
		badge('Eclipse', 'eclipseide'),
	]),
	category('Infrastructure', [
		badge('PM2', 'pm2'),
		badge('VPS', 'vps'),
		badge('Ubuntu', 'ubuntu'),
		badge('CentOS', 'centos'),
		badge('Nginx', 'nginx'),
		badge('Apache', 'apache'),
		badge('AWS EC2', 'amazonwebservices'),
		badge('Caddy', 'caddy'),
		badge('ngrok', 'ngrok'),
		badge("Let's Encrypt", 'letsencrypt'),
	]),
]

function transform_to_categories(data: Array<CategoryData>): Array<Category> {
	return data.map(([title, badges]) => ({
		title,
		badges: badges.map(([name, logo]) => ({ name, logo })),
	}))
}

export const TECH_STACK: Array<Category> = transform_to_categories(tech_stack_data)
