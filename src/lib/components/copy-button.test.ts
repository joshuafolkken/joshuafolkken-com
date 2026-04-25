// CopyButton is a Svelte component that uses navigator.clipboard and $effect lifecycle.
// Full timer-cleanup and clipboard tests require component mounting with a DOM environment
// (jsdom or browser), which is not available in this project's node test runner.
// Observable behavior (copied state, error resilience) is verified by E2E tests.

import { describe, expect, it } from 'vitest'

const IMPORT_TEST = 'module can be imported without errors'

describe('CopyButton', () => {
	it(IMPORT_TEST, async () => {
		const component = await import('./CopyButton.svelte')

		expect(component.default).toBeDefined()
	})
})

describe('CheckIcon', () => {
	it(IMPORT_TEST, async () => {
		const component = await import('$lib/icons/CheckIcon.svelte')

		expect(component.default).toBeDefined()
	})
})

describe('CopyIcon', () => {
	it(IMPORT_TEST, async () => {
		const component = await import('$lib/icons/CopyIcon.svelte')

		expect(component.default).toBeDefined()
	})
})
