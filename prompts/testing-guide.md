# Test Generation Prompt

このプロンプトは、AI に一発で理想的なテストコードを生成させるための指示書です。

---

## 1. Test Type (自動判定)

### 自動判定ルール

以下のルールに基づいてテストタイプを自動判定します：

#### E2E Test (Playwright) が選択される場合：

- ファイルパスに `src/routes/` が含まれる（Svelteページコンポーネント）
- ファイル拡張子が `.svelte` で、かつページコンポーネント（`+page.svelte`、`+layout.svelte`等）
- ファイルパスに `src/lib/components/` が含まれ、かつUIコンポーネント（ユーザーインタラクションを含む）

#### Unit/Integration Test (Vitest) が選択される場合：

- ファイル拡張子が `.ts` または `.js` で、かつライブラリ関数・ユーティリティ関数
- ファイルパスに `src/lib/utils/`、`src/lib/data/`、`src/lib/server/` が含まれる
- ファイル拡張子が `.svelte` で、かつライブラリコンポーネント（純粋な表示コンポーネント）

#### 判定できない場合：

- 複数のテストタイプが適用可能な場合
- ファイルの性質が不明確な場合
- ユーザーに確認を求める

### 自動判定プロセス

**Step 1**: ユーザーが提供するファイルを分析
**Step 2**: ファイルパスと内容に基づいてテストタイプを自動判定
**Step 3**: コードの機能を分析してテストケースを自動生成
**Step 4**: 必要な定数とdata-testidを自動抽出
**Step 5**: 判定結果に基づいてテストコードを自動生成

---

## 2. Target Specification (自動判定)

### Target File

- **ユーザーが提供するファイル**（動的に分析）

### Test Objective (自動判定)

提供されたファイルのコード分析により、以下のテストケースを自動判定：

#### ファイルタイプ別の自動判定

**Svelteページコンポーネント** (`src/routes/*.svelte`):

- ユーザーインタラクションテスト
- 状態管理テスト
- データフロー検証テスト

**Svelteライブラリコンポーネント** (`src/lib/components/*.svelte`):

- プロパティ受け渡しテスト
- イベントハンドリングテスト
- レンダリングテスト

**ユーティリティ関数** (`src/lib/utils/*.ts`):

- 関数の入出力テスト
- エラーハンドリングテスト
- 境界値テスト

**データ処理関数** (`src/lib/data/*.ts`):

- データ変換テスト
- バリデーションテスト
- 配列・オブジェクト操作テスト

**サーバー関数** (`src/lib/server/*.ts`):

- API レスポンステスト
- データベース操作テスト
- 認証・認可テスト

### Test Description

提供されたファイルの機能に基づいて、適切なテストケースを自動生成します。

---

## 3. Test Conditions (自動判定)

### ファイル分析による自動判定

提供されたファイルの内容を分析して、以下のテストケースを自動生成：

#### コード分析による判定プロセス

1. **関数・メソッドの分析**
   - 関数の入出力を分析
   - 副作用の有無を確認
   - エラーハンドリングの確認

2. **状態管理の分析**
   - 状態変数の特定
   - 状態変更のトリガーを特定
   - 状態の依存関係を分析

3. **ユーザーインタラクションの分析**
   - イベントハンドラーの特定
   - ユーザー入力の処理を分析
   - UI要素の状態変化を分析

4. **データフローの分析**
   - データの入出力を追跡
   - 変換処理を特定
   - バリデーション処理を特定

#### 自動生成されるテストケース例

**関数テスト**:

- 正常系の入出力テスト
- 異常系のエラーハンドリングテスト
- 境界値テスト

**コンポーネントテスト**:

- プロパティ受け渡しテスト
- イベントハンドリングテスト
- レンダリングテスト

**統合テスト**:

- データフロー検証テスト
- 状態管理テスト
- ユーザーインタラクションテスト

---

## 4. Test Cases (自動判定)

### ファイル分析による自動判定

