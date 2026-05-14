import { SUBTITLE_DEVELOPMENT_TOOL, URLS } from '$lib/app'
import kit_package from '$lib/assets/images/blog/kit-package.png'
import godot_2d_platformer from '$lib/assets/images/projects/godot-2d-platformer.png'
import godot_multiplayer from '$lib/assets/images/projects/godot-multiplayer-v2.png'
import godot_project_template from '$lib/assets/images/projects/godot-project-template.png'
import joshuafolkken_com from '$lib/assets/images/projects/joshuafolkken-com-v2.png'
import mnemecha from '$lib/assets/images/projects/mnemecha.png'
import pong from '$lib/assets/images/projects/pong.png'
import talk from '$lib/assets/images/projects/talk.png'
import tasks from '$lib/assets/images/projects/tasks-v2.png'
import tic_tac_toe from '$lib/assets/images/projects/tic-tac-toe.png'
import {
	CLOUDFLARE_D1,
	CLOUDFLARE_KV,
	CLOUDFLARE_R2,
	CLOUDFLARE_WORKERS,
	GDSCRIPT,
	GODOT,
	WEB_EXPORT,
} from '$lib/data/tech-names'
import FilmIcon from '$lib/icons/FilmIcon.svelte'
import GlobeIcon from '$lib/icons/GlobeIcon.svelte'
import ListIcon from '$lib/icons/ListIcon.svelte'
import PackageIcon from '$lib/icons/PackageIcon.svelte'
import ProjectsIcon from '$lib/icons/ProjectsIcon.svelte'
import RunningIcon from '$lib/icons/RunningIcon.svelte'
import SparklesIcon from '$lib/icons/SparklesIcon.svelte'
import TalkIcon from '$lib/icons/TalkIcon.svelte'
import TennisIcon from '$lib/icons/TennisIcon.svelte'
import ToolIcon from '$lib/icons/ToolIcon.svelte'
import type { Project } from '$lib/types/project'

const KIT_BLOG_URL = '/blog/kit-package'
const MNEMECHA_BLOG_URL = '/blog/mnemecha'
const CLAUDE_CODE_TAG = 'Claude Code'

const FEATURED_COUNT = 4

