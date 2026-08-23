// ========================================
// 設定項目のスキーマ定義（Single Source of Truth）
// ========================================

/** 設定項目の定義 */
export interface SettingItem {
  key: string;
  param: string;
  label: string;
  type: 'boolean' | 'string';
  category: Category;
}

/** カテゴリ情報 */
export interface CategoryInfo {
  id: string;
  title: string;
  description?: string;
}

/** カテゴリ定義 */
export const CATEGORIES = [
  { id: 'extend', title: '拡張機能' },
  { id: 'display', title: '表示モード' },
  { id: 'card', title: 'カード操作' },
  { id: 'ui', title: 'UI機能' },
  { id: 'menu', title: 'メニュー表示' },
  { id: 'chat', title: 'チャット・手札' },
  { id: 'board', title: 'ボード・ついたて' },
  { id: 'note', title: 'メモ' },
  { id: 'restriction', title: '機能制限' },
] as const satisfies readonly CategoryInfo[];

/** カテゴリIDの型 */
export type Category = typeof CATEGORIES[number]['id'];

/** Boolean型の設定項目 */
export const BOOLEAN_SETTINGS: SettingItem[] = [
  // 機能拡張
  { key: 'isKeepBoardOnLoad', param: 'keep-board-on-load', label: 'ルームデータロード時にボード上のオブジェクトを更新せずに残す', type: 'boolean', category: 'extend' },

  // 表示モード
  { key: 'is2d', param: '2d', label: '2Dモード', type: 'boolean', category: 'display' },
  { key: 'isTutorial', param: 'tutorial', label: 'チュートリアル', type: 'boolean', category: 'display' },
  { key: 'isFirstFetchZipRoom', param: 'first-fetch-zip-room', label: 'Zipから部屋情報読込', type: 'boolean', category: 'display' },
  { key: 'isUseResetPointOfView', param: 'reset-point-of-view', label: '視点リセット→2D表示切替', type: 'boolean', category: 'display' },
  { key: 'isEmptyDefaultObjects', param: 'empty-default-objects', label: 'サンプルのキャラクターコマを非表示', type: 'boolean', category: 'display' },
  { key: 'isEmptyDefaultTable', param: 'empty-default-table', label: '初期テーブル設定をおこなわない', type: 'boolean', category: 'display' },

  // カード操作
  { key: 'isTapCard', param: 'tap-card', label: 'カードをタップ', type: 'boolean', category: 'card' },
  { key: 'isCardShuffleNormalPosition', param: 'shuffle-normal', label: 'カードを正位置のままシャッフル', type: 'boolean', category: 'card' },
  { key: 'addBlankCardAddContextMenu', param: 'add-blank-card-menu', label: '右クリックメニューでブランクカードを作成', type: 'boolean', category: 'card' },
  { key: 'isAddDrawNCards', param: 'add-draw-n-cards', label: '「カードをn枚引く」を山札のコンテキストメニューに追加', type: 'boolean', category: 'card' },
  { key: 'isCardWritable', param: 'add-card-text-writable', label: 'カードに文字入力可能にする', type: 'boolean', category: 'card' },
  { key: 'isMoveStackedCard', param: 'move-stacked-card', label: '重ねたカードをまとめて移動', type: 'boolean', category: 'card' },
  { key: 'isAddBlankCardMenuSimple', param: 'add-blank-card-menu-simple', label: '右クリックメニューでブランクカードを作成（本家互換・シンプル版、文字入力なし）', type: 'boolean', category: 'card' },

  // UI機能
  { key: 'isUseKeyboardShortcut', param: 'key-shortcut', label: 'キーボードショートカット', type: 'boolean', category: 'ui' },
  { key: 'isAddCounterBoard', param: 'counter-board', label: 'カウンターボード', type: 'boolean', category: 'ui' },
  { key: 'isChangeDefaultTerrain', param: 'change-default-terrain', label: 'デフォルト地形をCubeに変更', type: 'boolean', category: 'ui' },
  { key: 'isMinimizableMenu', param: 'mini-menu', label: 'メニュー最小化', type: 'boolean', category: 'ui' },
  { key: 'isToggleSoundEffect', param: 'toggle-sound-effect', label: '操作音オンオフ', type: 'boolean', category: 'ui' },

  // メニュー表示（GM以外のメニューから一部項目を非表示にする）
  { key: 'isHideMenuTable', param: 'hide-menu-table', label: 'メニューから削除: テーブル設定', type: 'boolean', category: 'menu' },
  { key: 'isHideMenuImage', param: 'hide-menu-image', label: 'メニューから削除: 画像', type: 'boolean', category: 'menu' },
  { key: 'isHideMenuMusic', param: 'hide-menu-music', label: 'メニューから削除: 音楽', type: 'boolean', category: 'menu' },
  { key: 'isHideMenuInventory', param: 'hide-menu-inventory', label: 'メニューから削除: インベントリ', type: 'boolean', category: 'menu' },
  { key: 'isHideMenuZip', param: 'hide-menu-zip', label: 'メニューから削除: ZIP読込', type: 'boolean', category: 'menu' },
  { key: 'isHideMenuSave', param: 'hide-menu-save', label: 'メニューから削除: 保存', type: 'boolean', category: 'menu' },
  { key: 'isAddReloadButton', param: 'add-reload-button', label: '「接続」内に退室ボタンを追加', type: 'boolean', category: 'menu' },
  { key: 'isContextMenuIcon', param: 'context-menu-add-icon', label: '右クリックメニューをアイコン表示にする', type: 'boolean', category: 'menu' },
  { key: 'isHideFirstPeer', param: 'hide-first-peer', label: '初期表示に接続情報を表示しない', type: 'boolean', category: 'menu' },
  { key: 'isHideFirstChat', param: 'hide-first-chat', label: '初期表示にチャットウィンドウを表示しない', type: 'boolean', category: 'menu' },

  // チャット・手札
  { key: 'useChatCommand', param: 'use-chat-command', label: 'チャットコマンド', type: 'boolean', category: 'chat' },
  { key: 'isUseHandStorage', param: 'use-hand-storage', label: '手札ストレージ', type: 'boolean', category: 'chat' },

  // ボード・ついたて
  { key: 'isUseVirtualScreen', param: 'virtual-screen', label: 'ボード（ついたて）', type: 'boolean', category: 'board' },
  { key: 'isUseHandStorageSelfOnly', param: 'hand-storage-self-only', label: 'ボードを自分のものだけ触れるようにする', type: 'boolean', category: 'board' },
  { key: 'canReturnHandToIndividualBoard', param: 'return-the-hand', label: '手札を回収する', type: 'boolean', category: 'board' },
  { key: 'isHandCardSelfHandStorage', param: 'hand-card-self-hand-storage', label: '自分のボードにしたときにボード上のカードを手札にする', type: 'boolean', category: 'board' },
  { key: 'isCardBackImageAllChangeMenu', param: 'card-back-image-all-change', label: 'カード裏画像の一括変更', type: 'boolean', category: 'board' },
  { key: 'isAutoSelfViewCard', param: 'auto-self-view-mode', label: 'ついたてに入れたカードを自動的に自分だけ見るモードにする', type: 'boolean', category: 'board' },
  { key: 'isAutoSelfViewCardFromDeck', param: 'auto-self-view-mode-from-stack', label: '山札から引いたカードを自動的に自分だけ見るモードにする', type: 'boolean', category: 'board' },
  { key: 'isContextMenuAutoSelfViewCardFromDeck', param: 'add-stack-context-auto-self-view-mode', label: '「自分だけ見る」を山札のコンテキストメニューに追加', type: 'boolean', category: 'board' },

  // メモ
  { key: 'isTextNoteSelectableUprightFlat', param: 'text-note-upright-flat', label: '共有メモの直立と並行の切り替え', type: 'boolean', category: 'note' },

  // 機能制限
  { key: 'isOffTableRotate', param: 'table-rotate-off', label: 'テーブル回転オフ', type: 'boolean', category: 'restriction' },
  { key: 'isOffObjectRotateAll', param: 'object-rotate-off-all', label: 'オブジェクト回転オフ', type: 'boolean', category: 'restriction' },
  { key: 'isOffObjectRotateIndividually', param: 'object-rotate-off-individually', label: 'オブジェクト回転オフ(個別設定可能)', type: 'boolean', category: 'restriction' },
];

