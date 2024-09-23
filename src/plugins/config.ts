

const params = new URL(document.URL).searchParams;

const vsRankConfig =
  params.get('room') !== 'vsrank'
    ? {}
    : {
        isTapCard: true,
        isUseKeyboardShortcut: true,
        isCardShuffleNormalPosition: true,
        isFirstFetchZipRoom: true,
        isAddCounterBoard: true,
        isChangeDefaultTerrain: false,
        isOffObjectRotateIndividually: false,
      };
const hollowConfig =
  params.get('room') === 'hollow'
    ? {
        isTapCard: true,
        isUseKeyboardShortcut: true,
        isCardShuffleNormalPosition: true,
        isFirstFetchZipRoom: true,
        isChangeDefaultTerrain: false,
        isOffObjectRotateIndividually: false,
      }
    : {};
export const pluginConfig = {
  is2d: params.get('2d') != null,
  isTapCard: params.get('tap-card') != null,
  isUseHelp: params.get('key-shortcut'),
  isUseKeyboardShortcut: params.get('key-shortcut') != null,
  isTutorial: params.get('tutorial') != null,
  z: params.get('z'),
  x: params.get('x'),
  y: params.get('y'),
  rx: params.get('rx'),
  ry: params.get('ry'),
  rz: params.get('rz'),

  isCardShuffleNormalPosition: !!params.get('shuffle-normal'),
  isAddCounterBoard: !!params.get('counter-board'),
  isChangeDefaultTerrain: !!params.get('change-default-terrain'),

  useChatCommand: !!params.get('use-chat-command'),
  isUseHandStorage: !!params.get('use-hand-storage'),

  isUseHandStorageSelfOnly: false, // 未実装。hand-storageのエラー回避のために移動した状態
  isCardBackImageAllChangeMenu: false, // 未実装。hand-storageのエラー回避のために移動した状態
  isOffObjectRotateIndividually: false, // 未実装。hand-storageのエラー回避のために移動した状態
  isUseVirtualScreen: false, // 未実装。hand-storageのエラー回避のために移動した状態
  canReturnHandToIndividualBoard: false, // 未実装。hand-storageのエラー回避のために移動した状態
  isAutoSelfViewCardFromDeck: false, // 未実装。hand-storageのエラー回避のために移動した状態
  isContextMenuAutoSelfViewCardFromDeck: false, // 未実装。hand-storageのエラー回避のために移動した状態
  isAutoSelfViewCard: false, // 未実装。hand-storageのエラー回避のために移動した状
  isHandCardSelfHandStorage: false, // 未実装。hand-storageのエラー回避のために移動した状態
  ...vsRankConfig,
  ...hollowConfig,
} as const;

