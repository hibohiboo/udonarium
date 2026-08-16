# 部屋設定機能 移行計画

移行元: https://d3snr6xc5uvnuy.cloudfront.net/cartagraph-udonarium-plus/?settings
（ソース: `D:\projects\udonarium\udonarium-boardgame`）

移行先: 本リポジトリ（`src/plugins/settings/component/plugin-settings.component.*`）

> **⚠️ アクセスURLの注意（移行元との差異）**
> 移行元は `?settings`（値なしフラグ）で設定画面が開くが、移行先は
> `?mode=settings`（`mode` パラメータに `settings` という値を指定）で開く仕様になっている
> （[src/plugins/settings/extend/app.component.ts](../../src/plugins/settings/extend/app.component.ts) の
> `isSettingsRoute()` 参照）。他のプラグインフラグ（`?2d` 等の値なしフラグ）とは命名方式が異なるため
> 混同しやすい。例: 本番 https://yakumi.pages.dev/?mode=settings （`?settings` だけでは表示されない）。
> なお `src/plugins/settings/routing.ts` に `path: 'settings'` のAngular Routeも定義されているが、
> `RouterModule` 自体がアプリに組み込まれていないため**未使用のデッドコード**（`/settings` という
> パスでアクセスしても機能しない）。紛らわしいので将来的に削除するか、`isSettingsRoute()` 側の実装に
> 統一することを検討したい。

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

> **既知の逸脱（解消しないことを決定済み）**: 本プロジェクトの「ブランクカード」機能
> （`add-blank-card`）は、この方針が明文化される前に実装されたため、コア
> [game-table.component.html](../../src/app/component/game-table/game-table.component.html)
> に `<blank-card-stack>` / `<blank-card>` の描画行が直接追加されている（コミット
> `8a140a8e fix ブランクカードにも対応`）。本方針に反する既存の例外だが、下記の理由により
> **あえて解消しないことにした**（詳細は0-3節）。
>
> 解消案として、コアのテンプレートを一切変更せず動的コンポーネント生成でDOM階層を今と
> 完全に同一に保つ「忠実案」を設計・実装まで進めたが、実装コストと複雑さ（`*ngFor`
> 相当の追加/削除差分検出を手動実装する必要があり、`ngOnChanges`呼び出しタイミングの
> バグを実際に踏むなど、Angularの標準機構を手で再現するリスクが見合わないと判断）を
> 踏まえ、**逸脱を許容する（案C）**ことにした。実装は `blank-card-avoid-core-touch`
> ブランチに未完成のままpushしてある（`git log blank-card-avoid-core-touch` 参照）。
> 将来この判断を覆す場合は、そのブランチの
> `docs/plans/blank-card-core-deviation-handoff.md`（経緯・実装内容・残作業まとめ）を
> 出発点にする。

### 0-2. すでに移行済み・対応不要な機能

以下は移行元の `?settings` にもある機能だが、本プロジェクトには**移行作業前から実装・配線済み**
（`config-schema.ts` の `BOOLEAN_SETTINGS` に既に登録され、プラグイン本体も動作する）。移行元の
一覧と見比べて「無いのでは？」と気になった場合はまずここを確認する。

| ラベル | param | key |
| --- | --- | --- |
| 2Dモード | `2d` | `is2d` |
| Zipから部屋情報読込 | `first-fetch-zip-room` | `isFirstFetchZipRoom` |
| カードをタップ | `tap-card` | `isTapCard` |
| カードを正位置のままシャッフル | `shuffle-normal` | `isCardShuffleNormalPosition` |
| キーボードショートカット | `key-shortcut` | `isUseKeyboardShortcut` |
| カウンターボード | `counter-board` | `isAddCounterBoard` |
| デフォルト地形をCubeに変更 | `change-default-terrain` | `isChangeDefaultTerrain` |
| メニュー最小化 | `mini-menu` | `isMinimizableMenu` |
| 手札ストレージ（ボード） | `use-hand-storage` | `isUseHandStorage` |
| 共有メモの直立と並行の切り替え | `text-note-upright-flat` | `isTextNoteSelectableUprightFlat` |
| テーブル回転オフ | `table-rotate-off` | `isOffTableRotate` |
| オブジェクト回転オフ | `object-rotate-off-all` | `isOffObjectRotateAll` |
| オブジェクト回転オフ(個別設定可能) | `object-rotate-off-individually` | `isOffObjectRotateIndividually` |
| ルームデータロード時にボード上のオブジェクトを更新せずに残す（移行先独自機能） | `keep-board-on-load` | `isKeepBoardOnLoad` |
| チャットコマンド（移行先独自機能） | `use-chat-command` | `useChatCommand` |