/** String型の設定項目（カメラ座標） */
export const STRING_SETTINGS: SettingItem[] = [
  { key: 'z', param: 'z', label: 'カメラZ座標', type: 'string', category: 'display' },
  { key: 'x', param: 'x', label: 'カメラX座標', type: 'string', category: 'display' },
  { key: 'y', param: 'y', label: 'カメラY座標', type: 'string', category: 'display' },
  { key: 'rx', param: 'rx', label: 'カメラRX回転', type: 'string', category: 'display' },
  { key: 'ry', param: 'ry', label: 'カメラRY回転', type: 'string', category: 'display' },
  { key: 'rz', param: 'rz', label: 'カメラRZ回転', type: 'string', category: 'display' },
];

/** 全設定項目 */
export const ALL_SETTINGS: SettingItem[] = [
  ...BOOLEAN_SETTINGS,
  ...STRING_SETTINGS,
];

// ========================================
// 部屋別プリセット設定
// ========================================

/**
 * 「全機能を有効化」プリセットで除外するキー。
 * 一括ONにすると自己矛盾を起こす・他の設定と衝突する・初期表示を壊すものを明示的に除外する。
 * - isHideMenuTable / isHideMenuImage / isHideMenuMusic / isHideMenuInventory / isHideMenuZip /
 *   isHideMenuSave: メニュー項目を非表示にする機能。「全機能を有効化」の趣旨（機能を隠さず
 *   使えるようにする）と矛盾するため除外。
 * - isOffObjectRotateAll: isOffObjectRotateIndividually（個別設定可能な回転オフ）と役割が重複・排他。
 *   個別設定可能な方を優先し、一括オフの方は除外する。
 * - isFirstFetchZipRoom（Zipから部屋情報読込）: ONにすると GameTableComponent の初期テーブル生成処理
 *   （デフォルトの地形・グリッド作成）が丸ごとスキップされ、代わりに `?room=<値>` をファイル名とみなして
 *   `rooms/<値>.zip` を取得しようとする（src/plugins/first-fetch-zip-room/extend/app.component.ts の
 *   getZipName()）。ROOM_PRESETSも同じ`room`パラメータを使う仕組みのため、プリセット名（例:
 *   `room=all`）がそのままZIPファイル名として扱われてしまい、存在しないZIPの取得に失敗して
 *   初期テーブルが何も表示されなくなる。vsrank/hollowプリセットは対応する専用ZIP
 *   （rooms/vsrank.zip等）が用意されている前提でこのフラグをONにしているため問題ないが、
 *   「全機能を有効化」は特定のZIPを前提としないプリセットなので除外する。
 * - isTutorial（チュートリアル）: 対応する実装が未整備で、ONにすると AppComponent の
 *   ngAfterViewInit が早期returnし、接続情報・チャット画面などの初期パネルが一切開かなくなる
 *   （src/plugins/extends/app.component.ts）。テーブル自体は生成されるが起動直後の画面が
 *   実質空になるため除外する。
 * - isEmptyDefaultObjects / isEmptyDefaultTable（サンプルのキャラクターコマ非表示／初期テーブル設定を
 *   おこなわない）: 「全機能を有効化」プリセットは機能を体験できるようにする趣旨のため、起動直後の
 *   サンプルオブジェクトやテーブルそのものが消えてしまうこれらは除外する。
 * - isHideFirstPeer / isHideFirstChat（初期表示に接続情報／チャットウィンドウを表示しない）:
 *   isTutorialと同様、起動直後のパネルが一切開かなくなり「機能を体験できるようにする」という
 *   趣旨と矛盾するため除外する。
 */
