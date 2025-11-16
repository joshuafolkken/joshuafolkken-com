import type { Component } from 'svelte'

export interface ProjectLink {
	href: string
	type: 'github' | 'demo'
}

export interface Project {
	icon: Component
	title: string
	subtitle?: string
	description: string
	links: Array<ProjectLink>
}
