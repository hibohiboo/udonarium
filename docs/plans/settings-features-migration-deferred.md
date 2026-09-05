# 部屋設定機能移行 — 保留事項（今回のスコープ外）

作成日: 2026-08-31

[settings-features-migration-checklist.md](./settings-features-migration-checklist.md) の
フェーズ4から、以下5項目を今回のスコープ外として一時的に外した。実装するかどうかは要検討・
ユーザー判断待ち。着手を決めたら、該当項目をチェックリスト側のフェーズ4（または適切なフェーズ）
に戻す。

## 1. `offline-mode`（オフラインモード）
- 要望一覧に直接の対応なし。移行元 `udonarium-boardgame` にある機能。
- Cloudflare Workers構成（本リポジトリ）と、移行元のAWS/CloudFront構成とで通信方式が異なる
  可能性があり、そもそも意味のある機能か・実装要否の確認が先（移行計画6章にも記載済みの
  既存の未確定事項）。
- 検討したいこと: Cloudflare版で「オフラインモード」に相当する要件があるか。

## 2. `post-message` 連携
- 要望一覧に直接の対応なし。
- 埋め込みiframe用の外部連携機能（移行元の `usePostMessage` / `add-posts-messages/`）。
- 検討したいこと: 本プロジェクトをiframe埋め込みで使う想定があるか（移行計画6章にも記載済み）。

## 3. `horizon-menu`（メニュー横並び）
- 要望一覧に直接の対応なし。
- 実装するには全パネル共通の `src/app/component/ui-panel/ui-panel.component.*`
  （テンプレート・CSS）への拡張が必要で、フェーズ4の他項目より作業量が大きい
  （移行計画3-2節にも「ui-panel.component.ts拡張が必要」と明記あり）。
- 検討したいこと: 優先してでも欲しい機能か。

## 4. `mini-menu-first-open`（メニュー最小化を最初から開く）
- 要望一覧に直接の対応なし。
- 調査結果: 移行元の実装
  （`initMin = pluginConfig.isMinimizableMenu && !pluginConfig.isMiniMenuFirstOpen`、
  `udonarium-boardgame/src/plugins/extend-menu/extends/app/component/ui-panel/ui-panel.component.ts`）
  では、「メニュー最小化」(`isMinimizableMenu`) を有効にすると**デフォルトで全パネルが
  最初から最小化された状態で起動**し、`isMiniMenuFirstOpen` はその最小化をキャンセルして
  最初から展開状態で始めるためのフラグ。
  本プロジェクトの「メニュー最小化」
  （[extends/component/ui-panel/ui-panel.component.ts](../../src/plugins/extends/component/ui-panel/ui-panel.component.ts)）
  は、有効時に「最小化ボタン」を表示できるようにするだけで、**最初から常に展開された状態で
  起動する**設計になっている（`isMinimized` は常に `false` 初期化）。
  そのため `mini-menu-first-open` 相当の設定自体が本プロジェクトでは意味を持たない
  （デフォルトの動作がすでに移行元の「first-open」状態と同じ）。
- 結論候補: **対応不要**（本プロジェクトの設計と噛み合わないため）。ただし将来「メニュー最小化
  時は最初から畳んでおきたい」という逆方向の要望が出た場合は、その時点で改めて設計する
  （その場合は移行元と実質逆の意味の新機能になる）。

## 5. `empty-display-items`（表示項目の初期値を空にする）
- 要望一覧に直接の対応なし。
- 未調査（移行元の実装内容・「表示項目」が何を指すか、具体的にまだ確認していない）。
- 検討したいこと: 何を指すか（キャラクターシートの表示項目？ ゲームテーブルの表示オブジェクト？）
  を確認してから着手要否を判断する。

## 6. `empty-new-character`（新規キャラクターのステータス欄を空白に）
- 要望一覧に直接対応する項目（唯一、他の5項目と違い要望との紐付けあり）。ただし以前のセッションで
  ユーザー指示によりフェーズ4内で最優先度を最後尾に変更済みで、今回さらにスコープ外として保留にした。
- 調査結果: 移行元は `GameCharacter.static create()`
  （`udonarium-boardgame/src/app/class/game-character.ts`）の中で
  `if (createEmptyNewCharacter(...)) return gameCharacter;` という分岐を**コアに直接追加**しており、
  `isEmptyNewCharacter` ON時はキャラクター名・サイズだけを設定して早期return、OFF時は
  `createTestGameDataElement()`（HP/MP・能力値・説明などのテスト用ダミーデータ一式を作る既存メソッド）
  を呼ぶ、という実装。本プロジェクトの [[dont-touch-upstream-core]] 方針（コア無変更）に反する
  移植元特有の実装で、素直に移すならコアを直接編集することになる。
- 本プロジェクトでの実装方針の候補: `GameCharacter.create` はstaticメソッドなので、
  [[dont-touch-upstream-core]] の「staticメソッドの拡張」パターン
  （`extendXxx()`という冪等ガード付き関数でstaticメソッド自体を一度だけ差し替える。
  `src/plugins/extends/class/sound-effect.ts` が実例）を使えば、コアを無変更のまま
  `isEmptyNewCharacter` ON時に `createTestGameDataElement()` 呼び出しをスキップする形で
  移植できる見込み（未着手・未検証）。
- 対象コアファイル: `src/app/class/game-character.ts` の `static create()` /
  `createTestGameDataElement()`（本プロジェクト側は移行元と同じ構造を確認済み）。