const ALL_PRESET_EXCLUDED_KEYS: ReadonlySet<string> = new Set([
  'isHideMenuTable',
  'isHideMenuImage',
  'isHideMenuMusic',
  'isHideMenuInventory',
  'isHideMenuZip',
  'isHideMenuSave',
  'isOffObjectRotateAll',
  'isFirstFetchZipRoom',
  'isTutorial',
  'isEmptyDefaultObjects',
  'isEmptyDefaultTable',
  'isHideFirstPeer',
  'isHideFirstChat',
]);

/** 部屋別プリセット（設定キーの配列で定義） */
export const ROOM_PRESETS: Record<string, Partial<Record<string, boolean>>> = {
  vsrank: {
    isTapCard: true,
    isUseKeyboardShortcut: true,
    isCardShuffleNormalPosition: true,
    isFirstFetchZipRoom: true,
    isAddCounterBoard: true,
    isChangeDefaultTerrain: false,
  },
  hollow: {
    isTapCard: true,
    isUseKeyboardShortcut: true,
    isCardShuffleNormalPosition: true,
    isFirstFetchZipRoom: true,
    isChangeDefaultTerrain: false,
  },
  // 全機能を有効化：ALL_PRESET_EXCLUDED_KEYSに挙げたもの以外のBoolean設定を全てONにする。
  // BOOLEAN_SETTINGSから動的に生成するため、新しい設定項目を追加しても自動的に反映される。
  all: Object.fromEntries(
    BOOLEAN_SETTINGS
      .filter(s => !ALL_PRESET_EXCLUDED_KEYS.has(s.key))
      .map(s => [s.key, true])
  ),
};

