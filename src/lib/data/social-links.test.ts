import { ABOUT_CONNECT_LINKS, SOCIAL_LINKS } from '$lib/data/social-links'
import { describe, expect, it } from 'vitest'

const DISCORD_LABEL = 'Discord'
const OPENCOLLECTIVE_LABEL = 'Open Collective'

function labels_of(links: ReadonlyArray<{ label?: string }>): Array<string> {
	return links.map((link) => link.label ?? '')
}

describe('SOCIAL_LINKS', () => {
	it('leads with YouTube', () => {
		expect(SOCIAL_LINKS[0].label).toBe('YouTube')
	})

	// Icon-only surfaces need `icon` and `aria_label`; the labelled ones need `label`. One array
	// feeds both, so an entry missing either would render blank on some page and fine on another.
	it('gives every profile an icon, an accessible name and a label', () => {
		for (const link of SOCIAL_LINKS) {
			expect(link.icon).toBeDefined()
			expect(link.aria_label.length).toBeGreaterThan(0)
			expect(link.label.length).toBeGreaterThan(0)
			expect(link.href).toMatch(/^https:\/\//u)
		}
	})
})

describe('ABOUT_CONNECT_LINKS', () => {
	it('follows the shared order rather than one of its own', () => {
		const shared_order = labels_of(SOCIAL_LINKS).filter((label) => label !== DISCORD_LABEL)

		expect(labels_of(ABOUT_CONNECT_LINKS).slice(0, shared_order.length)).toStrictEqual(shared_order)
	})

	it('leaves out the chat server nobody follows', () => {
		expect(labels_of(ABOUT_CONNECT_LINKS)).not.toContain(DISCORD_LABEL)
	})

	it('closes with Open Collective', () => {
		expect(ABOUT_CONNECT_LINKS.at(-1)?.label).toBe(OPENCOLLECTIVE_LABEL)
	})

	// These ids are what the About page specs select on; deriving them from the label would have
	// silently renamed every one of them.
	it('keeps the test ids the about page is addressed by', () => {
		expect(ABOUT_CONNECT_LINKS.map((link) => link.testid)).toStrictEqual([
			'about-connect-youtube-link',
			'about-connect-x-link',
			'about-connect-github-link',
			'about-connect-opencollective-link',
		])
	})

	it('explains what each profile is for', () => {
		for (const link of ABOUT_CONNECT_LINKS) {
			expect(link.description.length).toBeGreaterThan(0)
		}
	})
})
