import { describe, expect, it } from 'vitest'
import { tech_official_urls } from './tech-official-urls'

describe('tech_official_urls.get_official_url', () => {
	it.each([
		['GitHub Actions', 'https://github.com/features/actions'],
		['CSpell', 'https://cspell.org'],
		['Gemini', 'https://gemini.google.com/app'],
		['SonarQube Cloud', 'https://www.sonarsource.com/products/sonarqube/cloud/'],
	])('resolves %s to %s', (name, expected_url) => {
		expect(tech_official_urls.get_official_url(name)).toBe(expected_url)
	})

	it('returns undefined for an unknown name', () => {
		expect(tech_official_urls.get_official_url('NotARealTech')).toBeUndefined()
	})

	it('does not expose the legacy "SonarCloud" name (unified to SonarQube Cloud)', () => {
		expect(tech_official_urls.get_official_url('SonarCloud')).toBeUndefined()
	})
})
