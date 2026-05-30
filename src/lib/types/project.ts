import type { Component } from 'svelte'

export interface ProjectLink {
	href: string
	type: 'github' | 'demo' | 'play' | 'npm' | 'blog'
}

export interface Project {
	icon: Component
	slug: string
	title: string
	subtitle?: string
	description: string
	links: Array<ProjectLink>
	image?: string
	tags?: Array<string>
}

export interface CaseStudySection {
	heading: string
	body: string
}

export interface CaseStudy {
	overview: string
	sections: Array<CaseStudySection>
}
