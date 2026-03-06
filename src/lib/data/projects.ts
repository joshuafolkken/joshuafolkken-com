import { SUBTITLE_DEVELOPMENT_TOOL, URLS } from '$lib/app'
import godot_2d_platformer from '$lib/assets/images/projects/godot-2d-platformer.png'
import godot_multiplayer from '$lib/assets/images/projects/godot-multiplayer-v2.png'
import godot_project_template from '$lib/assets/images/projects/godot-project-template.png'
import pong from '$lib/assets/images/projects/pong.png'
import talk from '$lib/assets/images/projects/talk.png'
import tic_tac_toe from '$lib/assets/images/projects/tic-tac-toe.png'
import FilmIcon from '$lib/icons/FilmIcon.svelte'
import GlobeIcon from '$lib/icons/GlobeIcon.svelte'
import RunningIcon from '$lib/icons/RunningIcon.svelte'
import TalkIcon from '$lib/icons/TalkIcon.svelte'
import TennisIcon from '$lib/icons/TennisIcon.svelte'
import ToolIcon from '$lib/icons/ToolIcon.svelte'
import type { Project } from '$lib/types/project'

export const FEATURED_PROJECT_COUNT = 4

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
		image: talk,
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
	},
	{
		icon: GlobeIcon,
		title: 'Godot Multiplayer',
		subtitle: SUBTITLE_DEVELOPMENT_TOOL,
		description: 'Exploring multiplayer game development with Godot',
		links: [{ href: `${URLS.GITHUB}/godot-multiplayer`, type: 'github' }],
		image: godot_multiplayer,
	},
]
