import { describe, expect, it } from 'vitest'
import { app, AUTHOR } from './app'

describe('app.page_title', () => {
	it('joins the page title and the author name', () => {
		expect(app.page_title('About')).toBe('About — Joshua Folkken')
	})

	it('separates with an em dash, never a hyphen', () => {
		// The /chat assistant cites site pages by this title beside GitHub citations that use an em dash.
		expect(app.page_title('About')).toContain(' — ')
		expect(app.page_title('About')).not.toContain(' - ')
	})

	it('stays unambiguous for a title that itself contains a hyphen', () => {
		// The reason for the em dash: a hyphen separator would be indistinguishable from the one in the name.
		const title = app.page_title('game-kit')

		expect(title).toBe('game-kit — Joshua Folkken')
		expect(title.split(' — ')).toStrictEqual(['game-kit', AUTHOR.NAME])
	})

	it('keeps an empty page title from producing a leading separator alone', () => {
		expect(app.page_title('')).toBe(` — ${AUTHOR.NAME}`)
	})
})