提供されたファイルの内容を分析して、適切なテストケースを自動生成：

#### 分析プロセス

1. **インポート文の分析**
   - 外部依存関係の特定
   - データソースの特定
   - ユーティリティ関数の特定

2. **関数・メソッドの分析**
   - 公開関数の特定
   - 内部関数の特定
   - 副作用の有無を確認

3. **状態・変数の分析**
   - 状態変数の特定
   - 計算プロパティの特定
   - 副作用の特定

4. **イベントハンドラーの分析**
   - ユーザーインタラクションの特定
   - イベント処理の特定
   - 状態変更の特定

#### 自動生成されるテストケース

**基本機能テスト**:

- 関数の正常系テスト
- 関数の異常系テスト
- 境界値テスト

**統合テスト**:

- データフロー検証
- 状態管理検証
- ユーザーインタラクション検証

### Test Data Source (自動判定)

提供されたファイルの分析により、以下のデータソースを自動特定：

- インポートされたデータソース
- 使用されている外部API
- 内部で定義されたデータ
- ユーザー入力データ

---

## 5. Required Constants (自動判定)

提供されたファイルのコード分析により、必要な定数を自動抽出：

#### 自動抽出プロセス

1. **数値の抽出**
   - マジックナンバー（0, 1, -1以外）を自動検出
   - 繰り返し使用される数値を定数化
   - タイムアウト値、インデックス値、カウント値などを特定

2. **文字列の抽出**
   - ハードコードされた文字列を検出
   - パス、拡張子、メッセージなどを定数化
   - 設定値、URL、セレクターなどを特定

3. **設定値の抽出**
   - 設定ファイルから値を抽出
   - 環境変数のデフォルト値を特定
   - アプリケーション固有の値を特定

#### 自動生成される定数例

**ファイル分析により自動抽出される定数**:

- パス関連: `AUDIO_PATH`, `STATIC_PATH`, `ASSET_PATH`
- 拡張子関連: `MP3_EXTENSION`, `JSON_EXTENSION`, `HTML_EXTENSION`
- タイムアウト関連: `WAIT_TIMEOUT`, `REQUEST_TIMEOUT`, `ANIMATION_DURATION`
- インデックス関連: `FIRST_INDEX`, `LAST_INDEX`, `DEFAULT_INDEX`
- 設定値関連: `DEFAULT_LANGUAGE`, `MAX_RETRIES`, `BATCH_SIZE`

**Note**: 提供されたファイルの内容に基づいて、実際に必要な定数のみを自動抽出します。

---

## 6. Required Data-TestIDs (自動判定)

提供されたファイルの分析により、必要なdata-testidを自動判定：

#### 自動判定プロセス

1. **UI要素の分析**
   - ユーザーインタラクション可能な要素を特定
   - ボタン、リンク、フォーム要素を検出
   - 状態表示要素を特定

2. **テスト要件の分析**
   - テストで操作が必要な要素を特定
   - アサーションで検証が必要な要素を特定
   - 状態変化を確認する要素を特定

3. **data-testidの自動生成**
   - 要素の機能に基づいて適切なIDを生成
   - 一意性を確保
   - 意味のある名前を付与

#### 自動生成されるdata-testid例

**ボタン要素**:

- `play-button`, `pause-button`, `stop-button`
- `submit-button`, `cancel-button`, `reset-button`
- `next-button`, `prev-button`, `close-button`

**入力要素**:

- `text-input`, `email-input`, `password-input`
- `checkbox-input`, `radio-input`, `select-input`
- `file-input`, `date-input`, `number-input`

**表示要素**:

- `content-area`, `message-display`, `status-indicator`
- `progress-bar`, `loading-spinner`, `error-message`

**コンテナ要素**:

- `main-container`, `sidebar`, `modal-dialog`
- `form-container`, `list-container`, `grid-container`

**Note**: 提供されたファイルの内容に基づいて、実際に必要なdata-testidのみを自動生成します。

