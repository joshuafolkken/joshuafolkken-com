import { SUBTITLE_DEVELOPMENT_TOOL, URLS } from '$lib/app'
import FilmIcon from '$lib/icons/FilmIcon.svelte'
import GlobeIcon from '$lib/icons/GlobeIcon.svelte'
import RunningIcon from '$lib/icons/RunningIcon.svelte'
import TalkIcon from '$lib/icons/TalkIcon.svelte'
import TennisIcon from '$lib/icons/TennisIcon.svelte'
import ToolIcon from '$lib/icons/ToolIcon.svelte'
import type { Project } from '$lib/types/project'

export const PROJECTS: Array<Project> = [
	{
		icon: TalkIcon,
		title: 'Talk',
		subtitle: 'Language Learning Game',
		description: "World's first fun language learning game for listening and speaking",
		links: [
			{ href: URLS.TALK, type: 'demo' },
			{ href: `${URLS.GITHUB}/talk-svelte`, type: 'github' },
		],
		image: '/api/images/projects/talk.webp',
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
		image: '/api/images/projects/godot-2d-platformer.webp',
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
		image: '/api/images/projects/tic-tac-toe.webp',
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
		image: '/api/images/projects/pong.webp',
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
		image: '/api/images/projects/godot-project-template.webp',
	},
	{
		icon: GlobeIcon,
		title: 'Godot Multiplayer',
		subtitle: SUBTITLE_DEVELOPMENT_TOOL,
		description: 'Exploring multiplayer game development with Godot',
		links: [{ href: `${URLS.GITHUB}/godot-multiplayer`, type: 'github' }],
	},
]