区分A（1章）の8項目を含めると、これで移行元の主要機能の大半が本プロジェクトでも利用可能になっている。

### 0-3. 「ブランクカード」は移行元・移行先で別機能として扱う

移行元と移行先はどちらも「右クリックメニューでブランクカードを作成」という機能を持つが、
中身は別物であり、**同じ機能の移行先バージョンではなく、2つの独立した機能として整理する**。

| | 機能A: 拡張ブランクカード（**移行先に既存・対応不要**） | 機能B: ブランクカード・本家互換版（**未移植・区分B対象**） |
| --- | --- | --- |
| 由来 | 本プロジェクト独自実装（移行作業以前から存在） | 移行元 `udonarium-boardgame` の `add-blank-card` |
| 現在の param / key | `add-blank-card-menu` / `addBlankCardAddContextMenu` | なし（新設が必要） |
| データモデル | `Card` / `CardStack` を継承した専用の同期オブジェクト型 `BlankCard`（`@SyncObject('blank-card')`）/ `BlankCardStack`（`@SyncObject('blank-card-stack')`）。通常のカードとは別の型としてルーム内で管理される。 | ただの `Card`（本家の標準クラス）。前面画像を `blank_card.png` に差し替えているだけで、型としては通常のトランプカードと区別がつかない。 |
| カードへの文字入力 | `BlankCard` 自身が `text` / `fontsize` / `color` プロパティを標準搭載。ブランクカード限定で、カード面に直接テキストを重ねて表示できる（フォントサイズ・色も指定可）。 | なし。文字入力は別プラグイン `add-card-text-writable`（区分B, 3-1節）が担当し、**あらゆるカード**を対象にする汎用機能。ブランクカードとは無関係。 |
| 専用UI | `BlankCardComponent` / `BlankCardStackComponent` / `BlankCardOverviewPanelComponent`（ツールチップ相当、テキスト編集用テキストエリア付き）/ `BlankCardSheetComponent`（画像差し替え・XML保存等）という4つの専用コンポーネント。 | なし。既存の `CardComponent` / `CardStackComponent` をそのまま利用（見た目・操作は通常カードと同じ）。 |
| 統合箇所 | `TabletopService`（`blankCards`/`blankCardStacks` ゲッター追加）、`GameTableComponent`（同ゲッター追加）、`TooltipDirective`（`BlankCard`/`BlankCardStack` の場合に専用オーバービューパネルを開くよう `open()` をオーバーライド）の3箇所を拡張。加えて**コアの `game-table.component.html` に描画行を直接追加**（0-1節の「既知の逸脱」参照）。 | `TabletopActionService` に「右クリックメニューへの追加」と「生成処理」を足すのみ（1ファイル）。他のコアサービス・コンポーネントには一切手を入れていない。 |
| 生成されるカードの名前 | `ブランクカード`（専用の名前） | `カード`（無名・通常カードと同じ命名） |

**方針**:
- 機能A（拡張ブランクカード）は移行先の独自機能としてそのまま維持する。移行対象ではない。
- 機能B（本家互換のシンプルなブランクカード）を**区分Bの新規移植項目として追加**し、機能Aとは別の
  param/key で実装する（3-1節参照）。ユーザーはどちらか一方、または両方を有効化できるようにする。
- 区分Bで `add-card-text-writable`（カードに文字入力可能にする）を移植する際も、「機能Aのブランク
  カードに文字が書ける」こととは**別物**として扱うこと。移行元の `add-card-text-writable` は通常の
  カード（山札から引いたカード等）にも文字を書けるようにする汎用機能であり、機能Aの `BlankCard`
  限定のテキスト機能では代替できない。
