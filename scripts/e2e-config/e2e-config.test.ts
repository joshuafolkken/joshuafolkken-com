/* eslint-disable unicorn/prevent-abbreviations -- e2e is a well-known testing abbreviation */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

interface PackageJson {
	scripts: Record<string, string>
}

const ROOT = path.resolve(import.meta.dirname, '../..')

describe('E2E config preserves dev server', () => {
	it('test:e2e script does not kill the dev server port 5173', () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- JSON.parse returns any
		const package_json: PackageJson = JSON.parse(
			readFileSync(path.join(ROOT, 'package.json'), 'utf8'),
		)
		const test_e2e_script = package_json.scripts['test:e2e']

		expect(test_e2e_script).not.toContain('5173')
		expect(test_e2e_script).toContain('playwright test')
	})

	it('playwright local config sets reuseExistingServer to true', () => {
		const config_content = readFileSync(path.join(ROOT, 'playwright.config.ts'), 'utf8')

		// The local (non-CI) return block should have reuseExistingServer: true
		// Extract the second return block (local config, after the CI block)
		const local_block_match = /\/\/ kill-port[\s\S]*?return\s*\{([\s\S]*?)\}/u.exec(config_content)

		expect(local_block_match).toBeTruthy()
		expect(local_block_match?.[1]).toContain('reuseExistingServer: true')
	})
})
