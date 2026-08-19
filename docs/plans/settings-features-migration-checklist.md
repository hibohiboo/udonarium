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
- [ ] `add-draw-n-cards`（カードをn枚引く）
- [ ] `reset-point-of-view`（視点リセット→2D表示切替）
- [ ] `toggle-sound-effect`（操作音オンオフ）
- [ ] `empty-new-character`（新規キャラクターのステータス欄を空白に）
- [ ] `empty-default-objects`（サンプルのキャラクターコマ非表示）
- [ ] `empty-default-table`（初期テーブル設定をおこなわない）
- [ ] `add-card-text-writable`（カードに文字入力。0-3節参照、ブランクカード限定機能とは別物）

## フェーズ3: 区分A'（依存関係・デフォルト値調整）
- [ ] 設定間の依存関係・排他制御の仕組み導入（`config-schema.ts` への `DEPENDENCIES` 定義追加）
- [ ] 依存関係ルールの移植（移行計画2章の組み合わせ一覧を実装）
- [ ] 地形作成時「回転オフ・点滅なし」をデフォルト値として反映

## フェーズ4: 区分Bの残り（要望との直接の紐付けが弱い・優先度低め）
- [ ] `move-stacked-card`（重ねカード移動）
- [ ] `add-blank-card-menu-simple`（本家互換のシンプルなブランクカード。既存「拡張ブランクカード」
      とは別機能、0-3節参照）
- [ ] `offline-mode`（オフラインモード。Cloudflare構成での要否確認が先）
- [ ] `horizon-menu`（メニュー横並び）※要望一覧に直接の対応なし
- [ ] `mini-menu-first-open`（メニュー最小化を最初から開く）※要望一覧に直接の対応なし
- [ ] `hide-menu-table` / `hide-menu-music` / `hide-menu-zip`（GM以外メニュー非表示の残り項目。
      要望で名指しされたのは image/inventory/save のみ）
- [ ] `empty-display-items`（表示項目の初期値を空にする）※要望一覧に直接の対応なし
- [ ] `hide-first-peer` / `hide-first-chat`（初期表示の接続情報・チャット非表示）
      ※要望一覧に直接の対応なし
- [ ] `post-message` 連携 ※要望一覧に直接の対応なし、要否確認が先

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
