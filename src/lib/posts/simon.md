---
title: シンプルなゲームを作ったら、次のゲームを作るキットも育っていた—— 3D Simon リリースの話
date: '2026-05-14 22:30'
author: 'Joshua Folkken'
cover_image: /api/images/blog/simon.webp
excerpt: 3 歳から 90 歳まで遊べるシンプルな記憶ゲーム Simon を、 3D 空間に詰め込んでリリースしました。スマホでも滑らかに動くまで詰めた工夫と、そのあいだに育てていた『次のゲームを作るためのキット』の話を、ぜんぶ書きます。
---

## みなさん、本当にありがとうございます！

朝からタイムラインが賑わって、リリース告知のポストにいいねとリポストを本当にたくさんいただきました。お礼を先に言わせてください。ありがとうございます！感謝です！スポンサーのみなさま、テストプレイしてくれたみなさま、 X でポストしてくれたみなさま、ぜんぶ拾わせてもらってます。本当にありがとうございます。

「またなんか作ったんか」と思った方、はい、作りました。 **3D ファーストパーソンの Simon** —— **シンプルな記憶ゲーム** を 3D 空間にぶち込みました。

「 Simon って何？」 という方もいると思うので少しだけ補足。 **1978 年に Milton Bradley が発売した電子ゲーム** で、円盤型の本体に赤・青・黄・緑の 4 色のボタンが並んでいて、 **光って音を鳴らすパターンを覚えて、同じ順番で押し返す** ——というあのレトロおもちゃです。光るパターンはラウンドごとに 1 つずつ伸びていって、最後は自分の記憶力との戦いになる。アメリカ・ヨーロッパでは「あの黒くて丸いやつ」と言えばだいたい通じる定番ですが、日本での知名度はそこまで高くない。実は **僕自身も子供の頃は知らなくて** 、大人になってから出会ったクチです。

[前回の記事](/blog/kit-2) は「ランチから帰ってきたら実装が終わっていた」という話でした。今回はその `kit` と並走して、こっそり育ててきたもうひとつの土台—— **`@joshuafolkken/game-kit`** と、その第 1 弾の **Simon** の話を、ぜんぶ書きます。

ネタが多すぎるので、今回は **過去最長** を目指して書きます。お茶でも淹れてゆっくり読んでもらえると嬉しいです。