---

## 7. Expected Output (自動生成)

### File Path (自動判定)

提供されたファイルの種類に基づいて、適切なテストファイルパスを自動判定：

- **E2E Test**: `e2e/*.test.ts`
- **Unit Test**: `src/**/*.spec.ts`

### Expected Code Structure (自動生成)

提供されたファイルの分析により、以下の構造でテストコードを自動生成：

#### 基本構造

```typescript
// インポート文（自動生成）
import { expect, test } from '@playwright/test' // E2Eの場合

// または
import { expect, test } from 'vitest' // Unit/Integrationの場合

// 必要な定数（自動抽出）
const CONSTANT_NAME = 'value'

// テストケース（自動生成）
test('test description', async ({ page }) => {
	// テストロジック（自動生成）
})
```

#### 自動生成されるテストパターン

**関数テスト**:

- 正常系の入出力テスト
- 異常系のエラーハンドリングテスト
- 境界値テスト

**コンポーネントテスト**:

- プロパティ受け渡しテスト
- イベントハンドリングテスト
- レンダリングテスト

**E2Eテスト**:

- ユーザーインタラクションテスト
- 状態管理テスト
- データフロー検証テスト

**Note**: 提供されたファイルの内容に基づいて、実際に必要なテストケースのみを自動生成します。

---

## 8. Test Guidelines (Common Rules)

### Coding Standards

- **ESLint**: 必ず eslint ルールに準拠する（`eslint.config.js` 参照）
- **Naming Convention**:
  - 変数: `snake_case`
  - 定数: `UPPER_SNAKE_CASE`
  - 関数: `snake_case`
  - boolean: `is_`, `has_`, `should_`, `can_`, `will_`, `did_` プレフィックス

### Test Function Usage

- **describe の外**: `test` を使用
- **describe の内**: `it` を使用
- **describe**: 複数テストをグループ化する必要がある場合のみ使用（不要ならば避ける）

### Parameterized Tests

- **Playwright**: `for` ループを使用
  ```typescript
  for (const item of items) {
  	test(`test: ${item.name}`, async ({ page }) => {
  		// ...
  	})
  }
  ```
- **Vitest**: `test.each` または `it.each` を使用
  ```typescript
  test.each(items)('test: $name', (item) => {
  	// ...
  })
  ```

### Test Case Definition

- テストケースが複数ある場合は配列で定義
- 変数名: `cases` またはサフィックスに `_cases` を使用
- ファイル上部、テスト関数の外部に定義

### Constants

- **マジックナンバー/文字列は厳禁**（0, 1, -1 以外はすべて定数化）
- `UPPER_SNAKE_CASE` で命名
- ファイル上部、インポートの後に配置
- 例:
  ```typescript
  const STATUS_CODE_OK = 200
  const MIN_COUNT = 0
  const MP3_EXTENSION = '.mp3'
  const TEST_ITERATION_COUNT = 5
  const FIRST_INDEX = 0
  ```

### Error Messages

- 詳細かつ具体的に記述
- 何が期待され、何が得られたかを明示
- テンプレートリテラルを使用
- **template literal 内で `number` 型を使用する場合は `String()` で変換**
- **template literal 内で不要な `?? ''` を使用しない**（既に string 型の場合）
- **配列の要素アクセスで `array.at(index)` は `undefined` を返す可能性があるため、必要な場合のみ `?? ''` を使用**
- **変数定義時に `?? ''` を使用する場合は、その変数を使用する箇所で不要な `?? ''` を避ける**
- **YAGNI原則に従い、現在nullチェックが必要ない状況では不要な防御的プログラミングを避ける**
- 例:

  ```typescript
  // 良い例（シンプルで適切）
  const first_file = praise_audio_files.at(FIRST_INDEX)
  const error_message = `Expected to cycle back to first file "${first_file ?? ''}", but got "${cycled_file}"`

  // 悪い例（過度な防御的プログラミング）
  const first_file = praise_audio_files.at(FIRST_INDEX) ?? ''
  const error_message = `Expected to cycle back to first file "${first_file}", but got "${cycled_file}"`

  // その他の例
  throw new Error(`Matching phrase not found for: ${displayed_transcript ?? ''}`)
  const error_message = `mp3 file does not exist: ${file_name}`
  const error_message = `Expected file at index ${String(index)} to be "${expected_file}"`
  ```

