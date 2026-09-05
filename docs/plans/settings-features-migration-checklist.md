# 部屋設定機能 移行チェックリスト

> 背景・設計方針・要望との対応表は [settings-features-migration.md](./settings-features-migration.md) を参照。
> 本ファイルは進捗管理用のチェックリストのみを、優先順位順（フェーズ0→6、根拠は移行計画側
> 7-2「推奨着手フェーズ」）に並べたもの。フェーズ番号が小さいほど先に着手する。

## フェーズ0: 実装済み・動作確認/初期値調整のみ
要望者に「既に使える」と回答できるものの最終確認と、初期値のみの変更。実装コスト最小。

- [x] `mini-menu`（メニュー最小化）動作確認
- [x] `object-rotate-off-individually`（回転オンオフの個別スイッチ）動作確認
- [x] `text-note-upright-flat`（共有メモの直立/並行切替）動作確認
- [x] `use-hand-storage`（手札置き場）動作確認
- [x] `isTapCard`（カードタップ）動作確認・右クリックメニュー項目の有無確認
- [x] `isUseKeyboardShortcut`（キーボードショートカット）動作確認・コピー/ペースト/デリートが含まれるか確認
- [x] `shuffle-normal`（正位置シャッフル）をデフォルトONにする

## フェーズ1: 区分A（配線済み・実機動作確認待ち）
`config-schema.ts` への登録・配線は完了済み（`tsc --noEmit` / `ng build` とも成功、コアの
`src/app/**` は無変更）。実機でのクエリパラメータ付きURL起動確認のみ残っている。

- [x] `isUseVirtualScreen`（ボード・ついたて）
- [x] `isUseHandStorageSelfOnly`（ボードを自分のものだけ触れる）
- [x] `canReturnHandToIndividualBoard`（手札を回収する）
- [x] `isHandCardSelfHandStorage`（自分のボード→手札化）
- [x] `isCardBackImageAllChangeMenu`（カード裏画像一括変更）
- [x] `isAutoSelfViewCard`（ついたてカード自動自分だけ見る）
- [x] `isAutoSelfViewCardFromDeck`（山札から引いたカード自動自分だけ見る）
- [x] `isContextMenuAutoSelfViewCardFromDeck`（山札コンテキストメニューに追加）
- [x] 上記8機能の実機動作確認（各クエリパラメータ付きURLで起動して目視確認。`virtual-screen`
      は関連8コンポーネントがあるため重点確認）

## フェーズ2: 区分B（要望内で件数が多い・影響範囲が局所的）
- [x] `hide-menu-image` / `hide-menu-inventory` / `hide-menu-save`（GM以外のメニュー非表示）
- [x] `add-reload-button`（退室ボタン追加）
- [x] `context-menu-add-icon`（右クリックメニューのアイコン化）
- [x] `help`（キーボードヘルプ表示。既存 `keyboard-help` と統合、専用フラグは追加せず`isUseKeyboardShortcut`連動のまま）
- [x] `add-draw-n-cards`（カードをn枚引く）
- [x] `reset-point-of-view`（視点リセット→2D表示切替。移行元は1ボタン+ポップアップ選択だったが、AppComponentにContextMenuService注入がないため2つの独立メニュー項目に変更）
- [x] `toggle-sound-effect`（操作音オンオフ）
- [x] `add-card-text-writable`（カードに文字入力。0-3節参照、ブランクカード限定機能とは別物。専用UIは作らず既存「カードを編集」パネルの汎用DataElement編集機能を利用）
- [x] `empty-default-objects`（サンプルのキャラクターコマ非表示）
- [x] `empty-default-table`（初期テーブル設定をおこなわない。移行元と同名の既存フラグ
      `isEmptyDefaultTabletopObjects`（first-fetch-zip-room由来、別物）との衝突を避けるため、
      新フラグは `isEmptyDefaultObjects`/`isEmptyDefaultTable` と命名。2つは完全に独立して
      ON/OFFでき、「全機能を有効化」プリセットでは初期表示が壊れるため除外）


## フェーズ3: 区分A'（依存関係・デフォルト値調整）
- [x] 設定間の依存関係・排他制御の仕組み導入（`config-schema.ts` に `DEPENDENCIES` 定義＋
      変更起点からのBFSで連鎖を解決する `applySettingDependencies()` を追加。設定画面
      （`plugin-settings.component.ts`）のチェックボックス変更時・プリセット適用時にのみ適用され、
      URLから直接クエリパラメータを指定した場合の実行時挙動には影響しない＝移行元と同じ適用範囲）
- [x] 依存関係ルールの移植（移行計画2章の組み合わせ一覧を実装。「2Dモード」⇔「視点リセット」の
      相互排他は本プロジェクトの設計変更により対象外、`deck-from-spreadsheet` 関連は機能自体が
      対象外のため除外。加えて、`isContextMenuIcon` の前提3項目それぞれにOFF→`isContextMenuIcon`も
      OFFにする逆方向ルールを追加＝ユーザー確認済み。詳細は `config-schema.ts` の `DEPENDENCIES`
      コメント参照）
