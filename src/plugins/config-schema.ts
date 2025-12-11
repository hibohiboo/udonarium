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
  { id: 'display', title: '表示モード' },
  { id: 'card', title: 'カード操作' },
  { id: 'ui', title: 'UI機能' },
  { id: 'chat', title: 'チャット・手札' },
  { id: 'note', title: 'メモ' },
  { id: 'restriction', title: '機能制限' },
] as const satisfies readonly CategoryInfo[];

/** カテゴリIDの型 */
export type Category = typeof CATEGORIES[number]['id'];

/** Boolean型の設定項目 */
export const BOOLEAN_SETTINGS: SettingItem[] = [
  // 表示モード
  { key: 'is2d', param: '2d', label: '2Dモード', type: 'boolean', category: 'display' },
  { key: 'isTutorial', param: 'tutorial', label: 'チュートリアル', type: 'boolean', category: 'display' },
  { key: 'isFirstFetchZipRoom', param: 'first-fetch-zip-room', label: 'Zipから部屋情報読込', type: 'boolean', category: 'display' },

  // カード操作
  { key: 'isTapCard', param: 'tap-card', label: 'カードをタップ', type: 'boolean', category: 'card' },
  { key: 'isCardShuffleNormalPosition', param: 'shuffle-normal', label: 'カードを正位置のままシャッフル', type: 'boolean', category: 'card' },

  // UI機能
  { key: 'isUseKeyboardShortcut', param: 'key-shortcut', label: 'キーボードショートカット', type: 'boolean', category: 'ui' },
  { key: 'isAddCounterBoard', param: 'counter-board', label: 'カウンターボード', type: 'boolean', category: 'ui' },
  { key: 'isChangeDefaultTerrain', param: 'change-default-terrain', label: 'デフォルト地形をCubeに変更', type: 'boolean', category: 'ui' },
  { key: 'isMinimizableMenu', param: 'mini-menu', label: 'メニュー最小化', type: 'boolean', category: 'ui' },

  // チャット・手札
  { key: 'useChatCommand', param: 'use-chat-command', label: 'チャットコマンド', type: 'boolean', category: 'chat' },
  { key: 'isUseHandStorage', param: 'use-hand-storage', label: '手札ストレージ', type: 'boolean', category: 'chat' },

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
};

/** プリセット選択肢（UI用） */
export const PRESET_OPTIONS = [
  { value: '', label: 'なし' },
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
