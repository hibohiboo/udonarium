# 部屋設定機能移行 — セッション引継ぎ文書

作成日: 2026-08-22（このセッションのリセット時点のスナップショット）

追記: 2026-08-23 — フェーズ2の残り2件（`empty-default-objects`/`empty-default-table`）を
実装・実機確認・コミット済み。フェーズ2は完了。次はフェーズ3（下記チェックリスト参照）。

このファイルは「次のセッションが読めばすぐ続きから作業できる」ことを目的にした引継ぎ文書。
背景・設計方針は [settings-features-migration.md](./settings-features-migration.md)、
進捗チェックリストは [settings-features-migration-checklist.md](./settings-features-migration-checklist.md)
が正（このファイルはそれらのサマリ+補足であり、進捗の一次情報源はチェックリスト側）。

## 1. 今の状態

- ブランチ: `yakumi-cloudflare-boardgame-for-sola`
- 作業ツリー: クリーン（`git status --short` 出力なし）。フェーズ2までの実装は全てコミット済み
  （直近: `37c983c1 add カードに文字入力機能を追加` 他、機能ごとに1コミット）。
- フェーズ0・フェーズ1: 完了（8機能の配線＋実機確認済み）。
- **フェーズ2: 8/10 完了**。残り2件が次の作業対象:
  - [ ] `empty-default-objects`（サンプルのキャラクターコマ非表示）
  - [ ] `empty-default-table`（初期テーブル設定をおこなわない）
- フェーズ3〜6: 未着手（詳細はチェックリスト参照）。

## 2. 次にやること: `empty-default-objects` / `empty-default-table`

事前調査済みなので、次のセッションはここから実装に入れる。

**移行元（`D:\projects\udonarium\udonarium-boardgame`）の実装:**
- `isEmptyDefaultTabletopObjects`（param: `empty-default-objects`）/ `isEmptyDefaultTable`
  （param: `empty-default-table`）は `src/plugins/config.ts` で定義。
- どちらも `src/plugins/extends/app/component/game-table/game-table.component.ts` の `ngOnInit`
  オーバーライド内で、`tabletopActionService.makeDefaultTabletopObjects()` /
  `tabletopActionService.makeDefaultTable()` の呼び出し各々を独立してガードしているだけ
  （コア無変更、2つのフラグは完全に独立）。

**移行先（本リポジトリ）の現状 — ⚠️名前衝突に注意:**
- 移行先にも `isEmptyDefaultTabletopObjects` という名前がすでに **存在するが、全くの別物**。
  [first-fetch-zip-room/extend/components/game-table/game-table.components.ts](../../src/plugins/first-fetch-zip-room/extend/components/game-table/game-table.components.ts)
  で `pluginConfig.isFirstFetchZipRoom` のエイリアスとして定義されている（Zip読込機能用）。
  **同じ名前を新機能で再利用しないこと。** 新フラグは `isEmptyDefaultObjects`（末尾 `Tabletop` なし）
  など明確に別名にする。
- コア [game-table.component.ts:111-112](../../src/app/component/game-table/game-table.component.ts)
  で `makeDefaultTable()` と `makeDefaultTabletopObjects()` は独立した2行の呼び出し。
- 既存の集約フック [extends/component/game-table/game-table.component.ts](../../src/plugins/extends/component/game-table/game-table.component.ts)
  の `ngOnInit` オーバーライドは、既存の（無関係な）`isEmptyDefaultTabletopObjects`
  （first-fetch-zip-room由来）が true のときだけ分岐し、`originalNgOnInit` 自体を丸ごとスキップする
  作りになっている（＝2つの呼び出しをまとめてスキップする一体型で、個別スキップの仕組みがまだない）。
  新機能の実装では、この分岐構造の中に「2つを個別にガードする」ロジックを追加する必要がある
  （素直にやるなら、`originalNgOnInit.call(this)` を呼ぶ代わりに、条件次第で `makeDefaultTable()`
  ／`makeDefaultTabletopObjects()` を個別に呼ぶよう分岐を書き換える形になりそう。ただし
  `originalNgOnInit`（コア側の本来のngOnInit実装）の中身を先に読んで、他に何をしているか
  確認してから設計すること）。

**進め方の型（これまでの7機能と同じ）:**
1. `config-schema.ts` に2つの新フラグを追加（category は `display` あたりが妥当、要検討）。
2. `config.ts` の `QueryParamConfig` に追記。
3. `src/plugins/extends/component/game-table/game-table.component.ts` の既存 `ngOnInit`
   オーバーライドに手を入れる（新規プラグインディレクトリを作るかは規模次第）。
