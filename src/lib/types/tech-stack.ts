export interface Badge {
	name: string
	logo: string
}

export interface Category {
	title: string
	badges: Array<Badge>
}