- 今後 udonarium 本家で `game-table.component.html` に変更が入った場合、機能Aの `<blank-card-stack>` /
  `<blank-card>` の行がマージ競合の原因になり得る。これは解消コストとのトレードオフで
  **意図的に許容している**リスクである（0-1節参照）。機能Bの新規移植では同じ轍を踏まないよう、
  0-1節の「1行フック＋CSSクラス切り替え」方式を徹底する。

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
  - `context-menu-add-icon`（区分B, 3章） ON → `use-hand-storage` ON、`change-default-terrain` ON
    （移行元では合わせて `deck-from-spreadsheet` OFF も連動するが、当該機能は移行対象外のため不要）
  - `first-fetch-zip-room` ON → サンプルキャラクター非表示相当を ON

この章はUXの質を上げる改善なので、区分Aの単純有効化が終わった後の着手でよい。

---

## 3. 区分B: 新規移植が必要な機能

移行元にのみ存在し、移行先にプラグインディレクトリごと存在しないもの。ソースの
`src/plugins/<name>` を移行先の拡張パターン（`extend/component/<component>/<component>.component.ts`
で `extends*Component(that)` 関数を呼び出し、対象コンポーネントの `ngOnInit` 等から適用する形）に
合わせて移植する。

### 3-1. カード・山札操作系
| 移行元プラグイン | ラベル | param（移行先での提案） | 優先度 |
| --- | --- | --- | --- |
| `add-blank-card`（本家互換版） | ブランクカードを作成（本家互換・シンプル版／文字入力なし。0-3節「機能B」参照。移行先の既存「拡張ブランクカード」＝機能Aとは別のON/OFF・別のコンテキストメニュー項目として実装し、混同しないラベルにする） | `add-blank-card-menu-simple`（仮称。既存の `add-blank-card-menu` と衝突しない名前にする） | 中 |
| `add-card-text-writable` | カードに文字入力可能にする（通常カード全般が対象。ブランクカード限定の文字入力とは別機能。0-3節参照） | `add-card-text-writable` | 中 |
| `add-draw-n-cards` | 「カードをn枚引く」を山札のコンテキストメニューに追加 | `add-draw-n-cards` | 中 |
| `move-stacked-card` | 重ねカード移動機能 | `move-stacked-card` | 低 |

> `deck-from-spreadsheet`（スプレッドシートからデッキ読込）は**移行対象外**（ユーザー判断により除外、6章参照）。

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
   影響範囲が局所的で移植しやすい。`offline-mode` は外部依存や本アプリの通信構成
   （Cloudflare Workers版）との整合性確認が必要なため後回しにする。
   `deck-from-spreadsheet` は移行対象外（6章参照）。
4. 各機能追加後、`docs/plans/` 内の本ファイルのチェックリスト（下記）を更新して進捗管理する。

## 5. チェックリスト

### 区分A（配線のみ）
- [x] `virtual-screen`（ボード・ついたて）
- [x] `hand-storage-self-only`（ボードを自分のものだけ触れる）
- [x] `return-the-hand`（手札を回収する）
- [x] `hand-card-self-hand-storage`（自分のボード→手札化）
- [x] `card-back-image-all-change`（カード裏画像一括変更）
- [x] `auto-self-view-mode`（ついたてカード自動自分だけ見る）
- [x] `auto-self-view-mode-from-stack`（山札から引いたカード自動自分だけ見る）
- [x] `add-stack-context-auto-self-view-mode`（山札コンテキストメニューに追加）

`config-schema.ts` の `BOOLEAN_SETTINGS` に新カテゴリ `board`（ボード・ついたて）として8項目を追加し、
`config.ts` の `UNIMPLEMENTED_FLAGS` / `UnimplementedFeatureFlags` を撤去してクエリパラメータ駆動に
切り替え済み（`tsc --noEmit` / `ng build` とも成功、コアの `src/app/**` は無変更）。実機での目視動作確認
（各クエリパラメータ付きURLでの起動確認、特に `virtual-screen` 関連8コンポーネント）は未実施。

### 区分A'
- [ ] 設定間の依存関係・排他制御の仕組み導入
- [ ] 依存関係ルールの移植

### 区分B（新規移植）
- [ ] `add-blank-card-menu-simple`（仮称。本家互換のシンプルなブランクカード。0-3節「機能B」）
- [ ] `add-card-text-writable`
- [ ] `add-draw-n-cards`
- [ ] `move-stacked-card`
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
- 移行元の「機能をすべて有効化 / 最小限にする」ボタン相当は、移行先では `ROOM_PRESETS`
  （`?room=xxx`）で代替する設計になっている。ボタンUIとして別途復活させたいか、既存の
  プリセット方式のままでよいか確認したい。

