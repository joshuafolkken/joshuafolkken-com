# Issue-Driven Collaboration Workflow

<!-- cspell:words coderabbit -->

このドキュメントは、Claude/Cursor/Gemini を含む複数の AI ツールで共通利用するための運用フローです。

## Overview

1. Issue を作成する
2. Issue を元に実装提案を作る
3. 計画コメントを Issue に残して Telegram 通知を送る
4. 実装を進める
5. 実装完了後に Issue へ完了コメントを投稿する

### フェーズ分離

ワークフローは 2 つのフェーズに分けて実行できる。

- **Planning phase（`kickoff`）**: Step 1〜3 — Issue 作成・計画投稿・Telegram 通知で止まる。実装前にレビューや承認を挟みたい場合に使う。
- **Execution phase（`fullrun #N`）**: Step 4〜5 — 既存 Issue の計画に基づいて実装・PR 作成・完了通知を行う。

一括実行する場合は `fullrun new` で Step 1〜5 を通しで実行する。

## Step 1: Issue 作成テンプレ

Issue には次の要素を必ず含める。

- タイトルは簡潔で明瞭な英語で記載する（日本語で作成した場合は、AIツールが実装開始前に英語タイトルへ変換する。すでに英語で書かれている場合でも、文法・明確さ・簡潔さの観点で改善できるなら書き換えて良い。いずれの場合も GitHub Issue のタイトルを `gh issue edit` で合わせて更新する）
- 目的（何を改善したいか）
- 現象（現在の不具合や課題）
- 期待結果（完了時の状態）
- 受け入れ条件（検証方法、対象画面/機能）

最小テンプレート:

```md
## 背景

<なぜ必要か>

## 現象

<現在の問題>

## 期待結果

<どうなれば完了か>

## 受け入れ条件

- [ ] 条件1
- [ ] 条件2
```

## Step 2: 提案依頼（AI 共通）

Issue URL を渡して、次の観点で提案を依頼する。

- 要件の分解
- 実装候補（複数案がある場合は比較）
- 影響ファイル
- テスト方針（unit/e2e）
- リスクと回避策

最小プロンプト:

```md
Issue: <issue-url>

以下を提案してください:

1. 要件分解
2. 実装方針（必要なら複数案）
3. 変更予定ファイル
4. テスト戦略（unit/e2e）
5. リスクと対策
```

## Step 3: 計画コメントを記録して通知する

1. 提案を人間が判断する
2. 採用した計画を Issue に記録する（Issue body が空の場合は `gh issue edit <N> --body "<plan>"` で body に書き込む。body が既にある場合は `gh issue comment <N> --body "<plan>"` でコメント追加する）
3. Telegram で計画開始を通知する:

   ```bash
   pnpm telegram:test --message "📋 Planning: <title>\n- <bullet1>\n- <bullet2>" --issue-url "<issue-url>"
   ```

   - Issue URL を必ず含める
   - 箇条書きの間に改行を入れて読みやすくする
   - `kickoff` コマンドの場合はここで **停止** する（実装に進まない）

4. メインブランチへ切り替えて最新を取得する:
   ```bash
   git switch main && git pull
   ```
5. 依存関係を最新化し、脆弱性を確認する（`pnpm latest` は内部で `pnpm audit` も実行する）:
   ```bash
   pnpm latest
   # 脆弱性が見つかった場合: package.json の overrides に対象バージョンを追加して pnpm install 後に再確認
   ```
6. 実装を開始する
7. 実装後は `AGENTS.md` の検証ゲートを実行する

`pnpm git` の基本実行（`-y` で確認プロンプトをスキップ）。**初回コミット前に必ず `pnpm version:minor` を実行する。** ただし、同一 PR 内の追加修正コミット（CodeRabbit 指摘対応など）では実行しない。

```bash
pnpm version:minor
pnpm git -y "<issue-title> #<issue-number>"
```

> **Note**: Issue タイトルは `pnpm git` を実行する前に、簡潔で明瞭な英語に整えること。
> 日本語で書かれている場合は英語に変換する。すでに英語で書かれている場合でも、文法・明確さ・簡潔さの観点で改善できるなら書き換えて良い（AI ツールは実装前にタイトル品質を判断する）。
> いずれの場合も `gh issue edit <number> --title "<english-title>"` で GitHub Issue タイトルを合わせて更新する。

## Step 5: PR結果確認 + 完了通知（別スクリプト）

`pnpm git` の後に、別スクリプト `pnpm git:followup` を実行する。

`pnpm git:followup` の主な動作:

- Cloudflare / CodeRabbit / SonarQube の結果確認（Required チェックのみ待機。CodeQL 等の non-required チェックは待たない）
- CodeRabbit 指摘の未対応検出（必要なら理由コメント投稿）
- Issue への完了通知投稿（Issue body が空なら body を編集、既にあればコメント追加）

主なオプション:

- `--notify-target`: `issue`（固定。PR への完了報告は行わない）
- `--notify-message`: Issue への完了コメント本文。定型文ではなく実装内容のサマリーを英語で記載する（例: `"Implemented X:\n- Added ...\n- Changed ..."`）
- `--coderabbit-ignore-reason`: 未対応を残す場合の理由コメント
- `--issue-number`: Issue 番号（または位置引数に `"<title> #<number>"`）

例1: 基本

```bash
pnpm git:followup "<issue-title> #<issue-number>" \
  --notify-message "Implemented <title>:
- Added ...
- Changed ..."
```

例2: CodeRabbit 未対応理由あり

```bash
pnpm git:followup "<issue-title> #<issue-number>" \
  --notify-message "Implemented <title>:
- Added ...
- Fixed ..." \
  --coderabbit-ignore-reason "仕様上この指摘は該当しないため"
```

## 運用ルール

- 通知は CI チェック成功後に投稿する
- 通知投稿に失敗しても、実装完了の事実はログで確認できるようにする
- 自動投稿される Issue コメント文面は英語で記載する

### CI チェック失敗時の対応

`pnpm git:followup` は Required チェックのみ待機するが、**Workers Builds（Cloudflare デプロイ）など非 Required チェックが失敗した場合も必ずユーザーに明示的に報告する**。

- `gh pr checks` の結果を確認し、失敗しているチェックがあればすべて列挙する
- 修正できた場合: 修正内容を `--notify-message` に含める
- 修正できなかった場合: `--notify-message` に失敗チェック名・原因・未解決である旨を記載する。**完了コメントに失敗を隠してはならない**
- ユーザーへの報告も失敗の事実を正直に伝える（「成功」として扱わない）

### `pnpm.overrides` の保護

`pnpm.overrides`（または `overrides`）に設定された制約は、**セキュリティ・互換性・動作保証のために意図的に追加されたもの**である。

- `pnpm latest` や `pnpm update --latest` 実行後は必ず `pnpm.overrides` が変化していないか確認する
- overrides が自動的に変更・削除された場合は、**理由を調査してから**ユーザーに報告し、明示的な承認なしに変更してはならない
- 例: `"esbuild@<=0.24.2": ">=0.25.0"` などのバージョン制約は、Workers ビルド互換性やパッケージの動作保証のために入れてある場合がある