### Comments

- 最小限に抑える
- 必要な場合は英語で記述
- コードの「何を」ではなく「なぜ」を説明

### Imports

- 拡張子 `.js` を明示（TypeScript ファイルでも `.js` と記述）
- 型インポートは `type` キーワードを使用: `import { type Foo } from '...'`
- 例:
  ```typescript
  import { expect, test } from '@playwright/test'
  import { get_bttf_phrases } from '$lib/data/phrases/back-to-the-future'
  import type { Phrase } from '$lib/data/phrases/common'
  ```

### Playwright Specific

- 要素の取得: `data-testid` を使用（label や text での検索は避ける）
- セレクター: `page.getByTestId('element-id')`
- 実装ファイルに `data-testid` 属性を追加する必要がある

### Async/Await

- Playwright: テスト関数は必ず `async` を使用
- 非同期操作には必ず `await` を付与
- `await` を忘れないこと

### Type Safety

- 型アノテーションを適切に使用
- `any` の使用は禁止
- undefined チェックを適切に行う
- **ループ変数は必ず使用する**（未使用変数エラーを避けるため）

  ```typescript
  // NG: 未使用変数
  for (const _ of array) {
  	do_something()
  }

  // OK: ループ変数を使用
  for (const [index, item] of array.entries()) {
  	do_something()
  	expect(index).toBeGreaterThanOrEqual(0)
  }
  ```

---

## 9. Generation Checklist

生成前に以下を確認してください：

- [ ] すべてのマジックナンバー/文字列を定数化した（0, 1, -1 以外）
- [ ] インポート文に `.js` 拡張子を付与した（TypeScript でも）
- [ ] 必要に応じて `test.each` または `for` でパラメータ化した
- [ ] エラーメッセージを詳細に記述した（何が期待され、何が得られたか）
- [ ] template literal 内の number 型を String() で変換した
- [ ] template literal 内の不要な `?? ''` を削除した
- [ ] `data-testid` を使用してエレメントを取得した（Playwright の場合）
- [ ] `async`/`await` を適切に使用した
- [ ] 型の安全性を確保した（`undefined` チェック等）
- [ ] ループ変数を必ず使用した（未使用変数エラーを避ける）
- [ ] **テスト生成後、必ず `read_lints` ツールでリントエラーを確認した**
- [ ] **リントエラーが検出された場合は、「エラーなし」と報告しない**
- [ ] **リントエラー修正後、必ず再度 `read_lints` ツールで再チェックした**
- [ ] **完全にエラーがなくなるまで修正を繰り返した**
- [ ] eslint ルールに準拠している（命名規則、関数の複雑度等）
- [ ] テスト関数の最大ステートメント数（10）を超えていない
- [ ] 不要なコメントを削除した
- [ ] `describe` が本当に必要か確認した（不要なら削除）
- [ ] **@ts-ignore ではなく @ts-expect-error を使用した**
- [ ] **配列の要素アクセスで不要な `?? ''` を削除した**
- [ ] **テスト内のループ回数も定数化した**
- [ ] **複雑なテストは分割して10ステートメント以下にした**
- [ ] **動的テスト生成**: 配列・データ駆動関数の場合は動的テストを生成した
- [ ] **配列の内容に依存しない**: ハードコードされた値ではなく動的な値を使用した
- [ ] **詳細なエラーメッセージ**: 期待値と実際の値を明示した
- [ ] **循環動作のテスト**: 配列の最後で最初に戻る動作をテストした
- [ ] **状態リセットのテスト**: リセット機能が正しく動作することをテストした
- [ ] **YAGNI原則の適用**: 現在nullチェックが必要ない状況では不要な防御的プログラミングを避けた\*\*
- [ ] **シンプルなコード**: dummy1のような適切なレベルのシンプルさを保った\*\*

