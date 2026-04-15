export interface BlogMetadata {
	title: string
	date: string
	updated?: string
	author?: string
	excerpt: string
	cover_image?: string
}

export interface Post {
	slug: string
	title: string
	date: string
	updated?: string | undefined
	author?: string | undefined
	excerpt: string
	cover_image?: string | undefined
}
