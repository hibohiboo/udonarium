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
} as const;

export const settings = [
  { label: '2Dモード', param: '2d', checked: false }
, { label: 'ボード回転オフ', param: 'rotate-off', checked: false }
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
, { label: '右クリックメニューでブランクカードを作成', param: 'add-blank-card-menu', checked:false }
, { label: '共有メモの直立と並行の切り替え', param: 'text-note-upright-flat', checked:false }
, { label: '重ねカード移動機能', param: 'move-stacked-card', checked:false }
, { label: '手札置き場', param: 'hand-storage', checked:false }
, { label: '手札置き場（ついたて）', param: 'virtual-screen', checked:false }
, { label: '手札置き場を自分のものだけ触れるようにする', param: 'hand-storage-self-only', checked:false }
, { label: '操作音オンオフ', param: 'toggle-sound-effect', checked:false }
]

export const labelsAllInOne = [
    '2Dモード'
    ,'オブジェクト回転オフ(個別設定可能)'
    ,'メニュー最小化'
    ,'メニュー横並び'
    ,'ヘルプ表示'
    ,'右クリックメニューでブランクカードを作成'
    ,'共有メモの直立と並行の切り替え'
    ,'重ねカード移動機能'
    ,'手札置き場'
    ,'手札置き場（ついたて）'
    ,'手札置き場を自分のものだけ触れるようにする'
    ,'操作音オンオフ'
  ]