---

## 10. Reference Files

参考にするテストコード：

**E2E Tests (Playwright):**

- `e2e/page.test.ts` - E2E テストの基本構造
- `e2e/praise.test.ts` - パラメータ化テスト（Playwright）

**Unit/Integration Tests (Vitest):**

- `src/lib/data/phrases/phrases.spec.ts` - パラメータ化テスト、データ検証（Vitest）
- `src/lib/data/praise-audio.spec.ts` - ステートフルな関数のテスト（Vitest）

ESLint 設定：

- `eslint.config.js` - コーディング規約の詳細

---

## 10.1. Unit Test Examples

### ステートフルな関数のテスト例

状態を持つ関数（内部変数を変更する関数）をテストする場合の注意点：

#### 基本パターン

```typescript
import { expect, test } from 'vitest'
import { get_praise_audio_file, reset_praise_audio_index } from './praise-audio.js'

test('function returns expected values in sequence', () => {
	reset_praise_audio_index() // 状態をリセット

	// 期待される動作を検証
	const first_result = get_praise_audio_file()
	expect(first_result).toBe('expected-value-1')

	const second_result = get_praise_audio_file()
	expect(second_result).toBe('expected-value-2')
})
```

#### テスト間の独立性を保つ

```typescript
test('test A', () => {
	reset_praise_audio_index() // 各テストの開始時に状態をリセット
	// テストロジック
})

test('test B', () => {
	reset_praise_audio_index() // 前のテストの影響を受けないように
	// テストロジック
})
```

#### 循環動作のテスト

```typescript
test('function cycles back to start', () => {
	reset_praise_audio_index()

	// 全要素を消費
	for (let i = 0; i < array_length; i++) {
		get_next_item()
	}

	// 最初に戻ることを確認
	const cycled_item = get_next_item()
	expect(cycled_item).toBe(first_item)
})
```

#### リセット関数のテスト

```typescript
test('reset function restores initial state', () => {
	// 状態を変更
	for (let i = 0; i < 5; i++) {
		modify_state()
	}

	// リセット
	reset_state()

	// 初期状態に戻ったことを確認
	const result = get_state()
	expect(result).toBe(initial_value)
})
```

---

## 10.2. Dynamic Test Generation (動的テスト生成)

### 配列・データ駆動テストの自動生成

配列やデータ構造に依存する関数をテストする場合の動的生成パターン：

#### 基本パターン（配列の内容に依存しない）

```typescript
import { expect, test } from 'vitest'
import {
	get_praise_audio_file,
	praise_audio_files,
	reset_praise_audio_index,
} from './praise-audio.js'

const MIN_PRAISE_FILES_COUNT = 0
const FIRST_INDEX = 0
const TEST_ITERATION_COUNT = 5

test('praise_audio_files is not empty', () => {
	expect(praise_audio_files.length).toBeGreaterThan(MIN_PRAISE_FILES_COUNT)
})

test('get_praise_audio_file returns files in sequence', () => {
	reset_praise_audio_index()

	for (const [index, expected_file] of praise_audio_files.entries()) {
		const actual_file = get_praise_audio_file()
		const error_message = `Expected file at index ${String(index)} to be "${expected_file}", but got "${actual_file}"`

		expect(actual_file, error_message).toBe(expected_file)
	}
})
```

#### 循環動作の動的テスト