実際に触れるのはこちら → [simon.joshuafolkken.com](https://simon.joshuafolkken.com/) 。読みながら触ってもらえると、たぶん **100 万倍** くらい伝わります。

## 3 歳から 90 歳まで遊べるゲームを作りたい

僕がゲームを作るときの根っこにあるのは、 **「 3 歳から 90 歳まで遊べるもの」** を作りたい、という願いです。世代も国もスキルレベルも関係なく、誰もが直感で触れるシンプルなルール。難しい操作も覚えなくていい。 Simon は、そのコンセプトにぴったりの題材でした。

> ボタンが光る → 同じ順番で押す。間違えたら終わり。

それだけ。 3 歳の子も 90 歳のおじいちゃんも、ルール説明 5 秒で理解できる。これが Simon を選んだ一番の理由です。

そして **「シンプルなゲーム」にこだわった理由はもう 1 つあって** —— 後で詳しく書きますが、 `game-kit` という library を一緒に育てるためでもありました。複雑なゲームを最初から作ると、ゲーム固有のロジックがあちこちに絡まって library に切り出せなくなる。 **シンプルなゲームをまず 1 本作って、そこから "ゲームコア以外" を抜き出す** という計画が、最初から立っていたんです。

「 2 つの柱を同時に走らせる」というこの話は、後半でじっくり書きます。

## 始まりはシンプルな欲求

理由はひとつだけ。 **「 TypeScript と SvelteKit で Web3D ゲームを作りたかった」** 。

毎日触っている技術スタックで、ちゃんと「ゲーム」と呼べるものを作ってみたかった。それだけです。

最初の Overview Issue ([#10](https://github.com/joshuafolkken/simon/issues/10)) を立てたのは **2026 年 4 月 26 日** 。そこには SvelteKit + [Threlte](https://threlte.xyz) + Rapier （物理） + Tailwind CSS + Cloudflare Workers + D1 + KV と書いてあります。 **3 週間前** の自分、よくこれ全部スタックに積んだな、と。

驚いたのは、 Three.js と Svelte をつなぐ [Threlte](https://threlte.xyz) という package がすでに存在していたこと。「 3D は React じゃないとライブラリ揃わへんやろ」と覚悟していたら、宣言的に `<T.Mesh>` と書ける環境がもう用意されていた。これは本当に助かりました。 Threlte コミュニティのみなさんに頭が上がりません。

ちなみに、最初は Rapier （物理エンジン）も入れていたんですが、 Simon のゲーム性的に物理シミュレーションが要らないと気づいて、途中で抜きました（[#95](https://github.com/joshuafolkken/simon/issues/95)）。 **「入れたものを抜く勇気」** 、これも大事。バンドルが小さくなったし、起動も速くなりました。

## 目に見えない調整カタログ

ここからが、リリースしたゲームを触ってもらったら「**普通**」に動くんだけど、その「普通」のために **3 週間** あれこれ詰めてきた細かい話です。

最初に正直に言っておくと—— **Claude Code は UI と UX に弱いです**。機能はガリガリ実装してくれるんですが、「触り心地」の領域に踏み込もうとすると、急に他人事みたいになる。だから微調整、微調整、微調整。 AI さんと二人で何度も座り直しました。

### ボタン押下の判定タイミングを揃えた話

最初の Simon ボタンは、押したときに **スコアのカウントアップ・ RND 表示更新・ゲームオーバー判定・勝利フラッシュが全部バラバラのタイミング** で発火していました。

何が起きるかというと、「 4 つのランプが一斉に光った、その瞬間にスコアが確定する！」という演出が崩れる。スコアが先に増えてからフラッシュが始まったり、フラッシュ中に RND の数字がカチッと切り替わったり。 AI さんは「動いてます」と言うんですけど—— **これ、ぜんぜん気持ち良くないやん**。

判定をぜんぶ「ボタン**リリース時**」に集約しました（[#218](https://github.com/joshuafolkken/simon/issues/218)）。これで 4 つのランプとスコアと演出が一斉に発火するようになって、ようやく「来た！」という感触が出た。 **こういう "感触" は AI さんが見抜けない領域** なんですよ、本当に。

### 勝利フラッシュは 3 ステージ構成

ラウンドクリア時のフラッシュは 3 ステージで設計しました（[#140](https://github.com/joshuafolkken/simon/issues/140)）。

| Stage | 内容                                                                        |
| ----- | --------------------------------------------------------------------------- |
| 1     | Lightning Burst （ 4 ボタン同時点灯、 30ms ON × 4 cycle 、 4 音同時鳴らし） |
| 2     | Color Cascade （緑→赤→黄→青の sweep 、その後逆方向に reverse sweep ）       |
| 3     | finale                                                                      |

ms 単位の調整を何度も繰り返しました。 20ms にしてみる、 40ms に戻してみる、 cycle 数を 3 にしてみる、 4 に戻す……「これかよ！」というベストを探した結果が今の値です。「演出 1 つにそんなにこだわるか？」と聞かれたら、こだわります。 **自分が好きになれないものをリリースしても意味ないからね**。

### スコア式は「長いラウンドでも公平に」を設計

スコアは、 1 ラウンドごとに次の式で加算されます（[#142](https://github.com/joshuafolkken/simon/issues/142)）。

`round_score = 1,000 × time_coefficient × round_number`

`time_coefficient = max(0.1, 1.0 − avg_seconds_per_button × 0.1)`

`avg_seconds_per_button = elapsed_seconds ÷ sequence_length`

例えば——

| 状況                      | avg_seconds_per_button | time_coefficient | round_score  |
| ------------------------- | ---------------------- | ---------------- | ------------ |
| Round 5 を 8 秒でクリア   | 1.6 s/button           | 0.84             | **4,200 pt** |
| Round 10 を 20 秒でクリア | 2.0 s/button           | 0.80             | **8,000 pt** |

なんでわざわざ `avg_seconds_per_button` で正規化したかというと、 **シーケンスが長くなれば、当然 1 ボタンあたりの平均時間も上がりやすい** から。そのまま秒数で測ると、長いラウンドは絶対にスピードボーナスが取れなくなってしまう。

「長いラウンドをクリアした人にも、ちゃんとスピードボーナスを出したい」。この一点だけのために、式の形がこうなりました。 **数式 1 本にもストーリーがある** 、好きです、こういうの。

### ゲームオーバーのカメラシェイク

ゲームオーバー時のカメラシェイク（[#143](https://github.com/joshuafolkken/simon/issues/143)）は、 position ±0.08m / rotation ±0.04rad で 0.8 秒の指数減衰。「いま間違えた！」という感覚を視覚に流し込みます。

地味ですが、これを入れた後と入れる前では、 **ゲームオーバーの「悔しさ」が全然違う** 。視覚が揺れると、「あー、やってもうた」と体が反応する。ゲームってこういうところで体感が決まりますよね。

### PointerLock を捨てた話

PC 操作で **標準だった PointerLock を捨てました** （[#101](https://github.com/joshuafolkken/simon/issues/101), [#103](https://github.com/joshuafolkken/simon/issues/103)）。 3D ゲームでカーソルを消すのは「常識」だったんですが——カーソルが消えると、 3D オブジェクトをクリックで直接触れないんですよ。 Raycast が画面中央に固定されるので、いちいち画面中央に的を合わせに行く必要がある。

Roblox っぽく **「右ドラッグでカメラ回転、左クリックで 3D オブジェクト」** に切り替えました。トラックパッドの 2 本指 pan も生きる。 **常識を捨てたほうが、明らかに触り心地が良くなる** という、ちょっとした学び。

「みんながやってるから」を疑うところから、 UX のチューニングが始まる。 [glass-header の記事](/blog/glass-header) で書いたヘッダー調整も、結局はそういう話でした。

### モバイル操作、闇深い 3 連発

モバイル操作はもっとカオスでした。 3 連発で書きます。

- **不可視ジョイスティック** （[#90](https://github.com/joshuafolkken/simon/issues/90)）：可視 UI を全部撤去。左半分=移動、右半分=カメラの不可視ゾーンに切り替え。 Threlte に **synthetic PointerEvent** を `offsetX/Y` 明示で投げ込んで `calculateDistance` チェックを通すという、若干ハックも仕込んでいます。 nipplejs から脱却して、 0.009 rad/px の感度に詰めて、 max 40px の半径制限を入れて……。
- **iOS Safari の疑似フルスクリーン** （[#91](https://github.com/joshuafolkken/simon/issues/91)）： iPhone Safari は標準 Fullscreen API が使えない（ iPad Safari 16.4+ や Android Chrome は問題なし）。 `position: fixed; inset: 0; z-index: 9999` の **CSS 疑似フルスクリーン** にフォールバックしました。 iOS だけ別パスを書くの、毎回めんどくさい。
- **touchcancel バグ** （[#131](https://github.com/joshuafolkken/simon/issues/131)）：電話着信などで `touchcancel` が飛ぶと、 `pointerup` が Threlte に届かずドラッグ状態が固まる。回帰テストまで書き切りました。

加えて、「 JUMP ボタンがタッチドラッグ中に反応しない」というモバイル特有のバグもありました（[#115](https://github.com/joshuafolkken/simon/issues/115)）。マルチタッチを 2 つの zone で同時にトラッキングするのって、思った以上に面倒なんです。

[シンプルにしたい話](/blog/simplify-ui) でも書きましたが、 UI / UX は引き算と微調整の繰り返しです。 AI さんに「**触り心地のここがおかしい**」を分かってもらうの、これだけは無理。

### Cyber モードが暗すぎ問題

おまけにもう 1 つ。 Cyber モード、初期は **物が見えないくらい暗かった** （[#26](https://github.com/joshuafolkken/simon/issues/26)）。室内全体の明るさと、点光源の強さをぐっと持ち上げて、ようやく「 Cyber 感」を保ちつつ視認性を確保しました。 **「かっこいい」と「見える」のバランス** 、これも AI さんには出せない。

### ホロ風 UI の統一とコンポーネント整理

UI の見た目もコツコツ整えてきました。 CYBER ボタンとフルスクリーンボタンを、**「ホロ風（ホログラム風）に浮かんだ半透明パネル」というスタイルで統一**（[#127](https://github.com/joshuafolkken/simon/issues/127), [#145](https://github.com/joshuafolkken/simon/issues/145)）。 SF 映画でよく見る、空中にうっすら浮かんだボタンのあのイメージです。

最初はそれぞれ別コンポーネントとして書いていたのを、共通の `Switch` コンポーネントに抽出しました。重複コードが消えて、見た目も揃って、 game-kit に切り出しやすくなった。 **1 つの作業で 3 つの良いことが同時に起きる** 、リファクタリングのご褒美です。

### 状態管理地獄をひと撫で

地味なバグも 1 つ書いておきます。 Simon のゲームロジックは **FSM ( finite state machine = "今どの状態か" を明示的に管理する仕組み)** で書いてあります。「待機中」「シーケンス再生中」「プレイヤー入力待ち」「ゲームオーバー」みたいな状態を、明示的に切り替えながら進むやつです。

そのある時期、状態遷移時のタイマーが残り続けるリークがありました。加えて、 Web Audio の AudioContext がブラウザのタブ切り替えで suspend されたまま戻ってこない問題も（[#125](https://github.com/joshuafolkken/simon/issues/125)）。

ゲーム開発は **状態管理地獄** だ、と改めて思いました。 setTimeout / setInterval を張ったら回収する責任がある、というあたりまえのことを地味に詰めていく。 game-kit に切り出す前にこの辺を綺麗にしておけて良かった。

## モバイル 30 → 60 FPS への道のり

FPS 表示を出したのは、もともとパフォーマンス調整のためでした。 MacBook Pro M3 Pro では **120 FPS** 出るのに、 Pixel 6 Pro では **30 FPS** くらい。 **うううう** 。 **これはスマホユーザーのために絶対やらなあかん！**

### まず 5 軸の最適化

[#113](https://github.com/joshuafolkken/simon/issues/113) で 5 つの軸を順番に当てました。

| #   | 軸                          | 何をしたか                                                                                              |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1   | **DPR 制限**                | `<Canvas dpr={[1, 2]}>` 。 iPhone の native DPR は 3 ＝論理解像度の **9 倍** のピクセル数を描画していた |
| 2   | **モバイルで shadow OFF**   | PointLight ごとに 6 枚の shadow map レンダリングが走る。タッチデバイス検出で切る                        |
| 3   | **antialias 明示**          | モバイル GPU のデフォルト MSAA を回避                                                                   |
| 4   | **shader precision**        | デフォルトの `highp` を `mediump` に。 GPU に優しく                                                     |
| 5   | **emissive intensity 削減** | bloom 入れてないのに 3.0 / 5.0 は GPU のムダ                                                            |

「 iPhone の native DPR が 3 」と気づいた瞬間が一番大きかったです。 9 倍のピクセルを毎フレーム塗ってたら、そら 30 FPS にもなるわ……。

### それでもまだ CYBER だけが遅い——犯人探し

5 軸の最適化で底上げできたんですが、 **CYBER モードだけ** が依然として遅い。 RETRO は 60 FPS 出るのに、 CYBER は 40 FPS で頭打ち。

ここから犯人探し（[#198](https://github.com/joshuafolkken/simon/issues/198)）が始まりました。

- 影を疑って外す → 変わらず
- ネオンライトを疑って外す → 変わらず
- ネオンチューブを疑って外す → 変わらず
- 「絶対こいつや！」と思って外したのが、片っ端から空振り

**嘘やろ……** を 5 回くらい呟きました。当てずっぽうで shader を疑ったり、テクスチャを疑ったり、 emissive を全部 0 にしたり。それでも CYBER の 40 FPS が動かない。

最終犯人は—— **CYBER スイッチアイコンのジオメトリ** でした。

`TorusGeometry × 2 + SphereGeometry` で頂点数 **700+** 。 RETRO の数十倍の頂点を、毎フレーム描いていた。「**お前やったんか**」。

ジオメトリを軽量化して、 60 FPS まで持ち上がりました。

ちなみに、こういう「ボトルネックを 1 つずつ消去法で削っていく」っていう動き、 [ESLint を高速化したとき](/blog/optimize-eslint-performance) と全く同じでした。 **3 倍も速さ変わったりするんか** 、と思いながら、 1 つずつ容疑者を吊し上げていく。エンジニアあるあるです。今後もまだ調整したい。これは旅の途中。

## PWA と、 Cloudflare Workers の罠

リリースに合わせて PWA 対応もしました（[#61](https://github.com/joshuafolkken/simon/issues/61)）。 iOS / Android 両方インストール可能。 Simon のアーク（弧）セグメントを SVG で自作した favicon を PWA アイコンに採用しています（[#88](https://github.com/joshuafolkken/simon/issues/88)）。 SVG なので任意サイズに対応できて、 192 / 512 / Apple Touch Icon もぜんぶこの 1 ファイルから派生。

「**ブラウザタブで Svelte ロゴが出ていた**」というしょうもないバグも一緒に直しました（[#224](https://github.com/joshuafolkken/simon/issues/224)）。リリース直前にこれは恥ずかしかった。何してたんや、僕。

そして Cloudflare Workers ならではの罠（[#135](https://github.com/joshuafolkken/simon/issues/135)）。ローディングオーバーレイの **バージョン番号が、本番環境だけ空欄** でした。

原因は、 `%sveltekit.env.PUBLIC_APP_VERSION%` は Cloudflare Workers の env を見るのに、 env は Node.js のビルドプロセスでしかセットされていなかったから。

解決は、 `__APP_VERSION__` という独自トークンを `hooks.server.ts` の `transformPageChunk` で注入して、ビルド時に `package.json` から worker bundle に焼き込む方式に変更。本番でも開発でもバージョンが見えるようになりました。 **Cloudflare デプロイあるある** 、また 1 つ覚えました。

加えて、 Cloudflare Workers の miniflare が **SQLite ロック** で頻繁にコケる問題にも何度も悩まされました（次の節で詳しく書きます）。

## リリース直前まで踏み続けた罠（ CI と E2E ）

「完成までスムーズに来ました！」と書くと綺麗な物語に聞こえますが、実際には **時間のうち結構な割合を、 CI と E2E の罠を踏み続けることに使っていた** 気がします。

- **`workers=1` じゃないと miniflare の SQLite ロックで落ちる謎** （[game-kit #33](https://github.com/joshuafolkken/game-kit/issues/33), [#37](https://github.com/joshuafolkken/game-kit/issues/37)）。 miniflare 内で SQLite が並列アクセスを許してくれず、 Playwright の worker を 2 以上にすると確実にコケる。最終的に CI でも `workers=1` に落ち着きました（後にローカルベンチを取って `workers=2` に戻せた範囲もあるけど）。
- **Playwright を Docker イメージで動かして、 CI のシステム依存インストール時間を削減** （[game-kit #35](https://github.com/joshuafolkken/game-kit/issues/35), [simon #235](https://github.com/joshuafolkken/simon/issues/235)）。 Playwright が必要にする libnss やらの apt パッケージを毎回入れていたら、 CI が 5 分余分にかかっていた。 Playwright 公式の Docker イメージにしたら、 push してから結果が返ってくるまでの時間が劇的に短くなりました。
- **pre-push hook の E2E は `preview` ビルドじゃないと Vite 8 dev server の CSS 回帰でコケる** 。これは Vite 側の挙動変更で、ローカルの dev server で起動した状態の Playwright だと CSS が間に合わないタイミングがあった。 production build → preview server に切り替えて落ち着きました。

「リリース直前にこんなとこ踏むんか」みたいな罠ばっかりで、本気で泣きそうになりながら 1 つずつ潰しました。 **CI が緑になるまでマージしない** という意地だけは曲げなくて良かったと思っています。

CI の細かい話は [前回の kit-2 の記事](/blog/kit-2) でも触れた話の延長線です。「**たまに動く**」ではなく「**必ず動く**」をどこまで詰められるかが、長期的に効いてきます。

## セキュリティと a11y 、ゲームでも手を抜かない

「ゲームだから」と手を抜きたくないところもあって、本筋とは外れますが書いておきます。

### HTTP セキュリティヘッダー

Cloudflare Workers の `hooks.server.ts` で、 **Content-Security-Policy** ・ **X-Frame-Options** ・ **X-Content-Type-Options** ・ **Referrer-Policy** を全部配信するようにしました（[#183](https://github.com/joshuafolkken/simon/issues/183)）。

| ヘッダー                      | 目的                                                                   |
| ----------------------------- | ---------------------------------------------------------------------- |
| `Content-Security-Policy`     | スクリプト / スタイル / メディアを同一オリジン + Cloudflare CDN に制限 |
| `X-Frame-Options: SAMEORIGIN` | クリックジャッキング防止                                               |
| `X-Content-Type-Options`      | MIME-type sniffing を無効化                                            |
| `Referrer-Policy`             | リファラ漏洩を制御                                                     |

ゲームでここまでやってる人、たぶん少ないと思います。でも、 **ゲームだからこそ「ここはちゃんとしてる」を体に染み込ませる** ようにしています。次のゲームで楽になるから。

### アクセシビリティと E2E カバレッジ

E2E テストも、ゲームコアだけじゃなく **ハイスコアの localStorage 永続化と、自動 a11y 監査** （[`@axe-core/playwright`](https://www.npmjs.com/package/@axe-core/playwright)）まで拡張しました（[#186](https://github.com/joshuafolkken/simon/issues/186)）。

「 3D ゲームに E2E ？」と聞かれることもあるんですが、 **ゲーム以外の周辺 UI （フルスクリーン、ローディング、操作説明オーバーレイ）** はテストしやすいし、回帰も起きやすい。 game-kit に切り出した後はなおさら、こっちのテストが土台になります。

## 機能を増やすより、削った話

最初は Normal モードと Strict モードの両方を実装していました。 Normal は 1 ミスしても続行、 Strict は 1 ミスで即ゲームオーバー。

これ、 **Strict だけにしました** （[#34](https://github.com/joshuafolkken/simon/issues/34)）。

理由は、 **覚悟して触るゲームのほうが記憶に残る** から。 1 ミスでやり直し、というルールが Simon の本来の緊張感だと思って、 Normal を消した。あとは UI 上にモードトグルを置く必要も消えて、ボード周辺がすっきりした。 **機能を増やすより削ったほうがええわ** 、と腹に落ちた瞬間でした。

「これ機能 A も入れる？ B も入れる？」と聞かれる場面、エンジニアやってると無限に来ます。「あれもこれも対応しなきゃ」って思いがち。でも実際に作ってみると、 [share-buttons の記事](/blog/share-buttons) でも書いたとおり、ボタンが増えるたびに **「あーー！これじゃダメだ！」** が発動するんです。引き算は強い。引き算は強い。 2 回書きました。

操作説明も、敢えてテキストを書きませんでした。 3D の中にじわっと馴染ませたかった。ただ、リリース後のフィードバックで「やっぱり分かりづらい」という声も届いているので、最低限のテキストは足そうと思っています。多言語対応もしたいけど、なるべく文字を入れたくない。 **ここのバランス、いまも答えが出てない** 。チュートリアル issue ([#147](https://github.com/joshuafolkken/simon/issues/147)) に設計だけ書いて、まだ寝かせています。

## クレジット、 STAFF 、そして OSS への謝辞

クレジットには、 **スポンサーのみなさま** 、 **テストプレイをしてくれたみなさま** 、 **X でポストしてくれたみなさま** 、ぜんぶ名前を入れさせていただきました。フィードバックなしには、このゲームはここまで来ていません。本当にありがとうございます。

今回は **僕と AI さんの兼業** なので、 STAFF 欄にも書きました（[#215](https://github.com/joshuafolkken/simon/issues/215) で cinematic な staff credits を実装）。 Director と Engineer のエンドカードが流れます。気恥ずかしいけど、事実そうなので。

そして謝辞として、 **すべての OSS package** もクレジットに記載させてもらいました。 [Threlte](https://threlte.xyz) 、 [Three.js](https://threejs.org/) 、 [SvelteKit](https://svelte.dev/) 、 Tailwind CSS 、 Vite 、 Playwright 、 Vitest 、 Drizzle 、 better-auth 、 Paraglide ……ぜんぶ書きました。 OSS がなければ、このゲームは完成していません。これは大事なので、もう一度書きます。 **OSS がなければ、このゲームは完成していません** 。

### 次は、技術アイコンの壁

クレジットを書いていて、もう一歩進めたいと思ったのが「**技術アイコンの壁**」（[#217](https://github.com/joshuafolkken/simon/issues/217)）。ゲームのバックウォール、ボードの左隣に、使っている OSS のアイコンをグリッドで並べる構想です。

イメージはこんな感じ：

- 場所は **ボードと同じ壁、ボードの左隣** 。プレイ中は視界の端にずっと見える
- アイコン群は **少し壁から手前に浮かせる** 。スコア表示と同じ「文字や絵がパネルから少し浮いて見える」流儀
- **動かない、揺らさない、ホバーもなし** 。最初からラベル付きで全部見せる（モバイルでホバー取れんし）
- アイコン素材は npm の [`simple-icons`](https://simpleicons.org/) パッケージを **ローカル参照** （外部 URL は使わない）

実装はこれから。 **プレイ中、ずっと OSS のアイコンが見える** 、そういう状態にしたい。文字より絵のほうが伝わると思っているので。

## もうひとつの柱、 game-kit

ここからが、もう 1 本の柱の話です。長くなります。

`game-kit` は、 Simon と並走して育てている **オレオレゲーム開発キット** 。 Simon のゲームコア以外（スコア表示、トグルボタン、クレジット、スプラッシュ画面、空間、移動系、操作説明）、ぜんぶこっちに切り出してきました。

### 最初から「 package 化する」前提で始めた

このプロジェクト、 **最初から 2 つのゴール** を立てて始めました。

| ゴール | 内容                                              | 期間感   |
| ------ | ------------------------------------------------- | -------- |
| 短期   | シンプルな 3D ゲーム Simon をリリースする         | 数週間   |
| 長期   | ゲームコア以外を再利用可能な library として育てる | 数ヶ月〜 |

ここまでに書いた「シンプルなゲームを選んだ理由」と完全につながっています。複雑なゲームを最初から作ると、ゲーム固有のロジックがあちこちに絡まって library に切り出せなくなる。 **シンプルなゲームをまず 1 本作って、そこから "ゲームコア以外" を抜き出す** —— その計画が出発点でした。

つまり Simon の中で書いたモジュールのうち、 **「これは Simon じゃなくても使えるよね？」というものを、 1 つずつ game-kit 側に引っ越していく** という作業を、ずっと並行でやってきたわけです。

### 「これ Simon じゃなくても使えるよね？」を 20 PR 以上積んだ

Simon を作りながら、「これ汎用やん」と気づくたびに切り出し PR を立てました。一覧で見せるとこんな感じ。

| カテゴリ                      | 内容                                                                                                                     | issue                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| **テーマの抽象化**            | 「ノーマル / Cyber 」のような見た目切り替えを 1 つの object （色 / 明るさ / フォント倍率など）にまとめて差し替え式に統一 | [#85](https://github.com/joshuafolkken/simon/issues/85), [#118](https://github.com/joshuafolkken/simon/issues/118)   |
| **命名の一般化**              | `CYBER` や `simon` のような固有名を `ALT` 、汎用名に置換                                                                 | [#152](https://github.com/joshuafolkken/simon/issues/152), [#158](https://github.com/joshuafolkken/simon/issues/158) |
| **設定の外出し**              | ローディング画面・スイッチ音・クレジットなど、ゲームに紐づく固有値を library 外へ                                        | [#159](https://github.com/joshuafolkken/simon/issues/159)                                                            |
| **コンポーネントの props 化** | Player や SimonBoard を、 props 受け取りで動くように                                                                     | [#161](https://github.com/joshuafolkken/simon/issues/161)                                                            |
| **入力の脱結合**              | ボードやスイッチの入力イベントを、コールバックパターンに                                                                 | [#160](https://github.com/joshuafolkken/simon/issues/160)                                                            |
| **状態の脱グローバル**        | モジュールスコープ singleton 状態を factory 関数化（インスタンスごとに状態を持てるように）                               | [#191](https://github.com/joshuafolkken/simon/issues/191)                                                            |
| **メッセージの分割**          | i18n を library 共通分と Simon 固有分に分割                                                                              | [#231](https://github.com/joshuafolkken/simon/issues/231)                                                            |
| **ファイルの隔離**            | Simon 専用ファイルを `lib/simon/` に隔離し、 game-kit 側を "pure engine" に                                              | [#173](https://github.com/joshuafolkken/simon/issues/173), [#175](https://github.com/joshuafolkken/simon/issues/175) |
| **公開 API の整理**           | barrel exports 、 plugin API 設計                                                                                        | [#162](https://github.com/joshuafolkken/simon/issues/162), [#171](https://github.com/joshuafolkken/simon/issues/171) |

これ、 1 つ 1 つは超地味なんです。「あの定数を外出ししました」「あの関数の依存を消しました」。リリースした人から見たら、何も変わってない。でも内側では着実に **Simon の輪郭がはっきりして、 game-kit が独立した library の姿** になっていく。

[#175](https://github.com/joshuafolkken/simon/issues/175) で「 Simon 専用の 3D オブジェクト群を `lib/simon` に隔離して、 game-kit 側を "pure engine" にした」ときは、地味なのにちょっと感動しました。 **境界が綺麗に切れた瞬間** 、エンジニアは無条件で気持ちよくなる。

**綺麗な抽象は最初から作らない** 。 1 つ目を作りながら「これは共通だな」「これは Simon 固有だな」が見えてきて、抽象が後から決まる。これは AI と協業していようがいまいが、変わらない真理だと思っています。

[`kit-package` の記事](/blog/kit-package) で書いた「育てるパッケージ」と同じ発想です。あっちは AI コーディングの土台、こっちは 3D ゲームの土台。兄弟みたいなものですね。

### 旧名は `threlte-kit` だった

ちなみに、 game-kit は最初 `@joshuafolkken/threlte-kit` という名前でした（[#120](https://github.com/joshuafolkken/simon/issues/120)）。途中で `game-kit` に改名（[#197](https://github.com/joshuafolkken/simon/issues/197)）。

理由は、「 Threlte 依存は内部実装、ユーザーから見たら "ゲームを作るキット"」だから。 **名前は外向きの言葉で** 。中で Threlte を使っていることは事実ですが、利用者が「 Threlte 使ってる」を意識する必要は無いほうが良い、と思って。

別案として **`@joshuafolkken/game-shell`** という名前も候補にありました（[#197](https://github.com/joshuafolkken/simon/issues/197)）。「 shell （シェル）」だとゲームコア以外という意味合いが強く出るんですが、「次のゲームを生むためのキット」というニュアンスにしたかったので `game-kit` を採用。 **名前って大事ですね** 、ほんまに。

### `gk init` で次のゲームが 1 コマンドで生まれる

そして、 game-kit の現在の到達点が **`gk init`** という CLI コマンド（[game-kit #27](https://github.com/joshuafolkken/game-kit/issues/27), [#49](https://github.com/joshuafolkken/game-kit/issues/49), [#51](https://github.com/joshuafolkken/game-kit/issues/51)）。

`pnpm dlx @joshuafolkken/game-kit gk init tic-tac-toe` 一発で、 `tic-tac-toe/` ディレクトリが自動で作られて、 PWA マニフェスト・ `app.html`・ `messages.ts` の `SIMON` という文字列が全部 `TIC TAC TOE` に置換されます。 `create-vite` / `create-svelte` 相当の体験。

| 以前                                                                                                               | いま                                                    |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| `mkdir my-game` → `cd my-game` → `pnpm dlx @joshuafolkken/game-kit gk init my-game` → 設定ファイル群を手で差し替え | `pnpm dlx @joshuafolkken/game-kit gk init my-game` 一発 |

しかも GitHub Packages に公開済み（[game-kit #55](https://github.com/joshuafolkken/game-kit/issues/55), [#57](https://github.com/joshuafolkken/game-kit/issues/57)）。 `pnpm dlx` で叩けるのはこのおかげです。 **配布まで作って、ようやく "kit"** 。

裏では、 `josh init` を内部で呼んで kit を入れ、 game-kit 固有のテンプレートを scaffolding 、 `game-config.ts` という single source of truth から PWA manifest / app.html / messages.ts に値を流す——という処理が動いています。 XSS が怖いのでゲーム名は HTML エスケープ済み（[game-kit #49](https://github.com/joshuafolkken/game-kit/issues/49)）。 **「あ、これそのまま `innerHTML` に入れたらアカン値や」** と気づいて、エスケープ処理を追加しました。地味だけど大事な配慮。

[`kit-package` の記事](/blog/kit-package) と [前回の `kit-2`](/blog/kit-2) で「土台が育つから次が早い」と書きました。 game-kit でもまったく同じ発想です。 **同じことを 2 回書くのめんどくさいから、ライブラリにする** 。 [単純作業アレルギー](/blog/driven-by-laziness) は健在です。

## これからやりたいこと（ロードマップ）

リリースしましたが、やりたいことは山ほどあります。優先度高そうな順に書きます。

### ランキング（最初から後付け前提で設計済み、まだ未実装）

最初の Overview Issue ([#10](https://github.com/joshuafolkken/simon/issues/10), [#9](https://github.com/joshuafolkken/simon/issues/9)) から「**後付け実装**」前提でずっと設計されていました。

| 項目       | 内容                                                                              |
| ---------- | --------------------------------------------------------------------------------- |
| DB         | **Cloudflare D1** （ SQLite ）                                                    |
| キャッシュ | **Cloudflare KV**                                                                 |
| 認証       | なし。名前のみ入力                                                                |
| 名前の上限 | **16 文字**                                                                       |
| 登録ルール | UPSERT （新スコアが既存より高い場合のみ上書き）                                   |
| モード分離 | Normal / Strict で分けるだけ。 Cyber はビジュアル違いだけなのでランキング上は同一 |
| 表示       | 上位 100 件 + 自分の順位                                                          |

スキーマも `PRIMARY KEY (name, strict)` まで決め打ち。 D1 のテーブル作成 SQL も issue にもう書いてある。 **やるだけの状態** 。次のマイルストーンはこれかな。 [前回の記事](/blog/kit-2) でも書いた「土台を作るほど次が早い」を、ここで実証する番です。

### チュートリアル、色覚サポート、デイリーチャレンジ

[#132](https://github.com/joshuafolkken/simon/issues/132) にまとめた「ゲーム改善アイデア集」から、まだ着手していないものをピックアップ。

| アイデア                       | 内容                                                                                         | issue                                                     |
| ------------------------------ | -------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **チュートリアル**             | 左半分を点滅させて移動を促し、右半分を点滅させて視点変更を促す。設計はあるが寝かせている     | [#147](https://github.com/joshuafolkken/simon/issues/147) |
| **色覚サポートモード**         | 4 ボタンに ▲◆●■ のシンボルを重ねる。色だけで識別しなくていいように                           | [#132](https://github.com/joshuafolkken/simon/issues/132) |
| **デイリーチャレンジ**         | 日付ベースの固定シードで、その日プレイした全員が同じシーケンスを解く。スコア比べが盛り上がる | [#132](https://github.com/joshuafolkken/simon/issues/132) |
| **逆再生モード**               | シーケンスを逆順に入力。コアロジック据え置きで新モードを足せる                               | [#132](https://github.com/joshuafolkken/simon/issues/132) |
| **スピードモード**             | ボタン入力に 2 秒の時間制限                                                                  | [#132](https://github.com/joshuafolkken/simon/issues/132) |
| **ハイスコア記録**             | localStorage で最大ラウンド数を保存                                                          | [#132](https://github.com/joshuafolkken/simon/issues/132) |
| **ルームテーマアンロック**     | スコア達成で別の部屋デザインがアンロックされる                                               | [#132](https://github.com/joshuafolkken/simon/issues/132) |
| **BGM / アンビエントサウンド** | 静かなループ音楽で没入感を向上                                                               | [#132](https://github.com/joshuafolkken/simon/issues/132) |

色覚サポートは **3 歳から 90 歳まで遊べる** という設計の延長として、優先度高めにしたい。色だけに頼らずシンボルでも識別できるなら、色覚が違う方にも遊んでもらえる。デイリーチャレンジは、 X で「今日のスコア！」と投稿してもらえる導線になりそうで、ワクワクしてます。

### VR / AR 対応

[#148](https://github.com/joshuafolkken/simon/issues/148) には「 VR/AR 対応」とだけ書いてあります（中身は空）。 Threlte で 3D を組んでいるからこそ、自然な拡張先。長期視点で考えています。 Quest で Simon を遊ぶ未来、めっちゃ気持ち良さそうやないですか？

## 最後に、 Sonnet / Opus 経済学の話

ちなみに、ここまで全部 **Claude Sonnet** で書いています。 Opus じゃないんです。

理由は **コスト** 。 Opus を使うと、 queue を回しているうちにすぐクレジットが溶けていく。 [前回 5 時間リミットに引っかかった話](/blog/kit-2) を書いたばかりなのに、 Opus にしたら、もっと厳しい。

`Sonnet で十分か？` と聞かれると、 **十分です** 。 UI / UX の感覚調整以外なら、 Sonnet で全部回ります。複雑なリファクタリングや状態管理の設計、 E2E 整備、 Cloudflare 周りの罠回避、ぜんぶ Sonnet が並走してくれた。

この経済学を解いてから、 Opus にも手を出していきたいと思っています。今は Sonnet と二人三脚です。 AI さん、いつもありがとうございます。

## 長期 × 短期、両軸で走る

最後に、開発スタイルの話で締めます。

僕は基本的に、 **2 つの関連することを同時にやりたい** 人です。長期的なものと、短期的なもの。今回で言うと—— **短期 = シンプルなゲームを次々にリリース**、 **長期 = game-kit をじっくり育てる** 。

短期がないと長期は試せない。長期がないと短期は積み上がらない。両方を同時に走らせて、お互いをフィードバックさせる。 **Simon を作ったから game-kit が育ち、 game-kit が育ったから次のゲームが早く出せる** 。この循環が今のところ気持ちよく回っています。

次のゲームも、たぶんシンプルなやつです。またリリースしたら告知させてください。 `gk init` で土台はもうある。早く出したい。 **楽しみにしててな！**

実際に Simon を触ってもらえるのは [simon.joshuafolkken.com](https://simon.joshuafolkken.com/) 。リポジトリは [github.com/joshuafolkken/simon](https://github.com/joshuafolkken/simon) で全部オープンにしています。 game-kit のほうも [github.com/joshuafolkken/game-kit](https://github.com/joshuafolkken/game-kit) で見られます。 issue や PR 、本当に歓迎です。「ここはこうしたほうが良くない？」という視点で、ぜひ覗いてみてください。

そして X もこまめに更新しています。 [@joshuafolkken](https://x.com/joshuafolkken) でリプライ・ DM 、いつでも待っています。 **みなさんの "いいね" と "リポスト" 、本当に支えになっています** 。本当に。

これから次のゲームを作るので、もうしばらくお付き合いください！

---

## ボツタイトル供養

- シンプルなゲームを作ったら、次のゲームを作るキットも育っていた—— 3D Simon リリースの話（採用）
- 3 歳から 90 歳まで遊べる Simon をリリースしました——『次のゲームを作るキット』を育てるための、シンプル設計の話
- ゲームを 1 本作るついでに、次のゲームを作るキットも育っていた
- 子供の頃に憧れた記憶ゲームを、 3D 空間にぶち込んだ話（ボツ：実は子供の頃は知らなかった）
- 30 FPS と CYBER スイッチを倒した日—— Simon リリースと、 3 週間の地ならし
- 「お前やったんか」—— Pixel 6 Pro の犯人探しと、 Simon リリースの裏側
- Simon を作ったから game-kit が育った。 game-kit が育ったから次のゲームが早い
- 700 頂点のスイッチアイコンと、 20 本の地味な PR —— Simon リリース全記録
- `gk init` 一発で次のゲームが生まれる。 Simon リリースと game-kit という土台
