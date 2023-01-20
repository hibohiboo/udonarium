const params = new URL(document.URL).searchParams;
export const pluginConfig = {
    isSettingsPage: params.get('settings') != null
  , is2d: params.get('2d') != null
  , isOffRotate: params.get('rotate-off') != null
  , isMinimizableMenu: params.get('mini-menu') != null
  , isHorizonMenu: params.get('horizon-menu') != null
  , isHideMenuTable: params.get('hide-menu-table') != null
  , isHideMenuImage: params.get('hide-menu-image') != null
  , isHideMenuMusic: params.get('hide-menu-music') != null
  , isHideMenuInventory: params.get('hide-menu-inventory') != null
  , isHideMenuZipUpload: params.get('hide-menu-zip') != null
  , isHideMenuSave: params.get('hide-menu-save') != null
  , isOffObjectRotate: params.get('object-rotate-off') != null
  , isOffObjectRotateIndividually:  params.get('object-rotate-off-individually') != null
  , isUseHelp:  params.get('help') != null
  , isHideFirstPeer: params.get('hide-first-peer') != null
  , isHideFirstChat: params.get('hide-first-chat') != null
  , addBlankCardAddContextMenu: params.get('add-blank-card-menu') != null
  , isTextNoteSelectableUprightFlat: params.get('text-note-upright-flat') != null
  , isMoveStackedCard: params.get('move-stacked-card') != null
  , isUseHandStorage: params.get('hand-storage') != null
  , isUseVirtualScreen: params.get('virtual-screen') != null
  , isUseHandStorageSelfOnly: params.get('hand-storage-self-only')!= null
  , isToggleSoundEffect: params.get('toggle-sound-effect') != null
  , isUseResetPointOfView: params.get('reset-point-of-view') != null
  , isCardWritable: params.get('add-card-text-writable') != null
  , isDrawNCards: params.get('add-draw-n-cards') != null
  , isTapCard: params.get('tap-card') != null
  , isHidePredestal: params.get('hide-pedestal') != null
  , isEmptyDisplayItems: params.get('empty-display-items') != null
  , isEmptyNewCharacter: params.get('empty-new-character') != null
  , isUseKeyboardShortcut: params.get('keyboard-shortcut') != null
  , isEmptyDefaultTabletopObjects: params.get('empty-default-objects') != null
  , isCardShuffleNormalPosition:params.get('card-shuffle-normal-position') != null
  , isAddReloadButton: params.get('add-reload-button') != null
  , isFirstFetchZipRoom: params.get('first-fetch-zip-room') != null
} as const;

export const settings = [
  { label: '2Dモード', param: '2d', checked: false }
, { label: 'テーブル回転オフ', param: 'rotate-off', checked: false }
, { label: 'オブジェクト回転オフ', param: 'object-rotate-off', checked: false }
, { label: 'オブジェクト回転オフ(個別設定可能)', param: 'object-rotate-off-individually', checked: false }
, { label: 'メニュー最小化', param: 'mini-menu', checked: false }
, { label: 'メニュー横並び', param: 'horizon-menu', checked: false }
, { label: 'メニューから削除: テーブル設定', param: 'hide-menu-table', checked: false }
, { label: 'メニューから削除: 画像', param: 'hide-menu-image', checked: false }
, { label: 'メニューから削除: 音楽', param: 'hide-menu-music', checked: false }
, { label: 'メニューから削除: インベントリ', param: 'hide-menu-inventory', checked: false }
, { label: 'メニューから削除: ZIP読込', param: 'hide-menu-zip', checked: false }
, { label: 'メニューから削除: 保存', param: 'hide-menu-save', checked: false }
, { label: '初期表示に接続情報を表示しない', param: 'hide-first-peer', checked: false }
, { label: '初期表示にチャットウィンドウを表示しない', param: 'hide-first-chat', checked: false }
, { label: 'ヘルプ表示', param: 'help', checked: false }
, { label: 'キーボードショートカットを追加', param: 'keyboard-shortcut', checked:false }
, { label: '共有メモの直立と並行の切り替え', param: 'text-note-upright-flat', checked:false }
, { label: '右クリックメニューでブランクカードを作成', param: 'add-blank-card-menu', checked:false }
, { label: 'カードに文字入力可能にする', param: 'add-card-text-writable', checked:false }
, { label: '「カードをn枚引く」を山札のコンテキストメニューに追加', param: 'add-draw-n-cards', checked:false }
, { label: '「カードを横にする」をカードのコンテキストメニューに追加', param: 'tap-card', checked:false }
, { label: '重ねカード移動機能', param: 'move-stacked-card', checked:false }
, { label: 'カードを正位置のままシャッフルする', param: 'card-shuffle-normal-position', checked:false }
, { label: 'ボード', param: 'hand-storage', checked:false }
, { label: 'ボード（ついたて）', param: 'virtual-screen', checked:false }
, { label: 'ボードを自分のものだけ触れるようにする', param: 'hand-storage-self-only', checked:false }
, { label: '操作音オンオフ', param: 'toggle-sound-effect', checked:false }
, { label: '視点リセット', param: 'reset-point-of-view', checked:false }
, { label: 'キャラクターコマの台座を非表示', param: 'hide-pedestal', checked:false }
, { label: '表示項目の初期値を空にする（デフォルト：HP MP 敏捷度 生命力 精神力）', param: 'empty-display-items', checked:false }
, { label: 'サンプルのキャラクターコマを非表示', param: 'empty-default-objects', checked:false }
, { label: '新しいキャラクターを作成時にステータスを空で作成する', param: 'empty-new-character', checked:false }
, { label: '退室ボタンを追加', param: 'add-reload-button', checked:false }
, { label: 'Zipから部屋情報読込', param: 'first-fetch-zip-room', checked: false }
]

export const labelsAllInOne = [
     'オブジェクト回転オフ(個別設定可能)'
    ,'メニュー最小化'
    ,'メニュー横並び'
    ,'ヘルプ表示'
    ,'右クリックメニューでブランクカードを作成'
    ,'共有メモの直立と並行の切り替え'
    ,'重ねカード移動機能'
    ,'ボード'
    ,'ボード（ついたて）'
    ,'操作音オンオフ'
    ,'視点リセット'
    ,'カードに文字入力可能にする'
    ,'「カードをn枚引く」を山札のコンテキストメニューに追加'
    ,'「カードを横にする」をカードのコンテキストメニューに追加'
    ,'キーボードショートカットを追加'
    ,'退室ボタンを追加'
  ]

export const lablsMinimum = [
  '2Dモード','テーブル回転オフ'
,'メニュー最小化'
,'オブジェクト回転オフ'
, 'メニューから削除: テーブル設定'
, 'メニューから削除: 画像'
, 'メニューから削除: 音楽'
, 'メニューから削除: インベントリ'
, 'メニューから削除: ZIP読込'
, 'メニューから削除: 保存'
, '初期表示に接続情報を表示しない',
, '初期表示にチャットウィンドウを表示しない'
, '表示項目の初期値を空にする（デフォルト：HP MP 敏捷度 生命力 精神力）'
, '新しいキャラクターを作成時にステータスを空で作成する'
, 'サンプルのキャラクターコマを非表示'
, 'カードを正位置のままシャッフルする'
]