```typescript
test('get_praise_audio_file cycles back to start after reaching end', () => {
	reset_praise_audio_index()

	const array_length = praise_audio_files.length
	const indices = Array.from({ length: array_length }).keys()
	for (const index of indices) {
		get_praise_audio_file()
		expect(index).toBeGreaterThanOrEqual(FIRST_INDEX)
	}

	const first_file = praise_audio_files.at(FIRST_INDEX)
	const cycled_file = get_praise_audio_file()
	const error_message = `Expected to cycle back to first file "${first_file ?? ''}", but got "${cycled_file}"`

	expect(cycled_file, error_message).toBe(first_file)
})
```

#### リセット機能の動的テスト

```typescript
test('reset_praise_audio_index resets to first file', () => {
	for (let index = 0; index < TEST_ITERATION_COUNT; index++) {
		get_praise_audio_file()
	}

	reset_praise_audio_index()

	const first_file = praise_audio_files.at(FIRST_INDEX)
	const actual_file = get_praise_audio_file()
	const error_message = `Expected file after reset to be "${first_file ?? ''}", but got "${actual_file}"`

	expect(actual_file, error_message).toBe(first_file)
})
```

#### 複数リセットの動的テスト

```typescript
test('multiple resets work correctly', () => {
	const first_file = praise_audio_files.at(FIRST_INDEX)

	reset_praise_audio_index()
	const file_after_first_reset = get_praise_audio_file()

	get_praise_audio_file()
	get_praise_audio_file()

	reset_praise_audio_index()
	const file_after_second_reset = get_praise_audio_file()

	expect(file_after_first_reset).toBe(first_file)
	expect(file_after_second_reset).toBe(first_file)
})
```

### 動的テストの利点

1. **保守性**: 配列の内容が変更されてもテストが影響を受けない
2. **汎用性**: 実装の詳細に依存しない
3. **可読性**: エラーメッセージが詳細で分かりやすい
4. **拡張性**: 新しい要素が追加されても自動的にテストされる

### 動的テスト生成の判定条件

以下の条件で動的テストを自動生成：

- 配列やデータ構造を操作する関数
- インデックスベースのアクセス
- 循環動作を持つ関数
- 状態リセット機能を持つ関数
- 配列の内容に依存しない動作をテストする場合

---

## 11. Execution Instructions (自動判定版)

このプロンプトを使用してテストを生成する際の手順：

### 自動判定プロセス

1. **ファイル分析**: ユーザーが提供するファイルのパスと内容を分析
2. **Test Type 自動判定**: ファイルの種類に基づいてE2E/Unit/Integrationを判定
3. **Test Cases 自動判定**: コードの機能を分析してテストケースを自動生成
4. **Constants 自動判定**: 必要な定数を自動抽出
5. **Data-TestIDs 自動判定**: 必要なdata-testidを自動抽出
6. **Expected Output 自動生成**: 判定結果に基づいてテストコードを生成

### 手動確認が必要な場合

以下の場合のみユーザーに確認を求める：

- 複数のテストタイプが適用可能な場合
- ファイルの性質が不明確な場合
- 特殊なテストケースが必要な場合

### 実行手順

1. **ユーザーがファイルを提供**
2. **ファイル分析** を実行
3. **自動判定結果** を確認
4. **Target Specification** で対象と目的を理解
5. **Test Conditions** で Given-When-Then を確認
6. **Expected Output** の完成形を参照
7. **Test Guidelines** に従ってコードを生成
8. **Generation Checklist** で最終確認
9. **リントエラー修正後、必ず再度 `read_lints` で再チェック**

---

## 12. Additional Notes

- **Lint エラー**: 必ず解決すること（一部エラーになっても構わないが、lint エラーは許容しない）
  - **重要**: テスト生成後、必ず `read_lints` ツールで対象ファイルを指定してリントエラーを確認すること
  - **重要**: リントエラーが検出された場合は、「エラーなし」と報告してはならない
  - **重要**: エラーが見つかった場合は、すべて修正してから完了とすること
  - **重要**: 修正後は必ず再度 `read_lints` ツールで再チェックすること
  - **重要**: 完全にエラーがなくなるまで修正を繰り返すこと
