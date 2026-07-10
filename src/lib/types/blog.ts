export interface BlogMetadata {
	title: string
	date: string
	updated?: string
	author?: string
	excerpt: string
	cover_image?: string
	youtube?: string
	youtube_date?: string
	youtube_title?: string
}

export interface Post {
	slug: string
	title: string
	date: string
	updated?: string | undefined
	author?: string | undefined
	excerpt: string
	cover_image?: string | undefined
	youtube?: string | undefined
	youtube_date?: string | undefined
	youtube_title?: string | undefined
}
