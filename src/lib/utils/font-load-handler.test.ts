import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { font_load_handler } from './font-load-handler'

class FakeHtmlLinkElement {
	media = 'print'
}

function make_event(target?: EventTarget): Event {
	const event = new Event('load')

	if (target !== undefined) {
		Object.defineProperty(event, 'target', { value: target })
	}

	return event
}

beforeEach(() => {
	vi.stubGlobal('HTMLLinkElement', FakeHtmlLinkElement)
})

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('font_load_handler.on_font_load', () => {
	it('sets media to "all" when target is an HTMLLinkElement', () => {
		const link = new FakeHtmlLinkElement()

		font_load_handler.on_font_load(make_event(link as unknown as EventTarget))

		expect(link.media).toBe('all')
	})

	it('does not throw when target is missing', () => {
		expect(() => {
			font_load_handler.on_font_load(make_event())
		}).not.toThrow()
	})

	it('leaves non-link targets unchanged', () => {
		const not_link = { media: 'print' }

		font_load_handler.on_font_load(make_event(not_link as unknown as EventTarget))

		expect(not_link.media).toBe('print')
	})
})
