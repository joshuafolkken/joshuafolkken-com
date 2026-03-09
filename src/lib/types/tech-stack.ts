import type { LogoSlug } from '$lib/data/si-icons'

export interface Badge {
	name: string
	logo: LogoSlug
}

export interface Category {
	title: string
	badges: Array<Badge>
}