- **Test 実行**: 生成後、テストが実際に動作することを確認することが望ましい
- **除外ファイル**: `demo`、`sample`、`page.svelte.spec.ts` は対象外

### よくあるリントエラーと対処法

1. **template literal 内の number 型エラー**
   - エラー: `Invalid type "number" of template literal expression`
   - 対処: `${index}` → `${String(index)}`

2. **不要な `??` オペレーター**
   - エラー: `Unnecessary conditional, expected left-hand side of ?? operator to be possibly null or undefined`
   - 対処: 既に string 型の変数には `?? ''` は不要
   - **重要**: 配列の要素アクセスで `original_files[i]` は既に string 型なので `?? ''` は不要

3. **for ループを for-of に変更**
   - エラー: `Expected a for-of loop instead of a for loop with this simple iteration`
   - 対処: `for (let i = 0; i < array.length; i++)` → `for (const [index, item] of array.entries())`
   - 注意: ループ変数は必ず使用すること

4. **マジックナンバー**
   - エラー: `No magic number: 5`
   - 対処: すべての数値（0, 1, -1 以外）を定数化
   - **重要**: テスト内のループ回数も定数化が必要

5. **未使用変数**
   - エラー: `Remove the declaration of the unused '_' variable`
   - 対処: ループ変数は必ず使用する（例: `expect(index).toBeGreaterThanOrEqual(0)`）

6. **テスト関数の最大ステートメント数超過**
   - エラー: `Arrow function has too many statements (11). Maximum allowed is 10`
   - 対処: テストをシンプルにするか、複数のテストに分割する
   - **重要**: 複雑なテストは分割して、各テストを10ステートメント以下にする

7. **@ts-ignore の使用**
   - エラー: `Use "@ts-expect-error" instead of "@ts-ignore"`
   - 対処: `@ts-ignore` → `@ts-expect-error`
   - **重要**: テスト用の一時的な変更でも `@ts-expect-error` を使用

8. **配列の要素アクセス時の型エラー**
   - エラー: `Type 'string | undefined' is not assignable to type 'string'`
   - 対処: 配列の要素は既に string 型なので `?? ''` は不要
   - **重要**: `original_files[i]` は string 型なので `?? ''` は不要

9. **template literal 内の undefined 型エラー**
   - エラー: `Invalid type "string | undefined" of template literal expression`
   - 対処: `array.at(index)` は `undefined` を返す可能性があるため `?? ''` で変換
   - **重要**: template literal 内では `undefined` 型は使用できない

10. **変更後の新たなリントエラー**

- 問題: リントエラー修正後に新たなエラーが発生することがある
- 対処: **修正後は必ず再度 `read_lints` ツールで再チェックする**
- **重要**: 一度の修正で全て解決するとは限らないため、完全にエラーがなくなるまで繰り返す

11. **YAGNI原則の適用**

- 問題: 過度な防御的プログラミングによる不要なnullチェック
- 対処: **現在nullチェックが必要ない状況では `?? ''` を避ける**
- **重要**: dummy1のようなシンプルなコードを優先し、必要な場合のみnullチェックを追加
- 例:

  ```typescript
  // 良い例（シンプル）
  const first_file = praise_audio_files.at(FIRST_INDEX)
  const error_message = `Expected to cycle back to first file "${first_file ?? ''}", but got "${cycled_file}"`

  // 悪い例（過度な防御的プログラミング）
  const first_file = praise_audio_files.at(FIRST_INDEX) ?? ''
  const error_message = `Expected to cycle back to first file "${first_file}", but got "${cycled_file}"`
  ```

---

## Template for Future Use (自動判定版)

新しいテストを作成する際は、このプロンプトを使用して自動判定を行います：

### 自動判定される項目