/** プリセット選択肢（UI用） */
export const PRESET_OPTIONS = [
  { value: '', label: 'なし' },
  { value: 'all', label: '全機能を有効化' },
  { value: 'vsrank', label: 'VSRank用設定' },
  { value: 'hollow', label: 'Hollow用設定' },
];

// ========================================
// 設定間の依存関係・排他制御
// ========================================

/**
 * 設定項目間の依存関係定義。
 * `key` が `when` の値になったとき、`setOn` のキーを true に、`setOff` のキーを false にする。
 * 移行元 `settingApp/app.component.ts` の `changeSetting()` を移植したもの（`applySettingDependencies`
 * 参照。設定画面（`plugin-settings.component.ts`）のチェックボックス変更時にのみ適用され、URLから
 * 直接クエリパラメータを指定した場合の実行時挙動には影響しない＝移行元と同じ適用範囲）。
 *
 * 移行元との差分:
 * - 「2Dモード」⇔「視点リセット」の相互排他は移植していない。本プロジェクトの
 *   `isUseResetPointOfView` は「視点リセット/2D表示切替」の2つのメニュー項目を出すかどうかの
 *   フラグであり、`is2d`（起動時に最初から2D表示にするか）とは独立に共存できる設計にしたため
 *   （[[dont-touch-upstream-core]] 移行時の意図的な設計変更、詳細はチェックリスト参照）。
 * - `deck-from-spreadsheet` 関連のルールは、当該機能が移行対象外のため除外。
 * - `isFirstFetchZipRoom` → `isEmptyDefaultObjects`/`isEmptyDefaultTable` は移行元にない新規ルール。
 *   移行元は「サンプルのキャラクターコマを非表示」1項目だけをONにしていたが、本プロジェクトでは
 *   Zip読込時に初期テーブル生成処理自体が丸ごとスキップされる実装
 *   （`first-fetch-zip-room/extend/components/game-table/game-table.components.ts`）のため、実態に
 *   合わせて2項目ともONにする（このルール自体は表示上の整合性のためのものであり、Zip読込時の実際の
 *   スキップ動作は元々このルールと無関係に働く）。
 * - `isChangeDefaultTerrain` → `isOffObjectRotateIndividually` は移行元にない新規ルール。地形作成時の
 *   「点滅なし」は `isChangeDefaultTerrain` 単体で既に有効になる（`blinkOffTerrain`）が、「回転オフ」は
 *   `isOffObjectRotateIndividually` も併せてONでないと効果が出ない
 *   （`default-terrain-cube/extend/service/tabletop-action.service.ts` の `createDefaultCubeTerrain`
 *   参照）ため、依存関係として明示した。
 * - `isContextMenuIcon` → `addBlankCardAddContextMenu` も移行元にない新規ルール。右クリックメニューを
 *   アイコン化した際にカード用のアイコン項目（ブランクカード作成）が確実に出るようにするための
 *   ユーザー確認済みの追加。
 * - `isContextMenuIcon` の前提3項目（`isUseHandStorage`/`isChangeDefaultTerrain`/
 *   `addBlankCardAddContextMenu`）それぞれについて、OFF→`isContextMenuIcon`もOFFという逆方向ルールも
 *   追加している。移行元は「ボードOFF→関連4項目OFF」の逆方向は考慮しておらず（`isContextMenuIcon`
 *   ONのままボードだけOFFにできてしまう＝前提が欠けた矛盾状態を許容する）、本実装は全ルールを
 *   固定点まで適用する都合上、逆方向ルールがないと「前提をOFFにしたはずが、`isContextMenuIcon`が
 *   まだONなので次のループで即座に前提がONへ押し戻される」という無反応に見える挙動になるため。
 */
export interface SettingDependency {
  key: string;
  when: boolean;
  setOn?: string[];
  setOff?: string[];
}

