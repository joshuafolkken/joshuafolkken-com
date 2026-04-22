import type { Component } from 'svelte'

export interface ProjectLink {
	href: string
	type: 'github' | 'demo' | 'npm' | 'blog'
}

export interface Project {
	icon: Component
	title: string
	subtitle?: string
	description: string
	links: Array<ProjectLink>
	image?: string
	tags?: Array<string>
}
