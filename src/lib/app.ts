const APP = {
	ID: 'joshuafolkken-com',
	NAME: 'joshuafolkken.com',
	DESCRIPTION: 'Creating a Brighter Future',
	URL: 'https://joshuafolkken.com',
	VERSION: import.meta.env['APP_VERSION'] as string,
} as const

const AUTHOR = {
	NAME: 'Joshua Folkken',
	EMAIL: 'joshuafolkken@gmail.com',
	X_USERNAME: 'joshuafolkken',
	YEAR: new Date().getFullYear(),
	get COPYRIGHT(): string {
		return `© ${String(this.YEAR)} ${this.NAME}`
	},
}

const URLS = {
	TALK: 'https://talk.joshuafolkken.com',
	GITHUB: 'https://github.com/joshuafolkken',
	GITHUB_PRS: 'https://github.com/joshuafolkken/joshuafolkken-com/pulls?q=is%3Apr+is%3Aclosed',
	GITHUB_PAGE: 'https://joshuafolkken.github.io',
	SHARE_FACEBOOK: 'https://www.facebook.com/sharer/sharer.php',
	SHARE_TWITTER: 'https://twitter.com/intent/tweet',
	get X(): string {
		return `https://x.com/${AUTHOR.X_USERNAME}`
	},
	YOUTUBE: 'https://www.youtube.com/@Joshuafolkken-studio',
} as const

const OPENCOLLECTIVE = {
	SLUG: 'joshua-studio',
	get URL(): string {
		return `https://opencollective.com/${this.SLUG}`
	},
} as const

const LINK_TARGET = '_blank'
const LINK_REL = 'noopener noreferrer'

const SUBTITLE_DEVELOPMENT_TOOL = 'Dev Tool'

const LAST_UPDATED = {
	PRIVACY_POLICY: 'November 2025',
	UPDATE_INFO: '2025-11-19',
} as const

const LINK_LABELS = {
	github: 'GitHub',
	demo: 'Live Demo',
} as const

function link_label(type: 'github' | 'demo'): string {
	return LINK_LABELS[type]
}

const app = {
	link_label,
}

export {
	APP,
	AUTHOR,
	LAST_UPDATED,
	LINK_LABELS,
	LINK_REL,
	LINK_TARGET,
	SUBTITLE_DEVELOPMENT_TOOL,
	URLS,
	OPENCOLLECTIVE,
	app,
}
