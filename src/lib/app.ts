const APP = {
	ID: 'joshuafolkken-com',
	NAME: 'joshuafolkken.com',
	DESCRIPTION: 'Creating a Brighter Future',
	URL: 'https://joshuafolkken.com',
	VERSION: import.meta.env.APP_VERSION,
} as const

const AUTHOR = {
	NAME: 'Joshua Folkken',
	X_USERNAME: 'joshuafolkken',
	YEAR: new Date().getFullYear(),
	get COPYRIGHT(): string {
		return `© ${String(this.YEAR)} ${this.NAME}`
	},
} as const

// joshuafolkken@gmail.com XOR-encoded with key=5; decoded only at reveal time
/* eslint-disable @typescript-eslint/no-magic-numbers */
const AUTHOR_EMAIL_ENCODED: ReadonlyArray<number> = [
	111, 106, 118, 109, 112, 100, 99, 106, 105, 110, 110, 96, 107, 69, 98, 104, 100, 108, 105, 43,
	102, 106, 104,
]
/* eslint-enable @typescript-eslint/no-magic-numbers */

const URLS = {
	MNEMECHA: 'https://mnemecha.joshuafolkken.com',
	TALK: 'https://talk.joshuafolkken.com',
	TASKS: 'https://tasks.joshuafolkken.com',
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
const SUBTITLE_NPM_PACKAGE = 'npm package'

const LEGAL_PAGES_LAST_UPDATED = 'April 2026'

const LAST_UPDATED = {
	PRIVACY_POLICY: LEGAL_PAGES_LAST_UPDATED,
	TERMS_OF_SERVICE: LEGAL_PAGES_LAST_UPDATED,
	UPDATE_INFO: '2025-11-19',
} as const

const LINK_LABELS = {
	github: 'GitHub',
	demo: 'Live Demo',
	play: 'Play',
	npm: 'npm',
	blog: 'Blog',
} as const

function link_label(type: keyof typeof LINK_LABELS): string {
	return LINK_LABELS[type]
}

const app = {
	link_label,
}

export {
	APP,
	AUTHOR,
	AUTHOR_EMAIL_ENCODED,
	LAST_UPDATED,
	LINK_LABELS,
	LINK_REL,
	LINK_TARGET,
	SUBTITLE_DEVELOPMENT_TOOL,
	SUBTITLE_NPM_PACKAGE,
	URLS,
	OPENCOLLECTIVE,
	app,
}