### 解決済み
- `deck-from-spreadsheet`（スプレッドシートからデッキ読込）: **移行対象外**とすることに決定。
  区分B・依存関係ルール（2章）から除外済み。

---

## 7. 要望一覧（Issue）を踏まえた実装優先順位

利用者から寄せられた要望一覧（Issue番号付き）を、本移行計画の区分（A/A'/B）・実装状況と
突き合わせて整理する。Issue番号自体の並び順は要望の粒度がバラバラ（機能単体の要望と
「〜系」の見出しが混在）なため優先度の根拠にはせず、**実装コスト（すでに動くものほど低コスト）と
要望の温度感**の両方を考慮してフェーズ分けする。

### 7-1. 要望 ⇔ 移行計画 対応表

| Issue | 要望 | 対応する移行計画項目 | 現状 |
| --- | --- | --- | --- |
| #285 | 要望一覧・開発用環境作成 | （コード実装ではないプロジェクト管理タスク） | 本ドキュメント自体が該当 |
| #287 | キーボードヘルプを表示 | 3-2 `help` | 未移植（既存 `keyboard-help` との統合要確認） |
| #301 | メニューウィンドウの縮小 | 実装済み `mini-menu`（メニュー最小化） | **対応不要** |
| #306 | 回転機能の個別オンオフスイッチ | 実装済み `object-rotate-off-individually` | **対応不要** |
| #337 | 保存/コピー時に回転オフが引き継がれない | 計画外（#306機能のバグ） | 要調査・原因切り分けが先 |
| #302 | 右クリックでブランクカード作成（+テキスト入力） | 機能A（拡張ブランクカード）は実装済み／テキスト入力は3-1 `add-card-text-writable` | ブランクカード生成自体は対応不要、文字入力のみ未移植 |
| #322, #326 | カードに文字入力 | 3-1 `add-card-text-writable` | 未移植（通常カード全般が対象、0-3節参照） |
| #303 | 共有メモの直立と並行の切り替え | 実装済み `text-note-upright-flat` | **対応不要** |
| #291 | 重ねカード移動機能追加 | 3-1 `move-stacked-card` | 未移植（計画上も低優先度） |
| #293 | 手札置き場追加 | 実装済み `use-hand-storage` | **対応不要** |
| #307 | 疑似ついたて機能 | 区分A `virtual-screen` ほか | 配線済み（チェックリスト✓）、実機動作確認が未実施 |
| #320 | 手札置き場をボードとしてZIP保存 | 計画外・新規要件 | 個人ボードの永続化設計が必要（未着手） |
| #321 | コマンド操作で名前表示＆ついたて有効化 | 計画外・新規要件 | 右クリックメニュー仕様の新規設計が必要 |
| (#321関連) | 個人ボードの所有権放棄コマンド | 計画外・新規要件 | 上記とセットで設計 |
| #327 | 個人ボードをデフォルトで回転可能に | 計画外・小規模 | 初期値変更のみで対応できる可能性 |
| #329 | 「手札置き場」→「ボード」に名称変更 | 計画外・表記統一 | ラベル文言変更のみ |
| #309 | 複数選択して移動/削除（カード優先） | 計画外・新規機能 | 移行元プラグインに存在しない、独自設計が必要 |
| #305 | GM以外のメニューから一部項目非表示 | 3-2 `hide-menu-*`（image/inventory/save） | 未移植 |
| #310 | 操作音のオンオフ | 3-4 `toggle-sound-effect` | 未移植 |
| #297 | 視点リセット→2D表示切り替え | 3-4 `reset-point-of-view` | 未移植 |
| #298 | カードをn枚引く | 3-1 `add-draw-n-cards` | 未移植 |
| #288 | カードタップ機能（右クリックメニューにも追加） | 実装済み `isTapCard` | 本体は対応不要、コンテキストメニュー項目の有無のみ要確認 |
| #323 | 足元の黄色い丸枠の表示/非表示（一括でよい） | 3-3 `hide-pedestal` と同一機能の可能性 | 要確認（「台座」と「丸枠」が指す対象が一致するか） |
| #324 | ポップアップ時のHP〜精神力を非表示 | 計画外・新規調査 | 移行元に該当プラグインなし、独自設計が必要 |
| #325 | 新規キャラクター作成時のステータス欄を空白に | 3-3 `empty-new-character` | 未移植（そのまま合致） |
| #290 | キーボードショートカット追加（コピー/ペースト/デリート） | 実装済み `isUseKeyboardShortcut`（基盤） | ショートカットの中身がコピペデリートを含むか要確認 |
| #338 | 右クリックメニューのアイコン化 | 3-2 `context-menu-add-icon` | 未移植 |
| (#338関連) | "すべて正位置にする"をデフォルトに | 実装済み機能 `shuffle-normal` の初期値変更 | 区分A'（初期値・プリセット調整）で対応 |
| #328 | 「接続」内に退室ボタンを追加 | 3-2 `add-reload-button` | 未移植 |
| #339 | 地形作成時「回転オフ・点滅なし」をデフォルトに | 区分A'（依存関係・初期値調整） | 既存フラグの初期値/連動ルールで対応可能 |
| #340 | デフォルト地形データをURLのものと差し替え | 計画外（アセット差し替え作業） | コード実装ではなくアセット準備が先 |
| #289 | サンプル非表示（背景画像含む） | 3-3 `empty-default-objects` / `empty-default-table` | 未移植 |
| #292 | オリジナル初期画面に差し替え | 計画外（アセット未作成） | デザイン素材待ちでブロック中 |
| #347 | オフラインモード | 3-4 `offline-mode` | 未移植・Cloudflare構成での要否確認が必要（6章） |

### 7-2. 推奨着手フェーズ

**フェーズ0: 実装済み・確認/初期値調整のみ（最短で「対応済み」を報告できるもの）**
`mini-menu`(#301) / `object-rotate-off-individually`(#306) / `text-note-upright-flat`(#303) /
`use-hand-storage`(#293) / `isTapCard`(#288本体) / `isUseKeyboardShortcut`(#290本体) の
コンテンツ確認と、`shuffle-normal` のデフォルトON化(#338関連)。要望者への「既に使える」回答が
主目的で、コスト最小。

**フェーズ1: 区分A残作業（実機動作確認）**
チェックリスト上は配線済みの `virtual-screen` ほか8機能（#307含む）を実際にクエリパラメータ
付きURLで起動し、要望内容と一致するか確認する。

**フェーズ2: 区分B・影響範囲が局所的なもの（要望内でも件数が多い実務系）**
`hide-menu-*`(#305) / `add-reload-button`(#328) / `context-menu-add-icon`(#338) / `help`(#287) /
`add-draw-n-cards`(#298) / `reset-point-of-view`(#297) / `toggle-sound-effect`(#310) /
`empty-new-character`(#325) / `empty-default-objects`・`empty-default-table`(#289) /
`add-card-text-writable`(#302, #322, #326)。3章の移植手順に沿って1機能ずつPRを分割する。

**フェーズ3: 区分A'（依存関係・デフォルト値調整）**
`object-rotate-off-individually` の相互排他ルール、地形デフォルト回転オフ(#339)、
プリセット/初期値調整をまとめて着手。フェーズ2で有効化した機能同士の整合性も合わせて見る。

**フェーズ4: 区分Bの残り（計画上も優先度低め）**
`move-stacked-card`(#291) / `offline-mode`(#347、要否確認が先）。

**フェーズ5: 計画外・要件定義が先に必要なもの**
`#337`（回転オフ引き継ぎのバグ調査）/ `#320`（手札置き場のZIP永続化）/ `#321`＋所有権放棄コマンド
（個人ボードの右クリックメニュー仕様設計）/ `#327`（個人ボード回転デフォルト）/
`#329`（名称変更）/ `#309`（複数選択移動・削除、カード優先）/ `#324`（ポップアップHP非表示）/
`#323`（`hide-pedestal`と同一かの確認）。実装前に仕様を固める必要があるため、フェーズ2〜3と
並行して要件整理だけ先行させるのが現実的。

**フェーズ6: アセット待ちでブロック中**
`#340`（デフォルト地形データ差し替え）/ `#292`（オリジナル初期画面）。実装作業ではなく
素材の準備待ちのため、依頼・進捗確認を別途行う。