export const PROJECTS = [
	{
		icon: SparklesIcon,
		title: 'Mnemecha',
		subtitle: 'Memory Game',
		description:
			'A 3D first-person memory game inspired by the classic Simon format. Features increasingly fast color sequences, satisfying audio feedback, and a cyber visual mode — all rendered in real-time with Threlte.',
		links: [
			{ href: URLS.MNEMECHA, type: 'demo' },
			{ href: MNEMECHA_BLOG_URL, type: 'blog' },
			{ href: `${URLS.GITHUB}/mnemecha`, type: 'github' },
		],
		image: mnemecha,
		tags: ['SvelteKit', 'TypeScript', 'Three.js', 'Threlte', CLOUDFLARE_WORKERS, CLAUDE_CODE_TAG],
	},
	{
		icon: PackageIcon,
		title: '@joshuafolkken/kit',
		subtitle: 'npm package',
		description:
			'A consolidated npm package for development configuration and AI workflow automation. One command deploys 25+ config files; 25+ CLI subcommands cover code quality, CI/CD, git hooks, spell-checking, and AI-assisted workflows (kickoff / fullrun).',
		links: [
			{ href: KIT_BLOG_URL, type: 'blog' },
			{ href: `${URLS.GITHUB}/kit`, type: 'github' },
		],
		image: kit_package,
		tags: [
			'TypeScript',
			'Node.js',
			'SvelteKit',
			'pnpm',
			'Prettier',
			'ESLint',
			'CSpell',
			'Vitest',
			'Playwright',
			'Lefthook',
			'GitHub',
			'GitHub Actions',
			'SonarQube Cloud',
			'CodeRabbit',
			CLOUDFLARE_WORKERS,
			'AI Workflow',
			CLAUDE_CODE_TAG,
			'Cursor',
			'Gemini',
		],
	},
	{
		icon: ProjectsIcon,
		title: 'joshuafolkken.com',
		subtitle: 'Portfolio',
		description:
			'This portfolio site built with SvelteKit. Features project showcases and a technical blog, while serving as a sandbox for exploring web technologies on Cloudflare.',
		links: [{ href: `${URLS.GITHUB}/joshuafolkken-com`, type: 'github' }],
		image: joshuafolkken_com,
		tags: [
			'SvelteKit',
			'TypeScript',
			CLOUDFLARE_WORKERS,
			CLOUDFLARE_KV,
			CLOUDFLARE_D1,
			'Drizzle',
			'TailwindCSS',
		],
	},
	{
		icon: ListIcon,
		title: 'Tasks',
		subtitle: 'Task Manager',
		description:
			'A task management web app in early development. Currently implements authentication using SvelteKit, Better Auth, and Cloudflare D1 — exploring a performant alternative to Supabase Auth.',
		links: [
			{ href: URLS.TASKS, type: 'demo' },
			{ href: `${URLS.GITHUB}/tasks`, type: 'github' },
		],
		image: tasks,
		tags: ['SvelteKit', 'TypeScript', 'Better Auth', CLOUDFLARE_WORKERS, CLOUDFLARE_D1, 'Drizzle'],
	},
	{
		icon: TalkIcon,
		title: 'Talk',
		subtitle: 'Language Learning Game',
		description: "World's first fun language learning game for listening and speaking",
		links: [
			{ href: URLS.TALK, type: 'demo' },
			{ href: `${URLS.GITHUB}/talk-svelte`, type: 'github' },
		],
		image: talk,
		tags: ['SvelteKit', 'TypeScript', CLOUDFLARE_WORKERS, CLOUDFLARE_R2],
	},
	{
		icon: RunningIcon,
		title: 'Godot 2D Platformer',
		subtitle: 'Platform Game',
		description: 'Features dash mechanics, high jumps, and double jumps like Mario!',
		links: [
			{ href: `${URLS.GITHUB_PAGE}/godot-2d-platformer`, type: 'demo' },
			{ href: `${URLS.GITHUB}/godot-2d-platformer`, type: 'github' },
		],
		image: godot_2d_platformer,
		tags: [GODOT, GDSCRIPT, WEB_EXPORT],
	},
	{
		icon: FilmIcon,
		title: 'Tic-Tac-Toe',
		subtitle: 'Strategy Game',
		description: 'A classic game reimagined, inspired by the 1983 movie WarGames',
		links: [
			{ href: `${URLS.GITHUB_PAGE}/tic-tac-toe`, type: 'demo' },
			{ href: `${URLS.GITHUB}/tic-tac-toe`, type: 'github' },
		],
		image: tic_tac_toe,
		tags: [GODOT, GDSCRIPT, WEB_EXPORT],
	},
	{
		icon: TennisIcon,
		title: 'KAWAII PONG',
		subtitle: 'Action Game',
		description: 'Inspired by the 1976 SUPER PONG with a kawaii twist',
		links: [
			{ href: `${URLS.GITHUB_PAGE}/pong`, type: 'demo' },
			{ href: `${URLS.GITHUB}/pong`, type: 'github' },
		],
		image: pong,
		tags: [GODOT, GDSCRIPT, WEB_EXPORT],
	},
	{
		icon: ToolIcon,
		title: 'Godot Project Template',
		subtitle: SUBTITLE_DEVELOPMENT_TOOL,
		description: 'A minimalist template for rapid Godot 4 development',
		links: [
			{ href: `${URLS.GITHUB}/godot-project-template`, type: 'github' },
			{ href: `${URLS.GITHUB_PAGE}/godot-project-template`, type: 'demo' },
		],
		image: godot_project_template,
		tags: [GODOT, GDSCRIPT, WEB_EXPORT],
	},
	{
		icon: GlobeIcon,
		title: 'Godot Multiplayer',
		subtitle: SUBTITLE_DEVELOPMENT_TOOL,
		description: 'Exploring multiplayer game development with Godot',
		links: [{ href: `${URLS.GITHUB}/godot-multiplayer`, type: 'github' }],
		image: godot_multiplayer,
		tags: [GODOT, GDSCRIPT, 'WebSockets', WEB_EXPORT],
	},
] as const satisfies ReadonlyArray<Project>

export const FEATURED_PROJECTS = PROJECTS.slice(0, FEATURED_COUNT)
