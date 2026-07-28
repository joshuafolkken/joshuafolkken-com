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
		return `© ${String(AUTHOR.YEAR)} ${AUTHOR.NAME}`
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
	DISCORD: 'https://discord.gg/JdFywJmaSj',
	YOUTUBE: 'https://www.youtube.com/@Joshuafolkken-studio',
} as const

const OPENCOLLECTIVE = {
	SLUG: 'joshua-studio',
	get URL(): string {
		return `https://opencollective.com/${OPENCOLLECTIVE.SLUG}`
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

// An em dash, not a hyphen: the names this joins contain hyphens of their own (game-kit, app-kit,
// godot-project-template), so a hyphen separator would be indistinguishable from one inside the title it
// separates. The /chat assistant cites a site page by this exact title, where it sits beside GitHub
// citations that already use the em dash — one separator keeps a citation list readable (#795).
const TITLE_SEPARATOR = ' — '

// Single source for every page's <title> and OGP title, so the format can never drift per route.
function page_title(title: string): string {
	return `${title}${TITLE_SEPARATOR}${AUTHOR.NAME}`
}

const app = {
	link_label,
	page_title,
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
