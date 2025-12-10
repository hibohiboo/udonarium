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

  // カード操作
  isTapCard: boolean;
  isCardShuffleNormalPosition: boolean;

  // UI機能
  isUseKeyboardShortcut: boolean;
  isAddCounterBoard: boolean;
  isChangeDefaultTerrain: boolean;

  // チャット・手札
  useChatCommand: boolean;
  isUseHandStorage: boolean;

  // 機能制限
  isOffTableRotate: boolean;

  // カメラ座標（オプショナル）
  z: string | null;
  x: string | null;
  y: string | null;
  rx: string | null;
  ry: string | null;
  rz: string | null;
}

/** 未実装フラグ（将来の拡張用） */
interface UnimplementedFeatureFlags {
  isUseHandStorageSelfOnly: boolean;
  isCardBackImageAllChangeMenu: boolean;
  isOffObjectRotateIndividually: boolean;
  isUseVirtualScreen: boolean;
  canReturnHandToIndividualBoard: boolean;
  isAutoSelfViewCardFromDeck: boolean;
  isContextMenuAutoSelfViewCardFromDeck: boolean;
  isAutoSelfViewCard: boolean;
  isHandCardSelfHandStorage: boolean;
}

/** 部屋別の設定オーバーライド */
type RoomSpecificConfig = Partial<QueryParamConfig & UnimplementedFeatureFlags>;

/** 最終的なプラグイン設定 */
type PluginConfig = QueryParamConfig & UnimplementedFeatureFlags;

/** 未実装フラグのデフォルト値 */
const UNIMPLEMENTED_FLAGS: UnimplementedFeatureFlags = {
  // NOTE: hand-storage機能のエラー回避のため、一時的にfalseで定義
  // TODO: 各機能の実装予定を issue #XXX で管理
  isUseHandStorageSelfOnly: false,
  isCardBackImageAllChangeMenu: false,
  isOffObjectRotateIndividually: false,
  isUseVirtualScreen: false,
  canReturnHandToIndividualBoard: false,
  isAutoSelfViewCardFromDeck: false,
  isContextMenuAutoSelfViewCardFromDeck: false,
  isAutoSelfViewCard: false,
  isHandCardSelfHandStorage: false,
} as const;

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
  ...UNIMPLEMENTED_FLAGS,
  ...getRoomConfig(params), // 部屋別設定で上書き
} as const;

// ========================================
// 型エクスポート（他モジュールで使用可能）
// ========================================
// export type { PluginConfig, RoomSpecificConfig };
