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

  // カード操作
  { key: 'isTapCard', param: 'tap-card', label: 'カードをタップ', type: 'boolean', category: 'card' },
  { key: 'isCardShuffleNormalPosition', param: 'shuffle-normal', label: 'カードを正位置のままシャッフル', type: 'boolean', category: 'card' },
  { key: 'addBlankCardAddContextMenu', param: 'add-blank-card-menu', label: '右クリックメニューでブランクカードを作成', type: 'boolean', category: 'card' },

  // UI機能
  { key: 'isUseKeyboardShortcut', param: 'key-shortcut', label: 'キーボードショートカット', type: 'boolean', category: 'ui' },
  { key: 'isAddCounterBoard', param: 'counter-board', label: 'カウンターボード', type: 'boolean', category: 'ui' },
  { key: 'isChangeDefaultTerrain', param: 'change-default-terrain', label: 'デフォルト地形をCubeに変更', type: 'boolean', category: 'ui' },
  { key: 'isMinimizableMenu', param: 'mini-menu', label: 'メニュー最小化', type: 'boolean', category: 'ui' },

  // メニュー表示（GM以外のメニューから一部項目を非表示にする）
  { key: 'isHideMenuImage', param: 'hide-menu-image', label: 'メニューから削除: 画像', type: 'boolean', category: 'menu' },
  { key: 'isHideMenuInventory', param: 'hide-menu-inventory', label: 'メニューから削除: インベントリ', type: 'boolean', category: 'menu' },
  { key: 'isHideMenuSave', param: 'hide-menu-save', label: 'メニューから削除: 保存', type: 'boolean', category: 'menu' },
  { key: 'isAddReloadButton', param: 'add-reload-button', label: '「接続」内に退室ボタンを追加', type: 'boolean', category: 'menu' },
  { key: 'isContextMenuIcon', param: 'context-menu-add-icon', label: '右クリックメニューをアイコン表示にする', type: 'boolean', category: 'menu' },

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
 * 一括ONにすると自己矛盾を起こす・他の設定と衝突するものだけを明示的に除外する。
 * - isHideMenuImage / isHideMenuInventory / isHideMenuSave: メニュー項目を非表示にする機能。
 *   「全機能を有効化」の趣旨（機能を隠さず使えるようにする）と矛盾するため除外。
 * - isOffObjectRotateAll: isOffObjectRotateIndividually（個別設定可能な回転オフ）と役割が重複・排他。
 *   個別設定可能な方を優先し、一括オフの方は除外する。
 */
const ALL_PRESET_EXCLUDED_KEYS: ReadonlySet<string> = new Set([
  'isHideMenuImage',
  'isHideMenuInventory',
  'isHideMenuSave',
  'isOffObjectRotateAll',
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
