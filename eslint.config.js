import { fileURLToPath } from 'node:url'
import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import promise from 'eslint-plugin-promise'
import sonarjs from 'eslint-plugin-sonarjs'
import svelte from 'eslint-plugin-svelte'
import unicorn from 'eslint-plugin-unicorn'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import ts from 'typescript-eslint'
import svelteConfig from './svelte.config.js'

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url))

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	{
		// tsconfig に含まれないファイルを明示的に除外
		ignores: [
			'*.config.js',
			'*.config.cjs',
			'*.config.ts',
			'vite.config.js',
			'vite.config.ts',
			'vitest-setup-client.ts',
			'src/routes/demo/**',
			'src/stories/**',
			'src/app.d.ts',
			'src/hooks.server.ts',
			'src/hooks.ts',
			'src/lib/server/**',
			'src/routes/+layout*',
		],
	},
	{
		// tsconfig の include に合わせた対象ファイルを指定
		files: [
			'vite.config.js',
			'vite.config.ts',
			'src/**/*.js',
			'src/**/*.ts',
			'src/**/*.svelte',
			'tests/**/*.js',
			'tests/**/*.ts',
			'tests/**/*.svelte',
			'scripts/**/*.js',
			'scripts/**/*.ts',
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
		settings: {
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: './tsconfig.json',
				},
				node: true,
			},
		},
	},
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off',

			// ===== 命名規則の厳格化 =====
			'@typescript-eslint/naming-convention': [
				'error',
				// 変数は snake_case
				{
					selector: 'variable',
					format: ['snake_case'],
					leadingUnderscore: 'allow',
					trailingUnderscore: 'forbid',
				},
				// 定数（const）は UPPER_CASE または snake_case
				{
					selector: 'variable',
					modifiers: ['const'],
					format: ['UPPER_CASE', 'snake_case'],
					leadingUnderscore: 'allow',
				},
				// boolean 変数は is_, has_, should_ などで始める
				{
					selector: 'variable',
					types: ['boolean'],
					format: ['snake_case'],
					prefix: ['is_', 'has_', 'should_', 'can_', 'will_', 'did_'],
				},
				// 関数は snake_case
				{
					selector: 'function',
					format: ['snake_case'],
					leadingUnderscore: 'allow',
				},
				// パラメータは snake_case
				{
					selector: 'parameter',
					format: ['snake_case'],
					leadingUnderscore: 'allow',
				},
				// クラス、インターフェース、型エイリアス、Enum は PascalCase
				{
					selector: 'typeLike',
					format: ['PascalCase'],
				},
				// Enum メンバーは UPPER_CASE
				{
					selector: 'enumMember',
					format: ['UPPER_CASE'],
				},
				// クラスのプロパティは snake_case
				{
					selector: 'classProperty',
					format: ['snake_case'],
					leadingUnderscore: 'allow',
				},
				// クラスのメソッドは snake_case
				{
					selector: 'classMethod',
					format: ['snake_case'],
					leadingUnderscore: 'allow',
				},
				// オブジェクトリテラルのプロパティは snake_case（外部APIとの互換性のため例外を許可）
				{
					selector: 'objectLiteralProperty',
					format: ['snake_case', 'UPPER_CASE'],
					leadingUnderscore: 'allow',
					filter: {
						// 一般的な HTTP ヘッダー名のパターンのみ許可
						regex:
							'^(Content-Type|Accept|Accept-Language|Authorization|Cache-Control|Connection|Cookie|Host|Origin|Referer|User-Agent|X-[A-Za-z-]+|x[a-z]-[a-z-]+|[a-z-/]+)$',
						match: false,
					},
				},
				// 型プロパティは snake_case
				{
					selector: 'typeProperty',
					format: ['snake_case'],
				},
			],

			// ===== TypeScript 厳格化 =====
			// 明示的な関数戻り値の型を必須に
			'@typescript-eslint/explicit-function-return-type': [
				'error',
				{
					allowExpressions: true,
					allowTypedFunctionExpressions: true,
					allowHigherOrderFunctions: true,
					allowDirectConstAssertionInArrowFunctions: true,
					allowConciseArrowFunctionExpressionsStartingWithVoid: false,
				},
			],
			// モジュールの境界で明示的な型を必須に
			'@typescript-eslint/explicit-module-boundary-types': 'error',
			// any の使用を禁止
			'@typescript-eslint/no-explicit-any': 'error',
			// 未使用変数を禁止
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			// 不要な型アサーションを禁止
			'@typescript-eslint/no-unnecessary-type-assertion': 'error',
			// 不要な条件を禁止
			'@typescript-eslint/no-unnecessary-condition': 'error',
			// 浮動Promiseを禁止
			'@typescript-eslint/no-floating-promises': 'error',
			// 誤ったPromiseの使い方を禁止
			'@typescript-eslint/no-misused-promises': 'error',
			// switch文のフォールスルーを禁止
			'@typescript-eslint/switch-exhaustiveness-check': 'error',
			// 厳格なboolean式
			'@typescript-eslint/strict-boolean-expressions': [
				'error',
				{
					allowString: false,
					allowNumber: false,
					allowNullableObject: false,
					allowNullableBoolean: false,
					allowNullableString: false,
					allowNullableNumber: false,
					allowAny: false,
				},
			],
			// nullishオペレーターの適切な使用
			'@typescript-eslint/prefer-nullish-coalescing': 'error',
			// optional chainingの適切な使用
			'@typescript-eslint/prefer-optional-chain': 'error',
			// 配列のメソッドチェーンを推奨
			'@typescript-eslint/prefer-reduce-type-parameter': 'error',
			// return await を推奨
			'@typescript-eslint/return-await': ['error', 'always'],
			// 配列のインデックスアクセス時の型安全性
			'@typescript-eslint/no-unsafe-member-access': 'error',
			'@typescript-eslint/no-unsafe-call': 'error',
			'@typescript-eslint/no-unsafe-return': 'error',
			'@typescript-eslint/no-unsafe-assignment': 'error',
			// 型のインポートを明示
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
					fixStyle: 'inline-type-imports',
				},
			],
			// 型定義のエクスポート方法を統一
			'@typescript-eslint/consistent-type-exports': [
				'error',
				{
					fixMixedExportsWithInlineTypeSpecifier: true,
				},
			],
			// 配列型の表記を統一（T[] ではなく Array<T> を推奨）
			'@typescript-eslint/array-type': ['error', { default: 'generic' }],
			// メソッドシグネチャよりプロパティシグネチャを優先
			'@typescript-eslint/method-signature-style': ['error', 'property'],
			// 型アサーションよりas constを優先
			'@typescript-eslint/prefer-as-const': 'error',
			// enum宣言よりas constオブジェクトを優先
			'@typescript-eslint/prefer-enum-initializers': 'error',
			// for-of を優先
			'@typescript-eslint/prefer-for-of': 'error',
			// 関数型の表記を統一
			'@typescript-eslint/prefer-function-type': 'error',
			// includes()を優先
			'@typescript-eslint/prefer-includes': 'error',
			// string literalよりtemplate literalを優先
			'@typescript-eslint/prefer-literal-enum-member': 'error',
			// namespace よりES6モジュールを優先
			'@typescript-eslint/prefer-namespace-keyword': 'error',
			// RegExp#exec() よりString#match()を優先
			'@typescript-eslint/prefer-regexp-exec': 'error',
			// String#startsWith()を優先
			'@typescript-eslint/prefer-string-starts-ends-with': 'error',
			// void演算子の使用を制限
			'@typescript-eslint/no-meaningless-void-operator': 'error',
			// 重複した型ユニオン/インターセクションメンバーを禁止
			'@typescript-eslint/no-duplicate-type-constituents': 'error',
			// 無駄な型パラメータを禁止
			'@typescript-eslint/no-unnecessary-type-parameters': 'error',
			// Promise返す関数には非同期処理を必須に
			'@typescript-eslint/promise-function-async': 'error',
			// 混乱を招くvoid式を禁止
			'@typescript-eslint/no-confusing-void-expression': 'error',
			// 動的なdelete演算子を禁止
			'@typescript-eslint/no-dynamic-delete': 'error',
			// 無効なvoid型を禁止
			'@typescript-eslint/no-invalid-void-type': 'error',
			// 非nullアサーションの後の代替を禁止
			'@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
			// requireを禁止（ES6 importを使用）
			'@typescript-eslint/no-require-imports': 'error',
			// 型アサーションを制限
			'@typescript-eslint/consistent-type-assertions': [
				'error',
				{
					assertionStyle: 'as',
					objectLiteralTypeAssertions: 'never',
				},
			],
			// デフォルトエクスポートを禁止（既存のimport/no-default-exportと併用）
			'@typescript-eslint/no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: ['../*'],
							message: 'Relative imports from parent directories can make refactoring difficult.',
						},
					],
				},
			],
			// 型のみのインポートを分離
			'@typescript-eslint/no-import-type-side-effects': 'error',
			// inferを適切に使用
			'@typescript-eslint/no-unnecessary-qualifier': 'error',
			// 不要なtemplate expressionを禁止
			'@typescript-eslint/no-base-to-string': 'error',
			// 配列のソートにcompare関数を必須化
			'@typescript-eslint/require-array-sort-compare': ['error', { ignoreStringArrays: false }],
			// +演算子での文字列連結を制限
			'@typescript-eslint/restrict-plus-operands': [
				'error',
				{
					allowAny: false,
					allowBoolean: false,
					allowNullish: false,
					allowNumberAndString: false,
					allowRegExp: false,
				},
			],
			// テンプレート内の型を制限
			'@typescript-eslint/restrict-template-expressions': [
				'error',
				{
					allowAny: false,
					allowBoolean: false,
					allowNullish: false,
					allowNumber: false,
					allowRegExp: false,
				},
			],

			// ===== 一般的なコード品質 =====
			// console の使用を警告（開発時は許可、本番ではエラーにするべき）
			'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
			// 'no-console': 'error',
			// デバッガーの使用を禁止
			'no-debugger': 'error',
			// var の使用を禁止
			'no-var': 'error',
			// const を優先
			'prefer-const': 'error',
			// アロー関数を優先
			'prefer-arrow-callback': 'error',
			// テンプレートリテラルを優先
			'prefer-template': 'error',
			// 等価演算子は厳密等価を使用
			eqeqeq: ['error', 'always'],
			// 不要な return を禁止
			'no-useless-return': 'error',
			// 不要な catch を禁止
			'no-useless-catch': 'error',
			// 複雑度の制限
			complexity: ['error', 5],
			// 最大ネストレベル
			'max-depth': ['error', 2],
			// 関数の最大行数
			'max-lines-per-function': ['error', { max: 25, skipBlankLines: true, skipComments: true }],
			// ファイルの最大行数
			'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
			// パラメータの最大数
			'max-params': ['error', 3],
			// 関数内の文の数を制限
			'max-statements': ['error', 10],
			// 1行の最大長
			'max-len': [
				'error',
				{
					code: 100,
					tabWidth: 2,
					ignoreUrls: true,
					ignoreStrings: true,
					ignoreTemplateLiterals: true,
					ignoreRegExpLiterals: true,
					ignoreComments: true,
					ignorePattern: String.raw`^\s*class(:|=)|d="`,
				},
			],
			// 一貫した return
			'consistent-return': 'error',
			// 不要な else を禁止
			'no-else-return': 'error',
			// 重複したインポートを禁止
			'no-duplicate-imports': 'error',
			// 変数名の最小・最大長を制限
			'id-length': [
				'error',
				{
					min: 2,
					max: 30,
					exceptions: ['_', 'i', 'j', 'k', 'x', 'y', 'z'],
					properties: 'never',
				},
			],
			// 空のブロック文を禁止
			'no-empty': ['error', { allowEmptyCatch: false }],
			// ループ内で関数を作成することを禁止
			'no-loop-func': 'error',
			// 同じ変数への複数回の代入を制限
			'no-multi-assign': 'error',
			// 複数の空行を禁止
			'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
			// ネストされた三項演算子を禁止
			'no-nested-ternary': 'error',
			// new演算子を単独で使用することを禁止
			'no-new': 'error',
			// 配列コンストラクタを禁止
			'no-array-constructor': 'error',
			// Objectコンストラクタを禁止
			'no-object-constructor': 'error',
			// 不要な計算プロパティキーを禁止
			'no-useless-computed-key': 'error',
			// 不要なコンストラクタを禁止
			'no-useless-constructor': 'off', // TypeScript版を使用
			'@typescript-eslint/no-useless-constructor': 'error',
			// 不要な連結を禁止
			'no-useless-concat': 'error',
			// 不要なエスケープを禁止
			'no-useless-escape': 'error',
			// void演算子を禁止
			'no-void': ['error', { allowAsStatement: true }],
			// ラベル付き文を禁止
			'no-labels': 'error',
			// 単独のifをelse内に置くことを禁止
			'no-lonely-if': 'error',
			// 短絡評価を優先
			'no-unneeded-ternary': 'error',
			// オブジェクトのショートハンドを優先
			'object-shorthand': ['error', 'always'],
			// 分割代入を優先
			'prefer-destructuring': [
				'error',
				{
					VariableDeclarator: {
						array: true,
						object: true,
					},
					AssignmentExpression: {
						array: false,
						object: false,
					},
				},
				{
					enforceForRenamedProperties: false,
				},
			],
			// 指数演算子を優先
			'prefer-exponentiation-operator': 'error',
			// 数値リテラルを優先
			'prefer-numeric-literals': 'error',
			// Object.hasOwnを優先
			'prefer-object-has-own': 'error',
			// オブジェクトスプレッドを優先
			'prefer-object-spread': 'error',
			// restパラメータを優先
			'prefer-rest-params': 'error',
			// スプレッド演算子を優先
			'prefer-spread': 'error',
			// 正規表現リテラルを優先
			'prefer-regex-literals': 'error',
			// Promiseのrejectには必ずErrorオブジェクトを渡す
			'prefer-promise-reject-errors': 'error',
			// 基数パラメータを必須に
			radix: 'error',
			// await式を要求
			'require-atomic-updates': 'error',
			// Unicode正規表現フラグを要求
			'require-unicode-regexp': 'error',
			// Symbolの説明を必須に
			'symbol-description': 'error',
			// Yodaスタイルを禁止
			yoda: 'error',
			// パラメータの再代入を禁止
			'no-param-reassign': 'error',
			// 暗黙的な型変換を禁止
			'no-implicit-coercion': 'error',
			// カンマ演算子を禁止
			'no-sequences': 'error',
			// ビット演算子を禁止
			'no-bitwise': 'error',
			// continue文を禁止
			'no-continue': 'error',
			// インクリメント・デクリメント演算子を禁止
			'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
			// arguments.caller/calleeを禁止
			'no-caller': 'error',
			// evalを禁止
			'no-eval': 'error',
			// 暗黙的なevalを禁止
			'no-implied-eval': 'error',
			// with文を禁止
			'no-with': 'error',
			// __iterator__を禁止
			'no-iterator': 'error',
			// __proto__を禁止
			'no-proto': 'error',
			// スクリプトURLを禁止
			'no-script-url': 'error',
			// カンマ演算子を禁止（ループを除く）
			'no-restricted-syntax': [
				'error',
				{
					selector: 'ForInStatement',
					message:
						'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
				},
				{
					selector: 'LabeledStatement',
					message:
						'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
				},
				{
					selector: 'WithStatement',
					message:
						'`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
				},
				{
					selector: 'ExportNamedDeclaration > FunctionDeclaration:not([id.name=/^use_/])',
					message:
						'Individual named exports (functions) are not allowed. Use object export instead. Example: export const module_name = { function_name }',
				},
				{
					selector:
						'ExportNamedDeclaration > VariableDeclaration[declarations.length=1] > VariableDeclarator[id.type="Identifier"]:not([id.name=/^[A-Z_]+$/]):not([init.type="ObjectExpression"]):not([init.type="ArrayExpression"])',
					message:
						'Individual named exports (constants) are not allowed (except UPPER_CASE). Use object export instead. Example: export const module_name = { constant_name }',
				},
			],
			// delete演算子を変数に使用することを禁止
			'no-delete-var': 'error',
			// undefinedへの代入を禁止
			// 'no-undefined': 'error',
			// 初期化されていない変数を禁止
			'init-declarations': ['error', 'always'],
			// シャドーイングを禁止
			'no-shadow': 'off', // TypeScript版を使用
			'@typescript-eslint/no-shadow': 'error',
			// グローバル変数のシャドーイングを禁止
			'no-shadow-restricted-names': 'error',
			// alert/confirm/promptを禁止
			'no-alert': 'error',
			// 拡張されたネイティブオブジェクトを禁止
			'no-extend-native': 'error',
			// 不要なbind()を禁止
			'no-extra-bind': 'error',
			// 不要なラベルを禁止
			'no-extra-label': 'error',
			// caseのフォールスルーを禁止
			'no-fallthrough': 'error',
			// 浮動小数点の省略を禁止
			'no-floating-decimal': 'error',
			// グローバル変数への代入を禁止
			'no-global-assign': 'error',
			// 型変換の短縮形を禁止
			'no-implicit-globals': 'error',
			// ループ内で変更されない条件を禁止
			'no-unmodified-loop-condition': 'error',
			// 不要な.call()/.apply()を禁止
			'no-useless-call': 'error',
			// カーリーブレースを必須化
			curly: ['error', 'multi-line'],
			// default caseを要求
			'default-case': 'error',
			// default caseを最後に配置
			'default-case-last': 'error',
			// ドット記法を優先
			'dot-notation': [
				'error',
				{
					allowPattern: String.raw`^[A-Z0-9_]+$`,
				},
			],
			// 分割代入のデフォルト値を要求
			'default-param-last': 'error',
			// グループ化された変数宣言を要求
			'one-var': ['error', 'never'],
			// 変数を使用する前に宣言を要求
			'no-use-before-define': 'off', // TypeScript版を使用
			'@typescript-eslint/no-use-before-define': 'error',
			// throw文でErrorオブジェクトを要求
			'no-throw-literal': 'off', // TypeScript版を使用
			'@typescript-eslint/only-throw-error': 'error',
			// 文字列リテラルでのオクタル・エスケープシーケンスを禁止
			'no-octal-escape': 'error',
			// 8進数リテラルを禁止
			'no-octal': 'error',
			// 関数のパラメータ名の重複を禁止
			'no-dupe-args': 'error',
			// オブジェクトのキーの重複を禁止
			'no-dupe-keys': 'error',
			// case句の重複を禁止
			'no-duplicate-case': 'error',
			// 正規表現での空の文字クラスを禁止
			'no-empty-character-class': 'error',
			// 条件式での代入を禁止
			'no-cond-assign': 'error',
			// 定数条件を禁止
			'no-constant-condition': 'error',
			// 制御文字を禁止
			'no-control-regex': 'error',
			// 未定義変数の使用を禁止（TypeScriptで管理）
			// 'no-undef': 'error', // 既にoffに設定済み
			// 正規表現での複数のスペースを禁止
			'no-regex-spaces': 'error',
			// スパースアレイを禁止
			'no-sparse-arrays': 'error',

			// アノテーションコメントを禁止（issueに登録すべき）
			'no-warning-comments': [
				'error',
				{
					terms: ['todo', 'fixme', 'hack'],
					location: 'anywhere',
				},
			],

			// マジックナンバーを禁止
			'@typescript-eslint/no-magic-numbers': [
				'error',
				{
					ignoreArrayIndexes: false,
					ignoreDefaultValues: false,
					enforceConst: true,
					detectObjects: false,
					ignore: [0, 1, -1],
					ignoreEnums: true,
					ignoreNumericLiteralTypes: true,
					ignoreReadonlyClassProperties: true,
				},
			],

			// TypeScriptコンパイラが既にチェックするため無効化
			'import/no-unresolved': 'off',
			// Prettier: "@ianvs/prettier-plugin-sort-imports" と競合する
			// インポートの順序を強制
			// 'import/order': [
			// 	'error',
			// 	{
			// 		groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
			// 		'newlines-between': 'always',
			// 		alphabetize: { order: 'asc', caseInsensitive: true },
			// 	},
			// ],
			// 名前付きエクスポートを優先
			'import/prefer-default-export': 'off',
			'import/no-default-export': 'error',
			// 循環依存を禁止
			'import/no-cycle': 'error',
			// 未使用のインポートを禁止
			'import/no-unused-modules': 'error',
			// CommonJSを禁止
			'import/no-commonjs': 'error',
			// AMD形式を禁止
			'import/no-amd': 'error',
			// Node.jsビルトインモジュールを禁止（必要に応じて調整）
			// 'import/no-nodejs-modules': 'error',
			// 可変エクスポートを禁止
			'import/no-mutable-exports': 'error',
			// 絶対パスのインポートを禁止
			'import/no-absolute-path': 'error',
			// webpack固有のローダー構文を禁止
			'import/no-webpack-loader-syntax': 'error',
			// 自己インポートを禁止
			'import/no-self-import': 'error',
			// 同じファイルへの複数のインポートを禁止
			'import/no-duplicates': 'error',
			// 名前空間インポートを禁止
			'import/no-namespace': 'error',
			// 名前付きデフォルトエクスポートを禁止
			'import/no-named-default': 'error',
			// 匿名デフォルトエクスポートを禁止
			'import/no-anonymous-default-export': 'error',
			// インポートの際に拡張子を必須化/禁止
			'import/extensions': [
				'error',
				{
					js: 'always',
					ts: 'always',
					svelte: 'always',
					// SvelteKitの仮想モジュールを無視
					ignorePackages: true,
				},
			],
			// 最初のインポートを強制
			'import/first': 'error',
			// エクスポートの後のインポートを禁止
			'import/exports-last': 'error',
			// インポートとそれ以外の間に改行を強制
			'import/newline-after-import': 'error',
			// グループ化されていないインポートを禁止
			'import/no-unassigned-import': ['error', { allow: ['**/*.css', '**/*.scss'] }],

			// null よりも undefined を優先
			'unicorn/no-null': 'error',
			// reduce の過度な使用を禁止
			'unicorn/no-array-reduce': 'error',
			// abbreviation を禁止（明確な命名を強制）
			'unicorn/prevent-abbreviations': 'error',
			// より良いエラーメッセージ
			'unicorn/error-message': 'error',
			// ファイル名のケース統一
			'unicorn/filename-case': ['error', { case: 'kebabCase' }],
			// for-loopよりarray methodsを優先
			'unicorn/no-for-loop': 'error',
			// Array.from()よりスプレッド演算子を優先
			'unicorn/prefer-spread': 'error',
			// Array#{indexOf,lastIndexOf}よりArray#{findIndex,findLastIndex}を優先
			'unicorn/prefer-array-find': 'error',
			// 配列の存在チェックにArray#someを優先
			'unicorn/prefer-array-some': 'error',
			// String#matchAllを優先
			'unicorn/prefer-string-replace-all': 'error',
			// 三項演算子を優先
			'unicorn/prefer-ternary': 'error',
			// より明確なエラーを投げる
			'unicorn/custom-error-definition': 'error',
			// throw new Error()の形式を強制
			'unicorn/throw-new-error': 'error',
			// 空の配列をチェック
			'unicorn/no-empty-file': 'error',
			// 静的なみずからのみのクラスを禁止
			'unicorn/no-static-only-class': 'error',
			// this別名を禁止（arrow functionを使うべき）
			'unicorn/no-this-assignment': 'error',
			// 不要なawaitを禁止
			'unicorn/no-unnecessary-await': 'error',
			// 不要なspread演算子を禁止
			'unicorn/no-useless-spread': 'error',
			// より良い正規表現
			'unicorn/better-regex': 'error',
			// catch句でのエラー名を統一
			'unicorn/catch-error-name': ['error', { name: 'error' }],
			// switchケースでのブレークを強制
			'unicorn/prefer-switch': ['error', { minimumCases: 2 }],
			// Array.isArray()を優先
			'unicorn/no-instanceof-array': 'error',
			// 単独のifを禁止（else内）
			'unicorn/no-lonely-if': 'error',
			// 否定条件を避ける
			'unicorn/no-negated-condition': 'error',
			// new Array()を禁止
			'unicorn/no-new-array': 'error',
			// Buffer()コンストラクタを禁止
			'unicorn/no-new-buffer': 'error',
			// オブジェクトをデフォルトパラメータにしない
			'unicorn/no-object-as-default-parameter': 'error',
			// 読みにくい配列分割代入を禁止
			'unicorn/no-unreadable-array-destructuring': 'error',
			// 不要なundefinedを禁止
			'unicorn/no-useless-undefined': 'error',
			// 数値セパレータのスタイルを統一
			'unicorn/numeric-separators-style': 'error',
			// flatMapを優先
			'unicorn/prefer-array-flat-map': 'error',
			// Date.now()を優先
			'unicorn/prefer-date-now': 'error',
			// デフォルトパラメータを優先
			'unicorn/prefer-default-parameters': 'error',
			// Math.trunc()を優先
			'unicorn/prefer-math-trunc': 'error',
			// モダンなDOM APIを優先
			'unicorn/prefer-modern-dom-apis': 'error',
			// 負のインデックスを優先
			'unicorn/prefer-negative-index': 'error',
			// Number.*プロパティを優先
			'unicorn/prefer-number-properties': 'error',
			// Object.fromEntries()を優先
			'unicorn/prefer-object-from-entries': 'error',
			// プロトタイプメソッドを優先
			'unicorn/prefer-prototype-methods': 'error',
			// querySelector*を優先
			'unicorn/prefer-query-selector': 'error',
			// Reflect.apply()を優先
			'unicorn/prefer-reflect-apply': 'error',
			// Set#has()を優先
			'unicorn/prefer-set-has': 'error',
			// String#slice()を優先
			'unicorn/prefer-string-slice': 'error',
			// trimStart/trimEndを優先
			'unicorn/prefer-string-trim-start-end': 'error',
			// トップレベルawaitを優先
			'unicorn/prefer-top-level-await': 'error',
			// TypeErrorを優先
			'unicorn/prefer-type-error': 'error',
			// Array#joinにセパレータを必須化
			'unicorn/require-array-join-separator': 'error',
			// toFixed()に引数を必須化
			'unicorn/require-number-to-fixed-digits-argument': 'error',
			// 一貫性のないArray#lengthへの代入を禁止
			'unicorn/no-unreadable-iife': 'error',
			// process.exit()よりthrowを優先
			'unicorn/no-process-exit': 'error',
			// textContentを優先
			'unicorn/prefer-dom-node-text-content': 'error',
			// KeyboardEvent#keyを優先
			'unicorn/prefer-keyboard-event-key': 'error',
			// 配列のインデックスメソッドを優先
			'unicorn/prefer-array-index-of': 'error',
			// EventTarget#addEventListenerを優先
			'unicorn/prefer-add-event-listener': 'error',
			// Blob#arrayBuffer/text()を優先
			'unicorn/prefer-blob-reading-methods': 'error',
			// String#codePointAtを優先
			'unicorn/prefer-code-point': 'error',
			// Element#append/prependを優先
			'unicorn/prefer-dom-node-append': 'error',
			// Element#removeを優先
			'unicorn/prefer-dom-node-remove': 'error',
			// includes()を優先（文字列）
			'unicorn/prefer-includes': 'error',
			// .at()を優先
			'unicorn/prefer-at': 'error',

			// 認知的複雑度の制限（より厳しい複雑度の指標）
			'sonarjs/cognitive-complexity': ['error', 4],
			// 同一の条件分岐を禁止
			'sonarjs/no-identical-conditions': 'error',
			// 同一の関数を禁止
			'sonarjs/no-identical-functions': 'error',
			// 重複した文字列リテラルを禁止
			'sonarjs/no-duplicate-string': ['error', { threshold: 2 }],
			// ネストされた制御フロー文を制限
			'sonarjs/max-switch-cases': ['error', 3],
			// コレクションのサイズを常にチェック
			'sonarjs/no-collection-size-mischeck': 'error',
			// 無駄なジャンプ文を禁止
			'sonarjs/no-redundant-jump': 'error',
			// 同じ条件の連続したif文を禁止
			'sonarjs/no-same-line-conditional': 'error',
			// 使われない関数パラメータを禁止
			'sonarjs/no-unused-collection': 'error',
			// すべてが同じ値を返すswitch文を禁止
			'sonarjs/no-all-duplicated-branches': 'error',
			// 無駄な条件を禁止
			'sonarjs/no-redundant-boolean': 'error',
			// Promiseコールバック内でのreturnを必須化
			'promise/always-return': 'error',
			// catch()ハンドラを必須化
			'promise/catch-or-return': 'error',
			// Promiseのexecutor関数内でのreturnを禁止
			'promise/no-return-in-finally': 'error',
			// Promise.all()の引数が配列でない場合を禁止
			'promise/valid-params': 'error',
			// Promiseチェーン内での一貫性を強制
			'promise/prefer-await-to-then': 'error',
			// Promiseチェーン内での一貫性を強制
			'promise/prefer-await-to-callbacks': 'error',
			// ブール値を返すだけの無駄な条件を禁止
			'sonarjs/prefer-immediate-return': 'error',
			// 無駄なジャンプ文を禁止
			'sonarjs/prefer-single-boolean-return': 'error',

			// async 関数は必ず await を含む
			'require-await': 'error',
			'@typescript-eslint/require-await': 'error',

			// Promise コンストラクタの適切な使用
			'promise/no-new-statics': 'error',
			'promise/no-return-wrap': 'error',
			'promise/param-names': 'error',
			'promise/no-nesting': 'error',

			// a11y（アクセシビリティ）ルールを厳格に
			'svelte/valid-compile': 'error',
			'svelte/no-at-html-tags': 'error',
			'svelte/no-dom-manipulating': 'error',
			'svelte/require-optimized-style-attribute': 'error',
		},
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig,
			},
		},
		rules: {
			// Svelte ファイルでは Svelte 固有のルールを適用

			// Svelte の $state などのリアクティブ変数は再代入されるため、prefer-const を緩和
			// 'prefer-const': 'warn',

			// Svelte コンポーネントファイルは PascalCase を許可
			'unicorn/filename-case': [
				'error',
				{
					case: 'pascalCase',
					ignore: [
						String.raw`\+page\.svelte$`,
						String.raw`\+layout\.svelte$`,
						String.raw`\+error\.svelte$`,
						String.raw`\+server\.ts$`,
					],
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
		files: ['scripts/**/*.ts', 'scripts/**/*.js'],
		rules: {
			'unicorn/no-process-exit': 'off',
		},
	},
	{
		files: ['**/hooks/**/*.svelte.ts', '**/*State.svelte.ts'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig,
			},
		},
		rules: {
			'prefer-const': 'off',
			'max-lines-per-function': ['error', 150],
			'max-statements': ['error', 15],
		},
	},
	{
		files: ['**/phrases/*.ts'],
		rules: {
			'max-lines': 'off',
			'sonarjs/no-duplicate-string': 'off',
		},
	},
	{
		files: ['src/params/**/*.ts'],
		rules: {
			'unicorn/filename-case': 'off',
			'no-restricted-syntax': 'off',
		},
	},
	// {
	// 	// テストファイルではルールを緩和
	// 	files: ['**/*.test.ts', '**/*.spec.ts', '**/*.test.svelte.ts', '**/*.spec.svelte.ts'],
	// 	rules: {
	// 		'@typescript-eslint/no-explicit-any': 'off',
	// 		'max-lines-per-function': 'off',
	// 		'@typescript-eslint/explicit-function-return-type': 'off',
	// 	},
	// },
)