- [x] 地形作成時「回転オフ・点滅なし」をデフォルト値として反映（「点滅なし」は既存の
      `isChangeDefaultTerrain`→`blinkOffTerrain` で実装済みだった。「回転オフ」は
      `isOffObjectRotateIndividually` も併せてONでないと効果が出ないため、依存関係ルールとして
      `isChangeDefaultTerrain` ON → `isOffObjectRotateIndividually` ON を追加）

## フェーズ4: 区分Bの残り（要望との直接の紐付けが弱い・優先度低め）
- [x] `move-stacked-card`（重ねカード移動。`src/plugins/move-stacked-card/` に移植。カードの
      `onInputStart`/`onMoved` をオーバーライドし、ドラッグ開始時に上に重なっているカードを記録、
      ドラッグ終了時に同じ移動量で追従させて `toTopmost()` する。実機確認はUIの右クリック操作では
      なくAngularコンポーネントAPIを直接叩く形で実施：カードを2枚同じ座標に重ね、下のカードを
      `onInputStart`→座標変更→`onMoved`で「ドラッグ」し、上のカードが追従することを確認。フラグOFF
      時は追従しないことも確認済み）
- [x] `add-blank-card-menu-simple`（本家互換のシンプルなブランクカード。既存「拡張ブランクカード」
      （`BlankCard`型、名前「ブランクカード」）とは別機能として、`src/plugins/add-blank-card-simple/`
      に通常の`Card`型（名前「カード」、文字入力なし）で実装。右クリックメニューにも「ブランクカードを
      作成（シンプル版）」という別ラベルの独立項目として追加、既存の「ブランクカードを作成」とは
      共存可能。実機確認はコンテキストメニューactionを直接呼び出す形で実施し、生成されたオブジェクトの
      `aliasName`が`card`（`blank-card`ではない）であることを確認）
- [x] `hide-menu-table` / `hide-menu-music` / `hide-menu-zip`（GM以外メニュー非表示の残り項目。
      要望で名指しされたのは image/inventory/save のみ。既存の`hide-menu-image`等と同じ
      `hide-menu.css`のnth-childパターンで追加、コア（`src/app/app.component.html`）は無変更。
      「全機能を有効化」プリセットからは既存3項目と同様の理由で除外。実機確認は各liの
      `display`計算値を確認する形で実施し、対象以外の項目に影響がないことも確認済み）
- [x] `hide-first-peer` / `hide-first-chat`（初期表示の接続情報・チャット非表示）
      ※要望一覧に直接の対応なし。移行元では`config.ts`にフラグ定義があるだけで実装が
      存在しなかった（未実装のまま放置されたフラグ）ため、本プロジェクトで新規に設計・実装。
      コアの`AppComponent.ngAfterViewInit`は起動時に「接続情報」「チャットウィンドウ」の
      2パネルをまとめて開く実装で個別にフックできる場所がないため、`PanelService.prototype.open`
      を1回だけ差し替え、対象2コンポーネントの「最初の1回」の呼び出しだけをスキップする方式で実装
      （`src/plugins/hide-first-open/`）。2回目以降＝メニューからの手動オープンは通常通り動作する。
      実機確認は起動直後に両パネルが開かないこと、メニュー操作（`AppComponent.open()`経由）で
      手動オープンすると正常に開くこと、フラグ無指定時は従来通り両パネルが自動で開くことを確認済み
- [ ] `empty-new-character`（新規キャラクターのステータス欄を空白に。ユーザー指示により最優先度を最後尾に変更）

> `offline-mode` / `horizon-menu` / `mini-menu-first-open` / `empty-display-items` /
> `post-message` 連携は、2026-08-31時点でユーザー判断によりスコープ外とし
> [settings-features-migration-deferred.md](./settings-features-migration-deferred.md) に
> 移動した。着手を決めたらそちらを参照の上、本リストに戻すこと。

## フェーズ5: 計画外・要件定義が先に必要なもの
コード移植ではなく、まず仕様を固める必要がある要望。

- [ ] 保存/コピー時に回転オフ設定が引き継がれないバグの調査
- [ ] 手札置き場（個人ボード）をZIPデータに保存する仕組みの設計
- [ ] 右クリックメニューから名前表示＋ついたてを有効化するコマンドの仕様設計
- [ ] 個人ボードの所有権を放棄する（初期状態に戻す）コマンドの仕様設計
- [ ] 個人ボードをデフォルトで回転可能にする
- [ ] 「手札置き場」→「ボード」への名称変更
- [ ] 複数のカードをまとめて選択して移動/削除する機能（カード優先）の設計
- [ ] ポップアップ時のHP〜精神力の項目を非表示にする機能の調査
- [ ] 足元の黄色い丸枠の表示/非表示が `hide-pedestal` と同一機能か確認
      （確認後、実装自体はフェーズ2相当の作業になる見込み）

## フェーズ6: アセット待ちでブロック中
- [ ] デフォルト地形データをURLのものと差し替え（キューブ・灰色・サイズ0.5）
- [ ] オリジナル初期画面素材の受領・差し替え

---

各機能追加後、本ファイルの該当チェックボックスを更新して進捗管理する。
