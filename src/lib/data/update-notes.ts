export interface UpdateNote {
	text: string
	link?: string
}

export const UPDATE_NOTES: ReadonlyArray<UpdateNote> = [
	{ text: 'Adjusted AdSense tags' },
	{ text: 'Created sitemap' },
	{ text: 'Improved SEO' },
]
