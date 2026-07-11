import { describe, expect, it } from 'vitest'
import { tech_colors } from './tech-colors'

const CLOUDFLARE_ORANGE = '#f97316'
const FALLBACK_GRAY = '#64748b'

describe('tech_colors - AI Chat Cloudflare tags', () => {
	it.each(['Cloudflare Workers AI', 'Cloudflare AI Search'])(
		'resolves %s to the Cloudflare brand orange',
		(tag) => {
			expect(tech_colors.get(tag)).toBe(CLOUDFLARE_ORANGE)
		},
	)

	it('keeps the base Cloudflare Workers tag on the same orange', () => {
		expect(tech_colors.get('Cloudflare Workers')).toBe(CLOUDFLARE_ORANGE)
	})
})

describe('tech_colors - unbranded AI Chat tags stay gray', () => {
	it.each(['RAG', 'Server-Sent Events', 'Llama 3.3'])(
		'falls back to the neutral gray for %s (no brand color)',
		(tag) => {
			expect(tech_colors.get(tag)).toBe(FALLBACK_GRAY)
		},
	)
})
