import { BOOLEAN_SETTINGS, STRING_SETTINGS, ROOM_PRESETS } from './config-schema';

// ========================================
// 型定義
// ========================================

/** クエリパラメータから取得する設定 */
interface QueryParamConfig {
  // 表示モード
  is2d: boolean;
  isTutorial: boolean;
  isFirstFetchZipRoom: boolean;
  isUseResetPointOfView: boolean;

  // カード操作
  isTapCard: boolean;
  isCardShuffleNormalPosition: boolean;
  addBlankCardAddContextMenu: boolean;
  isAddDrawNCards: boolean;

  // UI機能
  isUseKeyboardShortcut: boolean;
  isAddCounterBoard: boolean;
  isChangeDefaultTerrain: boolean;
  isMinimizableMenu: boolean;
  isToggleSoundEffect: boolean;

  // メニュー表示（GM以外のメニューから一部項目を非表示にする）
  isHideMenuImage: boolean;
  isHideMenuInventory: boolean;
  isHideMenuSave: boolean;
  isAddReloadButton: boolean;
  isContextMenuIcon: boolean;

  // チャット・手札
  useChatCommand: boolean;
  isUseHandStorage: boolean;
  isKeepBoardOnLoad: boolean;

  // メモ帳
  isTextNoteSelectableUprightFlat: boolean;

  // 機能制限
  isOffTableRotate: boolean;
  isOffObjectRotateIndividually: boolean;
  isOffObjectRotateAll: boolean;

  // ボード・ついたて
  isUseVirtualScreen: boolean;
  isUseHandStorageSelfOnly: boolean;
  canReturnHandToIndividualBoard: boolean;
  isHandCardSelfHandStorage: boolean;
  isCardBackImageAllChangeMenu: boolean;
  isAutoSelfViewCard: boolean;
  isAutoSelfViewCardFromDeck: boolean;
  isContextMenuAutoSelfViewCardFromDeck: boolean;

  // カメラ座標（オプショナル）
  z: string | null;
  x: string | null;
  y: string | null;
  rx: string | null;
  ry: string | null;
  rz: string | null;
}

/** 部屋別の設定オーバーライド */
type RoomSpecificConfig = Partial<QueryParamConfig>;

/** 最終的なプラグイン設定 */
type PluginConfig = QueryParamConfig;

// ========================================
// ヘルパー関数
// ========================================

/**
 * URLSearchParamsからboolean値を取得
 * パラメータの存在をbooleanに変換
 */
function getBooleanParam(params: URLSearchParams, key: string): boolean {
  return params.get(key) != null;
}

/**
 * URLSearchParamsから文字列を取得（存在しない場合はnull）
 */
function getStringParam(params: URLSearchParams, key: string): string | null {
  return params.get(key);
}

/**
 * 部屋別の設定を取得
 */
function getRoomConfig(params: URLSearchParams): RoomSpecificConfig {
  const roomName = params.get('room');
  if (!roomName) return {};

  return ROOM_PRESETS[roomName] ?? {};
}

/**
 * クエリパラメータから基本設定を構築
 * スキーマから動的に構築することで、設定追加時の変更を最小化
 */
function buildBaseConfig(params: URLSearchParams): QueryParamConfig {
  const config: any = {};

  // Boolean設定を動的に構築
  for (const setting of BOOLEAN_SETTINGS) {
    config[setting.key] = getBooleanParam(params, setting.param);
  }

  // String設定を動的に構築
  for (const setting of STRING_SETTINGS) {
    config[setting.key] = getStringParam(params, setting.param);
  }

  return config as QueryParamConfig;
}

// ========================================
// エクスポート
// ========================================

const params = new URL(document.URL).searchParams;

export const pluginConfig: Readonly<PluginConfig> = {
  ...buildBaseConfig(params),
  ...getRoomConfig(params), // 部屋別設定で上書き
} as const;

// ========================================
// 型エクスポート（他モジュールで使用可能）
// ========================================
// export type { PluginConfig, RoomSpecificConfig };