export const DEPENDENCIES: SettingDependency[] = [
  // オブジェクト回転オフ「一括」と「個別設定可能」は相互排他
  { key: 'isOffObjectRotateIndividually', when: true, setOff: ['isOffObjectRotateAll'] },
  { key: 'isOffObjectRotateAll', when: true, setOff: ['isOffObjectRotateIndividually'] },

  // ボード（ついたて）系設定は「ボード」(isUseHandStorage) に依存する
  { key: 'isUseVirtualScreen', when: true, setOn: ['isUseHandStorage'] },
  { key: 'isUseHandStorageSelfOnly', when: true, setOn: ['isUseHandStorage'] },
  { key: 'canReturnHandToIndividualBoard', when: true, setOn: ['isUseHandStorage'] },
  { key: 'isHandCardSelfHandStorage', when: true, setOn: ['isUseHandStorage', 'canReturnHandToIndividualBoard'] },
  { key: 'canReturnHandToIndividualBoard', when: false, setOff: ['isHandCardSelfHandStorage'] },
  { key: 'isUseHandStorage', when: false, setOff: [
    'isUseVirtualScreen', 'isUseHandStorageSelfOnly', 'canReturnHandToIndividualBoard', 'isHandCardSelfHandStorage',
    'isContextMenuIcon', // isContextMenuIconの前提が欠けるため道連れでOFF（上記コメント参照）
  ] },

  // 右クリックメニューのアイコン化は、ボード・デフォルト地形(Cube)・ブランクカード作成を前提とする
  // （アイコン表示対象のメニュー項目が一通り揃うようにするため）。前提のいずれかがOFFになったら
  // isContextMenuIcon自体もOFFにする逆方向ルールも併せて定義する（上記コメント参照）。
  { key: 'isContextMenuIcon', when: true, setOn: ['isUseHandStorage', 'isChangeDefaultTerrain', 'addBlankCardAddContextMenu'] },
  { key: 'isChangeDefaultTerrain', when: false, setOff: ['isContextMenuIcon'] },
  { key: 'addBlankCardAddContextMenu', when: false, setOff: ['isContextMenuIcon'] },

  // Zipから部屋情報読込時は初期テーブル生成処理自体がスキップされるため、設定画面上もそれに合わせる
  { key: 'isFirstFetchZipRoom', when: true, setOn: ['isEmptyDefaultObjects', 'isEmptyDefaultTable'] },

  // デフォルト地形をCubeに変更時は、回転オフ（個別設定可能）も併せてONにしないと地形作成時の
  // 「回転オフ」が効かない
  { key: 'isChangeDefaultTerrain', when: true, setOn: ['isOffObjectRotateIndividually'] },
];

/**
 * DEPENDENCIESを、実際に変更されたキーを起点に連鎖的（BFS）に適用する。
 * `changedKeys` に渡したキー（呼び出し側で既に新しい値をsettingsへ反映済みのもの）から
 * 依存関係を辿り、値が変化したキーだけを次の伝播元としてキューに積んでいく。
 *
 * 「全ルールを毎回総当たりして固定点まで回す」素朴な実装は避けている。isUseHandStorage(false)
 * → isContextMenuIcon(false) のような逆方向ルールを追加すると、isContextMenuIcon(true) →
 * isUseHandStorage(true) という順方向ルールとの間で「まだisUseHandStorageがfalseのうちに
 * 逆方向ルールが先に評価され、直前にtrueにしたisContextMenuIconを同じ総当たりパス内で
 * false に巻き戻してしまう」というルール定義順に依存したバグが実際に発生したため
 * （DEPENDENCIES配列内のコメント参照）。
 * 変更起点からのBFSであれば、各キーはその時点で確定済みの値に基づいてのみ次の連鎖を
 * 決定するため、この種の巻き戻りが起きない。
 */
export function applySettingDependencies(
  settings: Record<string, boolean | string>,
  changedKeys: string[],
): void {
  const MAX_STEPS = 1000; // 想定外の循環定義があっても無限ループにしないための安全弁
  const queue: string[] = [...changedKeys];
  const queued = new Set(queue);
  let steps = 0;

  const enqueue = (key: string) => {
    if (queued.has(key)) return;
    queued.add(key);
    queue.push(key);
  };

  while (queue.length > 0 && steps < MAX_STEPS) {
    steps++;
    const key = queue.shift();
    queued.delete(key);
    const currentValue = settings[key];

    for (const dep of DEPENDENCIES) {
      if (dep.key !== key || currentValue !== dep.when) continue;
      for (const target of dep.setOn ?? []) {
        if (settings[target] !== true) { settings[target] = true; enqueue(target); }
      }
      for (const target of dep.setOff ?? []) {
        if (settings[target] !== false) { settings[target] = false; enqueue(target); }
      }
    }
  }
}

// ========================================
// ヘルパー関数
// ========================================

/** パラメータ名からキーを取得 */
export function getKeyByParam(param: string): string | undefined {
  return ALL_SETTINGS.find(s => s.param === param)?.key;
}

/** キーからパラメータ名を取得 */
export function getParamByKey(key: string): string | undefined {
  return ALL_SETTINGS.find(s => s.key === key)?.param;
}

/** キーからラベルを取得 */
export function getLabelByKey(key: string): string | undefined {
  return ALL_SETTINGS.find(s => s.key === key)?.label;
}
