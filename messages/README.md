# メッセージ（Paraglide / inlang）

各ロケールの JSON に定義するメッセージキーの命名方針です。

## 共通定義（`common_` プレフィックス）

**画面や機能に依存しない文言は `common_` で定義し、どこからでも利用する。**

- 例: `common_app_title`（アプリ名）, `common_loading`（読み込み中）, `common_error_label`（エラー:）
- 「Loading...」「Error:」のように、同じ意味で複数画面で使う場合は、画面ごとのキー（`account_loading` など）を増やさず、共通キーを import して使う。

## 機能別キー

- `account_*` … アカウント画面
- `login_*` … ログイン画面（文脈がログイン専用のときのみ。汎用の「読み込み中」は `common_loading`）
- `home_*` … ホーム画面
- その他、機能ごとにプレフィックスを分けてよい
