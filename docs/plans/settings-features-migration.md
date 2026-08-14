# 部屋設定機能 移行計画

移行元: https://d3snr6xc5uvnuy.cloudfront.net/cartagraph-udonarium-plus/?settings
（ソース: `D:\projects\udonarium\udonarium-boardgame`）

移行先: 本リポジトリ（`/settings` ルート、`src/plugins/settings/component/plugin-settings.component.*`）

## 0. 前提: 移行先の現状把握

移行先には移行元と同じ「チェックボックスでプラグインのON/OFFを選び、クエリパラメータとして
URLに反映する」設定ページが**既に存在する**（`src/plugins/settings/`）。

- 設定項目は `src/plugins/config-schema.ts` の `BOOLEAN_SETTINGS` / `STRING_SETTINGS` 配列に
  スキーマとして定義する。カテゴリ（`CATEGORIES`）ごとに `plugin-settings.component.html` が
  `*ngFor` で動的にチェックボックスを描画するため、**スキーマに1行追加するだけでUIに反映される**。
- 実行時の有効/無効判定は `src/plugins/config.ts` の `pluginConfig`（`URLSearchParams` から
  `getBooleanParam` で読み取る）を各プラグインが `import { pluginConfig } from "src/plugins/config"`
  して参照する形。
- 部屋別プリセットは `config-schema.ts` の `ROOM_PRESETS` に定義し、`?room=xxx` で一括適用できる
  （移行元の「機能をすべて有効化 / 最小限にする」ボタンに相当する仕組みが、こちらではプリセット
  という形で実装済み）。

### 0-1. 移行方針: 本家udonariumへの追従を優先し、コア（`src/app/**`）には触れない

本プロジェクトは udonarium 本家の更新を継続的に取り込めるようにするため、**`src/app/**`（本家由来のコア
コード）は極力変更しない**方針を取っている。既存コードはこの方針に基づき、次の「拡張フック」パターンで
統一されている。

