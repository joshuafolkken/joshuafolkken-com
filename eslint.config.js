import { fileURLToPath } from 'node:url'
import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import-x'
import promise from 'eslint-plugin-promise'
import sonarjs from 'eslint-plugin-sonarjs'
import svelte from 'eslint-plugin-svelte'
import unicorn from 'eslint-plugin-unicorn'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import ts from 'typescript-eslint'
import { code_quality_rules } from './eslint/rules/code-quality.ts'
import { formatting_rules } from './eslint/rules/formatting.ts'
import { import_rules } from './eslint/rules/import.ts'
import { naming_convention_rules } from './eslint/rules/naming-convention.ts'
import { promise_rules } from './eslint/rules/promise.ts'
import { sonarjs_rules } from './eslint/rules/sonarjs.ts'
import { svelte_rules } from './eslint/rules/svelte.ts'
import { typescript_rules } from './eslint/rules/typescript.ts'
import { unicorn_rules } from './eslint/rules/unicorn.ts'
import svelteConfig from './svelte.config.js'

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url))
const tsconfigRootDir = import.meta.dirname

// ファイルパターンの定数化
const FILE_PATTERNS = {
	rules: ['eslint/**/*.ts'],
	d_ts: ['**/*.d.ts'],
	typescript: ['**/*.ts', '**/*.tsx'],
	svelte: ['**/*.svelte', '**/*.svelte.ts'],
	svelteJs: ['**/*.svelte.js'], // 存在しないが設定に含まれている
	scripts: ['scripts/**/*.ts', 'scripts/**/*.js'],
	hooks: ['**/hooks/**/*.svelte.ts', '**/*State.svelte.ts'],
	phrases: ['**/phrases/collections/*.ts', '**/phrases/praise.ts'],
	params: ['src/params/**/*.ts'],
	routes: ['src/routes/**/+*.ts', 'src/routes/**/+*.js'],
	tests: ['**/*.test.ts', '**/*.spec.ts', '**/*.test.svelte.ts', '**/*.spec.svelte.ts'],
}

// SvelteKitのルートファイル名パターン
const SVELTEKIT_ROUTE_PATTERNS = [
	String.raw`\+page\.svelte$`,
	String.raw`\+layout\.svelte$`,
	String.raw`\+error\.svelte$`,
	String.raw`\+server\.ts$`,
]

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	{
		// tsconfig に含まれないファイルを明示的に除外
		ignores: [
			'node_modules/**',
			'src/app.d.ts',
			'*.config.{ts,js,cjs,mjs}',
			'env.d.ts',
			'src/service-worker.ts',
			'.storybook/**',
			'src/routes/demo/**',
			'src/lib/server/db/**',
			'src/lib/paraglide/**',
			'src/stories/**',
		],
	},
	js.configs.recommended,
	...ts.configs.strictTypeChecked,
	...ts.configs.stylisticTypeChecked,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	unicorn.configs.recommended,
	sonarjs.configs.recommended,
	// promise.configs.recommended,
	{
		plugins: {
			promise,
		},
		rules: {
			...promise.configs.recommended.rules,
		},
	},
	importPlugin.flatConfigs.recommended,
	{
		plugins: {
			import: importPlugin,
		},
		settings: {
			'import/ignore': ['src/lib/paraglide'],
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
				},
				node: true,
			},
			// node_modules 内の Svelte 5 の非標準構文を含むファイルのパースエラーを回避
			'import-x/ignore': ['node_modules'],
		},
	},
	{
		plugins: {
			'@stylistic': stylistic,
		},
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off',

			// ===== 命名規則の厳格化 =====
			...naming_convention_rules,
			...typescript_rules,
			...code_quality_rules,
			...import_rules,
			...unicorn_rules,
			...sonarjs_rules,
			...promise_rules,
			...svelte_rules,
			...formatting_rules,
		},
	},
	{
		files: FILE_PATTERNS.rules,
		rules: {
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/no-magic-numbers': 'off',
		},
	},
	{
		files: FILE_PATTERNS.d_ts,
		rules: {
			'import/no-default-export': 'off',
		},
	},
	{
		files: FILE_PATTERNS.typescript,
		ignores: ['**/*.svelte.ts'], // .svelte.ts ファイルを除外
		languageOptions: {
			parser: ts.parser,
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir,
			},
		},
	},
	{
		files: FILE_PATTERNS.svelte,
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig,
			},
		},
		rules: {
			// Svelte コンポーネントファイルは PascalCase を許可
			'unicorn/filename-case': [
				'error',
				{
					case: 'pascalCase',
					ignore: SVELTEKIT_ROUTE_PATTERNS,
				},
			],

			// Svelte の Props インターフェース名を許可
			'unicorn/prevent-abbreviations': [
				'error',
				{
					allowList: {
						Props: true,
					},
				},
			],

			// SonarJS の no-unused-collection ルールは Svelte の AST 解析でバグがあるため無効化
			'sonarjs/no-unused-collection': 'off',
		},
	},
	{
		// CLI スクリプトでは process.exit() を許可
		files: FILE_PATTERNS.scripts,
		rules: {
			'unicorn/no-process-exit': 'off',
			'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
		},
	},
	{
		files: FILE_PATTERNS.hooks,
		rules: {
			'prefer-const': 'off',
			'max-lines-per-function': ['error', 150],
			'max-statements': ['error', 15],
		},
	},
	{
		files: FILE_PATTERNS.phrases,
		rules: {
			'max-lines': 'off',
			'sonarjs/no-duplicate-string': 'off',
		},
	},
	{
		files: FILE_PATTERNS.params,
		rules: {
			'unicorn/filename-case': 'off',
			'no-restricted-syntax': 'off',
		},
	},
	{
		// SvelteKitのルートファイル（+page.server.tsなど）では名前付きエクスポートが必須のためルールを緩和
		files: FILE_PATTERNS.routes,
		rules: {
			'no-restricted-syntax': 'off',
		},
	},
	{
		// テストファイルではルールを緩和
		files: FILE_PATTERNS.tests,
		rules: {
			'@typescript-eslint/no-magic-numbers': 'off',
			'max-lines-per-function': ['error', { max: 35, skipBlankLines: true, skipComments: true }],
			'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
			// '@typescript-eslint/no-explicit-any': 'off',
			// 'max-lines-per-function': 'off',
			// '@typescript-eslint/explicit-function-return-type': 'off',
		},
	},
)