4. `ng build --configuration production` で確認（`tsc --noEmit` だけでは template 型エラーを
   検出できないので必ず本ビルドを通すこと）。
5. `git diff -- src/app` が空であることを確認。
6. playwright-cli で実機確認（起動時にサンプルキャラクター/初期テーブルが生成されないことを目視）。
7. チェックリストのチェックボックスを更新してコミット。

## 3. このセッションで確立したパターン・設計判断（次セッションはこれを前提にしてよい）

### 3-1. コア非破壊の実装パターン（[[dont-touch-upstream-core]] メモリ参照）
- **Angularコンポーネントの拡張**: コア側は既に `extendsXxxComponent(this)` / `extendCard(this)`
  等の1行フックを持っている（`src/app/**` 内）。新しいロジックは `src/plugins/extends/**`
  の対応する集約ファイルに追記するだけで、コアへの追記は不要なことがほとんど。
- **staticメソッドの拡張**（Angularコンポーネントではないプレーンなクラス、例: `SoundEffect`）:
  `extendXxx()` という冪等ガード付き関数を作り、静的メソッドそのものを一度だけ差し替える
  （[extends/class/sound-effect.ts](../../src/plugins/extends/class/sound-effect.ts) が実例）。
  `extendsAppComponent` から1回だけ呼ぶ。
- **サービスの拡張**（例: `ContextMenuService`）: `.prototype.method` を冪等ガード付きで
  一度だけ差し替える（[extends/service/context-menu.service.ts](../../src/plugins/extends/service/context-menu.service.ts) が実例）。
- **新しいメニュー項目・新しい表示要素がどうしても必要な場合**: CSSクラス切り替えで済ませられないか
  必ず先に検討し、無理なら核テンプレートに最小限の `*ngIf` ブロックを1つだけ追加してよい
  （既存メモリでは「コンポーネント丸ごとの出し入れのみ許容」だったが、このセッションで
  「1メニュー項目の追加」等にも適用範囲を広げて運用した実績あり: `add-reload-button`,
  `help`, `reset-point-of-view`, `toggle-sound-effect`, `add-card-text-writable` 全てこの型）。
  ロジックは一切コアに書かず、既存の注入済みプロパティ/メソッド（`useXxx`/`toggleXxx`等）を
  参照するだけにする。
- **注入したプロパティをテンプレートで使う場合の型エラー対策**: Angularの`strictTemplates`は
  `Object.defineProperty`/直接代入で注入したプロパティを型として認識しない
  （`tsc --noEmit` は検出できず、`ng build` のAOTコンパイルで初めて出る）。
  `src/plugins/extends/**` 配下に対応する `.d.ts`（`declare module 'src/app/...' { interface X { ... } }`）
  を作って型を拡張する。実例: `app.component.d.ts`, `class/card.d.ts`, `component/card/card.component.d.ts`,
  `component/game-table/game-table.component.d.ts`, `component/ui-panel/ui-panel.component.d.ts`。

### 3-2. config-schema駆動の設定追加
- 新しいBoolean設定を1つ増やすのに必要な変更は基本2箇所だけ:
  `config-schema.ts` の `BOOLEAN_SETTINGS` に1行、`config.ts` の `QueryParamConfig` interface に1行。
  それ以外（設定画面UI、URLパラメータ読み取り、「全機能を有効化」プリセットへの反映）は
  スキーマ駆動で自動的に反映される。
- 「全機能を有効化」プリセット（`ROOM_PRESETS.all`、param `room=all`）は `BOOLEAN_SETTINGS` から
  動的生成。自己矛盾する項目だけ `ALL_PRESET_EXCLUDED_KEYS` で明示的に除外している
  （現在の除外理由と対象は [config-schema.ts](../../src/plugins/config-schema.ts) のコメント参照）。
  新しい設定を追加するとき、それが「機能を隠す」「他の設定と排他」「起動時の初期テーブル表示を壊す」
  もの（例: `isFirstFetchZipRoom` は `room=<名前>.zip` を読み込もうとするため `room=all` と衝突して
  テーブルが空になる、というバグをユーザー指摘で発見・対処済み）に該当するなら、このリストに追加を検討する。

### 3-3. 検証ワークフロー（毎回このパターンで実機確認している）
1. `cd` してから `npx ng build --configuration production 2>&1 | grep -iE "error"` でエラー0件を確認
   （**`tsc --noEmit` だけでは不十分**。Angularテンプレートの型チェックはAOTビルド時のみ走る）。
2. `git diff -- src/app` でコア差分が最小（多くの場合ゼロ、あっても数行）であることを確認。
3. `(npx ng serve --port 4300 > /tmp/ng-serveN.log 2>&1 &)` でバックグラウンド起動し、
   `timeout 60 bash -c 'until curl -sf http://localhost:4300 >/dev/null; do sleep 1; done'` で待つ。
