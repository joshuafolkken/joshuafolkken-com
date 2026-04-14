import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

interface PackageJson {
	pnpm?: {
		overrides?: Record<string, string>
		// eslint-disable-next-line @typescript-eslint/naming-convention
		onlyBuiltDependencies?: Array<string>
		// eslint-disable-next-line @typescript-eslint/naming-convention
		ignoredBuiltDependencies?: Array<string>
	}
	scripts?: Record<string, string>
}

function load_manifest(): PackageJson {
	const content = readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8')

	return JSON.parse(content) as PackageJson
}

describe('package.json pnpm.overrides', () => {
	const manifest = load_manifest()
	const overrides = manifest.pnpm?.overrides ?? {}

	it('uses range-keyed format for esbuild', () => {
		expect(overrides['esbuild@<=0.24.2']).toBe('>=0.25.0')
		// eslint-disable-next-line dot-notation -- TS strict mode (noPropertyAccessFromIndexSignature) forbids dot access
		expect(overrides['esbuild']).toBeUndefined()
	})

	it('uses range-keyed format for cookie', () => {
		expect(overrides['cookie@<0.7.0']).toBe('>=0.7.0')
		// eslint-disable-next-line dot-notation -- TS strict mode (noPropertyAccessFromIndexSignature) forbids dot access
		expect(overrides['cookie']).toBeUndefined()
	})

	it('pins drizzle-orm to a safe floor', () => {
		expect(overrides['drizzle-orm@<0.45.2']).toBe('>=0.45.2')
	})

	it('pins @sveltejs/kit to a safe floor', () => {
		expect(overrides['@sveltejs/kit@<=2.57.0']).toBe('>=2.57.1')
	})

	it('keeps the project-specific undici override', () => {
		// eslint-disable-next-line dot-notation -- TS strict mode (noPropertyAccessFromIndexSignature) forbids dot access
		expect(overrides['undici']).toBe('>=7.24.0')
	})
})

describe('package.json pnpm built-dependency lists', () => {
	const manifest = load_manifest()
	const only_built = manifest.pnpm?.onlyBuiltDependencies ?? []
	const ignored_built = manifest.pnpm?.ignoredBuiltDependencies ?? []

	it('moves lefthook into ignoredBuiltDependencies', () => {
		expect(ignored_built).toContain('lefthook')
		expect(only_built).not.toContain('lefthook')
	})

	it('keeps native builds required by this project', () => {
		expect(only_built).toEqual(expect.arrayContaining(['better-sqlite3', 'esbuild']))
	})
})

describe('package.json scripts', () => {
	it('exposes the upstream drift check command', () => {
		const manifest = load_manifest()

		expect(manifest.scripts?.['check:upstream']).toBe('tsx scripts/check-upstream-drift.ts')
	})
})
