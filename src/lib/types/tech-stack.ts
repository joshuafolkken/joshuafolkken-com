export interface Badge {
	name: string
	url: string
}

export interface Category {
	title: string
	badges: Array<Badge>
}
