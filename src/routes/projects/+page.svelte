<script lang="ts">
	import { AUTHOR, SUBTITLE_DEVELOPMENT_TOOL, URLS } from '$lib/app'
	import Divider from '$lib/components/Divider.svelte'
	import PageHeader from '$lib/components/PageHeader.svelte'
	import PageLayout from '$lib/components/PageLayout.svelte'
	import ProjectList from '$lib/components/ProjectList.svelte'
	import FilmIcon from '$lib/icons/FilmIcon.svelte'
	import GlobeIcon from '$lib/icons/GlobeIcon.svelte'
	import RunningIcon from '$lib/icons/RunningIcon.svelte'
	import TalkIcon from '$lib/icons/TalkIcon.svelte'
	import TennisIcon from '$lib/icons/TennisIcon.svelte'
	import ToolIcon from '$lib/icons/ToolIcon.svelte'
	import { PAGES } from '$lib/types/page'
	import type { Project } from '$lib/types/project'

	const projects: Array<Project> = [
		{
			icon: TalkIcon,
			title: 'Talk',
			subtitle: 'Language Learning Game',
			description: "World's first fun language learning game for listening and speaking",
			links: [
				{ href: URLS.TALK, type: 'demo' },
				{ href: `${URLS.GITHUB}/talk-svelte`, type: 'github' },
			],
			image: '/images/talk.png',
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
			image:
				'https://raw.githubusercontent.com/joshuafolkken/godot-2d-platformer/main/docs/screenshot.png',
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
			image: 'https://github.com/joshuafolkken/joshuafolkken/raw/main/images/tic-tac-toe.png',
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
			image: 'https://github.com/joshuafolkken/joshuafolkken/raw/main/images/pong.png',
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
			image: '/images/godot-project-template.png',
		},
		{
			icon: GlobeIcon,
			title: 'Godot Multiplayer',
			subtitle: SUBTITLE_DEVELOPMENT_TOOL,
			description: 'Exploring multiplayer game development with Godot',
			links: [{ href: `${URLS.GITHUB}/godot-multiplayer`, type: 'github' }],
		},
	]
</script>

<svelte:head>
	<title>{PAGES.PROJECTS.title} - {AUTHOR.NAME}</title>
	<meta name="description" content={PAGES.PROJECTS.description} />
</svelte:head>

<PageLayout>
	<PageHeader page={PAGES.PROJECTS} />

	<Divider />
	<ProjectList {projects} />
</PageLayout>