1. **Test Type** - 提供されたファイルのパスと内容に基づいて自動判定
2. **Target Specification** - コード分析により自動判定
3. **Test Conditions** - 機能分析により自動生成
4. **Test Cases** - コードの機能に基づいて自動生成
5. **Required Constants** - コード内の数値・文字列を自動抽出
6. **Required Data-TestIDs** - 必要な要素を自動判定
7. **Expected Output** - 判定結果に基づいて自動生成

### 手動更新が必要な場合

以下の場合のみ手動で更新：

- 特殊なテストケースが必要な場合
- 自動判定結果が不適切な場合
- ユーザーの特別な要求がある場合

### 使用方法

1. **ユーザーがファイルを提供**
2. **プロンプトが自動分析を実行**
3. **適切なテストケースを自動生成**
4. **必要に応じて手動調整**

---

## 13. 自動判定機能の詳細

### ファイル分析による判定

#### ファイルパス分析

- `src/routes/` → E2E Test (Playwright)
- `src/lib/utils/` → Unit Test (Vitest)
- `src/lib/data/` → Unit Test (Vitest)
- `src/lib/components/` → コンポーネントの性質により判定

#### ファイル内容分析

- Svelteコンポーネント（`.svelte`）→ E2E Test
- ユーティリティ関数（`.ts`）→ Unit Test
- データ処理関数（`.ts`）→ Unit Test
- サーバー関数（`.ts`）→ Unit Test

### テストケース自動生成

#### 機能分析による判定

- 音声関連機能 → 音声テストケース
- ユーザーインタラクション → インタラクションテストケース
- 状態管理 → 状態管理テストケース
- データ処理 → データ処理テストケース

#### データフロー分析

- 入力 → 処理 → 出力の流れを分析
- エラーハンドリングの確認
- 境界値の確認

### 定数自動抽出

#### 数値の抽出

- マジックナンバー（0, 1, -1以外）を自動検出
- 繰り返し使用される数値を定数化

#### 文字列の抽出

- ハードコードされた文字列を検出
- パス、拡張子、メッセージなどを定数化

### Data-TestID自動判定

#### 要素分析

- ユーザーインタラクション可能な要素を検出
- テストで必要となる要素を特定
- 適切なdata-testidを提案

### 動的テスト生成の判定

#### 配列・データ駆動関数の判定

以下の特徴を持つ関数は動的テストを生成：

- 配列を操作する関数（`get_praise_audio_file`など）
- インデックスベースのアクセス
- 循環動作（配列の最後で最初に戻る）
- 状態リセット機能
- 配列の内容に依存しない動作

#### 動的テスト生成の条件

1. **配列の存在確認**: `array.length > 0`
2. **順次アクセステスト**: `for (const [index, item] of array.entries())`
3. **循環動作テスト**: 全要素消費後の最初への復帰
4. **リセット機能テスト**: 状態の初期化確認
5. **詳細エラーメッセージ**: 期待値と実際の値を明示

#### 動的テストの生成パターン

```typescript
// パターン1: 配列の存在確認
test('array is not empty', () => {
	expect(array.length).toBeGreaterThan(MIN_COUNT)
})

// パターン2: 順次アクセス
test('function returns items in sequence', () => {
	reset_function()
	for (const [index, expected_item] of array.entries()) {
		const actual_item = get_next_item()
		const error_message = `Expected item at index ${String(index)} to be "${expected_item}", but got "${actual_item}"`
		expect(actual_item, error_message).toBe(expected_item)
	}
})

// パターン3: 循環動作
test('function cycles back to start', () => {
	reset_function()
	const array_length = array.length
	for (const index of Array.from({ length: array_length }).keys()) {
		get_next_item()
		expect(index).toBeGreaterThanOrEqual(FIRST_INDEX)
	}
	const first_item = array.at(FIRST_INDEX)
	const cycled_item = get_next_item()
	expect(cycled_item).toBe(first_item)
})
```

### エラーハンドリング

#### 判定できない場合の対応

- 複数の可能性がある場合はユーザーに確認
- 不明確な場合は保守的な判定を採用
- エラーが発生した場合は手動設定を提案
