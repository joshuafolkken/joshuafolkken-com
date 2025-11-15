export const APP = {
	NAME: 'joshuafolkken.com',
	DESCRIPTION: 'Creating the future',
	AUTHOR: 'Joshua Folkken',
	VERSION: import.meta.env['APP_VERSION'] as string,
	YEAR: new Date().getFullYear(),
	get COPYRIGHT(): string {
		return `© ${String(this.YEAR)} ${this.AUTHOR}`
	},
} as const

export const URLS = {
	TALK: 'https://talk.joshuafolkken.com',
	GITHUB: 'https://github.com/joshuafolkken',
	X: 'https://x.com/joshuafolkken',
	YOUTUBE: 'https://www.youtube.com/@Joshuafolkken-studio',
	OPEN_COLLECTIVE: 'https://opencollective.com/joshua-studio',
	EMAIL: 'mailto:joshuafolkken@gmail.com',
} as const