- コア側の各コンポーネントは、コンストラクタ／ライフサイクルフックの中で
  `src/plugins/extends/...` の拡張関数を**1行だけ**呼び出す（例:
  [card.component.ts:31](src/app/component/card/card.component.ts#L31) の
  `import { extendsCardComponent } from 'src/plugins/extends/component/card/card.component'`、
  [app.component.ts:189](src/app/component/app.component.ts#L189) の `extendsAppComponent(this)`、
  [ui-panel.component.ts:60](src/app/component/ui-panel/ui-panel.component.ts#L60) の
  `extendsUIPanelComponent(this)`）。
- 実際のロジック（プロパティ注入 `Object.defineProperty`、`ngAfterViewInit`/`ngOnDestroy` などの
  プロトタイプ上書き、クラス追加 `appRoot.classList.add(...)` によるCSS切り替え等）はすべて
  `src/plugins/extends/**` および各プラグインの `extend/**` 側に置く。
- テンプレート（`.html`）についても、既存で許容されている変更は
  `<app-plugin-settings *ngIf="isSettingsRoute">`（[app.component.html:2](src/app/app.component.html#L2)）
  のような**プラグインの有無で1コンポーネントを挿入/非挿入にする最小限の `*ngIf` 追加**にとどまっている。
  既存要素の表示/非表示切り替えは、テンプレートに条件分岐を増やすのではなく、
  `appRoot.classList.add('xxx')` のようにフック側からクラスを付与し、プラグイン側のCSSで
  `display:none` 等を当てる手法（`is2d` / `object-rotate-off` クラスと同じやり方）を優先する。

**注意**: 移行元（`udonarium-boardgame`）自体は、この観点では必ずしも模範ではない。例えば
`hide-menu-*` 系機能は、`app.component.html` そのものを丸ごとフォークした
`plugins/extend-menu/extends/app/app.component.html` を作り、そこに `*ngIf="!hideTable"` を
直接書き込む実装になっている（本家の `app.component.html` を丸ごと複製して改変＝差分が広く
本家追従コストが高い）。**移行時はこれをそのまま踏襲せず、本プロジェクトの「1行フック＋CSSクラス
切り替え」方式に置き換えて移植する**（詳細は3-2節）。

→ 今回の移行作業の型は2種類に分かれる。

| 区分 | 内容 |
| --- | --- |
| **A. 配線のみ** | プラグイン本体のコードは実装済みだが、`config-schema.ts` 未登録＆`pluginConfig.ts` で強制 `false` 固定になっているため設定画面に出てこない・常時OFFになっているもの |
| **B. 新規移植** | 移行元にあり移行先には存在しない機能。移行元の `src/plugins/<name>` を移行先の `extend`アーキテクチャ（各コンポーネントを `extend*Component(that)` で拡張するパターン）に合わせて移植する |

---

## 1. 区分A: 配線のみで有効化できる機能（最優先・低リスク）

以下は `src/plugins/config.ts` の `UNIMPLEMENTED_FLAGS` で強制的に `false` にされているが、
プラグイン本体（`extend/component/...`）は実装済みで、動作確認済みの可能性が高いもの。

| 現フラグ名 | 対応する移行元ラベル | 既存プラグインディレクトリ |
| --- | --- | --- |
| `isUseVirtualScreen` | ボード（ついたて） | `src/plugins/virtual-screen/` |
| `isUseHandStorageSelfOnly` | ボードを自分のものだけ触れるようにする | `src/plugins/hand-storage-self-only/` |
| `canReturnHandToIndividualBoard` | 手札を回収する | `src/plugins/return-the-hand/` |
| `isHandCardSelfHandStorage` | 自分のボードにしたときにボード上のカードを手札にする | `src/plugins/virtual-screen/extend/component/hand-storage/` |
| `isCardBackImageAllChangeMenu` | カード裏画像の一括変更 | `src/plugins/card-back-image-all-change/` |
| `isAutoSelfViewCard` | ついたてに入れたカードを自動的に自分だけ見るモードにする | `src/plugins/auto-self-view-mode/` |
| `isAutoSelfViewCardFromDeck` | 山札から引いたカードを自動的に自分だけ見るモードにする | `src/plugins/auto-self-view-mode/extend/component/card-stack/` |
| `isContextMenuAutoSelfViewCardFromDeck` | 「自分だけ見る」を山札のコンテキストメニューに追加 | `src/plugins/auto-self-view-mode/extend/component/card-stack/` |

### 作業内容
1. `config-schema.ts` の `BOOLEAN_SETTINGS` に上記8項目を追加（`key` は既存のフラグ名を流用、
   `param` は移行元のクエリパラメータ名に合わせる: `virtual-screen`, `hand-storage-self-only`,
   `return-the-hand`, `hand-card-self-hand-storage`, `card-back-image-all-change`,
   `auto-self-view-mode`, `auto-self-view-mode-from-stack`,
   `add-stack-context-auto-self-view-mode`）。カテゴリは `chat`（手札・ボード系）に寄せるか、
   新カテゴリ `board`（ボード／ついたて）を `CATEGORIES` に追加して整理する。
2. `config.ts` の `UNIMPLEMENTED_FLAGS` から該当キーを削除し、`buildBaseConfig` 経由で
   クエリパラメータから読み取られるようにする。
3. `UnimplementedFeatureFlags` インターフェースから該当プロパティを削除し、
   `QueryParamConfig` 側に移す（型定義の整理）。
4. 依存関係のバリデーション（移行元 `app.component.ts` の `changeSetting` にある相互排他/自動ON
   ロジック、第2章参照）をUI側に反映するか検討。
5. 各機能を実際にクエリパラメータ付きURLで起動して動作確認（特に `virtual-screen` は関連コン
   ポーネントが8個と多いため重点的に確認）。

### 見積り目安
機能追加ではなく「フラグ解放＋動作確認」が主なので、1機能あたり半日程度（`virtual-screen` は
関連範囲が広いので1日）。

---

## 2. 区分A': 設定同士の依存関係・排他制御の移植

移行元 `settingApp/app.component.ts` の `changeSetting()` には、チェックボックス変更時に
関連項目を自動でON/OFFする依存関係ロジックがある（例: 「ボード（ついたて）」ONなら「ボード」も
自動ON、「ボード」OFFなら関連4項目を自動OFF等）。移行先の `plugin-settings.component.ts` には
この依存関係制御が未実装（プリセット適用時の一括上書きのみ）。

### 作業内容
- `config-schema.ts` に「設定間の依存関係」定義を追加する仕組みを検討する
  （例: `DEPENDENCIES: { key: string; requires?: string[]; excludes?: string[]; impliesOn?: string[] }[]`）。
- `plugin-settings.component.ts` のチェックボックス変更ハンドラでこの定義を参照し、
  移行元と同等の自動連動を行う。
- 対象の組み合わせ（移行元 `changeSetting` より）:
  - `object-rotate-off-individually` ON → `object-rotate-off-all` OFF（相互排他、既存 `object-rotate-off` 系）
  - `virtual-screen`（ついたて） ON → `use-hand-storage`（ボード） も ON
  - `use-hand-storage` OFF → `virtual-screen` / `hand-storage-self-only` / `return-the-hand` /
    `hand-card-self-hand-storage` を OFF
  - `hand-storage-self-only` ON → `use-hand-storage` ON
  - `return-the-hand` ON → `use-hand-storage` ON
  - `hand-card-self-hand-storage` ON → `use-hand-storage` ON、`return-the-hand` ON
  - `return-the-hand` OFF → `hand-card-self-hand-storage` OFF
  - `context-menu-add-icon`（区分B, 3章） ON → `use-hand-storage` ON、`change-default-terrain` ON、
    `deck-from-spreadsheet` OFF
  - `deck-from-spreadsheet` ON → `context-menu-add-icon` OFF
  - `first-fetch-zip-room` ON → サンプルキャラクター非表示相当を ON

この章はUXの質を上げる改善なので、区分Aの単純有効化が終わった後の着手でよい。

---

## 3. 区分B: 新規移植が必要な機能

移行元にのみ存在し、移行先にプラグインディレクトリごと存在しないもの。ソースの
`src/plugins/<name>` を移行先の拡張パターン（`extend/component/<component>/<component>.component.ts`
で `extends*Component(that)` 関数を呼び出し、対象コンポーネントの `ngOnInit` 等から適用する形）に
合わせて移植する。

### 3-1. カード・山札操作系
| 移行元プラグイン | ラベル | param（移行元） | 優先度 |
| --- | --- | --- | --- |
| `add-card-text-writable` | カードに文字入力可能にする | `add-card-text-writable` | 中 |
| `add-draw-n-cards` | 「カードをn枚引く」を山札のコンテキストメニューに追加 | `add-draw-n-cards` | 中 |
| `move-stacked-card` | 重ねカード移動機能 | `move-stacked-card` | 低 |
| `deck-from-spreadsheet` | スプレッドシートからデッキ読込 | `deck-from-spreadsheet` | 低（外部スプレッドシート仕様に依存、要相談） |

### 3-2. UI・メニュー系（`extend-menu` プラグインの移植）
移行先の `mini-menu` は移行元の「メニュー最小化」相当のみ実装済み。以下は未移植。

| 機能 | ラベル | param | 備考 |
| --- | --- | --- | --- |
| メニュー横並び | `horizon-menu` | `horizon-menu` | `ui-panel.component.ts` 拡張が必要 |
| メニュー最小化を最初は開いておく | `mini-menu-first-open` | `mini-menu-first-open` | `mini-menu` と組み合わせ |
| メニューから削除: テーブル設定/画像/音楽/インベントリ/ZIP読込/保存 | 各種 | `hide-menu-table` / `hide-menu-image` / `hide-menu-music` / `hide-menu-inventory` / `hide-menu-zip` / `hide-menu-save` | **移行元は `app.component.html` を丸ごとフォークして `*ngIf` を追加している（0-1節参照）が、本プロジェクトではそれを踏襲せず、`extendsAppComponent` から `appRoot` に `hide-menu-table` 等のクラスを付与し、`extend-menu.css`（新規プラグインCSS）側で `.hide-menu-table li:nth-child(n) { display: none; }` のように非表示にする方式に置き換える。コアの `app.component.html` は無変更のまま実現する。** |
| コンテキストメニューをアイコンに変更 | `context-menu-add-icon` | `context-menu-add-icon` | `game-table.component.ts` / `context-menu.service.ts` |
| 退室ボタンを追加 | `add-reload-button` | `add-reload-button` | `extends/app.component.ts` |
| ヘルプ表示 | `help` | `help` | 既存 `keyboard-help` プラグインと統合可能か要確認 |

### 3-3. 表示・初期化系
| 機能 | ラベル | param |
| --- | --- | --- |
| キャラクターコマの台座を非表示 | `hide-pedestal` | `hide-pedestal` |
| 表示項目の初期値を空にする | `empty-display-items` | `empty-display-items` |
| サンプルのキャラクターコマを非表示 | `empty-default-objects` | `empty-default-objects` |
| 新しいキャラクターを作成時にステータスを空で作成 | `empty-new-character` | `empty-new-character` |
| 初期テーブル設定をおこなわない | `empty-default-table` | `empty-default-table` |
| 初期表示に接続情報を表示しない | `hide-first-peer` | `hide-first-peer` |
| 初期表示にチャットウィンドウを表示しない | `hide-first-chat` | `hide-first-chat` |
| デフォルトの地形をCubeに変更 | 既存: `isChangeDefaultTerrain` | 実装済み（対応不要） |

### 3-4. その他
| 機能 | ラベル | param | 備考 |
| --- | --- | --- | --- |
| 操作音オンオフ | `toggle-sound-effect` | `toggle-sound-effect` | `sound-effect.ts` 移植 |
| 視点リセット | `reset-point-of-view` | `reset-point-of-view` | `2Dモード` と相互排他だった項目 |
| オフラインモード | `offline-mode` | `offline-mode` | Cloudflare版での意味合いを要確認（通信構成が異なる可能性） |
| postMessage連携 | `usePostMessage` | `post-message` | `add-posts-messages/`。埋め込み iframe 用の外部連携。要否を要確認 |

### 移植手順（1機能あたりの共通フロー）
1. 移行元 `src/plugins/<name>/` の実装を読み、対象コンポーネント／クラスを特定。
2. **移行元の実装方式をそのまま輸入しない**。移行元は本家ファイルを丸ごとフォークして直接編集する
   箇所が一部にある（0-1節）ため、移植時は必ず本プロジェクトの「コアは1行フックのみ、ロジックは
   `extend/**` に隔離、表示切り替えはCSSクラスで行う」方式に**変換**する。
   - コアの `.ts` に新しいフック（`extendsXxxComponent(this)` 呼び出し）が必要になる場合は、
     既存のフック１行パターンに倣って最小の追加にとどめる。既にフックが存在するコンポーネントなら、
     コア側は一切変更せず `src/plugins/extends/component/<component>/<component>.component.ts`
     （集約フック）にロジックを足すだけで済む。
   - コアの `.html` を直接編集する必要がある機能（新規要素の表示/非表示など）は、まずCSSクラス
     切り替え（`appRoot.classList.add(...)` ＋ プラグインCSS）で実現できないか検討し、
     できない場合のみ最小限の `*ngIf` を1箇所追加する。
3. 移行先の同名コンポーネントに対応する `extend/component/...` ディレクトリを作成し、
   移行元ロジックを移行先の拡張関数パターン（`export const extendsXxxComponent = (that) => {...}`）
   に合わせて書き写す。移行先は独自に手札ストレージ/ボード機能などが再設計されているため、
   **単純コピーではなくAPI差分を都度確認する**（特に `hand-storage` 関連は移行先で構造が変わっている）。
   `keep-board-on-load` `hand-storage-alignment` など移行先独自プラグインとの副作用有無を確認。
4. `config-schema.ts` に `BOOLEAN_SETTINGS`（必要なら新カテゴリ）を追加。
5. `config.ts` の `pluginConfig` に自動反映される（スキーマ駆動のため追加コード不要）。
6. プラグイン適用の呼び出し口（対象コンポーネントの `ngOnInit`／モジュール初期化部）に
   `extendsXxxComponent(this)` 相当の呼び出しを追加（既存フックへの追記で足りる場合は追加不要）。
7. 該当クエリパラメータ付きでアプリを起動し、移行元と同じ挙動になることを目視確認。
8. `git diff -- src/app` が空（またはフック1行程度の最小差分のみ）であることを確認してからコミットする。

---

## 4. 進め方の提案

1. **区分A（8機能）を先に着手** — 実装済みコードの配線のみなので、最短で移行元と同等の
   機能一覧に近づけられる。1機能ずつ `config-schema.ts` に追加してPRを分割するのが安全。
2. **区分A'（依存関係制御）** — 区分Aの一部が有効化された段階で、UXとして必要なら着手。
3. **区分B** — 優先度順に着手。まずは3-2のメニュー系（`horizon-menu` / `hide-menu-*` /
   `add-reload-button`）と3-3の表示・初期化系（`hide-pedestal` / `empty-*` / `hide-first-*`）は
   影響範囲が局所的で移植しやすい。`deck-from-spreadsheet` と `offline-mode` は外部依存や
   本アプリの通信構成（Cloudflare Workers版）との整合性確認が必要なため後回しにする。
4. 各機能追加後、`docs/plans/` 内の本ファイルのチェックリスト（下記）を更新して進捗管理する。

## 5. チェックリスト

### 区分A（配線のみ）
- [ ] `virtual-screen`（ボード・ついたて）
- [ ] `hand-storage-self-only`（ボードを自分のものだけ触れる）
- [ ] `return-the-hand`（手札を回収する）
- [ ] `hand-card-self-hand-storage`（自分のボード→手札化）
- [ ] `card-back-image-all-change`（カード裏画像一括変更）
- [ ] `auto-self-view-mode`（ついたてカード自動自分だけ見る）
- [ ] `auto-self-view-mode-from-stack`（山札から引いたカード自動自分だけ見る）
- [ ] `add-stack-context-auto-self-view-mode`（山札コンテキストメニューに追加）

### 区分A'
- [ ] 設定間の依存関係・排他制御の仕組み導入
- [ ] 依存関係ルールの移植

### 区分B（新規移植）
- [ ] `add-card-text-writable`
- [ ] `add-draw-n-cards`
- [ ] `move-stacked-card`
- [ ] `deck-from-spreadsheet`
- [ ] `horizon-menu`
- [ ] `mini-menu-first-open`
- [ ] `hide-menu-table` / `image` / `music` / `inventory` / `zip` / `save`
- [ ] `context-menu-add-icon`
- [ ] `add-reload-button`
- [ ] `help`
- [ ] `hide-pedestal`
- [ ] `empty-display-items`
- [ ] `empty-default-objects`
- [ ] `empty-new-character`
- [ ] `empty-default-table`
- [ ] `hide-first-peer`
- [ ] `hide-first-chat`
- [ ] `toggle-sound-effect`
- [ ] `reset-point-of-view`
- [ ] `offline-mode`（要否確認）
- [ ] `post-message` 連携（要否確認）

## 6. 未確定事項（要ユーザー確認）

- `offline-mode` と `post-message` 連携は、Cloudflare Workers構成（本リポジトリ）と
  元のAWS/CloudFront構成とで通信方式が異なる可能性があるため、そのまま移植してよいか要確認。
- `deck-from-spreadsheet` は移行元専用のGoogle Spreadsheetを参照する実装。本プロジェクト用の
  スプレッドシートを別途用意するか、移行元のものを共用するか要確認。
- 移行元の「機能をすべて有効化 / 最小限にする」ボタン相当は、移行先では `ROOM_PRESETS`
  （`?room=xxx`）で代替する設計になっている。ボタンUIとして別途復活させたいか、既存の
  プリセット方式のままでよいか確認したい。
