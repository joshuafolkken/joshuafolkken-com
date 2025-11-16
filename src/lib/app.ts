const APP = {
	NAME: 'joshuafolkken.com',
	DESCRIPTION: 'Creating a Brighter Future',
	AUTHOR: 'Joshua Folkken',
	VERSION: import.meta.env['APP_VERSION'] as string,
	YEAR: new Date().getFullYear(),
	get COPYRIGHT(): string {
		return `© ${String(this.YEAR)} ${this.AUTHOR}`
	},
} as const

const URLS = {
	TALK: 'https://talk.joshuafolkken.com',
	GITHUB: 'https://github.com/joshuafolkken',
	GITHUB_PAGE: 'https://joshuafolkken.github.io',
	X: 'https://x.com/joshuafolkken',
	YOUTUBE: 'https://www.youtube.com/@Joshuafolkken-studio',
	OPEN_COLLECTIVE: 'https://opencollective.com/joshua-studio',
	EMAIL: 'mailto:joshuafolkken@gmail.com',
} as const

const LINK_TARGET = '_blank'
const LINK_REL = 'noopener noreferrer'

const SUBTITLE_DEVELOPMENT_TOOL = 'Development Tool'

const LINK_LABELS = {
	github: 'GitHub',
	demo: 'Live Demo',
} as const

function get_link_label(type: 'github' | 'demo'): string {
	return LINK_LABELS[type]
}

export { APP, get_link_label, LINK_LABELS, LINK_REL, LINK_TARGET, SUBTITLE_DEVELOPMENT_TOOL, URLS }