4. `npx --yes playwright cli -s=<セッション名> open "http://localhost:4300/?<param>"` で実機起動。
   `resize 1280 900` してから操作する。
5. **実クリックは `page.mouse.move` → `page.mouse.click`（`run-code` 経由）で行う**。
   `eval` から `dispatchEvent` で合成イベントを飛ばす方式は、Angularの変更検知タイミングによっては
   届かないことがある（下記3-4のバグ参照）。
6. フラグON/OFF両方でメニュー項目の出現・非出現を確認し、リグレッションがないことを見る。
7. 後片付け: `playwright cli -s=<名前> close`、`rm -rf .playwright-cli`、
   `netstat -ano | grep 4300 | grep LISTENING` でPIDを見つけて PowerShell の
   `Stop-Process -Id <PID> -Force -ErrorAction SilentlyContinue` でdev serverを止める。

### 3-4. このセッションで見つけた実装バグ（要注意ポイントとして記録）
- **`*ngFor` に getter（毎回新しい配列/オブジェクトを返す）を渡すと壊れる**:
  `context-menu-add-icon` の実装中に発見。change detection（mousemoveでも走る）のたびに
  getterが新しいオブジェクト参照を返すと、Angularは既存の `<li>` を破棄して作り直す。
  そのため「mousedown→click」の間に要素が差し替わり、実クリックが届かなくなる
  （プログラム的な直接呼び出しでは再現しない=気づきにくいタイプの不具合）。
  対策: `*ngFor` 対象は `ngOnInit` で一度だけ計算する通常プロパティにする（getterにしない）。
- **移行元コード自体のバグを2件発見・修正**（`reset-point-of-view` 移植時）:
  `that.isTransformMode = false`（存在しないプロパティ名。正しくは `isTableTransformMode`）、
  `if(!pluginConfig.isUseResetPointOfView) false;`（`return` 漏れでガードが機能していない）。
  移行元をそのまま丸写ししないこと。

### 3-5. 意図的に移行元と異なる設計にした箇所（チェックリストにも記載済み）
- `reset-point-of-view`: 移行元は1ボタン+ContextMenuServiceのポップアップ選択だったが、
  本プロジェクトの `AppComponent` に `ContextMenuService` が注入されていないため、
  「視点リセット」「2Dモード表示」の2つの独立したメニュー項目に変更。
- `add-card-text-writable`: 移行元は専用オーバービューパネル等を新規に作っていたが、
  本プロジェクトには既に「カードを編集」パネル（`GameCharacterSheetComponent`）が
  `commonDataElement` の子要素を汎用的に列挙・編集する仕組みがあったため、専用UIを作らず
  `text`/`fontsize` を `DataElement` として注入するだけで済ませた（大幅に実装量を削減）。
- `context-menu-add-icon`: 移行元は `material-symbols-outlined` フォントの `diagnosis` アイコンを
  使っていたが、本プロジェクトはそのフォントを読み込んでいないため、既存の Material Icons
  フォント内の `style` アイコンで代替（新規フォント依存を避けるため）。
- `help`: 専用の `help` フラグを新設せず、既存の `isUseKeyboardShortcut` に連動させたまま
  （ヘルプの中身がキーボードショートカット説明そのものだったため、統合が妥当と判断）。

## 4. 保留中の未解決事項

- ユーザーから「カード・ボードのアイコンが足りないのでは」という指摘に対し、
  `context-menu-add-icon` ON時に `use-hand-storage`（ボード）/ `add-blank-card-menu`（カード）を
  自動ONするかどうかの選択肢を提示したが、**ユーザーからの回答はまだ得られていない**
  （質問はUIから却下された）。フェーズ3の「設定間の依存関係・排他制御」実装時に、
  改めてこの点を確認してから着手するのがよさそう。

## 5. 全体の優先順位・残りの機能一覧

チェックリスト参照。要点だけ:
- フェーズ2残り2件 → 次の作業（本文書2章）。
- フェーズ3: 依存関係・排他制御の仕組み導入（`DEPENDENCIES` 定義など）。上記「保留中の未解決事項」
  とも関連するので、着手前にユーザーに依存関係ルールの詳細を確認するとよい。
- フェーズ4: 優先度低め残り機能群（`move-stacked-card` 等）。`empty-new-character` は
  ユーザー指示によりこのセッションでフェーズ4の最後尾に降格済み。
- フェーズ5: 仕様未確定のためコード着手不可（バグ調査・新規設計が必要なもの）。
- フェーズ6: アセット（画像等）待ちでブロック中。
